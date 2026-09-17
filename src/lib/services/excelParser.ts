import type * as XLSXType from 'xlsx';
import { QualityRecord, FQCRecord, QualityType } from '@/types/quality';

type XLSXModule = typeof XLSXType;

/** A raw cell value as read from a worksheet. */
export type ExcelCell = string | number | boolean | Date | null | undefined;

// xlsx is loaded on demand so it stays out of the initial client bundle.
let xlsxPromise: Promise<XLSXModule> | null = null;
function loadXLSX(): Promise<XLSXModule> {
  if (!xlsxPromise) {
    xlsxPromise = import('xlsx');
  }
  return xlsxPromise;
}

export interface ExcelImportResult {
  fileName: string;
  qualityRecords: QualityRecord[];
  fqcRecords: FQCRecord[];
  summary: {
    totalRecords: number;
    rejectionCount: number;
    rejectionQty: number;
    rejectionCost: number;
    reworkCount: number;
    reworkQty: number;
    reworkCost: number;
    fqcCount: number;
    fqcQty: number;
    months: string[];
    sheetsParsed: string[];
  };
}

/** Maximum accepted upload size (10 MB). */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/** Maximum worksheet rows processed per sheet, to bound parse time and memory. */
export const MAX_ROWS_PER_SHEET = 20000;

/** Maximum worksheets processed per workbook. */
export const MAX_SHEETS_PER_WORKBOOK = 50;

export class ExcelImportError extends Error {}

export function parseExcelDate(val: ExcelCell, XLSX: XLSXModule): string {
  if (!val) return new Date().toISOString().split('T')[0];
  
  if (typeof val === 'string') {
    const trimmed = val.trim();
    // Match "01.09.26" or "01.09.2026"
    const dotParts = trimmed.split('.');
    if (dotParts.length === 3) {
      const day = dotParts[0].padStart(2, '0');
      const month = dotParts[1].padStart(2, '0');
      let year = dotParts[2];
      if (year.length === 2) year = '20' + year;
      return `${year}-${month}-${day}`;
    }
    // Match "01/09/2026" or "01/09/26"
    const slashParts = trimmed.split('/');
    if (slashParts.length === 3) {
      const day = slashParts[0].padStart(2, '0');
      const month = slashParts[1].padStart(2, '0');
      let year = slashParts[2];
      if (year.length === 2) year = '20' + year;
      return `${year}-${month}-${day}`;
    }
    // Match ISO "2026-09-01"
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }
  } else if (typeof val === 'number') {
    try {
      const date = XLSX.SSF.parse_date_code(val);
      if (date) {
        const day = String(date.d).padStart(2, '0');
        const month = String(date.m).padStart(2, '0');
        const year = date.y;
        return `${year}-${month}-${day}`;
      }
    } catch {
      // ignore
    }
  }
  return new Date().toISOString().split('T')[0];
}

export function deriveMonthString(dateStr: string): string {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const mIdx = parseInt(parts[1], 10) - 1;
    return `${monthNames[mIdx] || 'Sep'}-${parts[0]}`;
  }
  return 'Sep-2026';
}

function parseSingleSheet(
  sheet: XLSXType.WorkSheet,
  sheetName: string,
  defaultType: QualityType,
  XLSX: XLSXModule
): { records: QualityRecord[]; fqcRecords: FQCRecord[] } {
  const rows = XLSX.utils.sheet_to_json<ExcelCell[]>(sheet, { header: 1 });
  if (!rows || rows.length < 4) return { records: [], fqcRecords: [] };

  // Bound the work done per sheet so a crafted workbook cannot exhaust the tab.
  if (rows.length > MAX_ROWS_PER_SHEET) {
    throw new ExcelImportError(
      `Sheet "${sheetName}" has ${rows.length} rows, which exceeds the ${MAX_ROWS_PER_SHEET}-row limit.`
    );
  }

  // Find header row: look for 'part no' or 'm/c' or 'non conformance' or 'sr no'
  let headerRowIdx = -1;
  for (let i = 0; i < Math.min(12, rows.length); i++) {
    const row = rows[i] || [];
    const str = row.filter(Boolean).map(x => String(x).toLowerCase()).join(' ');
    if (
      (str.includes('part no') || str.includes('part') || str.includes('sap code')) &&
      (str.includes('m/c') || str.includes('machine') || str.includes('non conformance') || str.includes('sr no') || str.includes('cost'))
    ) {
      headerRowIdx = i;
      break;
    }
  }

  if (headerRowIdx === -1) return { records: [], fqcRecords: [] };

  const rawHeaderRow = rows[headerRowIdx] || [];
  const headers = rawHeaderRow.map(h => (h != null ? String(h).trim().toLowerCase() : ''));

  const getCol = (names: string[]) => {
    return headers.findIndex(h => h && names.some(n => h.includes(n)));
  };

  const idxMcNo = getCol(['m/c no', 'machine no', 'mc no', 'machine number']);
  const idxMcName = getCol(['m/c name', 'machine name', 'machine']);
  const idxOprn = getCol(['oprn', 'operation', 'opn']);
  const idxPartNo = getCol(['part no.', 'part no', 'part number', 'part']);
  const idxCustomer = getCol(['customer', 'cust']);
  const idxOperator = getCol(['operator', 'optr']);
  const idxDefect = getCol(['non conformance', 'defect', 'problem', 'nature of problem', 'rejection reason']);
  const idxDate = getCol(['date']);
  const idx1st = getCol(['1st', 'shift a']);
  const idx2nd = getCol(['2nd', 'shift b']);
  const idx3rd = getCol(['3rd', 'shift c']);
  const idxFqc = getCol(['fqc']);
  const idxTotalQty = getCol(['total rej. qty', 'total qty', 'total rej', 'rejection qty', 'rework qty']);
  const idxCostPiece = getCol(['cost per piece', 'cost/pc', 'rate', 'piece cost']);
  const idxTotalCost = getCol(['total cost', 'cost of poor quality', 'cost']);
  const idxReason = getCol(['reason', 'root cause', 'cause']);
  const idxAction = getCol(['rejection identified at', 'action', 'corrective action']);

  const records: QualityRecord[] = [];
  const fqcRecords: FQCRecord[] = [];

  for (let r = headerRowIdx + 1; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.length === 0) continue;

    const mcNo = idxMcNo >= 0 && row[idxMcNo] != null ? String(row[idxMcNo]).trim() : '';
    const partNo = idxPartNo >= 0 && row[idxPartNo] != null ? String(row[idxPartNo]).trim() : '';
    const defect = idxDefect >= 0 && row[idxDefect] != null ? String(row[idxDefect]).trim() : '';
    const rawDate = idxDate >= 0 ? row[idxDate] : '';
    const dateStr = parseExcelDate(rawDate, XLSX);
    const monthStr = deriveMonthString(dateStr);

    const customer = idxCustomer >= 0 && row[idxCustomer] ? String(row[idxCustomer]).trim() : 'RE (Royal Enfield)';
    const reason = idxReason >= 0 && row[idxReason] ? String(row[idxReason]).trim() : '';

    // STRICT RULE: Exclude ALL Bush data completely
    const isBush =
      partNo.toLowerCase().includes('bush') ||
      customer.toLowerCase().includes('bush') ||
      defect.toLowerCase().includes('bush') ||
      reason.toLowerCase().includes('bush');

    if (isBush) {
      continue; // Skip all Bush records completely
    }

    // Skip empty or summary lines
    if (!partNo && !defect && !mcNo) continue;
    const firstCell = String(row[0] || '').toLowerCase();
    const secondCell = String(row[1] || '').toLowerCase();
    if (firstCell.includes('total') || secondCell.includes('total') || firstCell.includes('grand')) continue;

    const qty1st = idx1st >= 0 && Number(row[idx1st]) > 0 ? Number(row[idx1st]) : 0;
    const qty2nd = idx2nd >= 0 && Number(row[idx2nd]) > 0 ? Number(row[idx2nd]) : 0;
    const qty3rd = idx3rd >= 0 && Number(row[idx3rd]) > 0 ? Number(row[idx3rd]) : 0;
    const qtyFqc = idxFqc >= 0 && Number(row[idxFqc]) > 0 ? Number(row[idxFqc]) : 0;

    let totalQty = idxTotalQty >= 0 && Number(row[idxTotalQty]) > 0
      ? Number(row[idxTotalQty])
      : (qty1st + qty2nd + qty3rd + qtyFqc);

    if (totalQty === 0) totalQty = 1;

    const costPerPiece = idxCostPiece >= 0 && Number(row[idxCostPiece]) > 0 ? Number(row[idxCostPiece]) : 0;
    const totalCost = idxTotalCost >= 0 && Number(row[idxTotalCost]) > 0
      ? Number(row[idxTotalCost])
      : costPerPiece * totalQty;

    const mcName = idxMcName >= 0 && row[idxMcName] ? String(row[idxMcName]).trim() : (mcNo || 'Machine');
    const operator = idxOperator >= 0 && row[idxOperator] ? String(row[idxOperator]).trim() : 'Line Operator';
    const action = idxAction >= 0 && row[idxAction] ? String(row[idxAction]).trim() : 'Logged from Excel Import';
    const operation = idxOprn >= 0 && row[idxOprn] ? String(row[idxOprn]).trim() : 'Turning';

    // Shift determination
    let shift: 'Shift A' | 'Shift B' | 'Shift C' = 'Shift A';
    if (qty2nd > 0 && qty2nd >= qty1st && qty2nd >= qty3rd) shift = 'Shift B';
    else if (qty3rd > 0 && qty3rd >= qty1st && qty3rd >= qty2nd) shift = 'Shift C';

    const recordType: QualityType = defaultType;

    records.push({
      id: `EXCEL-${recordType}-${sheetName.replace(/\s+/g, '_')}-${r}`,
      date: dateStr,
      month: monthStr,
      type: recordType,
      cell: 'Turning Cell / Line',
      line: 'Line - Hard Turning',
      machine: mcName,
      machineNumber: mcNo || 'M-GEN',
      operation: operation,
      partNumber: partNo ? `PART-${partNo}` : 'PART-UNKNOWN',
      partName: `Part #${partNo || 'Std'}`,
      customer: customer,
      operator: operator,
      nonConformance: defect || 'Quality Issue',
      shift: shift,
      quantity: totalQty,
      costPerPiece: costPerPiece,
      totalCost: totalCost,
      reason: reason,
      correctiveAction: action,
    });

    // If FQC column contains quantity, create FQC record
    if (qtyFqc > 0) {
      fqcRecords.push({
        id: `EXCEL-FQC-${sheetName.replace(/\s+/g, '_')}-${r}`,
        date: dateStr,
        month: monthStr,
        cell: 'Turning Cell / Line',
        line: 'Line - Hard Turning',
        partNumber: partNo ? `PART-${partNo}` : 'PART-UNKNOWN',
        partName: `Part #${partNo || 'Std'}`,
        customer: customer,
        stage: 'End-Of-Line FQC',
        defectCategory: 'Dimensional / Visual Fallout',
        nonConformance: defect || 'FQC Fallout',
        inspectorId: 'FQC-INSP',
        shift: shift,
        quantity: qtyFqc,
        lotSizeInspected: totalQty * 10,
        falloutRatePercent: Number(((qtyFqc / (totalQty * 10)) * 100).toFixed(2)),
        containmentAction: 'Quarantined & inspected from Excel import',
      });
    }
  }

  return { records, fqcRecords };
}

export function parseExcelWorkbook(
  workbook: XLSXType.WorkBook,
  fileName: string,
  XLSX: XLSXModule
): ExcelImportResult {
  const allQualityRecords: QualityRecord[] = [];
  const allFqcRecords: FQCRecord[] = [];
  const parsedSheetNames: string[] = [];

  if (workbook.SheetNames.length > MAX_SHEETS_PER_WORKBOOK) {
    throw new ExcelImportError(
      `Workbook has ${workbook.SheetNames.length} sheets, which exceeds the ${MAX_SHEETS_PER_WORKBOOK}-sheet limit.`
    );
  }

  workbook.SheetNames.forEach(sheetName => {
    const lowerName = sheetName.toLowerCase();
    
    // STRICT RULE: Skip all Bush sheets completely (e.g. "Bush Rejection")
    if (lowerName.includes('bush')) {
      return;
    }

    const sheet = workbook.Sheets[sheetName];
    if (!sheet) return;

    // Detect sheet type
    let sheetType: QualityType = 'REJECTION';
    if (lowerName.includes('rew') || lowerName.includes('rework')) {
      sheetType = 'REWORK';
    } else if (lowerName.includes('fqc')) {
      sheetType = 'FQC_FALLOUT';
    } else if (lowerName.includes('rej') || lowerName.includes('rejection')) {
      sheetType = 'REJECTION';
    }

    const { records, fqcRecords } = parseSingleSheet(sheet, sheetName, sheetType, XLSX);
    if (records.length > 0 || fqcRecords.length > 0) {
      allQualityRecords.push(...records);
      allFqcRecords.push(...fqcRecords);
      parsedSheetNames.push(`${sheetName} (${records.length} records)`);
    }
  });

  const rejectionRecords = allQualityRecords.filter(r => r.type === 'REJECTION');
  const reworkRecords = allQualityRecords.filter(r => r.type === 'REWORK');

  const rejectionQty = rejectionRecords.reduce((s, r) => s + r.quantity, 0);
  const rejectionCost = rejectionRecords.reduce((s, r) => s + r.totalCost, 0);

  const reworkQty = reworkRecords.reduce((s, r) => s + r.quantity, 0);
  const reworkCost = reworkRecords.reduce((s, r) => s + r.totalCost, 0);

  const fqcQty = allFqcRecords.reduce((s, r) => s + r.quantity, 0);

  const monthsSet = new Set<string>();
  allQualityRecords.forEach(r => monthsSet.add(r.month));
  allFqcRecords.forEach(r => monthsSet.add(r.month));

  return {
    fileName,
    qualityRecords: allQualityRecords,
    fqcRecords: allFqcRecords,
    summary: {
      totalRecords: allQualityRecords.length + allFqcRecords.length,
      rejectionCount: rejectionRecords.length,
      rejectionQty,
      rejectionCost,
      reworkCount: reworkRecords.length,
      reworkQty,
      reworkCost,
      fqcCount: allFqcRecords.length,
      fqcQty,
      months: Array.from(monthsSet),
      sheetsParsed: parsedSheetNames,
    },
  };
}

export async function parseUploadedExcelFile(file: File): Promise<ExcelImportResult> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new ExcelImportError(
      `File is ${(file.size / (1024 * 1024)).toFixed(1)} MB, which exceeds the ${MAX_UPLOAD_BYTES / (1024 * 1024)} MB limit.`
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const XLSX = await loadXLSX();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  return parseExcelWorkbook(workbook, file.name, XLSX);
}
