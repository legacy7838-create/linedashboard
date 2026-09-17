'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { DashboardFilters } from '@/components/filters/DashboardFilters';
import { Card } from '@/components/ui/Card';
import { QualityTrendChart } from '@/components/charts/QualityTrendChart';
import { ParetoChart } from '@/components/charts/ParetoChart';
import { GroupedBarChart } from '@/components/charts/GroupedBarChart';
import { CustomerQualityChart, ShiftQualityChart } from '@/components/charts/ComparisonChart';
import { ProblematicMachinesList, PartQualityList } from '@/components/charts/HorizontalRankedChart';
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
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';
import { DollarSign, UploadCloud } from 'lucide-react';

export default function AnalyticsPage() {
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

  useEffect(() => {
    setFilters((prev) => ({ ...prev, month: activeMonth }));
  }, [activeMonth]);

  const filterOptions = useMemo(() => {
    return extractFilterOptions(qualityRecords, fqcRecords);
  }, [qualityRecords, fqcRecords]);

  const filteredQualityRecords = useMemo(() => {
    return filterQualityRecords(qualityRecords, filters);
  }, [qualityRecords, filters]);

  const filteredFqcRecords = useMemo(() => {
    return filterFQCRecords(fqcRecords, filters);
  }, [fqcRecords, filters]);

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
      <PageHeader
        title="Manufacturing Quality Analytics"
        subtitle="Deep comparative analytics, financial loss breakdowns, and cross-operational metrics."
        badgeText={dataMode === 'EXCEL_IMPORTED' ? `Excel: ${importedFileName}` : 'Consolidated Analytics'}
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

      <DashboardFilters
        filters={filters}
        options={filterOptions}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Cost & Volume Metric Callouts */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">
              Total Quality Impact
            </span>
            <DollarSign className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 mt-2">
            {formatCurrency(kpiSummary.totalRejectionCost + kpiSummary.totalReworkCost)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Rejection + Rework financial expense
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">
              Rejection Scrap Value
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
          </div>
          <div className="text-xl font-extrabold text-red-700 mt-2">
            {formatCurrency(kpiSummary.totalRejectionCost)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {formatNumber(kpiSummary.totalRejectionQty)} scrapped units
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">
              Rework Expense
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
          </div>
          <div className="text-xl font-extrabold text-orange-700 mt-2">
            {formatCurrency(kpiSummary.totalReworkCost)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {formatNumber(kpiSummary.totalReworkQty)} reworked units
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">
              FQC Fallout Total
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
          </div>
          <div className="text-xl font-extrabold text-purple-700 mt-2">
            {formatNumber(kpiSummary.totalFqcQty)} pcs
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {kpiSummary.fqcDefectCount} audit non-conformances
          </span>
        </div>
      </div>

      {/* 4 Trends Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Overall Quality Trajectory (Combined)"
          subtitle="Integrated daily movement across all manufacturing operations"
        >
          <QualityTrendChart data={dailyTrend} />
        </Card>

        <Card
          title="Rejection vs Rework Daily Cost Analysis"
          subtitle="Scrap cost vs rework labor expenditure over time"
        >
          <QualityTrendChart data={dailyTrend} showFqc={false} />
        </Card>

        <Card
          title="Line & Cell Distribution Comparison"
          subtitle="Comparative volume across cells for all quality categories"
        >
          <GroupedBarChart data={lineComparison} />
        </Card>

        <Card
          title="Pareto 80/20 Non-Conformance Analysis"
          subtitle="Cumulative defect curve prioritizing root causes"
        >
          <ParetoChart data={paretoDefects} />
        </Card>
      </div>

      {/* Deep Cross Section Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          title="Top Problematic Machines"
          subtitle="Critical machine stations requiring PM & calibration"
        >
          <ProblematicMachinesList machines={machineRankings} limit={6} />
        </Card>

        <Card
          title="Top Non-Conforming Parts"
          subtitle="Components with maximum financial loss"
        >
          <PartQualityList parts={partRankings} limit={6} />
        </Card>

        <Card
          title="Customer Quality Matrix"
          subtitle="Impact classified by recipient division"
        >
          <CustomerQualityChart data={customerComparison} />
        </Card>
      </div>

      {/* Shift Comparison */}
      <Card
        title="Shift Variance Comparison (Shift A vs Shift B vs Shift C)"
        subtitle="Operational and quality variance by shift crew"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ShiftQualityChart data={shiftComparison} />
          
          {/* Shift Details Breakdown */}
          <div className="flex flex-col justify-center gap-3">
            {shiftComparison.map((s) => (
              <div
                key={s.shift}
                className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <span className="font-extrabold text-sm text-slate-800">{s.shift}</span>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Rej: <strong className="text-red-600">{s.rejection}</strong> | Rew: <strong className="text-orange-600">{s.rework}</strong> | FQC: <strong className="text-purple-600">{s.fqc}</strong>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-slate-900 block">
                    {formatNumber(s.total)} pcs
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    {formatCurrency(s.cost)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
