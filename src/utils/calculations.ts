/**
 * Financial Calculation Utilities
 * Helper functions for balance calculations, statistics, and financial computations
 */

import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, differenceInDays, addDays } from 'date-fns';
import {
  Transaction,
  Account,
  Budget,
  CategoryStatistics,
  PeriodSummary,
  SpendingTrend,
  AccountStatistics,
  BudgetProgress,
  DateRange,
} from './types';

// ============================================================================
// Balance Calculations
// ============================================================================

/**
 * Calculate current account balance from initial balance and transactions
 */
export const calculateAccountBalance = (
  initialBalance: number,
  transactions: Transaction[],
  accountId: number
): number => {
  let balance = initialBalance;

  for (const transaction of transactions) {
    if (transaction.type === 'income' && transaction.accountId === accountId) {
      balance += transaction.amount;
    } else if (transaction.type === 'expense' && transaction.accountId === accountId) {
      balance -= transaction.amount;
    } else if (transaction.type === 'transfer') {
      if (transaction.accountId === accountId) {
        // Money leaving this account
        balance -= transaction.amount;
      }
      if (transaction.toAccountId === accountId) {
        // Money entering this account
        balance += transaction.amount;
      }
    }
  }

  return balance;
};

/**
 * Calculate total balance across multiple accounts
 */
export const calculateTotalBalance = (accounts: Account[]): number => {
  return accounts
    .filter((account) => account.includeInTotal)
    .reduce((total, account) => total + account.currentBalance, 0);
};

/**
 * Calculate net worth (including all accounts)
 */
export const calculateNetWorth = (accounts: Account[]): number => {
  return accounts.reduce((total, account) => total + account.currentBalance, 0);
};

// ============================================================================
// Transaction Aggregations
// ============================================================================

/**
 * Calculate total income for a period
 */
export const calculateTotalIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
};

/**
 * Calculate total expenses for a period
 */
export const calculateTotalExpenses = (transactions: Transaction[]): number => {
  return transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
};

/**
 * Calculate net balance (income - expenses)
 */
export const calculateNetBalance = (transactions: Transaction[]): number => {
  const income = calculateTotalIncome(transactions);
  const expenses = calculateTotalExpenses(transactions);
  return income - expenses;
};

/**
 * Calculate total by transaction type
 */
export const calculateTotalByType = (
  transactions: Transaction[],
  type: 'income' | 'expense' | 'transfer'
): number => {
  return transactions
    .filter((t) => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0);
};

// ============================================================================
// Category Statistics
// ============================================================================

/**
 * Calculate spending by category
 */
export const calculateCategoryStatistics = (
  transactions: Transaction[],
  type: 'income' | 'expense'
): CategoryStatistics[] => {
  const categoryMap = new Map<number, CategoryStatistics>();

  // Filter transactions by type
  const filteredTransactions = transactions.filter((t) => t.type === type);
  const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Aggregate by category
  for (const transaction of filteredTransactions) {
    if (!transaction.categoryId || !transaction.category) continue;

    const categoryId = transaction.categoryId;
    
    if (categoryMap.has(categoryId)) {
      const existing = categoryMap.get(categoryId)!;
      existing.totalAmount += transaction.amount;
      existing.transactionCount += 1;
    } else {
      categoryMap.set(categoryId, {
        categoryId,
        categoryName: transaction.category.name,
        categoryType: type,
        totalAmount: transaction.amount,
        transactionCount: 1,
        percentage: 0,
        icon: transaction.category.icon,
      });
    }
  }

  // Calculate percentages
  const statistics = Array.from(categoryMap.values());
  for (const stat of statistics) {
    stat.percentage = totalAmount > 0 ? (stat.totalAmount / totalAmount) * 100 : 0;
  }

  // Sort by total amount (descending)
  return statistics.sort((a, b) => b.totalAmount - a.totalAmount);
};

/**
 * Get top spending categories
 */
export const getTopCategories = (
  transactions: Transaction[],
  type: 'income' | 'expense',
  limit: number = 5
): CategoryStatistics[] => {
  const stats = calculateCategoryStatistics(transactions, type);
  return stats.slice(0, limit);
};

// ============================================================================
// Account Statistics
// ============================================================================

/**
 * Calculate statistics per account
 */
export const calculateAccountStatistics = (
  accounts: Account[],
  transactions: Transaction[]
): AccountStatistics[] => {
  return accounts.map((account) => {
    const accountTransactions = transactions.filter(
      (t) =>
        t.accountId === account.id ||
        (t.type === 'transfer' && t.toAccountId === account.id)
    );

    const income = accountTransactions
      .filter((t) => t.type === 'income' || (t.type === 'transfer' && t.toAccountId === account.id))
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = accountTransactions
      .filter((t) => t.type === 'expense' || (t.type === 'transfer' && t.accountId === account.id))
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      accountId: account.id,
      accountName: account.name,
      balance: account.currentBalance,
      totalIncome: income,
      totalExpense: expense,
      transactionCount: accountTransactions.length,
    };
  });
};

// ============================================================================
// Period Summary
// ============================================================================

/**
 * Calculate comprehensive period summary
 */
export const calculatePeriodSummary = (
  transactions: Transaction[],
  accounts: Account[],
  startDate: Date,
  endDate: Date
): PeriodSummary => {
  const totalIncome = calculateTotalIncome(transactions);
  const totalExpense = calculateTotalExpenses(transactions);
  const netBalance = totalIncome - totalExpense;

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    totalIncome,
    totalExpense,
    netBalance,
    transactionCount: transactions.length,
    topIncomeCategories: getTopCategories(transactions, 'income', 5),
    topExpenseCategories: getTopCategories(transactions, 'expense', 5),
    accountBalances: calculateAccountStatistics(accounts, transactions),
  };
};

// ============================================================================
// Spending Trends
// ============================================================================

/**
 * Calculate daily spending trend
 */
export const calculateDailyTrend = (
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): SpendingTrend[] => {
  const trends: SpendingTrend[] = [];
  const dayCount = differenceInDays(endDate, startDate) + 1;

  for (let i = 0; i < dayCount; i++) {
    const date = addDays(startDate, i);
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    const dayTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return transactionDate >= dayStart && transactionDate <= dayEnd;
    });

    const income = calculateTotalIncome(dayTransactions);
    const expense = calculateTotalExpenses(dayTransactions);

    trends.push({
      date: date.toISOString(),
      income,
      expense,
      net: income - expense,
    });
  }

  return trends;
};

/**
 * Calculate average daily spending
 */
export const calculateAverageDailySpending = (transactions: Transaction[], days: number): number => {
  const totalExpense = calculateTotalExpenses(transactions);
  return days > 0 ? totalExpense / days : 0;
};

/**
 * Calculate average monthly spending
 */
export const calculateAverageMonthlySpending = (transactions: Transaction[], months: number): number => {
  const totalExpense = calculateTotalExpenses(transactions);
  return months > 0 ? totalExpense / months : 0;
};

// ============================================================================
// Budget Calculations
// ============================================================================

/**
 * Calculate budget progress
 */
export const calculateBudgetProgress = (
  budget: Budget,
  transactions: Transaction[]
): BudgetProgress => {
  // Filter transactions for the budget period and category
  const budgetTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    const budgetStart = new Date(budget.startDate);
    const budgetEnd = budget.endDate ? new Date(budget.endDate) : new Date();

    const inPeriod = transactionDate >= budgetStart && transactionDate <= budgetEnd;
    const matchesCategory = budget.categoryId ? t.categoryId === budget.categoryId : true;
    const isExpense = t.type === 'expense';

    return inPeriod && matchesCategory && isExpense;
  });

  const spent = budgetTransactions.reduce((sum, t) => sum + t.amount, 0);
  const remaining = budget.amount - spent;
  const percentUsed = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
  const isExceeded = spent > budget.amount;

  // Calculate days remaining
  const endDate = budget.endDate ? new Date(budget.endDate) : new Date();
  const now = new Date();
  const daysRemaining = Math.max(0, differenceInDays(endDate, now));

  return {
    budgetId: budget.id,
    budgetName: budget.name,
    budgetAmount: budget.amount,
    spent,
    remaining,
    percentUsed,
    isExceeded,
    daysRemaining,
  };
};

/**
 * Calculate all budget progress
 */
export const calculateAllBudgetProgress = (
  budgets: Budget[],
  transactions: Transaction[]
): BudgetProgress[] => {
  return budgets
    .filter((b) => b.isActive)
    .map((budget) => calculateBudgetProgress(budget, transactions));
};

// ============================================================================
// Date Range Helpers
// ============================================================================

/**
 * Get date range for period type
 */
export const getDateRangeForPeriod = (period: 'today' | 'week' | 'month' | 'year'): DateRange => {
  const now = new Date();

  switch (period) {
    case 'today':
      return {
        startDate: startOfDay(now).toISOString(),
        endDate: endOfDay(now).toISOString(),
      };
    case 'week':
      return {
        startDate: startOfWeek(now).toISOString(),
        endDate: endOfWeek(now).toISOString(),
      };
    case 'month':
      return {
        startDate: startOfMonth(now).toISOString(),
        endDate: endOfMonth(now).toISOString(),
      };
    case 'year':
      return {
        startDate: startOfYear(now).toISOString(),
        endDate: endOfYear(now).toISOString(),
      };
    default:
      return {
        startDate: startOfMonth(now).toISOString(),
        endDate: endOfMonth(now).toISOString(),
      };
  }
};

// ============================================================================
// Percentage Calculations
// ============================================================================

/**
 * Calculate percentage change
 */
export const calculatePercentageChange = (oldValue: number, newValue: number): number => {
  if (oldValue === 0) {
    return newValue === 0 ? 0 : 100;
  }
  return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
};

/**
 * Calculate percentage of total
 */
export const calculatePercentageOfTotal = (value: number, total: number): number => {
  return total > 0 ? (value / total) * 100 : 0;
};

// ============================================================================
// Comparison Helpers
// ============================================================================

/**
 * Compare two periods
 */
export const comparePeriods = (
  currentTransactions: Transaction[],
  previousTransactions: Transaction[]
): {
  incomeChange: number;
  expenseChange: number;
  netChange: number;
  incomePercentChange: number;
  expensePercentChange: number;
} => {
  const currentIncome = calculateTotalIncome(currentTransactions);
  const currentExpense = calculateTotalExpenses(currentTransactions);
  const currentNet = currentIncome - currentExpense;

  const previousIncome = calculateTotalIncome(previousTransactions);
  const previousExpense = calculateTotalExpenses(previousTransactions);
  const previousNet = previousIncome - previousExpense;

  return {
    incomeChange: currentIncome - previousIncome,
    expenseChange: currentExpense - previousExpense,
    netChange: currentNet - previousNet,
    incomePercentChange: calculatePercentageChange(previousIncome, currentIncome),
    expensePercentChange: calculatePercentageChange(previousExpense, currentExpense),
  };
};

// ============================================================================
// Utility Helpers
// ============================================================================

/**
 * Round to specified decimal places
 */
export const roundToDecimal = (value: number, decimalPlaces: number = 2): number => {
  const multiplier = Math.pow(10, decimalPlaces);
  return Math.round(value * multiplier) / multiplier;
};

/**
 * Clamp value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Check if amount is valid
 */
export const isValidAmount = (amount: number): boolean => {
  return !isNaN(amount) && isFinite(amount) && amount >= 0;
};
