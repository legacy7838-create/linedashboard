'use client';

import React, { useState, useRef } from 'react';
import { useQualityData } from '@/context/QualityDataContext';
import { ExcelImportResult } from '@/lib/services/excelParser';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  X,
  RotateCcw,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export function ExcelImportModal() {
  const {
    isImportModalOpen,
    setIsImportModalOpen,
    importExcelFile,
    dataMode,
    importedFileName,
    importSummary,
    resetToSampleData,
  } = useQualityData();

  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewResult, setPreviewResult] = useState<ExcelImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isImportModalOpen) return null;

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setErrorMessage('Please upload a valid Excel file (.xlsx or .xls)');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const result = await importExcelFile(file);
      setPreviewResult(result);
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Error parsing Excel file. Please ensure columns include Part No, Machine, and Defect.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClose = () => {
    setIsImportModalOpen(false);
    setPreviewResult(null);
    setErrorMessage(null);
  };

  const handleApply = () => {
    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#0B132B] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600 text-white shadow-sm">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-wide">
                Import Manufacturing Excel File
              </h3>
              <p className="text-[11px] text-slate-400">
                Upload company Line Rejection / Rework Excel workbook to update live dashboard
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {/* Active Data Mode Banner */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Active Data Mode:</span>
              <span
                className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                  dataMode === 'EXCEL_IMPORTED'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                {dataMode === 'EXCEL_IMPORTED'
                  ? `Excel: ${importedFileName}`
                  : 'Default Sample Data'}
              </span>
            </div>

            {dataMode === 'EXCEL_IMPORTED' && (
              <button
                onClick={() => {
                  resetToSampleData();
                  setPreviewResult(null);
                }}
                className="flex items-center gap-1 text-slate-600 hover:text-red-600 font-semibold text-[11px] transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Sample Data</span>
              </button>
            )}
          </div>

          {/* Drag and Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
              isDragging
                ? 'border-blue-500 bg-blue-50/70 scale-[1.01]'
                : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mb-3 shadow-xs">
              <Upload className="w-6 h-6" />
            </div>

            <h4 className="text-sm font-bold text-slate-800">
              {isProcessing ? 'Processing Excel File...' : 'Click to Upload or Drag & Drop Excel File'}
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Supports <strong className="text-slate-700">.xlsx</strong> and{' '}
              <strong className="text-slate-700">.xls</strong> workbooks containing Rejection, Rework, or FQC sheets (e.g. <span className="font-mono text-blue-600 text-[11px]">RE Hard Rejection Sept-2026.xlsx</span>)
            </p>

            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Auto-detects Shifts, Defects, Machines, Rates & Costs</span>
            </div>
          </div>

          {/* Error message */}
          {errorMessage && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success / Parsed Summary Preview */}
          {(previewResult || importSummary) && (
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-emerald-900">
                    Workbook Successfully Parsed: {previewResult?.fileName || importedFileName}
                  </span>
                </div>
                <span className="font-extrabold text-emerald-800 px-2 py-0.5 bg-emerald-100 rounded text-[11px]">
                  {(previewResult?.summary.totalRecords || importSummary?.totalRecords)} Total Records
                </span>
              </div>

              {/* Stat breakdown pills */}
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <div className="p-2.5 bg-white rounded-lg border border-red-200">
                  <span className="text-[10px] font-bold text-red-600 uppercase block">Rejection</span>
                  <span className="text-base font-black text-red-700 block">
                    {formatNumber(previewResult?.summary.rejectionQty || importSummary?.rejectionQty || 0)} pcs
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Cost: {formatCurrency(previewResult?.summary.rejectionCost || importSummary?.rejectionCost || 0)}
                  </span>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-orange-200">
                  <span className="text-[10px] font-bold text-orange-600 uppercase block">Rework</span>
                  <span className="text-base font-black text-orange-700 block">
                    {formatNumber(previewResult?.summary.reworkQty || importSummary?.reworkQty || 0)} pcs
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Cost: {formatCurrency(previewResult?.summary.reworkCost || importSummary?.reworkCost || 0)}
                  </span>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-purple-200">
                  <span className="text-[10px] font-bold text-purple-600 uppercase block">FQC Fallout</span>
                  <span className="text-base font-black text-purple-700 block">
                    {formatNumber(previewResult?.summary.fqcQty || importSummary?.fqcQty || 0)} pcs
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {(previewResult?.summary.fqcCount || importSummary?.fqcCount || 0)} logged audits
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 pt-1">
                <strong>Sheets Parsed:</strong>{' '}
                {(previewResult?.summary.sheetsParsed || importSummary?.sheetsParsed || []).join(', ')}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleApply}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <span>Apply to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
