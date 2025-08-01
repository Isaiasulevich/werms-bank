import { supabase } from './client'
import type { DatabaseUser, Account, Transaction, SupabaseResponse, SupabaseListResponse } from './types'

/**
 * Database query utilities
 * These are example queries - implement based on your actual database schema
 */

// User queries
export async function getUserProfile(userId: string): Promise<SupabaseResponse<DatabaseUser>> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  
  return { data, error }
}

export async function updateUserProfile(
  userId: string, 
  updates: Partial<DatabaseUser>
): Promise<SupabaseResponse<DatabaseUser>> {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  return { data, error }
}

// Account queries
export async function getUserAccounts(userId: string): Promise<SupabaseListResponse<Account>> {
  const { data, error, count } = await supabase
    .from('accounts')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
  
  return { data, error, count }
}

export async function getAccount(accountId: string): Promise<SupabaseResponse<Account>> {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('id', accountId)
    .single()
  
  return { data, error }
}

// Transaction queries
export async function getAccountTransactions(
  accountId: string,
  limit = 50,
  offset = 0
): Promise<SupabaseListResponse<Transaction>> {
  const { data, error, count } = await supabase
    .from('transactions')
    .select('*', { count: 'exact' })
    .eq('account_id', accountId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  
  return { data, error, count }
}

export async function createTransaction(
  transaction: Omit<Transaction, 'id' | 'created_at'>
): Promise<SupabaseResponse<Transaction>> {
  const { data, error } = await supabase
    .from('transactions')
    .insert(transaction)
    .select()
    .single()
  
  return { data, error }
}

// Real-time subscriptions
export function subscribeToAccountTransactions(
  accountId: string,
  callback: (payload: unknown) => void
) {
  return supabase
    .channel(`transactions:${accountId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'transactions',
        filter: `account_id=eq.${accountId}`,
      },
      callback
    )
    .subscribe()
}

export function subscribeToAccountBalance(
  accountId: string,
  callback: (payload: unknown) => void
) {
  return supabase
    .channel(`accounts:${accountId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'accounts',
        filter: `id=eq.${accountId}`,
      },
      callback
    )
    .subscribe()
} 