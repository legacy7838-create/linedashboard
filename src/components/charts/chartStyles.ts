/**
 * Shared presentation constants for the recharts-based charts.
 * These were previously duplicated as inline object literals in every
 * chart component, which created a new object on each render and defeated
 * downstream memoization.
 */

export const CHART_TOOLTIP_STYLE = {
  backgroundColor: '#0F172A',
  border: 'none',
  borderRadius: '8px',
  color: '#F8FAFC',
  fontSize: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
} as const;

export const CHART_TOOLTIP_ITEM_STYLE = {
  color: '#F8FAFC',
  padding: '2px 0',
} as const;

export const CHART_TOOLTIP_LABEL_STYLE = {
  fontWeight: 'bold',
  color: '#94A3B8',
  marginBottom: '4px',
} as const;

export const CHART_LEGEND_WRAPPER_STYLE = {
  fontSize: '11px',
  paddingBottom: '10px',
} as const;

export const CHART_GRID_STROKE = '#F1F5F9';
export const CHART_AXIS_STROKE = '#94A3B8';
export const CHART_AXIS_LINE = { stroke: '#E2E8F0' } as const;

/** Shown when a chart has no rows to render. */
export const CHART_EMPTY_CLASS =
  'flex items-center justify-center h-64 text-xs text-slate-400 font-medium';
