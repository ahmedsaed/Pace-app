/**
 * Category Database Queries
 * CRUD operations for categories
 */

import { getDatabase } from '../database';
import { Category } from '../../utils/types';

/**
 * Default categories to seed on first launch
 */
const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'createdAt'>[] = [
  // Income Categories
  { name: 'Salary', type: 'income', icon: 'briefcase', color: '#10B981', parentId: null, isDefault: true },
  { name: 'Freelance', type: 'income', icon: 'laptop', color: '#059669', parentId: null, isDefault: true },
  { name: 'Business', type: 'income', icon: 'business', color: '#047857', parentId: null, isDefault: true },
  { name: 'Investments', type: 'income', icon: 'trending-up', color: '#065F46', parentId: null, isDefault: true },
  { name: 'Gifts', type: 'income', icon: 'gift', color: '#10B981', parentId: null, isDefault: true },
  { name: 'Refunds', type: 'income', icon: 'return-up-back', color: '#059669', parentId: null, isDefault: true },
  { name: 'Other Income', type: 'income', icon: 'add-circle', color: '#047857', parentId: null, isDefault: true },

  // Expense Categories - Food & Dining
  { name: 'Food & Dining', type: 'expense', icon: 'restaurant', color: '#EF4444', parentId: null, isDefault: true },
  { name: 'Groceries', type: 'expense', icon: 'cart', color: '#DC2626', parentId: null, isDefault: true },
  { name: 'Dining Out', type: 'expense', icon: 'fast-food', color: '#B91C1C', parentId: null, isDefault: true },
  { name: 'Coffee & Drinks', type: 'expense', icon: 'cafe', color: '#991B1B', parentId: null, isDefault: true },

  // Transportation
  { name: 'Transportation', type: 'expense', icon: 'car', color: '#F59E0B', parentId: null, isDefault: true },
  { name: 'Gas', type: 'expense', icon: 'gas-station', color: '#D97706', parentId: null, isDefault: true },
  { name: 'Public Transit', type: 'expense', icon: 'bus', color: '#B45309', parentId: null, isDefault: true },
  { name: 'Parking', type: 'expense', icon: 'car-sport', color: '#92400E', parentId: null, isDefault: true },

  // Shopping
  { name: 'Shopping', type: 'expense', icon: 'bag-handle', color: '#8B5CF6', parentId: null, isDefault: true },
  { name: 'Clothing', type: 'expense', icon: 'shirt', color: '#7C3AED', parentId: null, isDefault: true },
  { name: 'Electronics', type: 'expense', icon: 'phone-portrait', color: '#6D28D9', parentId: null, isDefault: true },
  { name: 'Home & Garden', type: 'expense', icon: 'home', color: '#5B21B6', parentId: null, isDefault: true },

  // Bills & Utilities
  { name: 'Bills & Utilities', type: 'expense', icon: 'document-text', color: '#3B82F6', parentId: null, isDefault: true },
  { name: 'Rent/Mortgage', type: 'expense', icon: 'home-sharp', color: '#2563EB', parentId: null, isDefault: true },
  { name: 'Electricity', type: 'expense', icon: 'flash', color: '#1D4ED8', parentId: null, isDefault: true },
  { name: 'Water', type: 'expense', icon: 'water', color: '#1E40AF', parentId: null, isDefault: true },
  { name: 'Internet', type: 'expense', icon: 'wifi', color: '#1E3A8A', parentId: null, isDefault: true },
  { name: 'Phone', type: 'expense', icon: 'call', color: '#172554', parentId: null, isDefault: true },

  // Entertainment
  { name: 'Entertainment', type: 'expense', icon: 'film', color: '#EC4899', parentId: null, isDefault: true },
  { name: 'Movies & TV', type: 'expense', icon: 'tv', color: '#DB2777', parentId: null, isDefault: true },
  { name: 'Games', type: 'expense', icon: 'game-controller', color: '#BE185D', parentId: null, isDefault: true },
  { name: 'Events', type: 'expense', icon: 'ticket', color: '#9F1239', parentId: null, isDefault: true },

  // Health & Fitness
  { name: 'Health & Fitness', type: 'expense', icon: 'fitness', color: '#14B8A6', parentId: null, isDefault: true },
  { name: 'Gym', type: 'expense', icon: 'barbell', color: '#0D9488', parentId: null, isDefault: true },
  { name: 'Medical', type: 'expense', icon: 'medkit', color: '#0F766E', parentId: null, isDefault: true },
  { name: 'Pharmacy', type: 'expense', icon: 'medical', color: '#115E59', parentId: null, isDefault: true },

  // Education
  { name: 'Education', type: 'expense', icon: 'school', color: '#F97316', parentId: null, isDefault: true },
  { name: 'Books', type: 'expense', icon: 'book', color: '#EA580C', parentId: null, isDefault: true },
  { name: 'Courses', type: 'expense', icon: 'library', color: '#C2410C', parentId: null, isDefault: true },

  // Personal Care
  { name: 'Personal Care', type: 'expense', icon: 'cut', color: '#A855F7', parentId: null, isDefault: true },
  { name: 'Haircut', type: 'expense', icon: 'scissors', color: '#9333EA', parentId: null, isDefault: true },
  { name: 'Spa & Beauty', type: 'expense', icon: 'rose', color: '#7E22CE', parentId: null, isDefault: true },

  // Travel
  { name: 'Travel', type: 'expense', icon: 'airplane', color: '#06B6D4', parentId: null, isDefault: true },
  { name: 'Hotels', type: 'expense', icon: 'bed', color: '#0891B2', parentId: null, isDefault: true },
  { name: 'Vacation', type: 'expense', icon: 'boat', color: '#0E7490', parentId: null, isDefault: true },

  // Other
  { name: 'Other Expenses', type: 'expense', icon: 'ellipsis-horizontal-circle', color: '#64748B', parentId: null, isDefault: true },
];

/**
 * Seed database with default categories
 */
export const seedDefaultCategories = async (): Promise<void> => {
  const db = await getDatabase();
  
  try {
    // Check if categories already exist
    const result = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM categories'
    );
    
    if (result && result.count > 0) {
      console.log('Categories already seeded');
      return;
    }

    // Insert default categories
    for (const category of DEFAULT_CATEGORIES) {
      await db.runAsync(
        `INSERT INTO categories (name, type, icon, color, parent_id, is_default) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [category.name, category.type, category.icon, category.color, category.parentId, category.isDefault ? 1 : 0]
      );
    }

    console.log('Default categories seeded successfully');
  } catch (error) {
    console.error('Error seeding default categories:', error);
    throw error;
  }
};

/**
 * Create a new category
 */
export const createCategory = async (
  category: Omit<Category, 'id' | 'createdAt'>
): Promise<number> => {
  const db = await getDatabase();
  
  try {
    const result = await db.runAsync(
      `INSERT INTO categories (name, type, icon, color, parent_id, is_default) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        category.name,
        category.type,
        category.icon || null,
        category.color || null,
        category.parentId || null,
        category.isDefault ? 1 : 0,
      ]
    );

    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

/**
 * Get all categories
 */
export const getAllCategories = async (): Promise<Category[]> => {
  const db = await getDatabase();
  
  try {
    const rows = await db.getAllAsync<any>(
      'SELECT * FROM categories ORDER BY type, name ASC'
    );

    return rows.map(row => ({
      id: row.id,
      name: row.name,
      type: row.type as 'income' | 'expense',
      icon: row.icon,
      color: row.color,
      parentId: row.parent_id,
      isDefault: row.is_default === 1,
      createdAt: row.created_at,
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Get categories by type (income or expense)
 */
export const getCategoriesByType = async (
  type: 'income' | 'expense'
): Promise<Category[]> => {
  const db = await getDatabase();
  
  try {
    const rows = await db.getAllAsync<any>(
      'SELECT * FROM categories WHERE type = ? ORDER BY name ASC',
      [type]
    );

    return rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      type: row.type as 'income' | 'expense',
      icon: row.icon,
      color: row.color,
      parentId: row.parent_id,
      isDefault: row.is_default === 1,
      createdAt: row.created_at,
    }));
  } catch (error) {
    console.error('Error fetching categories by type:', error);
    throw error;
  }
};

/**
 * Get category by ID
 */
export const getCategoryById = async (id: number): Promise<Category | null> => {
  const db = await getDatabase();
  
  try {
    const row = await db.getFirstAsync<any>(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );

    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      type: row.type as 'income' | 'expense',
      icon: row.icon,
      color: row.color,
      parentId: row.parent_id,
      isDefault: row.is_default === 1,
      createdAt: row.created_at,
    };
  } catch (error) {
    console.error('Error fetching category by ID:', error);
    throw error;
  }
};

/**
 * Update a category
 */
export const updateCategory = async (
  id: number,
  category: Partial<Omit<Category, 'id' | 'createdAt'>>
): Promise<void> => {
  const db = await getDatabase();
  
  try {
    const updates: string[] = [];
    const values: any[] = [];

    if (category.name !== undefined) {
      updates.push('name = ?');
      values.push(category.name);
    }
    if (category.type !== undefined) {
      updates.push('type = ?');
      values.push(category.type);
    }
    if (category.icon !== undefined) {
      updates.push('icon = ?');
      values.push(category.icon);
    }
    if (category.color !== undefined) {
      updates.push('color = ?');
      values.push(category.color);
    }
    if (category.parentId !== undefined) {
      updates.push('parent_id = ?');
      values.push(category.parentId);
    }
    if (category.isDefault !== undefined) {
      updates.push('is_default = ?');
      values.push(category.isDefault ? 1 : 0);
    }

    if (updates.length === 0) return;

    values.push(id);

    await db.runAsync(
      `UPDATE categories SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

/**
 * Delete a category
 */
export const deleteCategory = async (id: number): Promise<void> => {
  const db = await getDatabase();
  
  try {
    // Check if category has subcategories
    const subcategories = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM categories WHERE parent_id = ?',
      [id]
    );

    if (subcategories && subcategories.count > 0) {
      throw new Error('Cannot delete category with subcategories. Delete subcategories first.');
    }

    // Check if category is used in transactions
    const transactions = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM transactions WHERE category_id = ?',
      [id]
    );

    if (transactions && transactions.count > 0) {
      throw new Error('Cannot delete category that has transactions.');
    }

    await db.runAsync('DELETE FROM categories WHERE id = ?', [id]);
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

/**
 * Get category count
 */
export const getCategoryCount = async (): Promise<number> => {
  const db = await getDatabase();
  
  try {
    const result = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM categories'
    );

    return result?.count || 0;
  } catch (error) {
    console.error('Error getting category count:', error);
    throw error;
  }
};

/**
 * Get subcategories for a parent category
 */
export const getSubcategories = async (parentId: number): Promise<Category[]> => {
  const db = await getDatabase();
  
  try {
    const rows = await db.getAllAsync<any>(
      'SELECT * FROM categories WHERE parent_id = ? ORDER BY name ASC',
      [parentId]
    );

    return rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      type: row.type as 'income' | 'expense',
      icon: row.icon,
      color: row.color,
      parentId: row.parent_id,
      isDefault: row.is_default === 1,
      createdAt: row.created_at,
    }));
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    throw error;
  }
};
