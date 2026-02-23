/**
 * Core Type Definitions for Pace App
 * Defines all TypeScript interfaces and types used throughout the application
 */

// ============================================================================
// Account Types
// ============================================================================

export type AccountType =
  | 'bank_account'
  | 'credit_card'
  | 'cash'
  | 'savings'
  | 'investment'
  | 'other';

export interface Account {
  id: number;
  name: string;
  type: AccountType;
  initialBalance: number;
  currentBalance: number;
  currency: string;
  includeInTotal: boolean;
  color: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountInput {
  name: string;
  type: AccountType;
  initialBalance: number;
  currency: string;
  includeInTotal?: boolean;
  color?: string;
  icon?: string;
}

export interface UpdateAccountInput {
  id: number;
  name?: string;
  type?: AccountType;
  currency?: string;
  includeInTotal?: boolean;
  color?: string;
  icon?: string;
}

// ============================================================================
// Category Types
// ============================================================================

export type CategoryType = 'income' | 'expense';

export interface Category {
  id: number;
  name: string;
  type: CategoryType;
  icon: string;
  parentId: number | null;
  isDefault: boolean;
  createdAt: string;
}

export interface CreateCategoryInput {
  name: string;
  type: CategoryType;
  icon?: string;
  parentId?: number | null;
  isDefault?: boolean;
}

export interface UpdateCategoryInput {
  id: number;
  name?: string;
  icon?: string;
  parentId?: number | null;
}

// ============================================================================
// Transaction Types
// ============================================================================

export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  date: string;
  accountId: number;
  categoryId: number | null;
  toAccountId: number | null; // For transfers
  note: string | null;
  isRecurring: boolean;
  recurringId: number | null;
  createdAt: string;
  updatedAt: string;
  // Populated relations
  account?: Account;
  category?: Category;
  toAccount?: Account;
  attachments?: Attachment[];
}

export interface CreateTransactionInput {
  type: TransactionType;
  amount: number;
  date: string;
  accountId: number;
  categoryId?: number | null;
  toAccountId?: number | null;
  note?: string | null;
  isRecurring?: boolean;
  recurringId?: number | null;
}

export interface UpdateTransactionInput {
  id: number;
  type?: TransactionType;
  amount?: number;
  date?: string;
  accountId?: number;
  categoryId?: number | null;
  toAccountId?: number | null;
  note?: string | null;
}

// ============================================================================
// Recurring Transaction Types
// ============================================================================

export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface RecurringTransaction {
  id: number;
  type: TransactionType;
  amount: number;
  frequency: RecurrenceFrequency;
  accountId: number;
  categoryId: number | null;
  toAccountId: number | null;
  note: string | null;
  startDate: string;
  endDate: string | null;
  nextDueDate: string;
  autoRecord: boolean;
  isActive: boolean;
  createdAt: string;
  // Populated relations
  account?: Account;
  category?: Category;
  toAccount?: Account;
}

export interface CreateRecurringTransactionInput {
  type: TransactionType;
  amount: number;
  frequency: RecurrenceFrequency;
  accountId: number;
  categoryId?: number | null;
  toAccountId?: number | null;
  note?: string | null;
  startDate: string;
  endDate?: string | null;
  autoRecord?: boolean;
}

export interface UpdateRecurringTransactionInput {
  id: number;
  amount?: number;
  frequency?: RecurrenceFrequency;
  accountId?: number;
  categoryId?: number | null;
  toAccountId?: number | null;
  note?: string | null;
  endDate?: string | null;
  autoRecord?: boolean;
  isActive?: boolean;
}

// ============================================================================
// Budget Types
// ============================================================================

export type BudgetPeriod = 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface Budget {
  id: number;
  name: string;
  amount: number;
  period: BudgetPeriod;
  categoryId: number | null;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  createdAt: string;
  // Populated relations
  category?: Category;
  // Calculated fields
  spent?: number;
  remaining?: number;
  percentUsed?: number;
}

export interface CreateBudgetInput {
  name: string;
  amount: number;
  period: BudgetPeriod;
  categoryId?: number | null;
  startDate: string;
  endDate?: string | null;
}

export interface UpdateBudgetInput {
  id: number;
  name?: string;
  amount?: number;
  period?: BudgetPeriod;
  categoryId?: number | null;
  endDate?: string | null;
  isActive?: boolean;
}

// ============================================================================
// Attachment Types
// ============================================================================

export type AttachmentFileType = 'image' | 'pdf' | 'other';

export interface Attachment {
  id: number;
  transactionId: number;
  filePath: string;
  fileType: AttachmentFileType;
  fileName: string | null;
  aiProcessed: boolean;
  aiExtractedData: string | null; // JSON string
  createdAt: string;
}

export interface CreateAttachmentInput {
  transactionId: number;
  filePath: string;
  fileType: AttachmentFileType;
  fileName?: string | null;
  aiProcessed?: boolean;
  aiExtractedData?: string | null;
}

export interface AIExtractedData {
  amount?: number;
  date?: string;
  merchantName?: string;
  suggestedCategory?: string;
  transactionType?: TransactionType;
  confidence?: number;
  rawText?: string;
}

// ============================================================================
// Settings Types
// ============================================================================

export interface AppSettings {
  defaultCurrency: string;
  theme: 'light' | 'dark' | 'auto';
  defaultAccountId: number | null;
  notificationsEnabled: boolean;
  biometricEnabled: boolean;
  onboardingCompleted: boolean;
  language: string;
  dateFormat: string;
  firstDayOfWeek: number; // 0 = Sunday, 1 = Monday
}

export interface SettingsUpdate {
  key: string;
  value: string;
}

// ============================================================================
// Filter & Query Types
// ============================================================================

export interface TransactionFilters {
  accountId?: number | number[];
  categoryId?: number | number[];
  type?: TransactionType | TransactionType[];
  startDate?: string;
  endDate?: string;
  searchText?: string;
  minAmount?: number;
  maxAmount?: number;
}

export type TransactionGroupBy = 'date' | 'category' | 'account' | 'none';

export type TransactionSortBy = 'date' | 'amount' | 'category' | 'account';
export type SortOrder = 'asc' | 'desc';

export interface TransactionQueryOptions {
  filters?: TransactionFilters;
  groupBy?: TransactionGroupBy;
  sortBy?: TransactionSortBy;
  sortOrder?: SortOrder;
  limit?: number;
  offset?: number;
}

// ============================================================================
// Statistics & Analytics Types
// ============================================================================

export interface AccountStatistics {
  accountId: number;
  accountName: string;
  balance: number;
  totalIncome: number;
  totalExpense: number;
  transactionCount: number;
}

export interface CategoryStatistics {
  categoryId: number;
  categoryName: string;
  categoryType: CategoryType;
  totalAmount: number;
  transactionCount: number;
  percentage: number;
  icon: string;
}

export interface PeriodSummary {
  startDate: string;
  endDate: string;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  transactionCount: number;
  topIncomeCategories: CategoryStatistics[];
  topExpenseCategories: CategoryStatistics[];
  accountBalances: AccountStatistics[];
}

export interface SpendingTrend {
  date: string;
  income: number;
  expense: number;
  net: number;
}

export interface BudgetProgress {
  budgetId: number;
  budgetName: string;
  budgetAmount: number;
  spent: number;
  remaining: number;
  percentUsed: number;
  isExceeded: boolean;
  daysRemaining: number;
}

// ============================================================================
// UI Component Types
// ============================================================================

export interface TabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
}

export type ThemeMode = 'light' | 'dark';

export interface Theme {
  mode: ThemeMode;
  colors: {
    primary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    income: string;
    expense: string;
    transfer: string;
    error: string;
    success: string;
    warning: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    full: number;
  };
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
}

// ============================================================================
// Navigation Types
// ============================================================================

export type RootStackParamList = {
  Main: undefined;
  AddTransaction: { editId?: number } | undefined;
  EditTransaction: { transactionId: number };
  CurrencySelection: undefined;
  Settings: undefined;
};

export type MainTabParamList = {
  Records: undefined;
  Analysis: undefined;
  Budgets: undefined;
  Subscriptions: undefined;
  Accounts: undefined;
};

// ============================================================================
// Date Period Types
// ============================================================================

export type DatePeriod = 'today' | 'week' | 'month' | 'year' | 'custom';

export interface DateRange {
  startDate: string;
  endDate: string;
}

// ============================================================================
// Currency Types
// ============================================================================

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  symbolNative: string;
  decimalDigits: number;
  rounding: number;
}

// ============================================================================
// Icon Types
// ============================================================================

export type IconName = string;

export interface IconOption {
  name: IconName;
  label: string;
}

// ============================================================================
// Color Types
// ============================================================================

export type ColorName = string;

export interface ColorOption {
  name: ColorName;
  value: string;
}
