/**
 * Database Initialization
 * Sets up SQLite database tables and initial schema
 */

import * as SQLite from 'expo-sqlite';
import { DATABASE_NAME } from '../utils/constants';

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Initialize the database connection and create tables
 */
export const initializeDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) {
    return db;
  }

  try {
    db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    
    console.log('Initializing database...');
    
    // Drop old tables if they exist (for development - clean slate)
    await db.execAsync(`
      DROP TABLE IF EXISTS attachments;
      DROP TABLE IF EXISTS budgets;
      DROP TABLE IF EXISTS transactions;
      DROP TABLE IF EXISTS recurring_transactions;
      DROP TABLE IF EXISTS categories;
      DROP TABLE IF EXISTS accounts;
      DROP TABLE IF EXISTS settings;
    `);
    
    console.log('Old tables dropped, creating new schema...');
    
    // Create accounts table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        initial_balance REAL NOT NULL DEFAULT 0,
        current_balance REAL NOT NULL DEFAULT 0,
        currency TEXT DEFAULT 'USD',
        include_in_total INTEGER DEFAULT 1,
        color TEXT,
        icon TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create categories table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        icon TEXT,
        parent_id INTEGER,
        is_default INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_id) REFERENCES categories(id)
      );
    `);

    // Create transactions table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        account_id INTEGER NOT NULL,
        category_id INTEGER,
        to_account_id INTEGER,
        note TEXT,
        is_recurring INTEGER DEFAULT 0,
        recurring_id INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (account_id) REFERENCES accounts(id),
        FOREIGN KEY (category_id) REFERENCES categories(id),
        FOREIGN KEY (to_account_id) REFERENCES accounts(id)
      );
    `);

    // Create recurring_transactions table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS recurring_transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        amount REAL NOT NULL,
        frequency TEXT NOT NULL,
        account_id INTEGER NOT NULL,
        category_id INTEGER,
        to_account_id INTEGER,
        note TEXT,
        start_date TEXT NOT NULL,
        end_date TEXT,
        next_due_date TEXT NOT NULL,
        auto_record INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (account_id) REFERENCES accounts(id),
        FOREIGN KEY (category_id) REFERENCES categories(id)
      );
    `);

    // Create budgets table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS budgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        amount REAL NOT NULL,
        period TEXT NOT NULL,
        category_id INTEGER,
        start_date TEXT NOT NULL,
        end_date TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      );
    `);

    // Create attachments table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS attachments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        transaction_id INTEGER NOT NULL,
        file_path TEXT NOT NULL,
        file_type TEXT NOT NULL,
        file_name TEXT,
        ai_processed INTEGER DEFAULT 0,
        ai_extracted_data TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE
      );
    `);

    // Create settings table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Database initialized successfully');
    
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

/**
 * Get the database instance
 */
export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
};

/**
 * Close the database connection
 */
export const closeDatabase = async (): Promise<void> => {
  if (db) {
    await db.closeAsync();
    db = null;
  }
};
