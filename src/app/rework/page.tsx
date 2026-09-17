'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { DashboardFilters } from '@/components/filters/DashboardFilters';
import { KPICard } from '@/components/ui/KPICard';
import { Card } from '@/components/ui/Card';
import { QualityTrendChart } from '@/components/charts/QualityTrendChart';
import { ParetoChart } from '@/components/charts/ParetoChart';
import { CustomerQualityChart } from '@/components/charts/ComparisonChart';
import { ProblematicMachinesList, PartQualityList } from '@/components/charts/HorizontalRankedChart';
import { QualityTable } from '@/components/tables/QualityTable';
import { useQualityData } from '@/context/QualityDataContext';

import {
  calculateKPISummary,
  calculateDailyTrend,
  calculateParetoDefects,
  calculateCustomerComparison,
  calculateMachineRankings,
  calculatePartRankings,
  extractFilterOptions,
  filterQualityRecords,
} from '@/lib/calculations/qualityCalculations';
import { FilterState } from '@/types/quality';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils/formatters';
import { RotateCcw, Wrench, Percent, UploadCloud } from 'lucide-react';

export default function ReworkPage() {
  const { qualityRecords, activeMonth, dataMode, importedFileName, setIsImportModalOpen } = useQualityData();

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
    type: 'REWORK',
  });

  useEffect(() => {
    setFilters((prev) => ({ ...prev, month: activeMonth }));
  }, [activeMonth]);

  const filterOptions = useMemo(() => {
    return extractFilterOptions(qualityRecords);
  }, [qualityRecords]);

  const reworkRecords = useMemo(() => {
    return filterQualityRecords(qualityRecords, { ...filters, type: 'REWORK' });
  }, [qualityRecords, filters]);

  const kpiSummary = useMemo(() => {
    return calculateKPISummary(reworkRecords, []);
  }, [reworkRecords]);

  const dailyTrend = useMemo(() => {
    return calculateDailyTrend(reworkRecords, []);
  }, [reworkRecords]);

  const paretoDefects = useMemo(() => {
    return calculateParetoDefects(reworkRecords, []);
  }, [reworkRecords]);

  const customerComparison = useMemo(() => {
    return calculateCustomerComparison(reworkRecords, []);
  }, [reworkRecords]);

  const machineRankings = useMemo(() => {
    return calculateMachineRankings(reworkRecords);
  }, [reworkRecords]);

  const partRankings = useMemo(() => {
    return calculatePartRankings(reworkRecords, []);
  }, [reworkRecords]);

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
      type: 'REWORK',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Line Rework Dashboard"
        subtitle="Tracking reworkable non-conformances, recovery labor costs, and tooling adjustments."
        badgeText={dataMode === 'EXCEL_IMPORTED' ? `Excel: ${importedFileName}` : 'Rework Tracking'}
        badgeColor="orange"
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

      {/* KPI Cards for Rework */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <KPICard
          title="Total Rework Qty"
          categoryBadge="Recovered Units"
          icon={RotateCcw}
          accentColor="orange"
          primaryLabel="Total Volume"
          primaryValue={`${formatNumber(kpiSummary.totalReworkQty)} pcs`}
          metrics={[
            {
              label: 'Rework Events',
              value: `${reworkRecords.length} incidents`,
            },
            {
              label: 'Avg Batch Size',
              value: reworkRecords.length > 0
                ? `${(kpiSummary.totalReworkQty / reworkRecords.length).toFixed(1)} pcs`
                : '0 pcs',
            }
          ]}
        />

        <KPICard
          title="Total Rework Cost"
          categoryBadge="Labor & Tool Cost"
          icon={Wrench}
          accentColor="orange"
          primaryLabel="Rework Expense"
          primaryValue={formatCurrency(kpiSummary.totalReworkCost)}
          metrics={[
            {
              label: 'Total Rework Cost',
              value: formatCurrency(kpiSummary.totalReworkCost),
              highlight: true,
            },
            {
              label: 'Avg Cost / Unit',
              value: kpiSummary.totalReworkQty > 0
                ? formatCurrency(kpiSummary.totalReworkCost / kpiSummary.totalReworkQty)
                : '₹0',
            }
          ]}
        />

        <KPICard
          title="Average Cost Per Unit"
          categoryBadge="Unit Labor"
          icon={Percent}
          accentColor="orange"
          primaryLabel="Avg Rework Cost / Pc"
          primaryValue={
            kpiSummary.totalReworkQty > 0
              ? formatCurrency(kpiSummary.totalReworkCost / kpiSummary.totalReworkQty)
              : '₹0'
          }
          metrics={[
            {
              label: 'Total Rework Expense',
              value: formatCurrency(kpiSummary.totalReworkCost),
              highlight: true,
            },
            {
              label: 'Total Reworked Units',
              value: `${formatNumber(kpiSummary.totalReworkQty)} pcs`,
            },
          ]}
        />
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Daily Rework Trend"
          subtitle="Daily trend of parts sent for manual/station rework"
        >
          <QualityTrendChart data={dailyTrend} showRejection={false} showRework={true} showFqc={false} />
        </Card>

        <Card
          title="Top Non-Conformance in Rework (Pareto)"
          subtitle="Pareto analysis of recurring defects requiring rework"
        >
          <ParetoChart data={paretoDefects} />
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          title="Machine-Wise Rework"
          subtitle="Stations requiring most rework intervention"
        >
          <ProblematicMachinesList machines={machineRankings} limit={5} />
        </Card>

        <Card
          title="Part-Wise Rework"
          subtitle="Components with highest rework incidents"
        >
          <PartQualityList parts={partRankings} limit={5} />
        </Card>

        <Card
          title="Customer-Wise Rework"
          subtitle="Rework volume classified by customer order"
        >
          <CustomerQualityChart data={customerComparison} />
        </Card>
      </div>

      {/* Detailed Rework Records Table */}
      <QualityTable
        records={reworkRecords}
        title="Detailed Line Rework Log"
        subtitle="Individual rework operations with root causes and corrective actions"
        onResetFilters={handleResetFilters}
      />
    </div>
  );
}
