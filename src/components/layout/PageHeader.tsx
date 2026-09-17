import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badgeText?: string;
  badgeColor?: 'blue' | 'red' | 'orange' | 'purple' | 'emerald';
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  badgeText,
  badgeColor = 'blue',
  actions,
}: PageHeaderProps) {
  const badgeStyles = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-200">
      <div>
        <div className="flex items-center gap-2.5">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
          {badgeText && (
            <span
              className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeStyles[badgeColor]}`}
            >
              {badgeText}
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2.5">{actions}</div>}
    </div>
  );
}
