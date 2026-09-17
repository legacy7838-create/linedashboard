'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { DailyTrendItem } from '@/types/quality';
import { QUALITY_COLORS } from '@/lib/constants/qualityConstants';

interface QualityTrendChartProps {
  data: DailyTrendItem[];
  showRejection?: boolean;
  showRework?: boolean;
  showFqc?: boolean;
  height?: number;
}

export function QualityTrendChart({
  data,
  showRejection = true,
  showRework = true,
  showFqc = true,
  height = 280,
}: QualityTrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-xs text-slate-400 font-medium">
        No daily trend data available for current selection.
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="displayDate"
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
          {showRejection && (
            <Line
              type="monotone"
              dataKey="rejectionQty"
              name="Rejection"
              stroke={QUALITY_COLORS.rejection.primary}
              strokeWidth={2.5}
              dot={{ r: 3, fill: QUALITY_COLORS.rejection.primary }}
              activeDot={{ r: 5 }}
            />
          )}
          {showRework && (
            <Line
              type="monotone"
              dataKey="reworkQty"
              name="Rework"
              stroke={QUALITY_COLORS.rework.primary}
              strokeWidth={2.5}
              dot={{ r: 3, fill: QUALITY_COLORS.rework.primary }}
              activeDot={{ r: 5 }}
            />
          )}
          {showFqc && (
            <Line
              type="monotone"
              dataKey="fqcQty"
              name="FQC Fallout"
              stroke={QUALITY_COLORS.fqc.primary}
              strokeWidth={2.5}
              dot={{ r: 3, fill: QUALITY_COLORS.fqc.primary }}
              activeDot={{ r: 5 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
