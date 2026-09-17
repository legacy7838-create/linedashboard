'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { DashboardFilters } from '@/components/filters/DashboardFilters';
import { QualitySummarySection } from '@/components/dashboard/QualitySummarySection';
import { Card } from '@/components/ui/Card';
import { GroupedBarChart } from '@/components/charts/GroupedBarChart';
import { QualityTrendChart } from '@/components/charts/QualityTrendChart';
import { ParetoChart } from '@/components/charts/ParetoChart';
import { CustomerQualityChart, ShiftQualityChart } from '@/components/charts/ComparisonChart';
import { ProblematicMachinesList, PartQualityList } from '@/components/charts/HorizontalRankedChart';
import { QualityTable } from '@/components/tables/QualityTable';
import { useQualityData } from '@/context/QualityDataContext';

import {
  calculateKPISummary,
  calculateDailyTrend,
  calculateLineComparison,
  calculateParetoDefects,
  calculateCustomerComparison,
  calculateMachineRankings,
  calculatePartRankings,
  calculateShiftComparison,
  extractFilterOptions,
  filterQualityRecords,
  filterFQCRecords,
} from '@/lib/calculations/qualityCalculations';
import { FilterState } from '@/types/quality';
import { UploadCloud, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

export default function DashboardPage() {
  const { qualityRecords, fqcRecords, activeMonth, dataMode, importedFileName, setIsImportModalOpen } = useQualityData();

  const [filters, setFilters] = useState<FilterState>({
    month: activeMonth,
    startDate: '',
    endDate: '',
    cellOrLine: 'ALL',
    shift: 'ALL',
    customer: 'ALL',
    partNumber: 'ALL',
    machine: 'ALL',
    searchQuery: '',
    type: 'ALL',
  });

  // Sync active month when changed
  useEffect(() => {
    setFilters((prev) => ({ ...prev, month: activeMonth }));
  }, [activeMonth]);

  // Dynamic filter options derived from active records
  const filterOptions = useMemo(() => {
    return extractFilterOptions(qualityRecords, fqcRecords);
  }, [qualityRecords, fqcRecords]);

  // Filtered records
  const filteredQualityRecords = useMemo(() => {
    return filterQualityRecords(qualityRecords, filters);
  }, [qualityRecords, filters]);

  const filteredFqcRecords = useMemo(() => {
    return filterFQCRecords(fqcRecords, filters);
  }, [fqcRecords, filters]);

  // Derived Business Calculations
  const kpiSummary = useMemo(() => {
    return calculateKPISummary(filteredQualityRecords, filteredFqcRecords);
  }, [filteredQualityRecords, filteredFqcRecords]);

  const dailyTrend = useMemo(() => {
    return calculateDailyTrend(filteredQualityRecords, filteredFqcRecords);
  }, [filteredQualityRecords, filteredFqcRecords]);

  const lineComparison = useMemo(() => {
    return calculateLineComparison(filteredQualityRecords, filteredFqcRecords);
  }, [filteredQualityRecords, filteredFqcRecords]);

  const paretoDefects = useMemo(() => {
    return calculateParetoDefects(filteredQualityRecords, filteredFqcRecords);
  }, [filteredQualityRecords, filteredFqcRecords]);

  const customerComparison = useMemo(() => {
    return calculateCustomerComparison(filteredQualityRecords, filteredFqcRecords);
  }, [filteredQualityRecords, filteredFqcRecords]);

  const machineRankings = useMemo(() => {
    return calculateMachineRankings(filteredQualityRecords);
  }, [filteredQualityRecords]);

  const partRankings = useMemo(() => {
    return calculatePartRankings(filteredQualityRecords, filteredFqcRecords);
  }, [filteredQualityRecords, filteredFqcRecords]);

  const shiftComparison = useMemo(() => {
    return calculateShiftComparison(filteredQualityRecords, filteredFqcRecords);
  }, [filteredQualityRecords, filteredFqcRecords]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      month: 'ALL',
      startDate: '',
      endDate: '',
      cellOrLine: 'ALL',
      shift: 'ALL',
      customer: 'ALL',
      partNumber: 'ALL',
      machine: 'ALL',
      searchQuery: '',
      type: 'ALL',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Status */}
      <PageHeader
        title="Manufacturing Line Quality Overview"
        subtitle="Real-time multi-dimensional tracking of rejection, rework, and FQC fallout metrics."
        badgeText={dataMode === 'EXCEL_IMPORTED' ? `Excel: ${importedFileName}` : 'Live Dashboard'}
        badgeColor={dataMode === 'EXCEL_IMPORTED' ? 'emerald' : 'blue'}
        actions={
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Import Excel</span>
          </button>
        }
      />

      {/* Dynamic Multi-Filter Bar */}
      <DashboardFilters
        filters={filters}
        options={filterOptions}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* KPI Section (4 High-Density Cards) */}
      <QualitySummarySection summary={kpiSummary} />

      {/* Analysis Grid: Row 1 - Line Comparison & Daily Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. REJECTION vs REWORK vs FQC FALLOUT (Grouped Bar Chart by Cell/Line) */}
        <Card
          title="1. Rejection vs Rework vs FQC Fallout"
          subtitle="Grouped volume breakdown by manufacturing cell and line"
        >
          <GroupedBarChart data={lineComparison} />
        </Card>

        {/* 2. DAILY QUALITY TREND (Multi-Line Chart) */}
        <Card
          title="2. Daily Quality Trend"
          subtitle="Chronological defect trajectory across Rejection, Rework, and FQC"
        >
          <QualityTrendChart data={dailyTrend} />
        </Card>
      </div>

      {/* Analysis Grid: Row 2 - Pareto Non-Conformance & Customer-Wise Quality */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3. TOP NON-CONFORMANCE (Pareto Chart: Defect Quantity & Cumulative %) */}
        <Card
          title="3. Top Non-Conformance (Pareto 80/20 Analysis)"
          subtitle="Root defect frequencies sorted descending with cumulative distribution"
        >
          <ParetoChart data={paretoDefects} />
        </Card>

        {/* 4. CUSTOMER-WISE QUALITY (Comparison Chart) */}
        <Card
          title="4. Customer-Wise Quality Distribution"
          subtitle="Impact distribution categorized by recipient OEM / division"
        >
          <CustomerQualityChart data={customerComparison} />
        </Card>
      </div>

      {/* Analysis Grid: Row 3 - Problematic Machines, Part Issues & Shift Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 5. TOP PROBLEMATIC MACHINES */}
        <Card
          title="5. Top Problematic Machines"
          subtitle="Ranked machine stations by issue quantity & contribution %"
        >
          <ProblematicMachinesList machines={machineRankings} limit={5} />
        </Card>

        {/* 6. PART-WISE QUALITY ISSUES */}
        <Card
          title="6. Part-Wise Quality Issues"
          subtitle="Component breakdown across Rejection, Rework, and Cost"
        >
          <PartQualityList parts={partRankings} limit={5} />
        </Card>

        {/* 7. SHIFT-WISE QUALITY */}
        <Card
          title="7. Shift-Wise Quality Comparison"
          subtitle="Operational variance comparison between Shift A, B, and C"
        >
          <ShiftQualityChart data={shiftComparison} />
        </Card>
      </div>

      {/* 8. RECENT QUALITY RECORDS TABLE */}
      <QualityTable
        records={filteredQualityRecords}
        fqcRecords={filteredFqcRecords}
        title="8. Recent Quality Records"
        subtitle="Individual line rejection, rework, and FQC non-conformance logs"
        onResetFilters={handleResetFilters}
      />
    </div>
  );
}
