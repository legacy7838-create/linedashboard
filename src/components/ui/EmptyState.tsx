import React from 'react';
import { FilterX, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  onReset?: () => void;
}

export function EmptyState({
  title = 'No Quality Records Found',
  message = 'No data matches the selected filters or date range. Try clearing or adjusting your filter criteria.',
  onReset,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
      <div className="w-12 h-12 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-500 mb-3">
        <FilterX className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-bold text-slate-800">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">{message}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset All Filters
        </button>
      )}
    </div>
  );
}

export function LoadingState({ message = 'Loading Quality Data...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
      <p className="text-xs font-semibold text-slate-600">{message}</p>
    </div>
  );
}
