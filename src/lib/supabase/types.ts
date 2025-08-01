// Database-specific types
// This file will be replaced with generated types from Supabase CLI

export interface DatabaseUser {
  id: string
  email: string
  name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Account {
  id: string
  user_id: string
  account_number: string
  account_type: 'checking' | 'savings' | 'credit'
  balance: number
  currency: string
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  account_id: string
  amount: number
  type: 'credit' | 'debit'
  description: string
  category?: string
  created_at: string
}

// Supabase Auth types
export interface AuthUser {
  id: string
  email?: string
  user_metadata?: Record<string, unknown>
  app_metadata?: Record<string, unknown>
}

// API Response types
export interface SupabaseResponse<T> {
  data: T | null
  error: unknown | null
}

export interface SupabaseListResponse<T> {
  data: T[] | null
  error: unknown | null
  count?: number | null
} 