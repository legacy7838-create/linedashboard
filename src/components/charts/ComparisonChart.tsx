'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { CustomerComparisonItem, ShiftComparisonItem } from '@/types/quality';
import { QUALITY_COLORS } from '@/lib/constants/qualityConstants';

interface CustomerChartProps {
  data: CustomerComparisonItem[];
  height?: number;
}

export function CustomerQualityChart({ data, height = 280 }: CustomerChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-xs text-slate-400 font-medium">
        No customer quality data available.
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 15, left: -15, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="customer"
            stroke="#94A3B8"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#E2E8F0' }}
            interval={0}
            angle={-15}
            textAnchor="end"
          />
          <YAxis
            stroke="#94A3B8"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0F172A',
              border: 'none',
              borderRadius: '8px',
              color: '#F8FAFC',
              fontSize: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            itemStyle={{ color: '#F8FAFC', padding: '2px 0' }}
            labelStyle={{ fontWeight: 'bold', color: '#94A3B8', marginBottom: '4px' }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
          />
          <Bar
            dataKey="rejection"
            name="Rejection"
            fill={QUALITY_COLORS.rejection.primary}
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
          />
          <Bar
            dataKey="rework"
            name="Rework"
            fill={QUALITY_COLORS.rework.primary}
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
          />
          <Bar
            dataKey="fqc"
            name="FQC Fallout"
            fill={QUALITY_COLORS.fqc.primary}
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface ShiftChartProps {
  data: ShiftComparisonItem[];
  height?: number;
}

export function ShiftQualityChart({ data, height = 280 }: ShiftChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-xs text-slate-400 font-medium">
        No shift quality data available.
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="shift"
            stroke="#94A3B8"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#E2E8F0' }}
          />
          <YAxis
            stroke="#94A3B8"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0F172A',
              border: 'none',
              borderRadius: '8px',
              color: '#F8FAFC',
              fontSize: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            itemStyle={{ color: '#F8FAFC', padding: '2px 0' }}
            labelStyle={{ fontWeight: 'bold', color: '#94A3B8', marginBottom: '4px' }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
          />
          <Bar
            dataKey="rejection"
            name="Rejection"
            fill={QUALITY_COLORS.rejection.primary}
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
          />
          <Bar
            dataKey="rework"
            name="Rework"
            fill={QUALITY_COLORS.rework.primary}
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
          />
          <Bar
            dataKey="fqc"
            name="FQC Fallout"
            fill={QUALITY_COLORS.fqc.primary}
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
