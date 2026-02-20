/**
 * Application Constants
 * Default data, configurations, and constant values used throughout the app
 */

import { AccountType, CategoryType, Currency, IconOption, ColorOption } from './types';

// ============================================================================
// App Configuration
// ============================================================================

export const APP_NAME = 'Pace';
export const APP_VERSION = '1.0.0';
export const DATABASE_NAME = 'pace.db';
export const DATABASE_VERSION = 1;

// ============================================================================
// Default Account Types
// ============================================================================

export const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: 'bank_account', label: 'Bank Account' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'cash', label: 'Cash' },
  { value: 'savings', label: 'Savings' },
  { value: 'investment', label: 'Investment' },
  { value: 'other', label: 'Other' },
];

// ============================================================================
// Default Categories
// ============================================================================

export const DEFAULT_INCOME_CATEGORIES = [
  { name: 'Salary', icon: 'briefcase', color: '#10B981' },
  { name: 'Freelance', icon: 'laptop', color: '#34D399' },
  { name: 'Business', icon: 'trending-up', color: '#059669' },
  { name: 'Investments', icon: 'bar-chart', color: '#047857' },
  { name: 'Gifts', icon: 'gift', color: '#6EE7B7' },
  { name: 'Refunds', icon: 'refresh-cw', color: '#A7F3D0' },
  { name: 'Other Income', icon: 'plus-circle', color: '#D1FAE5' },
];

export const DEFAULT_EXPENSE_CATEGORIES = [
  // Food & Dining
  { name: 'Food & Dining', icon: 'coffee', color: '#F59E0B' },
  { name: 'Groceries', icon: 'shopping-cart', color: '#FBBF24', parentName: 'Food & Dining' },
  { name: 'Restaurants', icon: 'utensils', color: '#FCD34D', parentName: 'Food & Dining' },
  
  // Transportation
  { name: 'Transportation', icon: 'truck', color: '#3B82F6' },
  { name: 'Gas/Fuel', icon: 'zap', color: '#60A5FA', parentName: 'Transportation' },
  { name: 'Public Transit', icon: 'navigation', color: '#93C5FD', parentName: 'Transportation' },
  { name: 'Parking', icon: 'map-pin', color: '#BFDBFE', parentName: 'Transportation' },
  
  // Shopping
  { name: 'Shopping', icon: 'shopping-bag', color: '#EC4899' },
  { name: 'Clothing', icon: 'wind', color: '#F472B6', parentName: 'Shopping' },
  { name: 'Electronics', icon: 'smartphone', color: '#F9A8D4', parentName: 'Shopping' },
  
  // Entertainment
  { name: 'Entertainment', icon: 'film', color: '#8B5CF6' },
  { name: 'Movies', icon: 'video', color: '#A78BFA', parentName: 'Entertainment' },
  { name: 'Sports', icon: 'activity', color: '#C4B5FD', parentName: 'Entertainment' },
  { name: 'Hobbies', icon: 'heart', color: '#DDD6FE', parentName: 'Entertainment' },
  
  // Bills & Utilities
  { name: 'Bills & Utilities', icon: 'file-text', color: '#EF4444' },
  { name: 'Electricity', icon: 'bolt', color: '#F87171', parentName: 'Bills & Utilities' },
  { name: 'Water', icon: 'droplet', color: '#FCA5A5', parentName: 'Bills & Utilities' },
  { name: 'Internet', icon: 'wifi', color: '#FEE2E2', parentName: 'Bills & Utilities' },
  { name: 'Phone', icon: 'phone', color: '#FECACA', parentName: 'Bills & Utilities' },
  
  // Housing
  { name: 'Housing', icon: 'home', color: '#14B8A6' },
  { name: 'Rent', icon: 'key', color: '#2DD4BF', parentName: 'Housing' },
  { name: 'Mortgage', icon: 'shield', color: '#5EEAD4', parentName: 'Housing' },
  { name: 'Maintenance', icon: 'tool', color: '#99F6E4', parentName: 'Housing' },
  
  // Healthcare
  { name: 'Healthcare', icon: 'heart', color: '#06B6D4' },
  { name: 'Doctor', icon: 'user', color: '#22D3EE', parentName: 'Healthcare' },
  { name: 'Pharmacy', icon: 'package', color: '#67E8F9', parentName: 'Healthcare' },
  { name: 'Insurance', icon: 'shield', color: '#A5F3FC', parentName: 'Healthcare' },
  
  // Education
  { name: 'Education', icon: 'book-open', color: '#84CC16' },
  { name: 'Tuition', icon: 'book', color: '#A3E635', parentName: 'Education' },
  { name: 'Books', icon: 'bookmark', color: '#BEF264', parentName: 'Education' },
  { name: 'Courses', icon: 'award', color: '#D9F99D', parentName: 'Education' },
  
  // Personal Care
  { name: 'Personal Care', icon: 'scissors', color: '#F97316' },
  { name: 'Haircut', icon: 'scissors', color: '#FB923C', parentName: 'Personal Care' },
  { name: 'Spa/Salon', icon: 'smile', color: '#FDBA74', parentName: 'Personal Care' },
  
  // Travel
  { name: 'Travel', icon: 'map', color: '#6366F1' },
  { name: 'Flights', icon: 'plane', color: '#818CF8', parentName: 'Travel' },
  { name: 'Hotels', icon: 'bed', color: '#A5B4FC', parentName: 'Travel' },
  { name: 'Vacation', icon: 'sun', color: '#C7D2FE', parentName: 'Travel' },
  
  // Subscriptions
  { name: 'Subscriptions', icon: 'repeat', color: '#A855F7' },
  { name: 'Streaming', icon: 'tv', color: '#C084FC', parentName: 'Subscriptions' },
  { name: 'Music', icon: 'music', color: '#D8B4FE', parentName: 'Subscriptions' },
  { name: 'Software', icon: 'code', color: '#E9D5FF', parentName: 'Subscriptions' },
  
  // Other
  { name: 'Gifts & Donations', icon: 'gift', color: '#DC2626' },
  { name: 'Taxes', icon: 'file-text', color: '#64748B' },
  { name: 'Fees & Charges', icon: 'alert-circle', color: '#94A3B8' },
  { name: 'Other Expenses', icon: 'more-horizontal', color: '#CBD5E1' },
];

// ============================================================================
// Currencies (Most Common)
// ============================================================================

export const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', symbolNative: '$', decimalDigits: 2, rounding: 0 },
  { code: 'EUR', name: 'Euro', symbol: '€', symbolNative: '€', decimalDigits: 2, rounding: 0 },
  { code: 'GBP', name: 'British Pound', symbol: '£', symbolNative: '£', decimalDigits: 2, rounding: 0 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', symbolNative: '¥', decimalDigits: 0, rounding: 0 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: 'CN¥', symbolNative: '¥', decimalDigits: 2, rounding: 0 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', symbolNative: '₹', decimalDigits: 2, rounding: 0 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', symbolNative: '$', decimalDigits: 2, rounding: 0 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'AU$', symbolNative: '$', decimalDigits: 2, rounding: 0 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', symbolNative: 'CHF', decimalDigits: 2, rounding: 0.05 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'SEK', symbolNative: 'kr', decimalDigits: 2, rounding: 0 },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', symbolNative: '$', decimalDigits: 2, rounding: 0 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', symbolNative: '₩', decimalDigits: 0, rounding: 0 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'SGD', symbolNative: '$', decimalDigits: 2, rounding: 0 },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'NOK', symbolNative: 'kr', decimalDigits: 2, rounding: 0 },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', symbolNative: '$', decimalDigits: 2, rounding: 0 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', symbolNative: 'R$', decimalDigits: 2, rounding: 0 },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', symbolNative: '₽', decimalDigits: 2, rounding: 0 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'ZAR', symbolNative: 'R', decimalDigits: 2, rounding: 0 },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', symbolNative: '₺', decimalDigits: 2, rounding: 0 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', symbolNative: 'د.إ', decimalDigits: 2, rounding: 0 },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR', symbolNative: 'ر.س', decimalDigits: 2, rounding: 0 },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'EGP', symbolNative: 'ج.م', decimalDigits: 2, rounding: 0 },
];

// Default currency
export const DEFAULT_CURRENCY = 'USD';

// ============================================================================
// Icon Options
// ============================================================================

export const CATEGORY_ICONS: IconOption[] = [
  { name: 'briefcase', label: 'Briefcase' },
  { name: 'laptop', label: 'Laptop' },
  { name: 'trending-up', label: 'Trending Up' },
  { name: 'bar-chart', label: 'Bar Chart' },
  { name: 'gift', label: 'Gift' },
  { name: 'refresh-cw', label: 'Refresh' },
  { name: 'plus-circle', label: 'Plus' },
  { name: 'coffee', label: 'Coffee' },
  { name: 'shopping-cart', label: 'Shopping Cart' },
  { name: 'utensils', label: 'Utensils' },
  { name: 'truck', label: 'Truck' },
  { name: 'zap', label: 'Zap' },
  { name: 'navigation', label: 'Navigation' },
  { name: 'map-pin', label: 'Map Pin' },
  { name: 'shopping-bag', label: 'Shopping Bag' },
  { name: 'wind', label: 'Wind' },
  { name: 'smartphone', label: 'Smartphone' },
  { name: 'film', label: 'Film' },
  { name: 'video', label: 'Video' },
  { name: 'activity', label: 'Activity' },
  { name: 'heart', label: 'Heart' },
  { name: 'file-text', label: 'File Text' },
  { name: 'bolt', label: 'Bolt' },
  { name: 'droplet', label: 'Droplet' },
  { name: 'wifi', label: 'WiFi' },
  { name: 'phone', label: 'Phone' },
  { name: 'home', label: 'Home' },
  { name: 'key', label: 'Key' },
  { name: 'shield', label: 'Shield' },
  { name: 'tool', label: 'Tool' },
  { name: 'user', label: 'User' },
  { name: 'package', label: 'Package' },
  { name: 'book-open', label: 'Book Open' },
  { name: 'book', label: 'Book' },
  { name: 'bookmark', label: 'Bookmark' },
  { name: 'award', label: 'Award' },
  { name: 'scissors', label: 'Scissors' },
  { name: 'smile', label: 'Smile' },
  { name: 'map', label: 'Map' },
  { name: 'plane', label: 'Plane' },
  { name: 'bed', label: 'Bed' },
  { name: 'sun', label: 'Sun' },
  { name: 'repeat', label: 'Repeat' },
  { name: 'tv', label: 'TV' },
  { name: 'music', label: 'Music' },
  { name: 'code', label: 'Code' },
  { name: 'alert-circle', label: 'Alert' },
  { name: 'more-horizontal', label: 'More' },
];

export const ACCOUNT_ICONS: IconOption[] = [
  { name: 'credit-card', label: 'Credit Card' },
  { name: 'dollar-sign', label: 'Dollar' },
  { name: 'wallet', label: 'Wallet' },
  { name: 'briefcase', label: 'Briefcase' },
  { name: 'home', label: 'Home' },
  { name: 'trending-up', label: 'Trending Up' },
  { name: 'bank', label: 'Bank' },
  { name: 'piggy-bank', label: 'Piggy Bank' },
  { name: 'safe', label: 'Safe' },
  { name: 'coins', label: 'Coins' },
];

// ============================================================================
// Color Options
// ============================================================================

export const COLOR_OPTIONS: ColorOption[] = [
  // Greens (Income)
  { name: 'Green', value: '#10B981' },
  { name: 'Emerald', value: '#059669' },
  { name: 'Teal', value: '#14B8A6' },
  { name: 'Cyan', value: '#06B6D4' },
  
  // Reds (Expense)
  { name: 'Red', value: '#EF4444' },
  { name: 'Rose', value: '#F43F5E' },
  { name: 'Pink', value: '#EC4899' },
  
  // Blues
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Sky', value: '#0EA5E9' },
  
  // Purples
  { name: 'Purple', value: '#A855F7' },
  { name: 'Violet', value: '#8B5CF6' },
  { name: 'Fuchsia', value: '#D946EF' },
  
  // Yellows/Oranges
  { name: 'Yellow', value: '#EAB308' },
  { name: 'Amber', value: '#F59E0B' },
  { name: 'Orange', value: '#F97316' },
  
  // Neutrals
  { name: 'Gray', value: '#6B7280' },
  { name: 'Slate', value: '#64748B' },
  { name: 'Zinc', value: '#71717A' },
];

// ============================================================================
// Date Formats
// ============================================================================

export const DATE_FORMATS = {
  SHORT: 'MM/dd/yyyy',
  MEDIUM: 'MMM dd, yyyy',
  LONG: 'MMMM dd, yyyy',
  FULL: 'EEEE, MMMM dd, yyyy',
  TIME: 'hh:mm a',
  DATETIME: 'MMM dd, yyyy hh:mm a',
  ISO: "yyyy-MM-dd'T'HH:mm:ss",
};

// ============================================================================
// Transaction Periods
// ============================================================================

export const TRANSACTION_PERIODS = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
  { value: 'custom', label: 'Custom Range' },
];

// ============================================================================
// Recurrence Frequencies
// ============================================================================

export const RECURRENCE_FREQUENCIES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'custom', label: 'Custom' },
];

// ============================================================================
// Budget Periods
// ============================================================================

export const BUDGET_PERIODS = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'custom', label: 'Custom' },
];

// ============================================================================
// Default Settings
// ============================================================================

export const DEFAULT_SETTINGS = {
  defaultCurrency: DEFAULT_CURRENCY,
  theme: 'dark' as const,
  defaultAccountId: null,
  notificationsEnabled: true,
  biometricEnabled: false,
  onboardingCompleted: false,
  language: 'en',
  dateFormat: DATE_FORMATS.MEDIUM,
  firstDayOfWeek: 0, // Sunday
};

// ============================================================================
// Validation Constants
// ============================================================================

export const VALIDATION = {
  MIN_AMOUNT: 0.01,
  MAX_AMOUNT: 999999999.99,
  MAX_NOTE_LENGTH: 500,
  MAX_NAME_LENGTH: 50,
  MIN_NAME_LENGTH: 1,
};

// ============================================================================
// UI Constants
// ============================================================================

export const UI = {
  TAB_BAR_HEIGHT: 60,
  HEADER_HEIGHT: 56,
  FAB_SIZE: 56,
  FAB_BOTTOM_MARGIN: 80, // Above tab bar
  ANIMATION_DURATION: 300,
  SWIPE_THRESHOLD: 100,
};

// ============================================================================
// Chart Colors
// ============================================================================

export const CHART_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#6366F1', // Indigo
  '#06B6D4', // Cyan
];
