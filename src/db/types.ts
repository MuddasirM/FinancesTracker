export type SettingDataType = 'string' | 'boolean' | 'number' | 'json' | 'time'
export type SettingInputType = 'toggle' | 'select' | 'text' | 'number' | 'time_picker' | 'info'

export interface SettingCategory {
  id: number
  key: string
  label: string
  icon: string
  sort_order: number
}

export interface Setting {
  key: string
  value: string
  default_value: string | null
  data_type: SettingDataType
  category_key: string
  label: string
  description: string | null
  input_type: SettingInputType
  options: string | null
  is_editable: number
  is_visible: number
  sort_order: number
}

export interface SettingsScreenData {
  category: SettingCategory
  settings: Setting[]
}

export interface Account {
  id: number
  name: string
  account_identifier: string | null
  type: 'checking' | 'savings' | 'credit' | 'wallet'
  currency: string
  balance: number
  balance_source: 'notification' | 'manual'
  color: string
  icon: string
  is_active: number
  created_at: number
}

export interface Category {
  id: number
  name: string
  icon: string
  color: string
  type: 'expense' | 'income' | 'both'
  is_default: number
  is_active: number
  created_at: number
}

export interface CreateAccountInput {
  name: string
  account_identifier?: string | null
  type: 'checking' | 'savings' | 'credit' | 'wallet'
  currency: string
  balance?: number
  balance_source?: 'notification' | 'manual'
  color?: string
  icon?: string
  is_active?: number
}

export interface CreateCategoryInput {
  name: string
  icon: string
  color: string
  type?: 'expense' | 'income' | 'both'
  is_default?: number
  is_active?: number
}
