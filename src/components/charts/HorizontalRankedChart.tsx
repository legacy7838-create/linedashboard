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
      <div className="flex items-center justify-center h-48 text-xs text-[#707070] font-medium">
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
            className="p-3 rounded-lg bg-[#0C0C0C] border border-[#242424] hover:bg-[#111111] transition-colors"
          >
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-[#1F1F1F] text-[#FF7900] text-[10px] font-bold flex items-center justify-center border border-[#242424]">
                  #{idx + 1}
                </span>
                <span className="font-bold text-[#FFFFFF] flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-[#FF7900]" />
                  {m.machineNumber}
                </span>
                <span className="text-[#A6A6A6] font-medium truncate max-w-[140px]">
                  {m.machineName}
                </span>
              </div>
              <div className="flex items-center gap-3 font-semibold">
                <span className="text-[#FFFFFF]">
                  {formatNumber(m.issueQuantity)} <span className="text-[10px] text-[#707070] font-normal">pcs</span>
                </span>
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#FF7900]/15 text-[#FF8C1A] border border-[#FF7900]/30 font-bold">
                  {m.contributionPercent}%
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-[#242424] rounded-full h-2 overflow-hidden flex">
              <div
                className="bg-[#FF7900] h-2 rounded-full transition-all duration-500 shadow-sm shadow-[#FF7900]/50"
                style={{ width: `${percentWidth}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#707070] mt-1.5">
              <span>Rejection: <strong className="text-[#FF453A] font-bold">{m.rejectionQty}</strong> | Rework: <strong className="text-[#FF7900] font-bold">{m.reworkQty}</strong></span>
              <span>Impact: <strong className="text-[#FFFFFF]">{formatCurrency(m.totalCost)}</strong></span>
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
      <div className="flex items-center justify-center h-48 text-xs text-[#707070] font-medium">
        No part quality issues data available.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-[#0C0C0C] text-[#A6A6A6] uppercase text-[10px] font-bold border-b border-[#242424]">
          <tr>
            <th className="py-2.5 px-3">Part Details</th>
            <th className="py-2.5 px-2 text-right">Rej</th>
            <th className="py-2.5 px-2 text-right">Rew</th>
            <th className="py-2.5 px-2 text-right">FQC</th>
            <th className="py-2.5 px-3 text-right">Total Cost</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#242424]">
          {displayParts.map((p) => (
            <tr key={p.partNumber} className="hover:bg-[#1F1F1F]/50 transition-colors">
              <td className="py-2 px-3">
                <div className="flex items-center gap-1.5 font-bold text-[#FFFFFF]">
                  <Package className="w-3.5 h-3.5 text-[#FF7900]" />
                  {p.partNumber}
                </div>
                <div className="text-[11px] text-[#A6A6A6] truncate max-w-[140px]">
                  {p.partName}
                </div>
              </td>
              <td className="py-2 px-2 text-right font-bold text-[#FF453A]">
                {p.rejectionQty}
              </td>
              <td className="py-2 px-2 text-right font-bold text-[#FF7900]">
                {p.reworkQty}
              </td>
              <td className="py-2 px-2 text-right font-bold text-[#A78BFA]">
                {p.fqcQty}
              </td>
              <td className="py-2 px-3 text-right font-bold text-[#FFFFFF]">
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
