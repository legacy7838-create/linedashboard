import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricItem {
  label: string;
  value: string;
  subtext?: string;
  highlight?: boolean;
}

interface KPICardProps {
  title: string;
  categoryBadge?: string;
  icon: LucideIcon;
  accentColor: 'red' | 'orange' | 'purple' | 'blue' | 'slate';
  primaryValue: string;
  primaryLabel: string;
  metrics: MetricItem[];
  footerNote?: string;
}

export function KPICard({
  title,
  categoryBadge,
  icon: Icon,
  accentColor,
  primaryValue,
  primaryLabel,
  metrics,
  footerNote,
}: KPICardProps) {
  const accentStyles = {
    red: {
      borderTop: 'border-t-4 border-t-red-600',
      iconBg: 'bg-red-50 text-red-600 border-red-200',
      badge: 'bg-red-50 text-red-700 border-red-200',
      primaryText: 'text-red-700',
      subMetricHighlight: 'text-red-700',
    },
    orange: {
      borderTop: 'border-t-4 border-t-orange-500',
      iconBg: 'bg-orange-50 text-orange-600 border-orange-200',
      badge: 'bg-orange-50 text-orange-700 border-orange-200',
      primaryText: 'text-orange-700',
      subMetricHighlight: 'text-orange-700',
    },
    purple: {
      borderTop: 'border-t-4 border-t-purple-600',
      iconBg: 'bg-purple-50 text-purple-600 border-purple-200',
      badge: 'bg-purple-50 text-purple-700 border-purple-200',
      primaryText: 'text-purple-700',
      subMetricHighlight: 'text-purple-700',
    },
    blue: {
      borderTop: 'border-t-4 border-t-blue-600',
      iconBg: 'bg-blue-50 text-blue-600 border-blue-200',
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
      primaryText: 'text-blue-700',
      subMetricHighlight: 'text-blue-700',
    },
    slate: {
      borderTop: 'border-t-4 border-t-slate-700',
      iconBg: 'bg-slate-100 text-slate-700 border-slate-200',
      badge: 'bg-slate-100 text-slate-700 border-slate-200',
      primaryText: 'text-slate-800',
      subMetricHighlight: 'text-slate-900',
    },
  };

  const style = accentStyles[accentColor];

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between transition-all hover:shadow-md ${style.borderTop}`}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-600">
              {title}
            </h3>
            {categoryBadge && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${style.badge}`}
              >
                {categoryBadge}
              </span>
            )}
          </div>
          <div className="mt-2">
            <span className="text-xs text-slate-400 font-medium block">
              {primaryLabel}
            </span>
            <div className={`text-2xl font-black tracking-tight ${style.primaryText}`}>
              {primaryValue}
            </div>
          </div>
        </div>

        <div className={`p-2.5 rounded-lg border shadow-xs ${style.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Secondary Metrics Section */}
      {metrics.length === 1 ? (
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">
            {metrics[0].label}
          </span>
          <span className={`text-base font-extrabold ${style.subMetricHighlight}`}>
            {metrics[0].value}
          </span>
        </div>
      ) : (
        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3">
          {metrics.map((m, idx) => (
            <div key={idx} className="flex flex-col">
              <span className="text-[11px] font-medium text-slate-400">
                {m.label}
              </span>
              <span
                className={`text-sm font-bold ${
                  m.highlight ? 'text-slate-900' : 'text-slate-700'
                }`}
              >
                {m.value}
              </span>
              {m.subtext && (
                <span className="text-[10px] text-slate-400 mt-0.5">{m.subtext}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {footerNote && (
        <div className="mt-3 pt-2 text-[10px] text-slate-400 border-t border-dashed border-slate-100 flex items-center justify-between">
          <span>{footerNote}</span>
        </div>
      )}
    </div>
  );
}
