'use client';

import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { ParetoItem } from '@/types/quality';

interface ParetoChartProps {
  data: ParetoItem[];
  height?: number;
}

export function ParetoChart({ data, height = 280 }: ParetoChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-xs text-slate-400 font-medium">
        No defect Pareto data available.
      </div>
    );
  }

  // Display top 8 defects for maximum clarity
  const displayData = data.slice(0, 8);

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={displayData}
          margin={{ top: 10, right: 20, left: -15, bottom: 35 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="defect"
            stroke="#94A3B8"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#E2E8F0' }}
            interval={0}
            angle={-20}
            textAnchor="end"
          />
          {/* Left Axis: Defect Quantity */}
          <YAxis
            yAxisId="left"
            stroke="#94A3B8"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            name="Quantity"
          />
          {/* Right Axis: Cumulative % */}
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#94A3B8"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
            unit="%"
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
            formatter={(value: any, name: any) => {
              if (name === 'Cumulative %') return [`${value}%`, name];
              return [value, name];
            }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
          />
          <Bar
            yAxisId="left"
            dataKey="quantity"
            name="Defect Qty"
            fill="#2563EB"
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="cumulativePercentage"
            name="Cumulative %"
            stroke="#DC2626"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#DC2626' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
