export const COMPANY_NAME = 'VE COMMERCIAL VEHICLE LIMITED';
export const PORTAL_NAME = 'Internal Line Quality Portal';

export const QUALITY_COLORS = {
  rejection: {
    primary: '#DC2626', // Red-600
    light: '#FEE2E2', // Red-100
    border: '#F87171', // Red-400
    badge: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800',
    chart: '#EF4444',
  },
  rework: {
    primary: '#EA580C', // Orange-600
    light: '#FFEDD5', // Orange-100
    border: '#FB923C', // Orange-400
    badge: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800',
    chart: '#F97316',
  },
  fqc: {
    primary: '#7C3AED', // Purple-600 / Indigo
    light: '#EDE9FE', // Purple-100
    border: '#A78BFA', // Purple-400
    badge: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
    chart: '#8B5CF6',
  },
} as const;

export const DEFAULT_PAGINATION_SIZES = [25, 50, 100] as const;
