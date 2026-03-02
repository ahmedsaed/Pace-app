/**
 * Transaction Store
 * Zustand store for managing transaction state
 */

import { create } from 'zustand';
import { Transaction, CreateTransactionInput, UpdateTransactionInput, TransactionType } from '../utils/types';
import {
  createTransaction as dbCreateTransaction,
  updateTransaction as dbUpdateTransaction,
  deleteTransaction as dbDeleteTransaction,
  getAllTransactions,
  getTransactionsByDateRange,
  getTransactionsByAccount as dbGetByAccount,
  getTransactionsByCategory as dbGetByCategory,
  getTransactionStats,
  getRecentTransactions,
  TransactionStats,
} from '../db/queries/transactions';
import { useAccountStore } from './accountStore';

interface TransactionStore {
  transactions: Transaction[];
  stats: TransactionStats;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchTransactions: () => Promise<void>;
  fetchTransactionsByDateRange: (startDate: string, endDate: string) => Promise<void>;
  fetchTransactionsByCategory: (categoryId: number) => Promise<Transaction[]>;
  fetchRecentTransactions: (limit?: number) => Promise<void>;
  fetchStats: (startDate?: string, endDate?: string) => Promise<void>;
  createTransaction: (input: CreateTransactionInput) => Promise<number>;
  updateTransaction: (id: number, input: Omit<UpdateTransactionInput, 'id'>) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;

  // Selectors
  getTransactionsByType: (type: TransactionType) => Transaction[];
  getTransactionsByAccount: (accountId: number) => Transaction[];
}

const defaultStats: TransactionStats = {
  totalIncome: 0,
  totalExpense: 0,
  netBalance: 0,
  transactionCount: 0,
};

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  stats: defaultStats,
  isLoading: false,
  error: null,

  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const transactions = await getAllTransactions();
      set({ transactions, isLoading: false });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to fetch transactions';
      set({ error: msg, isLoading: false });
    }
  },

  fetchTransactionsByDateRange: async (startDate, endDate) => {
    set({ isLoading: true, error: null });
    try {
      const transactions = await getTransactionsByDateRange(startDate, endDate);
      set({ transactions, isLoading: false });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to fetch transactions';
      set({ error: msg, isLoading: false });
    }
  },

  fetchTransactionsByCategory: async (categoryId) => {
    try {
      const transactions = await dbGetByCategory(categoryId);
      return transactions;
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to fetch transactions by category';
      set({ error: msg });
      return [];
    }
  },

  fetchRecentTransactions: async (limit = 50) => {
    set({ isLoading: true, error: null });
    try {
      const transactions = await getRecentTransactions(limit);
      set({ transactions, isLoading: false });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to fetch transactions';
      set({ error: msg, isLoading: false });
    }
  },

  fetchStats: async (startDate, endDate) => {
    try {
      const stats = await getTransactionStats(startDate, endDate);
      set({ stats });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  },

  createTransaction: async (input) => {
    set({ isLoading: true, error: null });
    try {
      const id = await dbCreateTransaction(input);
      // Refresh accounts to reflect new balance
      await useAccountStore.getState().fetchAccounts();
      // Refresh transactions
      await get().fetchTransactions();
      set({ isLoading: false });
      return id;
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to create transaction';
      set({ error: msg, isLoading: false });
      throw error;
    }
  },

  updateTransaction: async (id, input) => {
    set({ isLoading: true, error: null });
    try {
      await dbUpdateTransaction(id, input);
      await useAccountStore.getState().fetchAccounts();
      await get().fetchTransactions();
      set({ isLoading: false });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to update transaction';
      set({ error: msg, isLoading: false });
      throw error;
    }
  },

  deleteTransaction: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await dbDeleteTransaction(id);
      await useAccountStore.getState().fetchAccounts();
      set(state => ({
        transactions: state.transactions.filter(t => t.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to delete transaction';
      set({ error: msg, isLoading: false });
      throw error;
    }
  },

  getTransactionsByType: (type) =>
    get().transactions.filter(t => t.type === type),

  getTransactionsByAccount: (accountId) =>
    get().transactions.filter(t => t.accountId === accountId || t.toAccountId === accountId),
}));
