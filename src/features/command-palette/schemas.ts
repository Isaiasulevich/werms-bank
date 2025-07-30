/**
 * Command Palette Schemas
 * 
 * Zod schemas for validating command palette data structures
 * and ensuring type safety across the command system.
 */

import { z } from 'zod'

/**
 * Command category schema
 */
export const commandCategorySchema = z.enum([
  'Navigation',
  'Policies',
  'Employees', 
  'Werms',
  'Settings',
  'Actions'
])

/**
 * Base command action schema (without ReactNode validation)
 */
export const commandActionSchema = z.object({
  id: z.string().min(1, 'Command ID is required'),
  label: z.string().min(1, 'Command label is required'),
  category: commandCategorySchema,
  keywords: z.array(z.string()).optional(),
  shortcut: z.string().optional(),
  disabled: z.boolean().optional(),
})

/**
 * Command provider schema
 */
export const commandProviderSchema = z.object({
  id: z.string().min(1, 'Provider ID is required'),
  enabled: z.boolean().optional().default(true),
})

/**
 * Command palette state schema
 */
export const commandPaletteStateSchema = z.object({
  open: z.boolean(),
  query: z.string(),
})

/**
 * Command registration options schema
 */
export const commandRegistrationOptionsSchema = z.object({
  replace: z.boolean().optional().default(false),
  priority: z.number().int().min(0).optional().default(0),
})

/**
 * Search query schema
 */
export const searchQuerySchema = z.object({
  query: z.string(),
  category: commandCategorySchema.optional(),
  limit: z.number().int().min(1).max(50).optional().default(20),
})

/**
 * Keyboard shortcut schema
 */
export const keyboardShortcutSchema = z.object({
  key: z.string().min(1),
  metaKey: z.boolean().optional(),
  ctrlKey: z.boolean().optional(),
  altKey: z.boolean().optional(),
  shiftKey: z.boolean().optional(),
})

/**
 * Command execution result schema
 */
export const commandExecutionResultSchema = z.object({
  success: z.boolean(),
  commandId: z.string(),
  error: z.string().optional(),
  executedAt: z.date(),
})

// Type exports derived from schemas
export type CommandCategoryType = z.infer<typeof commandCategorySchema>
export type CommandActionData = z.infer<typeof commandActionSchema>
export type CommandProviderData = z.infer<typeof commandProviderSchema>
export type CommandPaletteStateData = z.infer<typeof commandPaletteStateSchema>
export type CommandRegistrationOptions = z.infer<typeof commandRegistrationOptionsSchema>
export type SearchQueryData = z.infer<typeof searchQuerySchema>
export type KeyboardShortcutData = z.infer<typeof keyboardShortcutSchema>
export type CommandExecutionResult = z.infer<typeof commandExecutionResultSchema>