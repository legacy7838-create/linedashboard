import React from 'react';
import { UploadCloud, FileSpreadsheet } from 'lucide-react';

interface NoDataStateProps {
  title?: string;
  message?: string;
  onImport?: () => void;
}

/**
 * Shown on any dashboard surface that has no records because no workbook
 * has been imported yet. Distinct from EmptyState, which reports that
 * filters matched nothing within an already-loaded dataset.
 */
export function NoDataState({
  title = 'No Data Available',
  message = 'Import a Line Rejection / Rework / FQC Excel workbook to populate this view.',
  onImport,
}: NoDataStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-14 text-center bg-white rounded-xl border border-dashed border-slate-300 shadow-xs">
      <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-4">
        <FileSpreadsheet className="w-7 h-7" />
      </div>
      <h3 className="text-base font-extrabold text-slate-800">{title}</h3>
      <p className="text-xs text-slate-500 max-w-md mt-1.5">{message}</p>
      {onImport && (
        <button
          onClick={onImport}
          className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Import Excel File</span>
        </button>
      )}
    </div>
  );
}
