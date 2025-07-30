// Main exports for Supabase functionality
export { supabase } from './client'
export type { Database } from './client'

// Re-export types for convenience
export * from './types'

// Re-export auth functions
export * from './auth'

// Re-export query functions  
export * from './queries'

// Re-export auth components
export { AuthProvider, useAuth } from './AuthProvider'
export { AuthGuard } from './AuthGuard' 