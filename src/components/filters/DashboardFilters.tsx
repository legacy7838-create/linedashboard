'use client';

import React from 'react';
import { RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { FilterState } from '@/types/quality';

interface FilterOptions {
  months: string[];
  cellsAndLines: string[];
  shifts: string[];
  customers: string[];
  parts: string[];
  machines: string[];
}

interface DashboardFiltersProps {
  filters: FilterState;
  options: FilterOptions;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
  showMachineFilter?: boolean;
}

export function DashboardFilters({
  filters,
  options,
  onFilterChange,
  onReset,
  showMachineFilter = true,
}: DashboardFiltersProps) {
  const hasActiveFilters =
    (filters.month && filters.month !== 'ALL') ||
    filters.startDate !== '' ||
    filters.endDate !== '' ||
    (filters.cellOrLine && filters.cellOrLine !== 'ALL') ||
    (filters.shift && filters.shift !== 'ALL') ||
    (filters.customer && filters.customer !== 'ALL') ||
    (filters.partNumber && filters.partNumber !== 'ALL') ||
    (filters.machine && filters.machine !== 'ALL') ||
    filters.searchQuery !== '';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 mb-6 transition-all">
      {/* Filters Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-blue-50 text-blue-600 border border-blue-200">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Operational Filters & Search
          </span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              Active Filters Applied
            </span>
          )}
        </div>

        {/* Search input + Reset Button */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search part, defect, machine..."
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-52 text-slate-800 placeholder:text-slate-400 font-medium"
            />
          </div>

          <button
            onClick={onReset}
            disabled={!hasActiveFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Clear all filters"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Grid of Dynamic Dropdowns */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {/* Month Dropdown */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Month
          </label>
          <select
            value={filters.month || 'ALL'}
            onChange={(e) => onFilterChange({ month: e.target.value })}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Months</option>
            {options.months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Start Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => onFilterChange({ startDate: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* End Date */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            End Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => onFilterChange({ endDate: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Cell / Line */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Cell / Line
          </label>
          <select
            value={filters.cellOrLine || 'ALL'}
            onChange={(e) => onFilterChange({ cellOrLine: e.target.value })}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 truncate"
          >
            <option value="ALL">All Cells & Lines</option>
            {options.cellsAndLines.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Shift */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Shift
          </label>
          <select
            value={filters.shift || 'ALL'}
            onChange={(e) => onFilterChange({ shift: e.target.value })}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Shifts</option>
            {options.shifts.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Customer */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Customer
          </label>
          <select
            value={filters.customer || 'ALL'}
            onChange={(e) => onFilterChange({ customer: e.target.value })}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 truncate"
          >
            <option value="ALL">All Customers</option>
            {options.customers.map((cust) => (
              <option key={cust} value={cust}>
                {cust}
              </option>
            ))}
          </select>
        </div>

        {/* Part Number */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Part Number
          </label>
          <select
            value={filters.partNumber || 'ALL'}
            onChange={(e) => onFilterChange({ partNumber: e.target.value })}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 truncate"
          >
            <option value="ALL">All Parts</option>
            {options.parts.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Machine (optional for general or Rejection/Rework) */}
        {showMachineFilter && (
          <div className="flex flex-col gap-1 col-span-2 md:col-span-4 lg:col-span-7 pt-1 border-t border-slate-100 flex-row items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 shrink-0">
              Filter By Machine:
            </span>
            <select
              value={filters.machine || 'ALL'}
              onChange={(e) => onFilterChange({ machine: e.target.value })}
              className="max-w-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Machines</option>
              {options.machines.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
