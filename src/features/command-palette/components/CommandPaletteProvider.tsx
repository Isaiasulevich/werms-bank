/**
 * Command Palette Provider
 * 
 * Global provider for command palette functionality.
 * Manages command registration, keyboard shortcuts, and state.
 */

'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { CommandPalette } from './CommandPalette'
import { 
  useCommandPalette, 
  useCommandPaletteShortcuts, 
  useNavigationCommands 
} from '../hooks'
import { CommandPaletteContextType } from '../types'

const CommandPaletteContext = createContext<CommandPaletteContextType | null>(null)

/**
 * Hook to access command palette context
 */
export function useCommandPaletteContext(): CommandPaletteContextType {
  const context = useContext(CommandPaletteContext)
  if (!context) {
    throw new Error('useCommandPaletteContext must be used within CommandPaletteProvider')
  }
  return context
}

interface CommandPaletteProviderProps {
  children: ReactNode
}

/**
 * Provider component that wraps the app with command palette functionality
 */
export function CommandPaletteProvider({ children }: CommandPaletteProviderProps) {
  const {
    open,
    setOpen,
    query,
    setQuery,
    providers,
    registerProvider,
    unregisterProvider,
    getAllCommands,
    searchCommands,
  } = useCommandPalette()

  // Register global keyboard shortcuts
  useCommandPaletteShortcuts(setOpen)

  // Get navigation commands (always available)
  const navigationCommands = useNavigationCommands()

  // Register navigation commands provider
  React.useEffect(() => {
    registerProvider({
      id: 'navigation',
      commands: navigationCommands,
      enabled: true,
    })
  }, [navigationCommands, registerProvider])

  // Context value
  const contextValue: CommandPaletteContextType = {
    state: {
      open,
      providers,
      query,
    },
    setOpen,
    registerProvider,
    unregisterProvider,
    getAllCommands,
    searchCommands,
  }

  return (
    <CommandPaletteContext.Provider value={contextValue}>
      {children}
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        commands={getAllCommands()}
        query={query}
        onQueryChange={setQuery}
      />
    </CommandPaletteContext.Provider>
  )
}