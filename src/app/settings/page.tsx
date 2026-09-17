'use client';

import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { useQualityData } from '@/context/QualityDataContext';
import {
  Database,
  FileSpreadsheet,
  ShieldCheck,
  FolderTree,
  Lock,
  Server,
  CheckCircle2,
  HardDrive,
  UploadCloud,
  RotateCcw,
} from 'lucide-react';

export default function SettingsPage() {
  const {
    dataMode,
    importedFileName,
    importSummary,
    qualityRecords,
    fqcRecords,
    resetToSampleData,
    setIsImportModalOpen,
  } = useQualityData();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Internal Portal Configuration & Data Settings"
        subtitle="System status, data source adapter configuration, and local server integration readiness."
        badgeText={dataMode === 'EXCEL_IMPORTED' ? 'Excel Integrated' : 'Sample Data Mode'}
        badgeColor={dataMode === 'EXCEL_IMPORTED' ? 'emerald' : 'blue'}
        actions={
          <div className="flex items-center gap-2">
            {dataMode === 'EXCEL_IMPORTED' && (
              <button
                onClick={resetToSampleData}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Sample Data</span>
              </button>
            )}
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Import Excel File</span>
            </button>
          </div>
        }
      />

      {/* Integration Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Data Source */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Data Source</span>
            <Database className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-lg font-extrabold text-slate-800 mt-2 flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                dataMode === 'EXCEL_IMPORTED' ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            ></span>
            {dataMode === 'EXCEL_IMPORTED' ? 'Excel Import Active' : 'Sample Data'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 truncate">
            {dataMode === 'EXCEL_IMPORTED' ? importedFileName : 'Running with internal dummy dataset'}
          </p>
        </div>

        {/* Excel Integration */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Active Records</span>
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-lg font-extrabold text-slate-700 mt-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            {qualityRecords.length + fqcRecords.length} Records
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {qualityRecords.filter(r => r.type === 'REJECTION').length} Rej / {qualityRecords.filter(r => r.type === 'REWORK').length} Rew / {fqcRecords.length} FQC
          </p>
        </div>

        {/* FQC Excel */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">FQC Format</span>
            <FileSpreadsheet className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-lg font-extrabold text-slate-700 mt-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
            {fqcRecords.length > 0 ? 'Integrated' : 'Sample Mode'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Separate FQC format parser enabled
          </p>
        </div>

        {/* Application Mode */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Application Mode</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-lg font-extrabold text-emerald-700 mt-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Internal Desktop
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Local browser execution mode active
          </p>
        </div>
      </div>

      {/* Uploaded File Details (if active) */}
      {dataMode === 'EXCEL_IMPORTED' && importSummary && (
        <Card
          title="Active Excel Workbook Details"
          subtitle={`Imported from local file: ${importedFileName}`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block font-semibold">Total Rows Parsed</span>
              <span className="text-lg font-black text-slate-900">{importSummary.totalRecords}</span>
            </div>
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <span className="text-red-700 block font-semibold">Rejection Qty</span>
              <span className="text-lg font-black text-red-800">{importSummary.rejectionQty} pcs</span>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <span className="text-orange-700 block font-semibold">Rework Qty</span>
              <span className="text-lg font-black text-orange-800">{importSummary.reworkQty} pcs</span>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <span className="text-purple-700 block font-semibold">FQC Fallout Qty</span>
              <span className="text-lg font-black text-purple-800">{importSummary.fqcQty} pcs</span>
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-600">
            <strong>Parsed Sheets:</strong> {importSummary.sheetsParsed.join(', ')}
          </div>
        </Card>
      )}

      {/* Target Directory Structure */}
      <Card
        title="Local Data Source Architecture"
        subtitle="Server-side directory structure designed for automated or manual Excel integration"
      >
        <div className="space-y-4 text-xs text-slate-700">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 text-slate-900 font-bold mb-2">
              <FolderTree className="w-4 h-4 text-blue-600" />
              <span>Target Directory Structure</span>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-100 rounded font-mono text-[11px] overflow-x-auto leading-relaxed">
{`LINE QUALITY DATA/
    Jul-2026/
        Rejection.xlsx
        Rework.xlsx
        FQC Fallout.xlsx

    Aug-2026/
        Rejection.xlsx
        Rework.xlsx
        FQC Fallout.xlsx

    Sep-2026/
        Rejection.xlsx
        Rework.xlsx
        FQC Fallout.xlsx`}
            </pre>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 bg-blue-50/50 rounded-lg border border-blue-200">
              <h4 className="font-bold text-blue-900 flex items-center gap-1.5 mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Live Excel Import Parser</span>
              </h4>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                The Excel parser extracts Rejection, Rework, shifts (1st, 2nd, 3rd), defect Pareto, machine breakdowns, and costs directly from workbooks like <code className="font-bold">RE Hard Rejection Sept-2026.xlsx</code>.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
                <Server className="w-4 h-4 text-slate-700" />
                <span>Server-Side Handlers</span>
              </h4>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Route Handlers in <code className="font-bold">/api/*</code> are fully configured to serve normalized JSON records to the dashboard and reporting modules.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Internal Security & Privacy Policy Card */}
      <Card
        title="Privacy & Security Assurance"
        subtitle="Guaranteed on-premise containment for VE Commercial Vehicle Limited"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 block">No Cloud Transmissions</strong>
              <span className="text-slate-500 text-[11px]">
                All Excel parsing occurs locally inside your browser / local server session. Zero cloud data transmission.
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2.5">
            <HardDrive className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 block">Read-Only Operation</strong>
              <span className="text-slate-500 text-[11px]">
                Excel files are parsed in memory in read-only mode without modifying the original spreadsheet.
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 block">Desktop Optimized</strong>
              <span className="text-slate-500 text-[11px]">
                High-density layout tailored for 1920x1080 PC and laptop workstations across plant floors.
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
