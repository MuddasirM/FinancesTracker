import { getDatabase } from '../database'
import { Setting, SettingCategory, SettingsScreenData, SettingDataType } from '../types'

function rowToCategory(row: Record<string, unknown>): SettingCategory {
  return {
    id:         row.id as number,
    key:        row.key as string,
    label:      row.label as string,
    icon:       row.icon as string,
    sort_order: row.sort_order as number,
  }
}

function rowToSetting(row: Record<string, unknown>): Setting {
  return {
    key:           row.key as string,
    value:         row.value as string,
    default_value: row.default_value as string | null,
    data_type:     row.data_type as Setting['data_type'],
    category_key:  row.category_key as string,
    label:         row.label as string,
    description:   row.description as string | null,
    input_type:    row.input_type as Setting['input_type'],
    options:       row.options as string | null,
    is_editable:   row.is_editable as number,
    is_visible:    row.is_visible as number,
    sort_order:    row.sort_order as number,
  }
}

export async function getCategories(): Promise<SettingCategory[]> {
  try {
    const db = getDatabase()
    const result = await db.executeAsync(
      'SELECT id, key, label, icon, sort_order FROM settings_categories ORDER BY sort_order'
    )
    return (result.rows?._array ?? []).map(rowToCategory)
  } catch (error) {
    throw new Error(`getCategories() failed: ${String(error)}`)
  }
}

export async function getCategoryWithSettings(categoryKey: string): Promise<SettingsScreenData> {
  try {
    const db = getDatabase()

    const catResult = await db.executeAsync(
      'SELECT id, key, label, icon, sort_order FROM settings_categories WHERE key = ?',
      [categoryKey]
    )
    const catRow = catResult.rows?._array[0]
    if (!catRow) throw new Error(`Category not found: ${categoryKey}`)

    const settingsResult = await db.executeAsync(
      `SELECT key, value, default_value, data_type, category_key, label, description,
              input_type, options, is_editable, is_visible, sort_order
       FROM settings
       WHERE category_key = ? AND is_visible = 1
       ORDER BY sort_order`,
      [categoryKey]
    )

    return {
      category: rowToCategory(catRow),
      settings: (settingsResult.rows?._array ?? []).map(rowToSetting),
    }
  } catch (error) {
    throw new Error(`getCategoryWithSettings(${categoryKey}) failed: ${String(error)}`)
  }
}

export async function getAllSettingsGrouped(): Promise<SettingsScreenData[]> {
  try {
    const db = getDatabase()
    const result = await db.executeAsync(
      `SELECT
         sc.id          AS cat_id,
         sc.key         AS cat_key,
         sc.label       AS cat_label,
         sc.icon        AS cat_icon,
         sc.sort_order  AS cat_sort,
         s.key          AS s_key,
         s.value,
         s.default_value,
         s.data_type,
         s.category_key,
         s.label        AS s_label,
         s.description,
         s.input_type,
         s.options,
         s.is_editable,
         s.is_visible,
         s.sort_order   AS s_sort
       FROM settings_categories sc
       LEFT JOIN settings s ON s.category_key = sc.key AND s.is_visible = 1
       ORDER BY sc.sort_order, s.sort_order`
    )

    const rows: Record<string, unknown>[] = result.rows?._array ?? []
    const map = new Map<string, SettingsScreenData>()

    for (const row of rows) {
      const catKey = row.cat_key as string
      if (!map.has(catKey)) {
        map.set(catKey, {
          category: {
            id:         row.cat_id as number,
            key:        catKey,
            label:      row.cat_label as string,
            icon:       row.cat_icon as string,
            sort_order: row.cat_sort as number,
          },
          settings: [],
        })
      }
      if (row.s_key) {
        map.get(catKey)!.settings.push({
          key:           row.s_key as string,
          value:         row.value as string,
          default_value: row.default_value as string | null,
          data_type:     row.data_type as Setting['data_type'],
          category_key:  row.category_key as string,
          label:         row.s_label as string,
          description:   row.description as string | null,
          input_type:    row.input_type as Setting['input_type'],
          options:       row.options as string | null,
          is_editable:   row.is_editable as number,
          is_visible:    row.is_visible as number,
          sort_order:    row.s_sort as number,
        })
      }
    }

    return Array.from(map.values())
  } catch (error) {
    throw new Error(`getAllSettingsGrouped() failed: ${String(error)}`)
  }
}

export async function getSetting(key: string): Promise<Setting | null> {
  try {
    const db = getDatabase()
    const result = await db.executeAsync(
      `SELECT key, value, default_value, data_type, category_key, label, description,
              input_type, options, is_editable, is_visible, sort_order
       FROM settings WHERE key = ?`,
      [key]
    )
    const row = result.rows?._array[0]
    return row ? rowToSetting(row) : null
  } catch (error) {
    throw new Error(`getSetting(${key}) failed: ${String(error)}`)
  }
}

export async function getSettingValue<T>(key: string): Promise<T | null> {
  const setting = await getSetting(key)
  if (!setting) return null

  const raw = setting.value
  switch (setting.data_type as SettingDataType) {
    case 'boolean': return (raw === 'true') as unknown as T
    case 'number':  return parseFloat(raw)  as unknown as T
    case 'json':    return JSON.parse(raw)  as T
    default:        return raw              as unknown as T
  }
}

export async function setSetting(key: string, value: string): Promise<void> {
  try {
    const db = getDatabase()
    const check = await db.executeAsync(
      'SELECT is_editable FROM settings WHERE key = ?',
      [key]
    )
    const row = check.rows?._array[0]
    if (!row || (row.is_editable as number) === 0) return
    await db.executeAsync('UPDATE settings SET value = ? WHERE key = ?', [value, key])
  } catch (error) {
    throw new Error(`setSetting(${key}) failed: ${String(error)}`)
  }
}

export async function resetSetting(key: string): Promise<void> {
  try {
    const db = getDatabase()
    await db.executeAsync(
      'UPDATE settings SET value = COALESCE(default_value, value) WHERE key = ?',
      [key]
    )
  } catch (error) {
    throw new Error(`resetSetting(${key}) failed: ${String(error)}`)
  }
}

export async function resetAllSettings(): Promise<void> {
  try {
    const db = getDatabase()
    await db.executeAsync(
      'UPDATE settings SET value = COALESCE(default_value, value) WHERE is_editable = 1'
    )
  } catch (error) {
    throw new Error(`resetAllSettings() failed: ${String(error)}`)
  }
}
