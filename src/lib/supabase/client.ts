import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  )
}

// Client-side Supabase client for browser/client components
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Database type exports (to be updated when you generate types from your schema)
export type Database = unknown // Replace with generated types from Supabase CLI 