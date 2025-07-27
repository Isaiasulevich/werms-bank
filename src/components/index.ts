/**
 * Main Components Index
 * 
 * Central export point for main application components.
 * This barrel export improves component discoverability and reduces import verbosity.
 */

// Layout & Navigation Components
export { AppSidebar } from './app-sidebar'
export { SiteHeader } from './site-header'
export { NavMain } from './nav-main'
export { NavUser } from './nav-user'
export { NavSecondary } from './nav-secondary'
export { NavDocuments } from './nav-documents'

// Shared Layout Components
export { DashboardLayout } from './dashboard-layout'

// Data & Charts Components
export { DataTable } from './data-table'
export { ChartAreaInteractive } from './chart-area-interactive'
export { SectionCards } from './section-cards'

// Form & Auth Components
export { LoginForm } from './LoginForm'

// Re-export commonly used UI components
export { SidebarInset, SidebarProvider } from './ui/sidebar'

// Re-export all other UI components
export * from './ui' 