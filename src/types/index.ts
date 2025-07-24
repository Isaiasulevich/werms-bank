// Global type definitions

export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  limit: number
  total_pages: number
}

// Common component props
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

// Form types
export interface FormFieldError {
  message: string
  type: string
}

export interface FormState {
  isLoading: boolean
  error?: string
  success?: string
}

// Database table types (to be replaced with generated Supabase types)
export type DatabaseTables = {
  users: User
  // Add more tables as you create them
} 