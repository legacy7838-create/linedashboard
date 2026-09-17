'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { QualityRecord, FQCRecord } from '@/types/quality';
import { DUMMY_QUALITY_RECORDS, DUMMY_FQC_RECORDS } from '@/data/dummyQualityData';
import { parseUploadedExcelFile, ExcelImportResult } from '@/lib/services/excelParser';

interface QualityDataContextType {
  qualityRecords: QualityRecord[];
  fqcRecords: FQCRecord[];
  dataMode: 'SAMPLE_DATA' | 'EXCEL_IMPORTED';
  importedFileName: string | null;
  importSummary: ExcelImportResult['summary'] | null;
  activeMonth: string;
  setActiveMonth: (month: string) => void;
  importExcelFile: (file: File) => Promise<ExcelImportResult>;
  resetToSampleData: () => void;
  isImportModalOpen: boolean;
  setIsImportModalOpen: (open: boolean) => void;
}

const QualityDataContext = createContext<QualityDataContextType | undefined>(undefined);

export function QualityDataProvider({ children }: { children: React.ReactNode }) {
  const [qualityRecords, setQualityRecords] = useState<QualityRecord[]>(DUMMY_QUALITY_RECORDS);
  const [fqcRecords, setFqcRecords] = useState<FQCRecord[]>(DUMMY_FQC_RECORDS);
  const [dataMode, setDataMode] = useState<'SAMPLE_DATA' | 'EXCEL_IMPORTED'>('SAMPLE_DATA');
  const [importedFileName, setImportedFileName] = useState<string | null>(null);
  const [importSummary, setImportSummary] = useState<ExcelImportResult['summary'] | null>(null);
  const [activeMonth, setActiveMonth] = useState<string>('Sep-2026');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const importExcelFile = async (file: File): Promise<ExcelImportResult> => {
    try {
      const result = await parseUploadedExcelFile(file);
      if (result.qualityRecords.length === 0 && result.fqcRecords.length === 0) {
        throw new Error('No valid quality or rejection/rework records found in this Excel file.');
      }

      setQualityRecords(result.qualityRecords);
      setFqcRecords(result.fqcRecords);
      setDataMode('EXCEL_IMPORTED');
      setImportedFileName(result.fileName);
      setImportSummary(result.summary);

      if (result.summary.months.length > 0) {
        setActiveMonth(result.summary.months[0]);
      }

      return result;
    } catch (error: any) {
      console.error('Failed to parse excel file:', error);
      throw error;
    }
  };

  const resetToSampleData = () => {
    setQualityRecords(DUMMY_QUALITY_RECORDS);
    setFqcRecords(DUMMY_FQC_RECORDS);
    setDataMode('SAMPLE_DATA');
    setImportedFileName(null);
    setImportSummary(null);
    setActiveMonth('Sep-2026');
  };

  return (
    <QualityDataContext.Provider
      value={{
        qualityRecords,
        fqcRecords,
        dataMode,
        importedFileName,
        importSummary,
        activeMonth,
        setActiveMonth,
        importExcelFile,
        resetToSampleData,
        isImportModalOpen,
        setIsImportModalOpen,
      }}
    >
      {children}
    </QualityDataContext.Provider>
  );
}

export function useQualityData() {
  const context = useContext(QualityDataContext);
  if (!context) {
    throw new Error('useQualityData must be used within a QualityDataProvider');
  }
  return context;
}
