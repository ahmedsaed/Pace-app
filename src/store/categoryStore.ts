/**
 * Category Store
 * Manages category state using Zustand
 */

import { create } from 'zustand';
import { Category } from '../utils/types';
import {
  getAllCategories,
  getCategoriesByType,
  createCategory as dbCreateCategory,
  updateCategory as dbUpdateCategory,
  deleteCategory as dbDeleteCategory,
  seedDefaultCategories,
  getSubcategories,
} from '../db/queries/categories';

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchCategories: () => Promise<void>;
  createCategory: (category: Omit<Category, 'id' | 'createdAt'>) => Promise<void>;
  updateCategory: (id: number, updates: Partial<Omit<Category, 'id' | 'createdAt'>>) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  seedDefaults: () => Promise<void>;
  
  // Selectors
  getIncomeCategories: () => Category[];
  getExpenseCategories: () => Category[];
  getRootCategories: (type?: 'income' | 'expense') => Category[];
  getSubcategoriesById: (parentId: number) => Category[];
  getCategoryById: (id: number) => Category | undefined;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const categories = await getAllCategories();
      set({ categories, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createCategory: async (category) => {
    set({ loading: true, error: null });
    try {
      await dbCreateCategory(category);
      await get().fetchCategories(); // Refresh list
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updateCategory: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      await dbUpdateCategory(id, updates);
      await get().fetchCategories(); // Refresh list
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  deleteCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      await dbDeleteCategory(id);
      await get().fetchCategories(); // Refresh list
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  seedDefaults: async () => {
    set({ loading: true, error: null });
    try {
      await seedDefaultCategories();
      await get().fetchCategories(); // Refresh list
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  // Selectors
  getIncomeCategories: () => {
    return get().categories.filter(cat => cat.type === 'income');
  },

  getExpenseCategories: () => {
    return get().categories.filter(cat => cat.type === 'expense');
  },

  getRootCategories: (type) => {
    const categories = get().categories.filter(cat => cat.parentId === null);
    if (type) {
      return categories.filter(cat => cat.type === type);
    }
    return categories;
  },

  getSubcategoriesById: (parentId) => {
    return get().categories.filter(cat => cat.parentId === parentId);
  },

  getCategoryById: (id) => {
    return get().categories.find(cat => cat.id === id);
  },
}));
