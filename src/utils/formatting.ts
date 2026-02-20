/**
 * Formatting Utilities
 * Functions for formatting currency, dates, numbers, and other display values
 */

import { format, formatDistance, formatRelative, isToday, isYesterday, startOfDay, endOfDay } from 'date-fns';
import { Currency } from './types';
import { CURRENCIES, DATE_FORMATS } from './constants';

// ============================================================================
// Currency Formatting
// ============================================================================

/**
 * Get currency object by code
 */
export const getCurrency = (code: string): Currency | undefined => {
  return CURRENCIES.find((c) => c.code === code);
};

/**
 * Format amount as currency string
 */
export const formatCurrency = (
  amount: number,
  currencyCode: string = 'USD',
  options?: {
    showSymbol?: boolean;
    showCode?: boolean;
    decimalPlaces?: number;
  }
): string => {
  const currency = getCurrency(currencyCode);
  
  if (!currency) {
    return amount.toFixed(2);
  }

  const decimalPlaces = options?.decimalPlaces ?? currency.decimalDigits;
  const formattedAmount = amount.toFixed(decimalPlaces);
  
  // Add thousand separators
  const parts = formattedAmount.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const displayAmount = parts.join('.');

  // Build the result
  const showSymbol = options?.showSymbol !== false;
  const showCode = options?.showCode ?? false;

  if (showSymbol && showCode) {
    return `${currency.symbol}${displayAmount} ${currency.code}`;
  } else if (showSymbol) {
    return `${currency.symbol}${displayAmount}`;
  } else if (showCode) {
    return `${displayAmount} ${currency.code}`;
  }

  return displayAmount;
};

/**
 * Format amount with sign (+ for positive, - for negative)
 */
export const formatCurrencyWithSign = (
  amount: number,
  currencyCode: string = 'USD',
  options?: { showSymbol?: boolean; showCode?: boolean }
): string => {
  const sign = amount >= 0 ? '+' : '';
  const formatted = formatCurrency(Math.abs(amount), currencyCode, options);
  return `${sign}${amount < 0 ? '-' : ''}${formatted}`;
};

/**
 * Format currency compactly (1.2K, 3.5M, etc.)
 */
export const formatCurrencyCompact = (amount: number, currencyCode: string = 'USD'): string => {
  const currency = getCurrency(currencyCode);
  const symbol = currency?.symbol ?? '$';

  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (abs >= 1_000_000_000) {
    return `${sign}${symbol}${(abs / 1_000_000_000).toFixed(1)}B`;
  } else if (abs >= 1_000_000) {
    return `${sign}${symbol}${(abs / 1_000_000).toFixed(1)}M`;
  } else if (abs >= 1_000) {
    return `${sign}${symbol}${(abs / 1_000).toFixed(1)}K`;
  }

  return formatCurrency(amount, currencyCode);
};

/**
 * Parse currency string to number
 */
export const parseCurrency = (value: string): number => {
  // Remove all non-numeric characters except decimal point and minus
  const cleaned = value.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

// ============================================================================
// Number Formatting
// ============================================================================

/**
 * Format number with thousand separators
 */
export const formatNumber = (value: number, decimalPlaces: number = 2): string => {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimalPlaces: number = 1): string => {
  return `${value.toFixed(decimalPlaces)}%`;
};

/**
 * Format large numbers compactly (1K, 2.5M, etc.)
 */
export const formatNumberCompact = (value: number): string => {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (abs >= 1_000_000_000) {
    return `${sign}${(abs / 1_000_000_000).toFixed(1)}B`;
  } else if (abs >= 1_000_000) {
    return `${sign}${(abs / 1_000_000).toFixed(1)}M`;
  } else if (abs >= 1_000) {
    return `${sign}${(abs / 1_000).toFixed(1)}K`;
  }

  return value.toString();
};

// ============================================================================
// Date Formatting
// ============================================================================

/**
 * Format date using predefined format
 */
export const formatDate = (date: Date | string, formatStr: string = DATE_FORMATS.MEDIUM): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }

  return format(dateObj, formatStr);
};

/**
 * Format date relative to now (Today, Yesterday, 2 days ago, etc.)
 */
export const formatDateRelative = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isToday(dateObj)) {
    return 'Today';
  }

  if (isYesterday(dateObj)) {
    return 'Yesterday';
  }

  // For dates within the last week, show "X days ago"
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays < 7 && diffInDays > 0) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }

  // Otherwise, show the formatted date
  return format(dateObj, DATE_FORMATS.MEDIUM);
};

/**
 * Format date for display with smart formatting
 */
export const formatDateSmart = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isToday(dateObj)) {
    return format(dateObj, DATE_FORMATS.TIME);
  }

  if (isYesterday(dateObj)) {
    return 'Yesterday';
  }

  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));

  // Within the current year
  if (dateObj.getFullYear() === now.getFullYear()) {
    return format(dateObj, 'MMM dd');
  }

  // Different year
  return format(dateObj, DATE_FORMATS.SHORT);
};

/**
 * Format time only
 */
export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, DATE_FORMATS.TIME);
};

/**
 * Format date range
 */
export const formatDateRange = (startDate: Date | string, endDate: Date | string): string => {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  // Same day
  if (startOfDay(start).getTime() === startOfDay(end).getTime()) {
    return formatDate(start, DATE_FORMATS.MEDIUM);
  }

  // Same month
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${format(start, 'MMM dd')} - ${format(end, 'dd, yyyy')}`;
  }

  // Same year
  if (start.getFullYear() === end.getFullYear()) {
    return `${format(start, 'MMM dd')} - ${format(end, 'MMM dd, yyyy')}`;
  }

  // Different years
  return `${format(start, DATE_FORMATS.MEDIUM)} - ${format(end, DATE_FORMATS.MEDIUM)}`;
};

/**
 * Get period label (for filters)
 */
export const getPeriodLabel = (startDate: Date | string, endDate: Date | string): string => {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  const now = new Date();

  // Check if it's today
  if (isToday(start) && isToday(end)) {
    return 'Today';
  }

  // Check if it's this month
  if (
    start.getMonth() === now.getMonth() &&
    start.getFullYear() === now.getFullYear() &&
    start.getDate() === 1 &&
    end.getMonth() === now.getMonth() &&
    end.getFullYear() === now.getFullYear()
  ) {
    return 'This Month';
  }

  // Check if it's this year
  if (
    start.getFullYear() === now.getFullYear() &&
    start.getMonth() === 0 &&
    start.getDate() === 1 &&
    end.getFullYear() === now.getFullYear() &&
    end.getMonth() === 11 &&
    end.getDate() === 31
  ) {
    return 'This Year';
  }

  // Return formatted range
  return formatDateRange(start, end);
};

// ============================================================================
// Text Formatting
// ============================================================================

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Capitalize first letter
 */
export const capitalizeFirst = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Convert to title case
 */
export const toTitleCase = (text: string): string => {
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => capitalizeFirst(word))
    .join(' ');
};

/**
 * Format account/category name for display
 */
export const formatName = (name: string): string => {
  return name.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

// ============================================================================
// Transaction Type Formatting
// ============================================================================

/**
 * Get transaction type label
 */
export const getTransactionTypeLabel = (type: 'income' | 'expense' | 'transfer'): string => {
  const labels = {
    income: 'Income',
    expense: 'Expense',
    transfer: 'Transfer',
  };
  return labels[type] || type;
};

/**
 * Get transaction type emoji
 */
export const getTransactionTypeEmoji = (type: 'income' | 'expense' | 'transfer'): string => {
  const emojis = {
    income: '💰',
    expense: '💸',
    transfer: '🔄',
  };
  return emojis[type] || '💵';
};

// ============================================================================
// Account Type Formatting
// ============================================================================

/**
 * Get account type label
 */
export const getAccountTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    bank_account: 'Bank Account',
    credit_card: 'Credit Card',
    cash: 'Cash',
    savings: 'Savings',
    investment: 'Investment',
    other: 'Other',
  };
  return labels[type] || formatName(type);
};

// ============================================================================
// Validation Formatting
// ============================================================================

/**
 * Format validation error message
 */
export const formatValidationError = (field: string, message: string): string => {
  return `${formatName(field)}: ${message}`;
};
