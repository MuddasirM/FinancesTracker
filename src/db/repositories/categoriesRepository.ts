import { getDatabase } from '../database'
import { Category, CreateCategoryInput } from '../types'

function rowToCategory(row: Record<string, unknown>): Category {
  return {
    id:         row.id as number,
    name:       row.name as string,
    icon:       row.icon as string,
    color:      row.color as string,
    type:       row.type as Category['type'],
    is_default: row.is_default as number,
    is_active:  row.is_active as number,
    created_at: row.created_at as number,
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const db = getDatabase()
    const result = await db.executeAsync(
      'SELECT * FROM categories ORDER BY is_default DESC, name ASC'
    )
    return (result.rows?._array ?? []).map(rowToCategory)
  } catch (error) {
    throw new Error(`getCategories() failed: ${String(error)}`)
  }
}

export async function getCategoryById(id: number): Promise<Category | null> {
  try {
    const db = getDatabase()
    const result = await db.executeAsync(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    )
    const row = result.rows?._array[0]
    return row ? rowToCategory(row) : null
  } catch (error) {
    throw new Error(`getCategoryById(${id}) failed: ${String(error)}`)
  }
}

export async function createCategory(
  input: CreateCategoryInput
): Promise<Category> {
  try {
    const db = getDatabase()
    const now = Date.now()
    const result = await db.executeAsync(
      `INSERT INTO categories (name, icon, color, type, is_default, is_active, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        input.name,
        input.icon,
        input.color,
        input.type ?? 'both',
        input.is_default ?? 0,
        input.is_active ?? 1,
        now,
      ]
    )
    const id = result.insertId
    if (id == null) throw new Error('INSERT did not return an insertId')
    const category = await getCategoryById(id)
    if (category === null) throw new Error(`Category ${id} not found after insert`)
    return category
  } catch (error) {
    throw new Error(`createCategory() failed: ${String(error)}`)
  }
}

export async function updateCategory(
  id: number,
  updates: Partial<Category>
): Promise<Category> {
  try {
    const db = getDatabase()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, created_at: _created, ...safeUpdates } = updates
    const entries = Object.entries(safeUpdates)

    if (entries.length > 0) {
      const setClause = entries.map(([col]) => `${col} = ?`).join(', ')
      const values = entries.map(([, val]) => val)
      await db.executeAsync(
        `UPDATE categories SET ${setClause} WHERE id = ?`,
        [...values, id]
      )
    }

    const category = await getCategoryById(id)
    if (category === null) throw new Error(`Category ${id} not found`)
    return category
  } catch (error) {
    throw new Error(`updateCategory(${id}) failed: ${String(error)}`)
  }
}

export async function archiveCategory(
  id: number,
  reassignTo?: number
): Promise<void> {
  try {
    const db = getDatabase()
    await db.transaction(async tx => {
      // When a transactions table is added, update its category_id here:
      // if (reassignTo != null) {
      //   tx.execute('UPDATE transactions SET category_id = ? WHERE category_id = ?', [reassignTo, id])
      // }
      void reassignTo
      tx.execute('UPDATE categories SET is_active = 0 WHERE id = ?', [id])
    })
  } catch (error) {
    throw new Error(`archiveCategory(${id}) failed: ${String(error)}`)
  }
}
