// Formatting utilities following the coding guidelines

/**
 * Formats a number as currency using USD format
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD' 
  }).format(amount);
}

/**
 * Formats a number as currency using AUD format
 */
export function formatCurrencyAUD(amount: number): string {
  return new Intl.NumberFormat('en-AU', { 
    style: 'currency', 
    currency: 'AUD' 
  }).format(amount);
}

/**
 * Calculates the AUD value of werms based on estimated mixed werm composition
 * Assumes roughly 60% silver ($1 USD), 35% gold ($10 USD), 5% bronze ($20 USD)
 * Uses an approximate USD to AUD exchange rate of 1.55
 */
export function calculateWermValueAUD(wermCount: number): string {
  const avgUSDValue = (0.6 * 1) + (0.35 * 10) + (0.05 * 20); // ~$5.10 USD per werm average
  const usdToAudRate = 1.55; // Approximate exchange rate
  const audValue = wermCount * avgUSDValue * usdToAudRate;
  return formatCurrencyAUD(audValue);
}

/**
 * Formats a date using a relative format (e.g., "2 days ago")
 */
export function formatRelativeDate(date: Date | string): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return targetDate.toLocaleDateString();
}

/**
 * Formats a date using a standard format
 */
export function formatDate(date: Date | string): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  return targetDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formats a number with proper thousand separators
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Truncates text to a specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
} 