/**
 * Command Palette Hooks
 * 
 * Custom React hooks for managing command palette state,
 * command registration, and search functionality.
 */

'use client'

import React, { useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { 
  Home, 
  FileText, 
  Users, 
  Plus, 
  Edit, 
  DollarSign, 
  Search
} from 'lucide-react'
import { CommandAction, CommandProvider, CommandCategory } from './types'

/**
 * Hook for managing command palette state
 */
export function useCommandPalette() {
  const [open, setOpen] = useState(false)
  const [providers, setProviders] = useState<CommandProvider[]>([])
  const [query, setQuery] = useState('')

  const registerProvider = useCallback((provider: CommandProvider) => {
    setProviders(prev => {
      const filtered = prev.filter(p => p.id !== provider.id)
      return [...filtered, provider]
    })
  }, [])

  const unregisterProvider = useCallback((providerId: string) => {
    setProviders(prev => prev.filter(p => p.id !== providerId))
  }, [])

  const getAllCommands = useCallback((): CommandAction[] => {
    return providers
      .filter(provider => provider.enabled !== false)
      .flatMap(provider => provider.commands)
      .filter(command => !command.disabled)
  }, [providers])

  const searchCommands = useCallback((searchQuery: string): CommandAction[] => {
    const commands = getAllCommands()
    
    if (!searchQuery.trim()) {
      return commands
    }

    const query = searchQuery.toLowerCase()
    
    return commands.filter(command => {
      const labelMatch = command.label.toLowerCase().includes(query)
      const categoryMatch = command.category.toLowerCase().includes(query)
      const keywordMatch = command.keywords?.some(keyword => 
        keyword.toLowerCase().includes(query)
      ) || false
      
      return labelMatch || categoryMatch || keywordMatch
    })
  }, [getAllCommands])

  return {
    open,
    setOpen,
    query,
    setQuery,
    providers,
    registerProvider,
    unregisterProvider,
    getAllCommands,
    searchCommands,
  }
}

/**
 * Hook for keyboard shortcuts
 */
export function useCommandPaletteShortcuts(setOpen: (open: boolean) => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open command palette
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen(true)
      }
      
      // Escape to close
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [setOpen])
}

/**
 * Hook for navigation commands
 */
export function useNavigationCommands(): CommandAction[] {
  const router = useRouter()

  return useMemo(() => [
    {
      id: 'nav-dashboard',
      label: 'Go to Dashboard',
      icon: React.createElement(Home, { className: 'h-4 w-4' }),
      category: 'Navigation' as CommandCategory,
      action: () => router.push('/dashboard'),
      keywords: ['dashboard', 'home', 'overview', 'main'],
      shortcut: '⌘D',
    },
    {
      id: 'nav-policies',
      label: 'Go to Policies',
      icon: React.createElement(FileText, { className: 'h-4 w-4' }),
      category: 'Navigation' as CommandCategory,
      action: () => router.push('/policies'),
      keywords: ['policies', 'rules', 'governance', 'regulations'],
      shortcut: '⌘P',
    },
    {
      id: 'nav-employees',
      label: 'Go to Employees',
      icon: React.createElement(Users, { className: 'h-4 w-4' }),
      category: 'Navigation' as CommandCategory,
      action: () => router.push('/employees'),
      keywords: ['employees', 'staff', 'team', 'people', 'workers'],
      shortcut: '⌘E',
    },
  ], [router])
}

/**
 * Hook for policy-related commands
 */
export function usePolicyCommands(options?: {
  onAddPolicy?: () => void
  onEditPolicy?: () => void
}) {
  return useMemo(() => {
    const commands: CommandAction[] = []

    if (options?.onAddPolicy) {
      commands.push({
        id: 'add-policy',
        label: 'Add New Policy',
        icon: React.createElement(Plus, { className: 'h-4 w-4' }),
        category: 'Policies' as CommandCategory,
        action: options.onAddPolicy,
        keywords: ['add', 'create', 'new', 'policy', 'rule', 'make'],
      })
    }

    if (options?.onEditPolicy) {
      commands.push({
        id: 'edit-policy',
        label: 'Edit Policy',
        icon: React.createElement(Edit, { className: 'h-4 w-4' }),
        category: 'Policies' as CommandCategory,
        action: options.onEditPolicy,
        keywords: ['edit', 'modify', 'update', 'policy', 'change'],
      })
    }

    return commands
  }, [options?.onAddPolicy, options?.onEditPolicy])
}

/**
 * Hook for employee-related commands
 */
export function useEmployeeCommands(options?: {
  onAddEmployee?: () => void
  onEditEmployee?: () => void
}) {
  return useMemo(() => {
    const commands: CommandAction[] = []

    if (options?.onAddEmployee) {
      commands.push({
        id: 'add-employee',
        label: 'Add New Employee',
        icon: React.createElement(Plus, { className: 'h-4 w-4' }),
        category: 'Employees' as CommandCategory,
        action: options.onAddEmployee,
        keywords: ['add', 'create', 'new', 'employee', 'staff', 'hire', 'onboard'],
      })
    }

    if (options?.onEditEmployee) {
      commands.push({
        id: 'edit-employee',
        label: 'Edit Employee',
        icon: React.createElement(Edit, { className: 'h-4 w-4' }),
        category: 'Employees' as CommandCategory,
        action: options.onEditEmployee,
        keywords: ['edit', 'modify', 'update', 'employee', 'change'],
      })
    }

    return commands
  }, [options?.onAddEmployee, options?.onEditEmployee])
}

/**
 * Hook for werms-related commands
 */
export function useWermsCommands(options?: {
  onGiveWerms?: () => void
  onViewBalance?: () => void
}) {
  return useMemo(() => {
    const commands: CommandAction[] = []

    if (options?.onGiveWerms) {
      commands.push({
        id: 'give-werms',
        label: 'Give Werms',
        icon: React.createElement(DollarSign, { className: 'h-4 w-4' }),
        category: 'Werms' as CommandCategory,
        action: options.onGiveWerms,
        keywords: ['give', 'send', 'transfer', 'werms', 'coins', 'reward', 'pay'],
      })
    }

    if (options?.onViewBalance) {
      commands.push({
        id: 'view-balance',
        label: 'View Balance',
        icon: React.createElement(Search, { className: 'h-4 w-4' }),
        category: 'Werms' as CommandCategory,
        action: options.onViewBalance,
        keywords: ['balance', 'view', 'check', 'werms', 'account', 'wallet'],
      })
    }

    return commands
  }, [options?.onGiveWerms, options?.onViewBalance])
}

/**
 * Hook for auto-registering commands in a component
 */
export function useRegisterCommands(
  providerId: string,
  commands: CommandAction[],
  registerProvider: (provider: CommandProvider) => void,
  unregisterProvider: (providerId: string) => void
) {
  // Use useMemo to prevent recreating the provider object unnecessarily
  const provider = useMemo((): CommandProvider => ({
    id: providerId,
    commands,
    enabled: true,
  }), [providerId, commands])

  useEffect(() => {
    registerProvider(provider)

    return () => {
      unregisterProvider(providerId)
    }
  }, [provider, registerProvider, unregisterProvider, providerId])
}