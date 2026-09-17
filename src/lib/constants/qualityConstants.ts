import { THEME } from './theme';

export const COMPANY_NAME = 'VE COMMERCIAL VEHICLE LIMITED';
export const PORTAL_NAME = 'Internal Line Quality Portal';

export const QUALITY_COLORS = {
  rejection: {
    primary: THEME.status.danger, // #FF453A
    light: '#2A1211',
    border: '#5C1D1A',
    badge: 'bg-[#FF453A]/15 text-[#FF453A] border-[#FF453A]/30',
    chart: THEME.status.danger,
  },
  rework: {
    primary: THEME.primary.DEFAULT, // #FF7900
    light: '#2E1905',
    border: '#663300',
    badge: 'bg-[#FF7900]/15 text-[#FF7900] border-[#FF7900]/30',
    chart: THEME.primary.DEFAULT,
  },
  fqc: {
    primary: '#A78BFA', // Soft purple
    light: '#1F1733',
    border: '#4C3575',
    badge: 'bg-[#A78BFA]/15 text-[#C4B5FD] border-[#A78BFA]/30',
    chart: '#A78BFA',
  },
} as const;

export const DEFAULT_PAGINATION_SIZES = [25, 50, 100] as const;
