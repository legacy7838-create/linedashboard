/**
 * Centralized theme colors and styling variables matching :root theme
 */

export const THEME = {
  bg: {
    primary: '#0C0C0C',
    secondary: '#111111',
    card: '#141414',
    sidebar: '#080808',
  },
  primary: {
    DEFAULT: '#FF7900',
    hover: '#FF8C1A',
    dark: '#CC6100',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#A6A6A6',
    muted: '#707070',
  },
  border: '#242424',
  status: {
    success: '#32C759',
    danger: '#FF453A',
    warning: '#FF9F0A',
  },
  glow: {
    orange: 'rgba(255, 121, 0, 0.25)',
    green: 'rgba(50, 199, 89, 0.20)',
  },
} as const;

export type ThemeType = typeof THEME;
