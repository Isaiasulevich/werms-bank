import { createClient } from './client'
import type { AuthUser, SupabaseResponse } from './types'

/**
 * Authentication utilities for Supabase
 */

// Sign up with email and password
export async function signUp(email: string, password: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  
  return { data, error }
}

// Sign in with email and password
export async function signIn(email: string, password: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  return { data, error }
}

// Sign out
export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Get current user
export async function getCurrentUser(): Promise<SupabaseResponse<AuthUser>> {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  return {
    data: user as AuthUser | null,
    error
  }
}

// Get current session
export async function getCurrentSession() {
  const supabase = createClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  return { data: session, error }
}

// Password reset
export async function resetPassword(email: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.resetPasswordForEmail(email)
  return { data, error }
}

// Update user profile
export async function updateProfile(updates: { 
  email?: string
  password?: string 
  data?: Record<string, unknown>
}) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.updateUser(updates)
  return { data, error }
} 