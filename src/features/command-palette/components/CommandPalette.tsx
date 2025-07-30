/**
 * Command Palette Component
 * 
 * Main command palette interface using shadcn CommandDialog.
 * Provides keyboard-accessible command execution similar to Notion.
 */

'use client'

import { useState, useEffect } from 'react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command'
import { CommandAction, CommandCategory } from '../types'

interface CommandPaletteProps {
  /** Whether the command palette is open */
  open: boolean
  
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void
  
  /** Available commands to display */
  commands: CommandAction[]
  
  /** Current search query */
  query?: string
  
  /** Callback when query changes */
  onQueryChange?: (query: string) => void
}

/**
 * Group commands by category for organized display
 */
function groupCommandsByCategory(commands: CommandAction[]): Record<CommandCategory, CommandAction[]> {
  const groups: Record<CommandCategory, CommandAction[]> = {
    'Navigation': [],
    'Policies': [],
    'Employees': [],
    'Werms': [],
    'Settings': [],
    'Actions': [],
  }

  commands.forEach(command => {
    if (groups[command.category]) {
      groups[command.category].push(command)
    }
  })

  return groups
}

/**
 * Get category display name for better UX
 */
function getCategoryDisplayName(category: CommandCategory): string {
  switch (category) {
    case 'Navigation':
      return 'Navigate'
    case 'Policies':
      return 'Policies'
    case 'Employees':
      return 'Employees'
    case 'Werms':
      return 'Werms'
    case 'Settings':
      return 'Settings'
    case 'Actions':
      return 'Quick Actions'
    default:
      return category
  }
}

export function CommandPalette({
  open,
  onOpenChange,
  commands,
  query = '',
  onQueryChange,
}: CommandPaletteProps) {
  const [internalQuery, setInternalQuery] = useState('')
  
  // Use internal query if no external query management provided
  const currentQuery = onQueryChange ? query : internalQuery
  const setCurrentQuery = onQueryChange || setInternalQuery

  // Clear query when dialog opens
  useEffect(() => {
    if (open) {
      setCurrentQuery('')
    }
  }, [open, setCurrentQuery])

  // Filter commands based on search query
  const filteredCommands = commands.filter(command => {
    if (!currentQuery.trim()) return true
    
    const searchTerm = currentQuery.toLowerCase()
    
    return (
      command.label.toLowerCase().includes(searchTerm) ||
      command.category.toLowerCase().includes(searchTerm) ||
      command.keywords?.some(keyword => 
        keyword.toLowerCase().includes(searchTerm)
      ) ||
      false
    )
  })

  // Group filtered commands by category
  const groupedCommands = groupCommandsByCategory(filteredCommands)

  // Handle command selection
  const handleSelect = async (command: CommandAction) => {
    try {
      await command.action()
      onOpenChange(false)
    } catch (error) {
      console.error('Error executing command:', error)
      // Keep dialog open on error so user can try again
    }
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Type a command or search..."
        value={currentQuery}
        onValueChange={setCurrentQuery}
      />
      <CommandList>
        <CommandEmpty>
          No commands found for "{currentQuery}"
        </CommandEmpty>
        
        {Object.entries(groupedCommands).map(([category, categoryCommands]) => {
          // Only show groups that have commands
          if (categoryCommands.length === 0) return null
          
          return (
            <CommandGroup 
              key={category} 
              heading={getCategoryDisplayName(category as CommandCategory)}
            >
              {categoryCommands.map((command) => (
                <CommandItem
                  key={command.id}
                  value={`${command.label} ${command.keywords?.join(' ') || ''}`}
                  onSelect={() => handleSelect(command)}
                  disabled={command.disabled}
                >
                  {command.icon}
                  <span>{command.label}</span>
                  {command.shortcut && (
                    <CommandShortcut>{command.shortcut}</CommandShortcut>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )
        })}
      </CommandList>
    </CommandDialog>
  )
}