/**
 * Command Palette Feature
 * 
 * Barrel export for the command palette feature module.
 * Provides a clean API for importing command palette functionality.
 */

// Components
export { CommandPalette } from './components/CommandPalette'
export { CommandPaletteProvider, useCommandPaletteContext } from './components/CommandPaletteProvider'

// Hooks
export {
  useCommandPalette,
  useCommandPaletteShortcuts,
  useNavigationCommands,
  usePolicyCommands,
  useEmployeeCommands,
  useWermsCommands,
  useRegisterCommands,
} from './hooks'

// Types
export type {
  CommandAction,
  CommandCategory,
  CommandProvider,
  CommandPaletteState,
  CommandPaletteContextType,
  CommandRegistrationOptions,
} from './types'

// Schemas
export {
  commandCategorySchema,
  commandActionSchema,
  commandProviderSchema,
  commandPaletteStateSchema,
  commandRegistrationOptionsSchema,
  searchQuerySchema,
  keyboardShortcutSchema,
  commandExecutionResultSchema,
} from './schemas'

export type {
  CommandCategoryType,
  CommandActionData,
  CommandProviderData,
  CommandPaletteStateData,
  SearchQueryData,
  KeyboardShortcutData,
  CommandExecutionResult,
} from './schemas'