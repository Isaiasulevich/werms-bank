# Theming System Documentation

## Overview

This project uses a comprehensive theming system built with your extracted color primitives, following shadcn/ui best practices for light and dark mode support.

## Color Primitives

Your color palette has been organized into the following categories:

### Brand Colors
- `--brand-050` to `--brand-1000`: Your primary brand colors (pink/magenta theme)
- Used for: Primary buttons, links, accents, and key brand elements

### Status Colors
- **Red** (`--red-100` to `--red-1000`): Error states, destructive actions
- **Yellow** (`--yellow-100` to `--yellow-1000`): Warning states, pending actions  
- **Green** (`--green-100` to `--green-1000`): Success states, positive actions

### Neutral Colors
- **White** (`--white-050` to `--white-1000`): Light backgrounds, text on dark backgrounds
- **Black** (`--black-050` to `--black-1000`): Dark backgrounds, text on light backgrounds
- **Gray** (`--gray-100` to `--gray-1000`): UI elements, borders, muted content

### Accent Colors
- **Light Blue** (`--brand-alt-light-blue-500`): Secondary accent color
- **Yellow** (`--brand-alt-yellow-500`): Alternative accent color

## Semantic Color System

Following shadcn conventions, colors are mapped to semantic roles:

### Light Mode
- `background`: White (main background)
- `foreground`: Black (main text)
- `primary`: Brand 500 (primary buttons, links)
- `secondary`: Gray 100 (secondary buttons)
- `muted`: Gray 100 (muted backgrounds)
- `accent`: Gray 100 (hover states)
- `destructive`: Red 500 (error/delete actions)
- `border`: Gray 200 (borders and separators)
- `card`: White (card backgrounds)

### Dark Mode
- `background`: Black (main background)
- `foreground`: White (main text)
- `primary`: Brand 400 (primary buttons, links)
- `secondary`: Gray 800 (secondary buttons)
- `muted`: Gray 800 (muted backgrounds)
- `accent`: Gray 800 (hover states)
- `destructive`: Red 400 (error/delete actions)
- `border`: Gray 800 (borders and separators)
- `card`: Gray 900 (card backgrounds)

## Usage Examples

### Using Semantic Colors (Recommended)
```tsx
// These automatically adapt to light/dark mode
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground">
    Primary Button
  </button>
  <div className="bg-card border border-border">
    Card Content
  </div>
</div>
```

### Using Primitive Colors (When Needed)
```tsx
// Direct access to color primitives
<div className="bg-brand-500 text-white">
  Brand Element
</div>
<div className="bg-green-500 text-white">
  Success Message
</div>
```

## Theme Switching

The theme system uses `next-themes` for seamless theme switching:

```tsx
import { useTheme } from "next-themes"

function ThemeExample() {
  const { theme, setTheme } = useTheme()
  
  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      Toggle Theme
    </button>
  )
}
```

## Components

### Theme Toggle Components
- `ThemeToggle`: Full dropdown with light/dark/system options
- `SimpleThemeToggle`: Simple toggle between light and dark

### Theme Provider
The `ThemeProvider` wraps your app and manages theme state:

```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

## Best Practices

1. **Use Semantic Colors**: Always prefer `bg-background`, `text-foreground`, etc. over direct color values
2. **Test Both Modes**: Ensure components work in both light and dark themes
3. **Consistent Contrast**: Use foreground/background pairs for proper contrast
4. **Gradual Adoption**: Can mix semantic and primitive colors during migration

## Available Tailwind Classes

All your color primitives are available as Tailwind classes:

```css
/* Brand colors */
bg-brand-50, bg-brand-100, ..., bg-brand-1000
text-brand-50, text-brand-100, ..., text-brand-1000
border-brand-50, border-brand-100, ..., border-brand-1000

/* Status colors */
bg-red-100, bg-red-200, ..., bg-red-1000
bg-yellow-100, bg-yellow-200, ..., bg-yellow-1000
bg-green-100, bg-green-200, ..., bg-green-1000

/* Neutral colors */
bg-gray-100, bg-gray-200, ..., bg-gray-1000
bg-white-50, bg-white-100, ..., bg-white-1000
bg-black-50, bg-black-100, ..., bg-black-1000

/* Semantic colors (recommended) */
bg-background, bg-foreground
bg-primary, bg-secondary, bg-muted, bg-accent
bg-destructive, bg-border, bg-card
```

## Testing the Theme

Visit the homepage to see the theme toggle in action and view the color palette demo that showcases how colors adapt between light and dark modes.

The system is now fully configured and ready for use throughout your application! 