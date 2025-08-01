/**
 * Command Palette Types
 * 
 * Type definitions for the command palette system including
 * command actions, categories, and provider interfaces.
 */

import { ReactNode } from 'react'

/**
 * Base command action interface
 */
export interface CommandAction {
  /** Unique identifier for the command */
  id: string
  
  /** Display label for the command */
  label: string
  
  /** Icon to display with the command */
  icon: ReactNode
  
  /** Category grouping for organization */
  category: CommandCategory
  
  /** Function to execute when command is selected */
  action: () => void | Promise<void>
  
  /** Additional keywords for search matching */
  keywords?: string[]
  
  /** Keyboard shortcut display (optional) */
  shortcut?: string
  
  /** Whether the command is currently available */
  disabled?: boolean
}

/**
 * Command categories for grouping
 */
export type CommandCategory = 
  | 'Navigation'
  | 'Policies' 
  | 'Employees'
  | 'Werms'
  | 'Settings'
  | 'Actions'

/**
 * Command provider interface for registering commands
 */
export interface CommandProvider {
  /** Provider identifier */
  id: string
  
  /** Commands provided by this provider */
  commands: CommandAction[]
  
  /** Whether this provider is currently active */
  enabled?: boolean
}

/**
 * Command palette state interface
 */
export interface CommandPaletteState {
  /** Whether the command palette is open */
  open: boolean
  
  /** Currently registered command providers */
  providers: CommandProvider[]
  
  /** Current search query */
  query: string
}

/**
 * Command palette context interface
 */
export interface CommandPaletteContextType {
  /** Current state */
  state: CommandPaletteState
  
  /** Open/close the command palette */
  setOpen: (open: boolean) => void
  
  /** Register a command provider */
  registerProvider: (provider: CommandProvider) => void
  
  /** Unregister a command provider */
  unregisterProvider: (providerId: string) => void
  
  /** Get all available commands */
  getAllCommands: () => CommandAction[]
  
  /** Search commands by query */
  searchCommands: (query: string) => CommandAction[]
}

/**
 * Command registration options
 */
export interface CommandRegistrationOptions {
  /** Whether to replace existing commands with same ID */
  replace?: boolean
  
  /** Priority for command ordering (higher = first) */
  priority?: number
}