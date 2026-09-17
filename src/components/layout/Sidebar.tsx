'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  XCircle,
  RotateCcw,
  ShieldAlert,
  BarChart3,
  FileText,
  Settings,
  Factory,
  CheckCircle2,
  Upload,
} from 'lucide-react';
import { useQualityData } from '@/context/QualityDataContext';

const NAV_ITEMS = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Line Rejection',
    href: '/rejection',
    icon: XCircle,
    color: 'text-red-400',
  },
  {
    name: 'Line Rework',
    href: '/rework',
    icon: RotateCcw,
    color: 'text-orange-400',
  },
  {
    name: 'FQC Fallout',
    href: '/fqc-fallout',
    icon: ShieldAlert,
    color: 'text-purple-400',
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: FileText,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { hasData, importedFileName, setIsImportModalOpen } = useQualityData();

  return (
    <aside className="w-64 bg-[#0B132B] text-slate-200 flex flex-col shrink-0 min-h-screen border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-900/40">
            <Factory className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xs tracking-wider text-slate-300 uppercase">
              VE Commercial
            </span>
            <span className="text-white font-extrabold text-sm tracking-tight">
              Vehicle Limited
            </span>
          </div>
        </div>
        <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-950/80 text-blue-300 border border-blue-800/60">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Quality Management System
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Main Navigation
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-colors ${
                  isActive ? 'text-white' : item.color || 'text-slate-400 group-hover:text-slate-200'
                }`}
              />
              <span className="truncate">{item.name}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-4 rounded-full bg-white/80" />
              )}
            </Link>
          );
        })}

        {/* Quick Import Action inside Sidebar */}
        <div className="pt-4 px-2">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold bg-blue-600/20 text-blue-300 border border-blue-500/40 hover:bg-blue-600 hover:text-white transition-all group"
          >
            <Upload className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            <span>Import Excel File</span>
          </button>
        </div>
      </nav>

      {/* System Status Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-[#080E20]/60">
        <div className="rounded-lg bg-slate-900/90 border border-slate-800 p-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Data Source
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${
                hasData
                  ? 'bg-emerald-950/90 text-emerald-300 border-emerald-800/70'
                  : 'bg-amber-950/80 text-amber-300 border-amber-800/50'
              }`}
            >
              {hasData ? 'Excel File' : 'No Data'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight mt-1 truncate">
            {hasData
              ? importedFileName
              : 'Upload Excel to view records.'}
          </p>
        </div>
      </div>
    </aside>
  );
}
