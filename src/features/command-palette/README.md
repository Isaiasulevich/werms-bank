# Command Palette Feature

A powerful, keyboard-driven command palette system inspired by tools like Notion, VS Code, and Linear. Provides quick access to actions and navigation throughout the Werms Bank application.

## Overview

The Command Palette is a universal search and action interface that allows users to:
- Navigate quickly between pages
- Execute actions without mouse interaction
- Search commands by keywords
- Access context-specific commands based on current page

### Key Features

- **⌨️ Keyboard-First**: Primary interaction via `Cmd/Ctrl+K`
- **🔍 Smart Search**: Fuzzy search with keyword matching
- **📂 Categorized**: Commands organized by feature area
- **Visual Icons**: Lucide React icons for better UX
- **⚡ Fast Access**: Instant command execution
- **🔌 Extensible**: Easy to add new commands per feature
- **Context-Aware**: Commands register/unregister based on active page

## 🏗️ Architecture

### Components

```
src/features/command-palette/
├── components/
│   ├── CommandPalette.tsx          # Main UI component
│   └── CommandPaletteProvider.tsx  # Global context provider
├── hooks.ts                        # Command management hooks
├── types.ts                        # TypeScript interfaces
├── schemas.ts                      # Zod validation schemas
└── index.ts                        # Public API exports
```

### Component Hierarchy

```
CommandPaletteProvider (Global Context)
└── CommandPalette (Dialog UI)
    ├── CommandInput (Search)
    ├── CommandList
    │   ├── CommandEmpty (No results)
    │   └── CommandGroup (Category)
    │       └── CommandItem (Individual commands)
    │           ├── Icon
    │           ├── Label
    │           └── Shortcut (if available)
```

## Usage

### Basic Setup

The command palette is automatically available throughout the app via the global provider in `layout.tsx`:

```tsx
// src/app/layout.tsx
import { CommandPaletteProvider } from '@/features/command-palette'

export default function RootLayout({ children }) {
  return (
    <CommandPaletteProvider>
      {children}
    </CommandPaletteProvider>
  )
}
```

### Adding Commands to a Page

Use the `useRegisterCommands` hook to add page-specific commands:

```tsx
// Example: src/features/policies/components/PoliciesPage.tsx
import { 
  useCommandPaletteContext, 
  usePolicyCommands, 
  useRegisterCommands 
} from '@/features/command-palette'

export function PoliciesPage() {
  const { registerProvider, unregisterProvider } = useCommandPaletteContext()
  
  // Define memoized callbacks
  const handleAddPolicy = useCallback(() => {
    // Your action logic
  }, [])
  
  // Generate commands for this feature
  const policyCommands = usePolicyCommands({
    onAddPolicy: handleAddPolicy,
  })
  
  // Register commands when component mounts
  useRegisterCommands(
    'policies-page',
    policyCommands,
    registerProvider,
    unregisterProvider
  )
  
  return <div>Your page content</div>
}
```

## Available Command Categories

| Category | Description | Example Commands |
|----------|-------------|------------------|
| **Navigation** | Page navigation | Go to Dashboard, Go to Policies |
| **Policies** | Policy management | Add New Policy, Edit Policy |
| **Employees** | Employee management | Add New Employee, Edit Employee |
| **Werms** | Currency operations | Give Werms, View Balance |
| **Settings** | App configuration | *Future use* |
| **Actions** | Quick actions | *Future use* |

## Command Structure

Each command follows this interface:

```tsx
interface CommandAction {
  id: string                    // Unique identifier
  label: string                 // Display text
  icon: ReactNode              // Lucide React icon
  category: CommandCategory    // Grouping category
  action: () => void | Promise<void>  // Execution function
  keywords?: string[]          // Search keywords
  shortcut?: string           // Display shortcut (e.g., "⌘D")
  disabled?: boolean          // Availability state
}
```

### Example Command

```tsx
{
  id: 'add-policy',
  label: 'Add New Policy',
  icon: React.createElement(Plus, { className: 'h-4 w-4' }),
  category: 'Policies',
  action: () => openAddPolicyDialog(),
  keywords: ['add', 'create', 'new', 'policy', 'rule'],
  shortcut: '⌘N'
}
```

## 🎹 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Open command palette |
| `Escape` | Close command palette |
| `↑/↓ Arrows` | Navigate commands |
| `Enter` | Execute selected command |
| `Type to search` | Filter commands |

## Hooks Reference

### Core Hooks

#### `useCommandPalette()`
Main state management hook for the command palette system.

```tsx
const {
  open,              // boolean: palette open state
  setOpen,           // (open: boolean) => void
  providers,         // CommandProvider[]: registered providers
  registerProvider,  // (provider: CommandProvider) => void
  unregisterProvider,// (id: string) => void
  getAllCommands,    // () => CommandAction[]
  searchCommands     // (query: string) => CommandAction[]
} = useCommandPalette()
```

#### `useRegisterCommands(providerId, commands, registerFn, unregisterFn)`
Automatically registers/unregisters commands when component mounts/unmounts.

```tsx
useRegisterCommands(
  'unique-provider-id',
  commandsArray,
  registerProvider,
  unregisterProvider
)
```

### Feature-Specific Hooks

#### `useNavigationCommands()`
Provides global navigation commands (always available).

#### `usePolicyCommands(options)`
```tsx
const commands = usePolicyCommands({
  onAddPolicy?: () => void,
  onEditPolicy?: () => void
})
```

#### `useEmployeeCommands(options)`
```tsx
const commands = useEmployeeCommands({
  onAddEmployee?: () => void,
  onEditEmployee?: () => void
})
```

#### `useWermsCommands(options)`
```tsx
const commands = useWermsCommands({
  onGiveWerms?: () => void,
  onViewBalance?: () => void
})
```

## 🔍 Search System

The command palette includes intelligent search that matches:

1. **Command label** (exact and partial matches)
2. **Category name** (e.g., typing "policy" shows all policy commands)
3. **Keywords** (additional search terms defined per command)

### Search Examples

| Search Query | Matches |
|--------------|---------|
| "add" | Add New Policy, Add New Employee |
| "nav" | Go to Dashboard, Go to Policies (navigation) |
| "werms" | Give Werms, View Balance |
| "policy create" | Add New Policy (keywords match) |

## UI/UX Features

- **Grouped Display**: Commands organized by category with clear headings
- **Visual Icons**: Each command has a relevant Lucide React icon
- **Keyboard Shortcuts**: Displayed shortcuts for quick reference
- **Empty State**: Helpful message when no commands match search
- **Error Handling**: Failed commands keep dialog open for retry
- **Responsive**: Works on all screen sizes

## 🔒 Type Safety

The feature includes comprehensive TypeScript support:

- **Interfaces**: Full type definitions in `types.ts`
- **Zod Schemas**: Runtime validation in `schemas.ts`
- **Generic Hooks**: Type-safe command registration
- **Strict Categories**: Enforced command categorization

## 🧪 Testing Considerations

When testing components that use the command palette:

1. **Mock the Context**: Provide mock `CommandPaletteProvider`
2. **Test Command Registration**: Verify commands are registered/unregistered properly
3. **Callback Memoization**: Ensure `useCallback` is used for command actions
4. **Keyboard Events**: Test shortcut functionality
5. **Search Functionality**: Verify filtering works correctly

## Performance Optimizations

- **Memoized Callbacks**: All command actions use `useCallback`
- **Memoized Providers**: Command providers are memoized to prevent recreation
- **Lazy Search**: Search only triggers on user input
- **Component Lazy Loading**: Dialog only renders when open
- **Efficient Updates**: Minimal re-renders via careful dependency management

## 🐛 Common Issues & Solutions

### Issue: "Maximum update depth exceeded"
**Cause**: Un-memoized callbacks causing infinite re-renders
**Solution**: Wrap all command callbacks in `useCallback`

```tsx
// ❌ Bad
function handleAction() { /* ... */ }

// ✅ Good  
const handleAction = useCallback(() => { /* ... */ }, [])
```

### Issue: Commands not appearing
**Cause**: Provider not registered or commands have wrong category
**Solution**: Check provider registration and command structure

### Issue: Icons not displaying
**Cause**: Icon not wrapped in React.createElement for `.ts` files
**Solution**: Use `React.createElement(Icon, { className: 'h-4 w-4' })`

## 🔮 Future Enhancements

- **Command History**: Remember frequently used commands
- **Custom Shortcuts**: User-defined keyboard shortcuts
- **Command Arguments**: Commands that accept parameters
- **Fuzzy Search**: More intelligent search algorithm
- **Command Suggestions**: AI-powered command recommendations
- **Theming**: Command palette theme customization
- **Analytics**: Usage tracking and optimization

## 📚 Related Documentation

- [Shadcn/ui Command Component](https://ui.shadcn.com/docs/components/command)
- [Lucide React Icons](https://lucide.dev/guide/packages/lucide-react)
- [React Context Pattern](https://react.dev/reference/react/useContext)
- [Zod Validation](https://zod.dev/)

---

*Built with ❤️ for the Werms Bank application*