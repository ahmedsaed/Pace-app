/**
 * Account Store
 * Zustand store for managing account state
 */

import { create } from 'zustand';
import { Account, AccountType } from '../utils/types';
import {
  createAccount as dbCreateAccount,
  getAllAccounts,
  getAccountById,
  getAccountsByType as dbGetAccountsByType,
  updateAccount as dbUpdateAccount,
  deleteAccount as dbDeleteAccount,
  getTotalBalance as dbGetTotalBalance,
  getAccountCount,
} from '../db/queries/accounts';

interface AccountStore {
  accounts: Account[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchAccounts: () => Promise<void>;
  createAccount: (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => Promise<number>;
  updateAccount: (id: number, account: Partial<Omit<Account, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteAccount: (id: number) => Promise<void>;
  getAccount: (id: number) => Account | undefined;
  
  // Selectors
  getTotalBalance: () => number;
  getAccountsByType: (type: AccountType) => Account[];
  getAccountCount: () => number;
}

export const useAccountStore = create<AccountStore>((set, get) => ({
  accounts: [],
  isLoading: false,
  error: null,

  // Fetch all accounts from database
  fetchAccounts: async () => {
    set({ isLoading: true, error: null });
    try {
      const accounts = await getAllAccounts();
      set({ accounts, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch accounts';
      set({ error: errorMessage, isLoading: false });
      console.error('Error fetching accounts:', error);
    }
  },

  // Create a new account
  createAccount: async (account) => {
    set({ isLoading: true, error: null });
    try {
      const id = await dbCreateAccount(account);
      
      // Fetch updated accounts list
      await get().fetchAccounts();
      
      set({ isLoading: false });
      return id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account';
      set({ error: errorMessage, isLoading: false });
      console.error('Error creating account:', error);
      throw error;
    }
  },

  // Update an existing account
  updateAccount: async (id, account) => {
    set({ isLoading: true, error: null });
    try {
      await dbUpdateAccount(id, account);
      
      // Fetch updated accounts list
      await get().fetchAccounts();
      
      set({ isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update account';
      set({ error: errorMessage, isLoading: false });
      console.error('Error updating account:', error);
      throw error;
    }
  },

  // Delete an account
  deleteAccount: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await dbDeleteAccount(id);
      
      // Remove account from state
      set(state => ({
        accounts: state.accounts.filter(acc => acc.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete account';
      set({ error: errorMessage, isLoading: false });
      console.error('Error deleting account:', error);
      throw error;
    }
  },

  // Get account by ID from state
  getAccount: (id) => {
    return get().accounts.find(acc => acc.id === id);
  },

  // Calculate total balance
  getTotalBalance: () => {
    const { accounts } = get();
    return accounts
      .filter(acc => acc.includeInTotal)
      .reduce((sum, acc) => sum + acc.currentBalance, 0);
  },

  // Get accounts filtered by type
  getAccountsByType: (type) => {
    return get().accounts.filter(acc => acc.type === type);
  },

  // Get account count
  getAccountCount: () => {
    return get().accounts.length;
  },
}));
