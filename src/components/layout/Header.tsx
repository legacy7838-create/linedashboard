'use client';

import React, { useState } from 'react';
import { RefreshCw, User, Calendar, ShieldCheck, Clock, UploadCloud, FileSpreadsheet } from 'lucide-react';
import { COMPANY_NAME, PORTAL_NAME } from '@/lib/constants/qualityConstants';
import { useQualityData } from '@/context/QualityDataContext';

interface HeaderProps {
  onRefresh?: () => void;
  lastUpdated?: string;
}

export function Header({
  onRefresh,
  lastUpdated,
}: HeaderProps) {
  const {
    activeMonth,
    dataMode,
    importedFileName,
    setIsImportModalOpen,
  } = useQualityData();

  const [isSpinning, setIsSpinning] = useState(false);
  const displayTime = lastUpdated || new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleRefreshClick = () => {
    setIsSpinning(true);
    if (onRefresh) {
      onRefresh();
    }
    setTimeout(() => {
      setIsSpinning(false);
    }, 600);
  };

  return (
    <header className="bg-white border-b border-slate-200 shadow-xs px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
      {/* Company & Portal Title */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h1 className="text-base font-extrabold tracking-tight text-slate-900 uppercase">
            {COMPANY_NAME}
          </h1>
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <ShieldCheck className="w-3 h-3" />
            Internal Portal
          </span>
        </div>
        <p className="text-xs font-semibold text-slate-500">
          {PORTAL_NAME}
        </p>
      </div>

      {/* Header Controls & Status */}
      <div className="flex items-center gap-3.5">
        {/* IMPORT EXCEL BUTTON */}
        <button
          onClick={() => setIsImportModalOpen(true)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs active:scale-95 ${
            dataMode === 'EXCEL_IMPORTED'
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
          }`}
          title="Import Local Excel Quality File (.xlsx)"
        >
          <UploadCloud className="w-4 h-4" />
          <span>{dataMode === 'EXCEL_IMPORTED' ? 'Excel Loaded' : 'Import Excel'}</span>
        </button>

        {/* Data Source Indicator Pill */}
        <div
          onClick={() => setIsImportModalOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer border hover:bg-slate-50 transition-colors"
          style={{
            borderColor: dataMode === 'EXCEL_IMPORTED' ? '#A7F3D0' : '#E2E8F0',
            backgroundColor: dataMode === 'EXCEL_IMPORTED' ? '#ECFDF5' : '#F8FAFC',
            color: dataMode === 'EXCEL_IMPORTED' ? '#065F46' : '#475569',
          }}
        >
          <FileSpreadsheet className={`w-3.5 h-3.5 ${dataMode === 'EXCEL_IMPORTED' ? 'text-emerald-600' : 'text-slate-400'}`} />
          <span className="truncate max-w-[160px]">
            {dataMode === 'EXCEL_IMPORTED' ? importedFileName : 'Sample Data Mode'}
          </span>
        </div>

        {/* Active Month Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <span>Period:</span>
          <span className="text-blue-700 font-bold">{activeMonth}</span>
        </div>

        {/* Refresh Button */}
        <button
          onClick={handleRefreshClick}
          title="Refresh Quality Data"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:text-blue-700 hover:border-blue-300 transition-colors shadow-xs active:scale-95"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin text-blue-600' : 'text-slate-500'}`}
          />
          <span className="hidden lg:inline">Refresh</span>
        </button>

        {/* Neutral Quality User Profile */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 shadow-xs">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-800 leading-tight">
              Quality User
            </span>
            <span className="text-[10px] font-medium text-slate-400 leading-none">
              Manufacturing QA
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
