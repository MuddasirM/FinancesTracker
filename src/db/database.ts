import { open, QuickSQLiteConnection } from 'react-native-quick-sqlite'
import {
  ALL_TABLES,
  CREATE_SETTINGS_CATEGORIES_TABLE,
  CREATE_SETTINGS_TABLE,
} from './schema'
import { CreateCategoryInput } from './types'

const DB_NAME = 'coffer.db'

let db: QuickSQLiteConnection | null = null

// ─── Expense / income category seed ────────────────────────────────────────

const DEFAULT_CATEGORIES: CreateCategoryInput[] = [
  { name: 'Food',          icon: 'food',                  color: '#E05C5C', type: 'expense', is_default: 1 },
  { name: 'Transport',     icon: 'car',                   color: '#4ECDC4', type: 'expense', is_default: 1 },
  { name: 'Shopping',      icon: 'shopping',              color: '#45B7D1', type: 'expense', is_default: 1 },
  { name: 'Bills',         icon: 'file-document-outline', color: '#96CEB4', type: 'expense', is_default: 1 },
  { name: 'Health',        icon: 'heart-pulse',           color: '#FF6B9D', type: 'expense', is_default: 1 },
  { name: 'Entertainment', icon: 'gamepad-variant',       color: '#9B59B6', type: 'expense', is_default: 1 },
  { name: 'Salary',        icon: 'cash',                  color: '#2ECC71', type: 'income',  is_default: 1 },
  { name: 'Transfer',      icon: 'bank-transfer',         color: '#F39C12', type: 'both',    is_default: 1 },
  { name: 'Other',         icon: 'dots-horizontal',       color: '#95A5A6', type: 'both',    is_default: 1 },
]

// ─── Settings seed data ─────────────────────────────────────────────────────

interface DefaultCategory {
  key: string
  label: string
  icon: string
  sort_order: number
}

interface DefaultSetting {
  key: string
  value: string
  default_value: string | null
  data_type: string
  category_key: string
  label: string
  description: string | null
  input_type: string
  options: string | null
  is_editable: number
  is_visible: number
  sort_order: number
}

const DEFAULT_SETTING_CATEGORIES: DefaultCategory[] = [
  { key: 'appearance',    label: 'Appearance', icon: 'palette',  sort_order: 1 },
  { key: 'capture',       label: 'Capture',    icon: 'bell',     sort_order: 2 },
  { key: 'currency',      label: 'Currency',   icon: 'coins',    sort_order: 3 },
  { key: 'notifications', label: 'Alerts',     icon: 'alarm',    sort_order: 4 },
  { key: 'security',      label: 'Security',   icon: 'lock',     sort_order: 5 },
  { key: 'data',          label: 'Data',       icon: 'database', sort_order: 6 },
]

const DEFAULT_SETTINGS: DefaultSetting[] = [
  // APPEARANCE
  {
    key: 'theme', value: 'system', default_value: 'system',
    data_type: 'string', category_key: 'appearance',
    label: 'Theme', description: null,
    input_type: 'select', options: JSON.stringify(['light', 'dark', 'system']),
    is_editable: 1, is_visible: 1, sort_order: 1,
  },

  // CAPTURE
  {
    key: 'push_notifications_enabled', value: 'true', default_value: 'true',
    data_type: 'boolean', category_key: 'capture',
    label: 'Bank App Notifications', description: 'Read transaction notifications from bank apps',
    input_type: 'toggle', options: null,
    is_editable: 1, is_visible: 1, sort_order: 1,
  },
  {
    key: 'sms_enabled', value: 'false', default_value: 'false',
    data_type: 'boolean', category_key: 'capture',
    label: 'SMS', description: 'Read bank transaction SMS messages',
    input_type: 'toggle', options: null,
    is_editable: 1, is_visible: 1, sort_order: 2,
  },
  {
    key: 'whatsapp_enabled', value: 'false', default_value: 'false',
    data_type: 'boolean', category_key: 'capture',
    label: 'WhatsApp', description: 'Read bank alerts received via WhatsApp',
    input_type: 'toggle', options: null,
    is_editable: 1, is_visible: 1, sort_order: 3,
  },
  {
    key: 'monitored_packages', value: '[]', default_value: '[]',
    data_type: 'json', category_key: 'capture',
    label: 'Monitored Apps', description: 'App package names to watch for notifications',
    input_type: 'text', options: null,
    is_editable: 1, is_visible: 1, sort_order: 4,
  },

  // CURRENCY
  {
    key: 'base_currency', value: 'AED', default_value: 'AED',
    data_type: 'string', category_key: 'currency',
    label: 'Base Currency', description: 'Primary currency for dashboard totals',
    input_type: 'text', options: null,
    is_editable: 1, is_visible: 1, sort_order: 1,
  },
  {
    key: 'currencies', value: '["AED"]', default_value: '["AED"]',
    data_type: 'json', category_key: 'currency',
    label: 'My Currencies', description: 'All currencies you transact in',
    input_type: 'text', options: null,
    is_editable: 1, is_visible: 1, sort_order: 2,
  },

  // NOTIFICATIONS
  {
    key: 'morning_nudge_enabled', value: 'false', default_value: 'false',
    data_type: 'boolean', category_key: 'notifications',
    label: 'Morning Nudge', description: 'Daily spend limit reminder each morning',
    input_type: 'toggle', options: null,
    is_editable: 1, is_visible: 1, sort_order: 1,
  },
  {
    key: 'morning_nudge_time', value: '08:00', default_value: '08:00',
    data_type: 'time', category_key: 'notifications',
    label: 'Nudge Time', description: null,
    input_type: 'time_picker', options: null,
    is_editable: 1, is_visible: 1, sort_order: 2,
  },
  {
    key: 'daily_limit', value: '0', default_value: '0',
    data_type: 'number', category_key: 'notifications',
    label: 'Daily Spend Limit', description: 'Set to 0 to disable',
    input_type: 'number', options: null,
    is_editable: 1, is_visible: 1, sort_order: 3,
  },
  {
    key: 'daily_limit_rollover', value: 'true', default_value: 'true',
    data_type: 'boolean', category_key: 'notifications',
    label: 'Rollover Unspent Budget', description: 'Carry unspent daily limit to next day',
    input_type: 'toggle', options: null,
    is_editable: 1, is_visible: 1, sort_order: 4,
  },
  {
    key: 'batch_notifications', value: 'true', default_value: 'true',
    data_type: 'boolean', category_key: 'notifications',
    label: 'Stack Notifications', description: 'Group transaction notifications for batch review',
    input_type: 'toggle', options: null,
    is_editable: 1, is_visible: 1, sort_order: 5,
  },
  {
    key: 'batch_review_time', value: '21:00', default_value: '21:00',
    data_type: 'time', category_key: 'notifications',
    label: 'Batch Review Time', description: 'When to remind you to review stacked notifications',
    input_type: 'time_picker', options: null,
    is_editable: 1, is_visible: 1, sort_order: 6,
  },

  // SECURITY
  {
    key: 'biometric_enabled', value: 'true', default_value: 'true',
    data_type: 'boolean', category_key: 'security',
    label: 'Biometric Lock', description: 'Require fingerprint or face unlock to open app',
    input_type: 'toggle', options: null,
    is_editable: 1, is_visible: 1, sort_order: 1,
  },

  // DATA
  {
    key: 'kofi_url', value: '', default_value: '',
    data_type: 'string', category_key: 'data',
    label: 'Support the App', description: 'Buy us a coffee if you find this useful',
    input_type: 'info', options: null,
    is_editable: 0, is_visible: 1, sort_order: 1,
  },
  {
    key: 'onboarding_complete', value: 'false', default_value: 'false',
    data_type: 'boolean', category_key: 'data',
    label: 'Onboarding Complete', description: null,
    input_type: 'info', options: null,
    is_editable: 0, is_visible: 0, sort_order: 0,
  },
  {
    key: 'first_launch_date', value: String(Date.now()), default_value: null,
    data_type: 'number', category_key: 'data',
    label: 'Member Since', description: null,
    input_type: 'info', options: null,
    is_editable: 0, is_visible: 0, sort_order: 0,
  },
  {
    key: 'milestones_shown', value: '[]', default_value: '[]',
    data_type: 'json', category_key: 'data',
    label: 'Milestones', description: null,
    input_type: 'info', options: null,
    is_editable: 0, is_visible: 0, sort_order: 0,
  },
]

// ─── Init helpers ───────────────────────────────────────────────────────────

async function createTables(connection: QuickSQLiteConnection): Promise<void> {
  for (const sql of ALL_TABLES) {
    await connection.executeAsync(sql)
  }
}

async function migrateSettingsTables(connection: QuickSQLiteConnection): Promise<void> {
  // Check whether the new schema is already in place
  const check = await connection.executeAsync(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='settings_categories'"
  )
  if ((check.rows?._array ?? []).length > 0) return

  // Drop old settings table (early dev — no data to preserve)
  await connection.executeAsync('DROP TABLE IF EXISTS settings')
  await connection.executeAsync(CREATE_SETTINGS_CATEGORIES_TABLE)
  await connection.executeAsync(CREATE_SETTINGS_TABLE)
}

async function seedExpenseCategories(connection: QuickSQLiteConnection): Promise<void> {
  const result = await connection.executeAsync('SELECT COUNT(*) as count FROM categories')
  const count: number = result.rows?._array[0]?.count ?? 0
  if (count > 0) return

  const now = Date.now()
  for (const cat of DEFAULT_CATEGORIES) {
    await connection.executeAsync(
      `INSERT INTO categories (name, icon, color, type, is_default, is_active, created_at)
       VALUES (?, ?, ?, ?, ?, 1, ?)`,
      [cat.name, cat.icon, cat.color, cat.type ?? 'both', cat.is_default ?? 0, now]
    )
  }
}

async function seedSettingsData(connection: QuickSQLiteConnection): Promise<void> {
  const check = await connection.executeAsync(
    'SELECT COUNT(*) as count FROM settings_categories'
  )
  const count: number = check.rows?._array[0]?.count ?? 0
  if (count > 0) return

  for (const cat of DEFAULT_SETTING_CATEGORIES) {
    await connection.executeAsync(
      'INSERT OR IGNORE INTO settings_categories (key, label, icon, sort_order) VALUES (?, ?, ?, ?)',
      [cat.key, cat.label, cat.icon, cat.sort_order]
    )
  }

  for (const s of DEFAULT_SETTINGS) {
    await connection.executeAsync(
      `INSERT OR IGNORE INTO settings
         (key, value, default_value, data_type, category_key, label, description,
          input_type, options, is_editable, is_visible, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        s.key, s.value, s.default_value, s.data_type, s.category_key,
        s.label, s.description, s.input_type, s.options,
        s.is_editable, s.is_visible, s.sort_order,
      ]
    )
  }
}

// ─── Public API ─────────────────────────────────────────────────────────────

export async function initDatabase(): Promise<void> {
  if (db !== null) return

  try {
    db = open({ name: DB_NAME })
    await createTables(db)
    await migrateSettingsTables(db)
    await seedExpenseCategories(db)
    await seedSettingsData(db)
  } catch (error) {
    db = null
    throw error
  }
}

export function getDatabase(): QuickSQLiteConnection {
  if (db === null) {
    throw new Error(
      'Database not initialized. Call initDatabase() before using repositories.'
    )
  }
  return db
}
