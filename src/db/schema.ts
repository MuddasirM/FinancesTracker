export const CREATE_SETTINGS_CATEGORIES_TABLE = `
  CREATE TABLE IF NOT EXISTS settings_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL UNIQUE,
    label TEXT NOT NULL,
    icon TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
  );
`

export const CREATE_SETTINGS_TABLE = `
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    default_value TEXT,
    data_type TEXT NOT NULL,
    category_key TEXT NOT NULL,
    label TEXT NOT NULL,
    description TEXT,
    input_type TEXT NOT NULL,
    options TEXT,
    is_editable INTEGER NOT NULL DEFAULT 1,
    is_visible INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (category_key) REFERENCES settings_categories(key)
  );
`

export const CREATE_ACCOUNTS_TABLE = `
  CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    account_identifier TEXT,
    type TEXT NOT NULL DEFAULT 'checking',
    currency TEXT NOT NULL,
    balance REAL NOT NULL DEFAULT 0,
    balance_source TEXT NOT NULL DEFAULT 'manual',
    color TEXT NOT NULL DEFAULT '#ffffff',
    icon TEXT NOT NULL DEFAULT 'bank',
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL
  );
`

export const CREATE_CATEGORIES_TABLE = `
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'both',
    is_default INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL
  );
`

// Accounts and categories only — settings tables are managed by migration
export const ALL_TABLES = [
  CREATE_ACCOUNTS_TABLE,
  CREATE_CATEGORIES_TABLE,
]
