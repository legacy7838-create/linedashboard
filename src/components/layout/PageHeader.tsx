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
  badgeColor = 'orange',
  actions,
}: PageHeaderProps) {
  const badgeStyles = {
    blue: 'bg-[#FF7900]/15 text-[#FF8C1A] border-[#FF7900]/30',
    red: 'bg-[#FF453A]/15 text-[#FF453A] border-[#FF453A]/30',
    orange: 'bg-[#FF7900]/15 text-[#FF8C1A] border-[#FF7900]/30',
    purple: 'bg-[#A78BFA]/15 text-[#C4B5FD] border-[#A78BFA]/30',
    emerald: 'bg-[#32C759]/15 text-[#32C759] border-[#32C759]/30',
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 mb-5 border-b border-[#242424]">
      <div>
        <div className="flex items-center gap-2.5">
          <h2 className="text-xl font-bold text-[#FFFFFF] tracking-tight">{title}</h2>
          {badgeText && (
            <span
              className={`px-2.5 py-0.5 rounded text-xs font-semibold border ${badgeStyles[badgeColor]}`}
            >
              {badgeText}
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs text-[#A6A6A6] mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2.5">{actions}</div>}
    </div>
  );
}
