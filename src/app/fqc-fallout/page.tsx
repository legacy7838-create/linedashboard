'use client';

import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { DashboardFilters } from '@/components/filters/DashboardFilters';
import { KPICard } from '@/components/ui/KPICard';
import { Card } from '@/components/ui/Card';
import {
  QualityTrendChart,
  ParetoChart,
  GroupedBarChart,
  CustomerQualityChart,
  PartQualityList,
} from '@/components/charts';
import { TablePagination } from '@/components/ui/TablePagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { useQualityData } from '@/context/QualityDataContext';
import { useQualityDerivations, createDefaultFilters } from '@/lib/hooks/useQualityDerivations';

import { FilterState } from '@/types/quality';
import { formatDate, formatNumber, formatPercent } from '@/lib/utils/formatters';
import { NoDataState } from '@/components/ui/NoDataState';
import { ShieldAlert, CheckCircle, Percent, UploadCloud } from 'lucide-react';

export default function FQCFalloutPage() {
  const { fqcRecords, activeMonth, hasData, setIsImportModalOpen } = useQualityData();

  const [filters, setFilters] = useState<FilterState>(createDefaultFilters({ month: activeMonth }));
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const effectiveFilters = useMemo(
    () => (filters.month === activeMonth ? filters : { ...filters, month: activeMonth }),
    [filters, activeMonth]
  );

  const {
    filteredFqcRecords,
    filterOptions,
    kpiSummary,
    dailyTrend,
    paretoDefects,
    lineComparison,
    customerComparison,
    partRankings,
  } = useQualityDerivations([], fqcRecords, effectiveFilters, { includeQuality: false });

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters(createDefaultFilters());
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedFqcRecords = filteredFqcRecords.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Final Quality Control (FQC) Fallout Dashboard"
        subtitle="End-of-line audits, pre-dispatch inspections, and dock audit containment monitoring."
        badgeText={hasData ? 'Excel Data Loaded' : 'No Data Loaded'}
        badgeColor="purple"
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

      {!hasData ? (
        <NoDataState
          title="No FQC Fallout Data Available"
          message="Import an Excel workbook containing an FQC sheet to populate end-of-line audit and containment analytics."
          onImport={() => setIsImportModalOpen(true)}
        />
      ) : (
        <>
          <DashboardFilters
            filters={filters}
            options={filterOptions}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            showMachineFilter={false}
          />

      {/* KPI Cards for FQC Fallout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <KPICard
          title="Total FQC Fallout"
          categoryBadge="Audit Fallout"
          icon={ShieldAlert}
          accentColor="purple"
          primaryLabel="Fallout Quantity"
          primaryValue={`${formatNumber(kpiSummary.totalFqcQty)} pcs`}
          metrics={[
            {
              label: 'Total Audit Logs',
              value: `${filteredFqcRecords.length} audits`,
            },
            {
              label: 'Sampled Units',
              value: `${formatNumber(filteredFqcRecords.reduce((s, r) => s + (r.lotSizeInspected || r.quantity * 5), 0))} inspected`,
            }
          ]}
        />

        <KPICard
          title="FQC Fallout Rate"
          categoryBadge="Quality Yield"
          icon={Percent}
          accentColor="purple"
          primaryLabel="Audit Fallout Rate"
          primaryValue={formatPercent(kpiSummary.fqcRate)}
          metrics={[
            {
              label: 'Audit Standard',
              value: 'MIL-STD-105E',
              highlight: true,
            },
            {
              label: 'Inspection Status',
              value: kpiSummary.totalFqcQty > 10 ? 'Enhanced Audit' : 'Normal Audit',
            }
          ]}
        />

        <KPICard
          title="Identified Defects"
          categoryBadge="Defect Severity"
          icon={CheckCircle}
          accentColor="purple"
          primaryLabel="Defect Non-Conformances"
          primaryValue={`${kpiSummary.fqcDefectCount} items`}
          metrics={[
            {
              label: 'Containment Status',
              value: '100% Quarantined',
              highlight: true,
            },
            {
              label: 'Dock Audits',
              value: `${filteredFqcRecords.filter(f => f.stage === 'Dock Audit').length} items`,
            }
          ]}
        />
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Daily FQC Fallout Trend"
          subtitle="Daily volume of parts flagged during FQC audits"
        >
          <QualityTrendChart data={dailyTrend} showRejection={false} showRework={false} showFqc={true} />
        </Card>

        <Card
          title="Top FQC Non-Conformance (Pareto)"
          subtitle="Pareto ranking of final inspection non-conformances"
        >
          <ParetoChart data={paretoDefects} />
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          title="Line-Wise Fallout"
          subtitle="FQC fallout aggregated by manufacturing line"
        >
          <GroupedBarChart data={lineComparison} />
        </Card>

        <Card
          title="Part-Wise Fallout"
          subtitle="Components with highest final QC fallout"
        >
          <PartQualityList parts={partRankings} limit={5} />
        </Card>

        <Card
          title="Customer-Wise Fallout"
          subtitle="Pre-dispatch inspection fallout by customer"
        >
          <CustomerQualityChart data={customerComparison} />
        </Card>
      </div>

      {/* Dedicated FQC Audit Records Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900">
                FQC Audit & Pre-Dispatch Inspection Logs
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                {filteredFqcRecords.length} Audits
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Dedicated final inspection dataset formatted for independent FQC Excel mapping
            </p>
          </div>
        </div>

        {filteredFqcRecords.length === 0 ? (
          <div className="p-6">
            <EmptyState onReset={handleResetFilters} />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Audit Stage</th>
                    <th className="py-3 px-3">Line / Cell</th>
                    <th className="py-3 px-3">Part No. & Name</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Non-Conformance</th>
                    <th className="py-3 px-3 text-right">Fallout Qty</th>
                    <th className="py-3 px-3 text-right">Lot Inspected</th>
                    <th className="py-3 px-3 text-right">Fallout Rate</th>
                    <th className="py-3 px-3">Containment Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedFqcRecords.map((f) => (
                    <tr key={f.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-slate-700 whitespace-nowrap">
                        {formatDate(f.date)}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          {f.stage}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-800 whitespace-nowrap">
                        {f.line}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{f.partNumber}</div>
                        <div className="text-[11px] text-slate-400">{f.partName}</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap font-medium">
                        {f.customer}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap font-bold text-slate-800">
                        {f.nonConformance}
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-purple-700">
                        {f.quantity} pcs
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-slate-600">
                        {f.lotSizeInspected}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                        {formatPercent(f.falloutRatePercent)}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 max-w-[200px] truncate">
                        {f.containmentAction}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <TablePagination
              currentPage={currentPage}
              totalRecords={filteredFqcRecords.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </>
        )}
      </div>
        </>
      )}
    </div>
  );
}
