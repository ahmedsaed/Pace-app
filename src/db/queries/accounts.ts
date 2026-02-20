/**
 * Account Database Queries
 * CRUD operations for accounts table
 */

import { getDatabase } from '../database';
import { Account, AccountType } from '../../utils/types';

/**
 * Create a new account
 */
export const createAccount = async (
  account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>
): Promise<number> => {
  const db = getDatabase();
  
  const result = await db.runAsync(
    `INSERT INTO accounts (name, type, initial_balance, current_balance, currency, include_in_total, color, icon)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      account.name,
      account.type,
      account.initialBalance,
      account.currentBalance,
      account.currency,
      account.includeInTotal ? 1 : 0,
      account.color,
      account.icon,
    ]
  );
  
  return result.lastInsertRowId;
};

/**
 * Get all accounts
 */
export const getAllAccounts = async (): Promise<Account[]> => {
  const db = getDatabase();
  
  const rows = await db.getAllAsync<any>(
    'SELECT * FROM accounts ORDER BY created_at DESC'
  );
  
  return rows.map(row => ({
    id: row.id,
    name: row.name,
    type: row.type as AccountType,
    initialBalance: row.initial_balance,
    currentBalance: row.current_balance,
    currency: row.currency,
    includeInTotal: row.include_in_total === 1,
    color: row.color,
    icon: row.icon,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
};

/**
 * Get account by ID
 */
export const getAccountById = async (id: number): Promise<Account | null> => {
  const db = getDatabase();
  
  const row = await db.getFirstAsync<any>(
    'SELECT * FROM accounts WHERE id = ?',
    [id]
  );
  
  if (!row) return null;
  
  return {
    id: row.id,
    name: row.name,
    type: row.type as AccountType,
    initialBalance: row.initial_balance,
    currentBalance: row.current_balance,
    currency: row.currency,
    includeInTotal: row.include_in_total === 1,
    color: row.color,
    icon: row.icon,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

/**
 * Get accounts by type
 */
export const getAccountsByType = async (type: AccountType): Promise<Account[]> => {
  const db = getDatabase();
  
  const rows = await db.getAllAsync<any>(
    'SELECT * FROM accounts WHERE type = ? ORDER BY created_at DESC',
    [type]
  );
  
  return rows.map(row => ({
    id: row.id,
    name: row.name,
    type: row.type as AccountType,
    initialBalance: row.initial_balance,
    currentBalance: row.current_balance,
    currency: row.currency,
    includeInTotal: row.include_in_total === 1,
    color: row.color,
    icon: row.icon,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
};

/**
 * Update account
 */
export const updateAccount = async (
  id: number,
  account: Partial<Omit<Account, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> => {
  const db = getDatabase();
  
  const updates: string[] = [];
  const values: any[] = [];
  
  if (account.name !== undefined) {
    updates.push('name = ?');
    values.push(account.name);
  }
  if (account.type !== undefined) {
    updates.push('type = ?');
    values.push(account.type);
  }
  if (account.initialBalance !== undefined) {
    updates.push('initial_balance = ?');
    values.push(account.initialBalance);
  }
  if (account.currentBalance !== undefined) {
    updates.push('current_balance = ?');
    values.push(account.currentBalance);
  }
  if (account.currency !== undefined) {
    updates.push('currency = ?');
    values.push(account.currency);
  }
  if (account.includeInTotal !== undefined) {
    updates.push('include_in_total = ?');
    values.push(account.includeInTotal ? 1 : 0);
  }
  if (account.color !== undefined) {
    updates.push('color = ?');
    values.push(account.color);
  }
  if (account.icon !== undefined) {
    updates.push('icon = ?');
    values.push(account.icon);
  }
  
  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);
  
  await db.runAsync(
    `UPDATE accounts SET ${updates.join(', ')} WHERE id = ?`,
    values
  );
};

/**
 * Update account balance
 */
export const updateAccountBalance = async (
  id: number,
  newBalance: number
): Promise<void> => {
  const db = getDatabase();
  
  await db.runAsync(
    'UPDATE accounts SET current_balance = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [newBalance, id]
  );
};

/**
 * Delete account
 */
export const deleteAccount = async (id: number): Promise<void> => {
  const db = getDatabase();
  
  await db.runAsync('DELETE FROM accounts WHERE id = ?', [id]);
};

/**
 * Get total balance (sum of all accounts where includeInTotal is true)
 */
export const getTotalBalance = async (): Promise<number> => {
  const db = getDatabase();
  
  const result = await db.getFirstAsync<{ total: number | null }>(
    'SELECT SUM(current_balance) as total FROM accounts WHERE include_in_total = 1'
  );
  
  return result?.total ?? 0;
};

/**
 * Count accounts
 */
export const getAccountCount = async (): Promise<number> => {
  const db = getDatabase();
  
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM accounts'
  );
  
  return result?.count ?? 0;
};
