import React from 'react';
import { QualityType } from '@/types/quality';

interface StatusBadgeProps {
  type: QualityType | string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ type, size = 'md' }: StatusBadgeProps) {
  const normalizedType = type.toUpperCase();

  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  if (normalizedType === 'REJECTION') {
    return (
      <span
        className={`inline-flex items-center font-bold tracking-wide rounded-md border bg-red-50 text-red-700 border-red-200 uppercase ${sizeClasses}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-red-600 mr-1.5"></span>
        Rejection
      </span>
    );
  }

  if (normalizedType === 'REWORK') {
    return (
      <span
        className={`inline-flex items-center font-bold tracking-wide rounded-md border bg-orange-50 text-orange-800 border-orange-200 uppercase ${sizeClasses}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1.5"></span>
        Rework
      </span>
    );
  }

  if (normalizedType === 'FQC_FALLOUT' || normalizedType === 'FQC FALLOUT' || normalizedType === 'FQC') {
    return (
      <span
        className={`inline-flex items-center font-bold tracking-wide rounded-md border bg-purple-50 text-purple-700 border-purple-200 uppercase ${sizeClasses}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mr-1.5"></span>
        FQC Fallout
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-md border bg-slate-100 text-slate-700 border-slate-200 ${sizeClasses}`}
    >
      {type}
    </span>
  );
}
