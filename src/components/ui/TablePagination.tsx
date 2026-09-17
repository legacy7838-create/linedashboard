import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DEFAULT_PAGINATION_SIZES } from '@/lib/constants/qualityConstants';

interface TablePaginationProps {
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function TablePagination({
  currentPage,
  totalRecords,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const startIndex = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(totalRecords, currentPage * pageSize);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 rounded-b-xl">
      {/* Records count & page size selector */}
      <div className="flex items-center gap-3">
        <span>
          Showing <strong className="text-slate-800">{startIndex}</strong> to{' '}
          <strong className="text-slate-800">{endIndex}</strong> of{' '}
          <strong className="text-slate-800">{totalRecords}</strong> records
        </span>

        <div className="flex items-center gap-1.5 ml-2 border-l border-slate-300 pl-3">
          <span className="text-slate-500 font-medium">Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(1);
            }}
            className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {DEFAULT_PAGINATION_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pagination Nav Buttons */}
      <div className="flex items-center gap-2">
        <span className="text-slate-500 mr-2">
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </span>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
