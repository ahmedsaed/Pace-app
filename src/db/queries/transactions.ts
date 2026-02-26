/**
 * Transaction Database Queries
 * CRUD operations for transactions table + account balance management
 */

import { getDatabase } from '../database';
import { Transaction, CreateTransactionInput, UpdateTransactionInput, TransactionType } from '../../utils/types';

// ============================================================================
// Row Mapper
// ============================================================================

const mapRowToTransaction = (row: any): Transaction => ({
  id: row.id,
  type: row.type as TransactionType,
  amount: row.amount,
  date: row.date,
  accountId: row.account_id,
  categoryId: row.category_id ?? null,
  toAccountId: row.to_account_id ?? null,
  note: row.note ?? null,
  isRecurring: row.is_recurring === 1,
  recurringId: row.recurring_id ?? null,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// ============================================================================
// Balance Helpers
// ============================================================================

/**
 * Adjust account balance when a transaction is created
 */
const applyTransactionToBalance = async (
  db: any,
  type: TransactionType,
  amount: number,
  accountId: number,
  toAccountId: number | null | undefined,
): Promise<void> => {
  if (type === 'income') {
    await db.runAsync(
      'UPDATE accounts SET current_balance = current_balance + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [amount, accountId],
    );
  } else if (type === 'expense') {
    await db.runAsync(
      'UPDATE accounts SET current_balance = current_balance - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [amount, accountId],
    );
  } else if (type === 'transfer' && toAccountId) {
    await db.runAsync(
      'UPDATE accounts SET current_balance = current_balance - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [amount, accountId],
    );
    await db.runAsync(
      'UPDATE accounts SET current_balance = current_balance + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [amount, toAccountId],
    );
  }
};

/**
 * Reverse a transaction's effect on account balances
 */
const reverseTransactionFromBalance = async (
  db: any,
  type: TransactionType,
  amount: number,
  accountId: number,
  toAccountId: number | null,
): Promise<void> => {
  if (type === 'income') {
    await db.runAsync(
      'UPDATE accounts SET current_balance = current_balance - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [amount, accountId],
    );
  } else if (type === 'expense') {
    await db.runAsync(
      'UPDATE accounts SET current_balance = current_balance + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [amount, accountId],
    );
  } else if (type === 'transfer' && toAccountId) {
    await db.runAsync(
      'UPDATE accounts SET current_balance = current_balance + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [amount, accountId],
    );
    await db.runAsync(
      'UPDATE accounts SET current_balance = current_balance - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [amount, toAccountId],
    );
  }
};

// ============================================================================
// CRUD Operations
// ============================================================================

/**
 * Create a new transaction and update account balance(s)
 */
export const createTransaction = async (
  input: CreateTransactionInput,
): Promise<number> => {
  const db = getDatabase();

  const result = await db.runAsync(
    `INSERT INTO transactions (type, amount, date, account_id, category_id, to_account_id, note, is_recurring, recurring_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.type,
      input.amount,
      input.date,
      input.accountId,
      input.categoryId ?? null,
      input.toAccountId ?? null,
      input.note ?? null,
      input.isRecurring ? 1 : 0,
      input.recurringId ?? null,
    ],
  );

  await applyTransactionToBalance(
    db,
    input.type,
    input.amount,
    input.accountId,
    input.toAccountId,
  );

  return result.lastInsertRowId;
};

/**
 * Get a single transaction by ID (with optional joins)
 */
export const getTransactionById = async (id: number): Promise<Transaction | null> => {
  const db = getDatabase();

  const row = await db.getFirstAsync<any>(
    'SELECT * FROM transactions WHERE id = ?',
    [id],
  );

  return row ? mapRowToTransaction(row) : null;
};

/**
 * Get all transactions ordered by date descending
 */
export const getAllTransactions = async (): Promise<Transaction[]> => {
  const db = getDatabase();

  const rows = await db.getAllAsync<any>(
    'SELECT * FROM transactions ORDER BY date DESC, created_at DESC',
  );

  return rows.map(mapRowToTransaction);
};

/**
 * Get transactions within a date range
 */
export const getTransactionsByDateRange = async (
  startDate: string,
  endDate: string,
): Promise<Transaction[]> => {
  const db = getDatabase();

  const rows = await db.getAllAsync<any>(
    `SELECT * FROM transactions
     WHERE date >= ? AND date <= ?
     ORDER BY date DESC, created_at DESC`,
    [startDate, endDate],
  );

  return rows.map(mapRowToTransaction);
};

/**
 * Get transactions for a specific account
 */
export const getTransactionsByAccount = async (
  accountId: number,
): Promise<Transaction[]> => {
  const db = getDatabase();

  const rows = await db.getAllAsync<any>(
    `SELECT * FROM transactions
     WHERE account_id = ? OR to_account_id = ?
     ORDER BY date DESC, created_at DESC`,
    [accountId, accountId],
  );

  return rows.map(mapRowToTransaction);
};

/**
 * Get transactions for a specific category
 */
export const getTransactionsByCategory = async (
  categoryId: number,
): Promise<Transaction[]> => {
  const db = getDatabase();

  const rows = await db.getAllAsync<any>(
    `SELECT * FROM transactions
     WHERE category_id = ?
     ORDER BY date DESC, created_at DESC`,
    [categoryId],
  );

  return rows.map(mapRowToTransaction);
};

/**
 * Get recent transactions (last N)
 */
export const getRecentTransactions = async (limit: number = 20): Promise<Transaction[]> => {
  const db = getDatabase();

  const rows = await db.getAllAsync<any>(
    'SELECT * FROM transactions ORDER BY date DESC, created_at DESC LIMIT ?',
    [limit],
  );

  return rows.map(mapRowToTransaction);
};

/**
 * Update a transaction and adjust account balances accordingly
 */
export const updateTransaction = async (
  id: number,
  input: Partial<Omit<UpdateTransactionInput, 'id'>>,
): Promise<void> => {
  const db = getDatabase();

  // Fetch the existing transaction first
  const existing = await getTransactionById(id);
  if (!existing) throw new Error(`Transaction ${id} not found`);

  // Reverse old balance effect
  await reverseTransactionFromBalance(
    db,
    existing.type,
    existing.amount,
    existing.accountId,
    existing.toAccountId,
  );

  // Build update query
  const updates: string[] = [];
  const values: any[] = [];

  if (input.type !== undefined) { updates.push('type = ?'); values.push(input.type); }
  if (input.amount !== undefined) { updates.push('amount = ?'); values.push(input.amount); }
  if (input.date !== undefined) { updates.push('date = ?'); values.push(input.date); }
  if (input.accountId !== undefined) { updates.push('account_id = ?'); values.push(input.accountId); }
  if ('categoryId' in input) { updates.push('category_id = ?'); values.push(input.categoryId ?? null); }
  if ('toAccountId' in input) { updates.push('to_account_id = ?'); values.push(input.toAccountId ?? null); }
  if ('note' in input) { updates.push('note = ?'); values.push(input.note ?? null); }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  await db.runAsync(`UPDATE transactions SET ${updates.join(', ')} WHERE id = ?`, values);

  // Re-apply new balance effect with merged values
  const newType = input.type ?? existing.type;
  const newAmount = input.amount ?? existing.amount;
  const newAccountId = input.accountId ?? existing.accountId;
  const newToAccountId = 'toAccountId' in input ? input.toAccountId : existing.toAccountId;

  await applyTransactionToBalance(db, newType, newAmount, newAccountId, newToAccountId);
};

/**
 * Delete a transaction and reverse its balance effect
 */
export const deleteTransaction = async (id: number): Promise<void> => {
  const db = getDatabase();

  const existing = await getTransactionById(id);
  if (!existing) throw new Error(`Transaction ${id} not found`);

  await reverseTransactionFromBalance(
    db,
    existing.type,
    existing.amount,
    existing.accountId,
    existing.toAccountId,
  );

  await db.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
};

// ============================================================================
// Statistics / Aggregates
// ============================================================================

export interface TransactionStats {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  transactionCount: number;
}

/**
 * Get income/expense summary for a date range
 */
export const getTransactionStats = async (
  startDate?: string,
  endDate?: string,
): Promise<TransactionStats> => {
  const db = getDatabase();

  let query = `
    SELECT
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0)  AS total_income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expense,
      COUNT(*) AS transaction_count
    FROM transactions
  `;
  const params: string[] = [];

  if (startDate && endDate) {
    query += ' WHERE date >= ? AND date <= ?';
    params.push(startDate, endDate);
  } else if (startDate) {
    query += ' WHERE date >= ?';
    params.push(startDate);
  }

  const row = await db.getFirstAsync<any>(query, params);

  const totalIncome = row?.total_income ?? 0;
  const totalExpense = row?.total_expense ?? 0;

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    transactionCount: row?.transaction_count ?? 0,
  };
};

/**
 * Get spending by category for a date range
 */
export const getSpendingByCategory = async (
  startDate: string,
  endDate: string,
): Promise<{ categoryId: number; total: number }[]> => {
  const db = getDatabase();

  const rows = await db.getAllAsync<any>(
    `SELECT category_id, SUM(amount) as total
     FROM transactions
     WHERE type = 'expense' AND category_id IS NOT NULL AND date >= ? AND date <= ?
     GROUP BY category_id
     ORDER BY total DESC`,
    [startDate, endDate],
  );

  return rows.map(row => ({ categoryId: row.category_id, total: row.total }));
};
