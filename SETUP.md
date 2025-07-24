# Project Setup

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
# Get these values from your Supabase project dashboard
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Database URL for local development
# DATABASE_URL=your_database_url

# Optional: Service Role Key (keep this secret, never expose in client)
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Getting Started

1. **Clone and install dependencies:**
   ```bash
   bun install
   ```

2. **Set up Supabase:**
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key to `.env.local`

3. **Run the development server:**
   ```bash
   bun dev
   ```

4. **Generate Supabase types (optional):**
   ```bash
   bunx supabase gen types typescript --project-id your-project-id > src/lib/supabase/generated-types.ts
   ```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages and routing
├── components/
│   └── ui/                # shadcn/ui components (Button, etc.)
├── features/              # Feature-based modules (auth, dashboard, etc.)
├── lib/
│   ├── supabase/         # 🗃️ All database configurations
│   │   ├── index.ts      # Main exports
│   │   ├── client.ts     # Supabase client setup
│   │   ├── auth.ts       # Authentication functions
│   │   ├── queries.ts    # Database queries
│   │   └── types.ts      # Database TypeScript types
│   ├── react-query.ts    # React Query configuration
│   └── utils.ts          # shadcn/ui utilities
├── shared/               # Reusable components and utilities
└── types/                # Global type declarations
```

## Adding shadcn/ui Components

All shadcn/ui components live in `src/components/ui/`. To add new ones:

```bash
bunx shadcn@latest add [component-name]
```

Examples:
```bash
bunx shadcn@latest add card
bunx shadcn@latest add input
bunx shadcn@latest add form
```

## Database Usage

Import everything from the main supabase index:

```typescript
import { supabase, signIn, getUserAccounts } from '@/lib/supabase'

// Use auth functions
const { data, error } = await signIn(email, password)

// Use database queries
const accounts = await getUserAccounts(userId)
``` 