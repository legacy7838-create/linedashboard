import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function Card({ children, className = '', title, subtitle, action }: CardProps) {
  return (
    <div className={`bg-[#141414] rounded-xl border border-[#242424] shadow-md shadow-black/40 p-5 text-[#FFFFFF] ${className}`}>
      {(title || subtitle || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-[#242424]">
          <div>
            {title && <h3 className="font-bold text-sm text-[#FFFFFF] tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-[#A6A6A6] mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
