/**
 * Utility formatters for Indian Manufacturing & Corporate Quality metrics
 */

export function formatCurrency(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(value: number): string {
  if (isNaN(value) || value === null || value === undefined) return '0';
  return new Intl.NumberFormat('en-IN').format(value);
}

export function formatPercent(value: number | 'N/A' | undefined | null, decimals: number = 2): string {
  if (value === 'N/A' || value === undefined || value === null || isNaN(Number(value))) {
    return 'N/A';
  }
  return `${Number(value).toFixed(decimals)}%`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatShortDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const day = parts[2];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIndex = parseInt(parts[1], 10) - 1;
      return `${day} ${monthNames[monthIndex] || parts[1]}`;
    }
    return dateString;
  } catch {
    return dateString;
  }
}
