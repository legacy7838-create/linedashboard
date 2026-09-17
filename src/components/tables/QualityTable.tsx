'use client';

import React, { useState, useMemo } from 'react';
import { QualityRecord, FQCRecord } from '@/types/quality';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TablePagination } from '@/components/ui/TablePagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency, formatDate, formatNumber } from '@/lib/utils/formatters';
import { ArrowUpDown, AlertCircle, Info } from 'lucide-react';

interface QualityTableProps {
  records: QualityRecord[];
  fqcRecords?: FQCRecord[];
  title?: string;
  subtitle?: string;
  onResetFilters?: () => void;
}

type CombinedRecord = {
  id: string;
  date: string;
  type: string;
  cellOrLine: string;
  machine: string;
  partNumber: string;
  partName: string;
  customer: string;
  nonConformance: string;
  quantity: number;
  cost: number;
  shift: string;
  reason?: string;
};

export const QualityTable = React.memo(function QualityTable({
  records,
  fqcRecords = [],
  title = 'Recent Quality Records',
  subtitle = 'Detailed line rejection, rework, and FQC fallout entries',
  onResetFilters,
}: QualityTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortField, setSortField] = useState<keyof CombinedRecord>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedRecord, setSelectedRecord] = useState<CombinedRecord | null>(null);

  // Combine general quality records and FQC records for unified tabular viewing.
  // Memoized so sorting below is not invalidated by unrelated re-renders.
  const combined: CombinedRecord[] = useMemo(() => [
    ...records.map((r) => ({
      id: r.id,
      date: r.date,
      type: r.type,
      cellOrLine: r.line || r.cell,
      machine: r.machineNumber ? `${r.machineNumber} (${r.machine})` : r.machine,
      partNumber: r.partNumber,
      partName: r.partName,
      customer: r.customer,
      nonConformance: r.nonConformance,
      quantity: r.quantity,
      cost: r.totalCost,
      shift: r.shift,
      reason: r.reason || r.correctiveAction,
    })),
    ...fqcRecords.map((f) => ({
      id: f.id,
      date: f.date,
      type: 'FQC_FALLOUT',
      cellOrLine: f.line || f.cell,
      machine: f.stage,
      partNumber: f.partNumber,
      partName: f.partName,
      customer: f.customer,
      nonConformance: f.nonConformance,
      quantity: f.quantity,
      cost: 0, // FQC Fallout has separated cost or N/A
      shift: f.shift,
      reason: f.containmentAction,
    })),
  ], [records, fqcRecords]);

  // Sorting — memoized because it is O(n log n) over the full dataset even
  // though only one page of rows is rendered.
  const sortedRecords = useMemo(() => {
    return [...combined].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (aVal === undefined || aVal === null) aVal = '';
      if (bVal === undefined || bVal === null) bVal = '';

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const strA = String(aVal).toLowerCase();
      const strB = String(bVal).toLowerCase();

      return sortDirection === 'asc'
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
    });
  }, [combined, sortField, sortDirection]);

  // Pagination slice
  const startIndex = (currentPage - 1) * pageSize;
  const currentRecords = sortedRecords.slice(startIndex, startIndex + pageSize);

  const handleSort = (field: keyof CombinedRecord) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  if (combined.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <EmptyState onReset={onResetFilters} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col">
      {/* Table Header / Title */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-slate-900">{title}</h3>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {combined.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-blue-600" />
          <span>Click any row for root cause details</span>
        </div>
      </div>

      {/* Table Data Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-200 select-none">
            <tr>
              <th
                onClick={() => handleSort('date')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Date</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('type')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Type</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('cellOrLine')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Cell / Line</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('machine')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Machine / Stage</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('partNumber')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Part No. & Name</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('customer')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Customer</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('nonConformance')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Non-Conformance</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('quantity')}
                className="py-3 px-3 text-right cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Qty</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('cost')}
                className="py-3 px-3 text-right cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Cost</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('shift')}
                className="py-3 px-3 text-center cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Shift</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentRecords.map((r) => (
              <tr
                key={r.id}
                onClick={() => setSelectedRecord(r)}
                className="hover:bg-blue-50/40 cursor-pointer transition-colors"
              >
                <td className="py-2.5 px-3 font-semibold text-slate-700 whitespace-nowrap">
                  {formatDate(r.date)}
                </td>
                <td className="py-2.5 px-3 whitespace-nowrap">
                  <StatusBadge type={r.type} size="sm" />
                </td>
                <td className="py-2.5 px-3 font-medium text-slate-800 whitespace-nowrap">
                  {r.cellOrLine}
                </td>
                <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap max-w-[150px] truncate">
                  {r.machine}
                </td>
                <td className="py-2.5 px-3 whitespace-nowrap">
                  <div className="font-bold text-slate-900">{r.partNumber}</div>
                  <div className="text-[11px] text-slate-400 max-w-[140px] truncate">
                    {r.partName}
                  </div>
                </td>
                <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap font-medium">
                  {r.customer}
                </td>
                <td className="py-2.5 px-3 whitespace-nowrap">
                  <span className="font-bold text-slate-800">{r.nonConformance}</span>
                </td>
                <td className="py-2.5 px-3 text-right font-black text-slate-900">
                  {formatNumber(r.quantity)}
                </td>
                <td className="py-2.5 px-3 text-right font-bold text-slate-800 whitespace-nowrap">
                  {r.cost > 0 ? formatCurrency(r.cost) : 'N/A'}
                </td>
                <td className="py-2.5 px-3 text-center whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {r.shift}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination component */}
      <TablePagination
        currentPage={currentPage}
        totalRecords={combined.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Detail Modal / Slide-over preview for selected record */}
      {selectedRecord && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedRecord(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-base text-slate-900">
                  Quality Record Details
                </h4>
              </div>
              <StatusBadge type={selectedRecord.type} />
            </div>

            <div className="grid grid-cols-2 gap-3.5 my-4 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Record ID</span>
                <span className="font-bold text-slate-800">{selectedRecord.id}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Date & Shift</span>
                <span className="font-bold text-slate-800">
                  {formatDate(selectedRecord.date)} ({selectedRecord.shift})
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Cell / Line</span>
                <span className="font-bold text-slate-800">{selectedRecord.cellOrLine}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Machine / Station</span>
                <span className="font-bold text-slate-800">{selectedRecord.machine}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Part Number</span>
                <span className="font-bold text-slate-800">{selectedRecord.partNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Customer</span>
                <span className="font-bold text-slate-800">{selectedRecord.customer}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 font-medium block">Non-Conformance</span>
                <span className="font-bold text-red-600 text-sm">
                  {selectedRecord.nonConformance}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Defect Quantity</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {selectedRecord.quantity} pcs
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Quality Cost Impact</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {selectedRecord.cost > 0 ? formatCurrency(selectedRecord.cost) : 'N/A'}
                </span>
              </div>
              {selectedRecord.reason && (
                <div className="col-span-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 font-bold block mb-1">
                    Root Cause / Action Details:
                  </span>
                  <p className="text-slate-700">{selectedRecord.reason}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-white font-semibold text-xs hover:bg-slate-900"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
