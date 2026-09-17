'use client';

import React, { useMemo } from 'react';
import { MachineRankingItem, PartRankingItem } from '@/types/quality';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';
import { Cpu, Package } from 'lucide-react';

interface ProblematicMachinesProps {
  machines: MachineRankingItem[];
  limit?: number;
}

function ProblematicMachinesListImpl({ machines, limit = 5 }: ProblematicMachinesProps) {
  const displayMachines = useMemo(() => machines.slice(0, limit), [machines, limit]);
  const maxIssues = useMemo(
    () => Math.max(...displayMachines.map(m => m.issueQuantity), 1),
    [displayMachines]
  );

  if (!displayMachines || displayMachines.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-xs text-slate-400 font-medium">
        No machine performance data available.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayMachines.map((m, idx) => {
        const percentWidth = (m.issueQuantity / maxIssues) * 100;
        return (
          <div
            key={m.machineNumber}
            className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 hover:bg-slate-100/80 transition-colors"
          >
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                  #{idx + 1}
                </span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-blue-600" />
                  {m.machineNumber}
                </span>
                <span className="text-slate-500 font-medium truncate max-w-[150px]">
                  {m.machineName}
                </span>
              </div>
              <div className="flex items-center gap-3 font-semibold">
                <span className="text-slate-900">
                  {formatNumber(m.issueQuantity)} <span className="text-[10px] text-slate-400 font-normal">pcs</span>
                </span>
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-blue-100/80 text-blue-800 font-bold">
                  {m.contributionPercent}%
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden flex">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${percentWidth}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
              <span>Rejection: <strong className="text-red-600">{m.rejectionQty}</strong> | Rework: <strong className="text-orange-600">{m.reworkQty}</strong></span>
              <span>Impact: <strong className="text-slate-700">{formatCurrency(m.totalCost)}</strong></span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface PartIssuesProps {
  parts: PartRankingItem[];
  limit?: number;
}

function PartQualityListImpl({ parts, limit = 5 }: PartIssuesProps) {
  const displayParts = useMemo(() => parts.slice(0, limit), [parts, limit]);

  if (!displayParts || displayParts.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-xs text-slate-400 font-medium">
        No part quality issues data available.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
          <tr>
            <th className="py-2.5 px-3">Part Details</th>
            <th className="py-2.5 px-2 text-right">Rej</th>
            <th className="py-2.5 px-2 text-right">Rew</th>
            <th className="py-2.5 px-2 text-right">FQC</th>
            <th className="py-2.5 px-3 text-right">Total Cost</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {displayParts.map((p) => (
            <tr key={p.partNumber} className="hover:bg-slate-50/80 transition-colors">
              <td className="py-2 px-3">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Package className="w-3.5 h-3.5 text-slate-400" />
                  {p.partNumber}
                </div>
                <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                  {p.partName}
                </div>
              </td>
              <td className="py-2 px-2 text-right font-bold text-red-600">
                {p.rejectionQty}
              </td>
              <td className="py-2 px-2 text-right font-bold text-orange-600">
                {p.reworkQty}
              </td>
              <td className="py-2 px-2 text-right font-bold text-purple-600">
                {p.fqcQty}
              </td>
              <td className="py-2 px-3 text-right font-bold text-slate-900">
                {formatCurrency(p.totalCost)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const ProblematicMachinesList = React.memo(ProblematicMachinesListImpl);
export const PartQualityList = React.memo(PartQualityListImpl);
