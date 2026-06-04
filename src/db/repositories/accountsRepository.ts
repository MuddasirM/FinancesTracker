import { getDatabase } from '../database'
import { Account, CreateAccountInput } from '../types'

function rowToAccount(row: Record<string, unknown>): Account {
  return {
    id:                 row.id as number,
    name:               row.name as string,
    account_identifier: row.account_identifier as string | null,
    type:               row.type as Account['type'],
    currency:           row.currency as string,
    balance:            row.balance as number,
    balance_source:     row.balance_source as Account['balance_source'],
    color:              row.color as string,
    icon:               row.icon as string,
    is_active:          row.is_active as number,
    created_at:         row.created_at as number,
  }
}

export async function getAccounts(): Promise<Account[]> {
  try {
    const db = getDatabase()
    const result = await db.executeAsync(
      'SELECT * FROM accounts ORDER BY created_at ASC'
    )
    return (result.rows?._array ?? []).map(rowToAccount)
  } catch (error) {
    throw new Error(`getAccounts() failed: ${String(error)}`)
  }
}

export async function getAccountById(id: number): Promise<Account | null> {
  try {
    const db = getDatabase()
    const result = await db.executeAsync(
      'SELECT * FROM accounts WHERE id = ?',
      [id]
    )
    const row = result.rows?._array[0]
    return row ? rowToAccount(row) : null
  } catch (error) {
    throw new Error(`getAccountById(${id}) failed: ${String(error)}`)
  }
}

export async function getAccountByIdentifier(
  identifier: string
): Promise<Account | null> {
  try {
    const db = getDatabase()
    const result = await db.executeAsync(
      'SELECT * FROM accounts WHERE account_identifier = ?',
      [identifier]
    )
    const row = result.rows?._array[0]
    return row ? rowToAccount(row) : null
  } catch (error) {
    throw new Error(`getAccountByIdentifier(${identifier}) failed: ${String(error)}`)
  }
}

export async function createAccount(input: CreateAccountInput): Promise<Account> {
  try {
    const db = getDatabase()
    const now = Date.now()
    const result = await db.executeAsync(
      `INSERT INTO accounts
         (name, account_identifier, type, currency, balance, balance_source, color, icon, is_active, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        input.name,
        input.account_identifier ?? null,
        input.type,
        input.currency,
        input.balance ?? 0,
        input.balance_source ?? 'manual',
        input.color ?? '#C9A87C',
        input.icon ?? 'bank',
        input.is_active ?? 1,
        now,
      ]
    )
    const id = result.insertId
    if (id == null) throw new Error('INSERT did not return an insertId')
    const account = await getAccountById(id)
    if (account === null) throw new Error(`Account ${id} not found after insert`)
    return account
  } catch (error) {
    throw new Error(`createAccount() failed: ${String(error)}`)
  }
}

export async function updateAccount(
  id: number,
  updates: Partial<Account>
): Promise<Account> {
  try {
    const db = getDatabase()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, created_at: _created, ...safeUpdates } = updates
    const entries = Object.entries(safeUpdates)

    if (entries.length > 0) {
      const setClause = entries.map(([col]) => `${col} = ?`).join(', ')
      const values = entries.map(([, val]) => val)
      await db.executeAsync(
        `UPDATE accounts SET ${setClause} WHERE id = ?`,
        [...values, id]
      )
    }

    const account = await getAccountById(id)
    if (account === null) throw new Error(`Account ${id} not found`)
    return account
  } catch (error) {
    throw new Error(`updateAccount(${id}) failed: ${String(error)}`)
  }
}

export async function archiveAccount(id: number): Promise<void> {
  try {
    const db = getDatabase()
    await db.executeAsync(
      'UPDATE accounts SET is_active = 0 WHERE id = ?',
      [id]
    )
  } catch (error) {
    throw new Error(`archiveAccount(${id}) failed: ${String(error)}`)
  }
}
