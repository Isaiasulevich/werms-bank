# Werms Central Bank 🏦

A Next.js application for managing "Werm" currency transactions with Slack integration and Supabase authentication.

## Features

- 🔐 **Slack OAuth Authentication** - Secure login with Slack (OIDC)
- 💰 **Werm Currency Management** - Track and transfer internal currency
- 👥 **Employee Management** - Manage team members and their balances
- 📊 **Transaction History** - View detailed transaction records
- 🎯 **Policy Management** - Create and manage company policies
- ⚡ **Real-time Updates** - Live balance updates via Supabase
- 📱 **Responsive Design** - Modern UI with Tailwind CSS and shadcn/ui

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Slack OIDC
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Package Manager**: Bun
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Supabase project
- A Slack app with OAuth configured

### Environment Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd worms-bank
   ```

2. **Install dependencies**:
   ```bash
   bun install
   ```

3. **Configure environment variables**:
   Create a `.env.local` file with:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Slack Configuration (for bot functionality)
   SLACK_BOT_USER_OAUTH_TOKEN=your_slack_bot_token
   SLACK_USER_OAUTH_TOKEN=your_slack_user_token
   ```

### Authentication Setup

#### 1. Supabase Configuration

1. **Enable Slack (OIDC) Provider**:
   - Go to your Supabase dashboard → Authentication → Providers
   - Enable "Slack (OIDC)" (not the legacy "Slack" provider)
   - Add your Slack Client ID and Client Secret

2. **Configure Redirect URLs**:
   - Add these patterns to your Supabase Auth settings:
   ```
   http://localhost:3000/**
   http://localhost:3001/**
   https://your-domain.com/**
   https://your-vercel-app.vercel.app/**
   ```

#### 2. Slack App Configuration

1. **Create a Slack App**:
   - Go to [api.slack.com](https://api.slack.com)
   - Create a new app "From scratch"
   - Choose your workspace

2. **Configure OAuth & Permissions**:
   - Go to "OAuth & Permissions"
   - Add redirect URLs:
     ```
     http://localhost:3000/auth/callback
     http://localhost:3001/auth/callback
     https://your-domain.com/auth/callback
     ```
   - Add these OAuth scopes under "User Token Scopes":
     - `profile`
     - `email`
     - `openid`

3. **Get Credentials**:
   - Copy the Client ID and Client Secret to your Supabase settings

### Database Schema

The app uses these main tables:
- `employees` - User profiles and werm balances
- `werm_transactions` - Werm transfer history
- `policies` - Company policies and documents

### Database Migrations

All SQL migrations are kept in `supabase/migrations/`.

You can apply them in either of two ways:

- Supabase SQL Editor
  1. Open your project → SQL → New query
  2. Paste the content of each migration (in order: `0001_...`, then `0002_...`)
  3. Run

- Supabase CLI (recommended for CI)
  1. Install `supabase` CLI
  2. Log in: `supabase login`
  3. Link project: `supabase link --project-ref <your-ref>`
  4. Apply: `supabase db push` (or run files in order)

### Development

1. **Start the development server**:
   ```bash
   bun dev
   ```

2. **Open your browser**:
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Click "Login with Slack" to test OAuth flow

### OAuth Flow Architecture

The Slack OAuth integration uses the following flow:

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│   User clicks   │───▶│    Slack     │───▶│  Supabase   │───▶│  Dashboard   │
│ "Login w/Slack" │    │    OAuth     │    │   Session   │    │   Redirect   │
└─────────────────┘    └──────────────┘    └─────────────┘    └──────────────┘
```

**Key Implementation Details**:

1. **Provider Configuration**: Uses `slack_oidc` (not legacy `slack`)
2. **Server-Side Callback**: `/app/auth/callback/route.ts` handles code exchange
3. **Session Management**: Middleware refreshes sessions automatically
4. **Error Handling**: Proper error pages and logging

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/
│   │   └── callback/       # OAuth callback handling
│   ├── dashboard/          # Main dashboard
│   └── api/               # API routes
├── components/
│   ├── ui/                # shadcn/ui components
│   └── custom/            # Custom components
├── features/              # Feature-based modules
│   ├── employees/
│   ├── policies/
│   └── transactions/
├── lib/
│   ├── supabase/         # Database configuration
│   └── services/         # External service integrations
└── types/                # TypeScript definitions
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
