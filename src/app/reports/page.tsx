'use client';

import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { QualityTable } from '@/components/tables/QualityTable';
import { NoDataState } from '@/components/ui/NoDataState';
import { useQualityData } from '@/context/QualityDataContext';
import {
  calculateKPISummary,
  filterQualityRecords,
  filterFQCRecords,
  extractFilterOptions,
} from '@/lib/calculations/qualityCalculations';
import { FilterState, QualityType } from '@/types/quality';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';
import { Download, Printer, Filter, UploadCloud, Loader2 } from 'lucide-react';

/**
 * Neutralize spreadsheet formula injection: a cell whose value begins with
 * =, +, -, or @ is interpreted as a formula by Excel/Sheets on open.
 * Prefixing with a single quote forces it to be treated as literal text.
 */
function sanitizeSpreadsheetCell(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

function sanitizeExportRow<T extends Record<string, unknown>>(row: T): T {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    out[key] = sanitizeSpreadsheetCell(value);
  }
  return out as T;
}

export default function ReportsPage() {
  const { qualityRecords, fqcRecords, activeMonth, hasData, importedFileName, setIsImportModalOpen } = useQualityData();

  // `selectedMonth` starts as null meaning "follow the global active month".
  // Selecting a specific month sets it explicitly, which avoids mirroring
  // activeMonth into state via an effect.
  const [selectedMonthOverride, setSelectedMonthOverride] = useState<string | null>(null);
  const selectedMonth = selectedMonthOverride ?? activeMonth;
  const setSelectedMonth = setSelectedMonthOverride;
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dataType, setDataType] = useState<'ALL' | QualityType>('ALL');
  const [selectedLine, setSelectedLine] = useState('ALL');
  const [isExporting, setIsExporting] = useState(false);

  const filterOptions = useMemo(() => {
    return extractFilterOptions(qualityRecords, fqcRecords);
  }, [qualityRecords, fqcRecords]);

  const filters: FilterState = useMemo(() => {
    return {
      month: selectedMonth,
      startDate,
      endDate,
      cellOrLine: selectedLine,
      shift: 'ALL',
      customer: 'ALL',
      partNumber: 'ALL',
      machine: 'ALL',
      searchQuery: '',
      type: dataType,
    };
  }, [selectedMonth, startDate, endDate, selectedLine, dataType]);

  const filteredQualityRecords = useMemo(() => {
    if (dataType === 'FQC_FALLOUT') return [];
    return filterQualityRecords(qualityRecords, filters);
  }, [qualityRecords, filters, dataType]);

  const filteredFqcRecords = useMemo(() => {
    if (dataType === 'REJECTION' || dataType === 'REWORK') return [];
    return filterFQCRecords(fqcRecords, filters);
  }, [fqcRecords, filters, dataType]);

  const summary = useMemo(() => {
    return calculateKPISummary(filteredQualityRecords, filteredFqcRecords);
  }, [filteredQualityRecords, filteredFqcRecords]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = async () => {
    if (!hasData) return;

    const exportData = [
      ...filteredQualityRecords.map(r => ({
        'Date': r.date,
        'Type': r.type,
        'Cell / Line': r.line || r.cell,
        'Machine': r.machineNumber ? `${r.machineNumber} (${r.machine})` : r.machine,
        'Part Number': r.partNumber,
        'Part Name': r.partName,
        'Customer': r.customer,
        'Non Conformance': r.nonConformance,
        'Shift': r.shift,
        'Quantity': r.quantity,
        'Cost Per Piece': r.costPerPiece,
        'Total Cost': r.totalCost,
        'Reason': r.reason || '',
        'Action': r.correctiveAction || '',
      })),
      ...filteredFqcRecords.map(f => ({
        'Date': f.date,
        'Type': 'FQC_FALLOUT',
        'Cell / Line': f.line || f.cell,
        'Machine': f.stage,
        'Part Number': f.partNumber,
        'Part Name': f.partName,
        'Customer': f.customer,
        'Non Conformance': f.nonConformance,
        'Shift': f.shift,
        'Quantity': f.quantity,
        'Cost Per Piece': 0,
        'Total Cost': 0,
        'Reason': f.containmentAction,
        'Action': 'FQC Containment',
      }))
    ];

    setIsExporting(true);
    try {
      const XLSX = await import('xlsx');
      const ws = XLSX.utils.json_to_sheet(exportData.map(sanitizeExportRow));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Quality_Report');
      XLSX.writeFile(wb, `Quality_Report_${selectedMonth}_${Date.now()}.csv`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quality Reports & Executive Summary"
        subtitle="Generate, preview, and audit customizable quality reports for plant operations."
        badgeText={hasData ? `Excel: ${importedFileName}` : 'No Data Loaded'}
        badgeColor={hasData ? 'emerald' : 'orange'}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Import Excel</span>
            </button>
            <button
              onClick={handlePrint}
              disabled={!hasData}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleExportCSV}
              disabled={!hasData || isExporting}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
            </button>
          </div>
        }
      />

      {!hasData ? (
        <NoDataState
          title="No Report Data Available"
          message="Import a Line Rejection / Rework / FQC Excel workbook to configure, preview, and export quality audit reports."
          onImport={() => setIsImportModalOpen(true)}
        />
      ) : (
        <>

      {/* Report Parameter Controls */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4">
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-700">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Report Configuration Parameters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Month */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Select Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Available Months</option>
              {filterOptions.months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Data Type */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Data Category
            </label>
            <select
              value={dataType}
              onChange={(e) => setDataType(e.target.value as 'ALL' | QualityType)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Categories (Rej + Rew + FQC)</option>
              <option value="REJECTION">Line Rejection Only</option>
              <option value="REWORK">Line Rework Only</option>
              <option value="FQC_FALLOUT">FQC Fallout Only</option>
            </select>
          </div>

          {/* Line Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Cell / Line
            </label>
            <select
              value={selectedLine}
              onChange={(e) => setSelectedLine(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Cells & Lines</option>
              {filterOptions.cellsAndLines.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Date Filter (Optional)
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-1/2 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-800"
              />
              <span className="text-slate-400 text-xs">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-1/2 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-800"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Report Summary Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 uppercase">
              Executive Report Summary: {selectedMonth}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              VE COMMERCIAL VEHICLE LIMITED | Internal Manufacturing Quality Audit
            </p>
          </div>
          <span className="px-2.5 py-1 rounded text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
            {filteredQualityRecords.length + filteredFqcRecords.length} Filtered Entries
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-red-50/60 rounded-lg border border-red-200/60">
            <span className="text-red-700 font-bold block">Rejection Qty</span>
            <span className="text-xl font-black text-red-800">
              {formatNumber(summary.totalRejectionQty)} pcs
            </span>
            <span className="text-[11px] text-red-600 block mt-0.5">
              Scrap Cost: {formatCurrency(summary.totalRejectionCost)}
            </span>
          </div>

          <div className="p-3 bg-orange-50/60 rounded-lg border border-orange-200/60">
            <span className="text-orange-700 font-bold block">Rework Qty</span>
            <span className="text-xl font-black text-orange-800">
              {formatNumber(summary.totalReworkQty)} pcs
            </span>
            <span className="text-[11px] text-orange-600 block mt-0.5">
              Rework Cost: {formatCurrency(summary.totalReworkCost)}
            </span>
          </div>

          <div className="p-3 bg-purple-50/60 rounded-lg border border-purple-200/60">
            <span className="text-purple-700 font-bold block">FQC Fallout Qty</span>
            <span className="text-xl font-black text-purple-800">
              {formatNumber(summary.totalFqcQty)} pcs
            </span>
            <span className="text-[11px] text-purple-600 block mt-0.5">
              {summary.fqcDefectCount} audit defects
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-700 font-bold block">Financial Total</span>
            <span className="text-xl font-black text-slate-900">
              {formatCurrency(summary.totalRejectionCost + summary.totalReworkCost)}
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              Direct Loss Impact
            </span>
          </div>
        </div>
      </div>

      {/* Report Records Table Preview */}
      <QualityTable
        records={filteredQualityRecords}
        fqcRecords={filteredFqcRecords}
        title="Report Records Preview"
        subtitle="Complete records included in the generated quality audit report"
      />
      </>
      )}
    </div>
  );
}
