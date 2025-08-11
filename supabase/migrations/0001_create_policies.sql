-- Create table for Policies that govern Werm transactions
-- Run this in your Supabase SQL editor or migrations pipeline

create extension if not exists pgcrypto;

-- policies represent rules that back transactions and define allocation logic
create table if not exists public.policies (
  id uuid primary key default gen_random_uuid(),

  -- Basic identification
  title text not null,
  description text not null,

  -- Categorization and lifecycle status
  category text not null check (category in ('distribution','minting','recognition','compliance','performance')),
  status text not null default 'draft' check (status in ('active','inactive','draft')),

  -- Operational semantics
  operation text not null check (operation in ('mint','distribution','burn')),
  execution_mode text not null default 'manual' check (execution_mode in ('manual','automated')),

  -- Targeting for distributions (ignored for mint/burn in v1)
  target_type text not null default 'none' check (target_type in ('none','all','departments','employees')),
  target_values jsonb not null default '[]'::jsonb,
  approval_required boolean not null default false,

  -- Simple fixed rewards allocated by this policy (first version: no complex conditions)
  gold_reward integer not null default 0 check (gold_reward >= 0),
  silver_reward integer not null default 0 check (silver_reward >= 0),
  bronze_reward integer not null default 0 check (bronze_reward >= 0),

  -- Creator metadata
  created_by jsonb not null,

  -- Effectivity window
  effective_at timestamptz not null,
  expires_at timestamptz,

  -- System-owned policy flag
  is_system_policy boolean not null default false,

  -- Arbitrary metadata for extensibility
  metadata jsonb not null default '{}'::jsonb,

  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Require at least one reward to be allocated by the policy
  constraint policies_at_least_one_reward check ((gold_reward + silver_reward + bronze_reward) > 0)
);

-- Indexes for common query patterns
create index if not exists idx_policies_status on public.policies (status);
create index if not exists idx_policies_category on public.policies (category);
create index if not exists idx_policies_operation on public.policies (operation);
create index if not exists idx_policies_execution_mode on public.policies (execution_mode);
create index if not exists idx_policies_target_type on public.policies (target_type);
create index if not exists idx_policies_effective_at on public.policies (effective_at desc);
create index if not exists idx_policies_expires_at on public.policies (expires_at);
create index if not exists idx_policies_metadata_gin on public.policies using gin (metadata);

-- Minimal JSON shape constraints (optional but helpful)

-- Optional: created_by must be an object
alter table public.policies
  add constraint policies_created_by_is_object
  check (jsonb_typeof(created_by) = 'object');

-- Row Level Security and policies
alter table public.policies enable row level security;

-- Allow authenticated users to read policies
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'policies' and policyname = 'Allow read to authenticated'
  ) then
    create policy "Allow read to authenticated"
      on public.policies for select
      to authenticated
      using (true);
  end if;
end $$;

-- Allow service role to insert policies
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'policies' and policyname = 'Allow insert to service role'
  ) then
    create policy "Allow insert to service role"
      on public.policies for insert
      to service_role
      with check (true);
  end if;
end $$;

-- Allow service role to update policies
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'policies' and policyname = 'Allow update to service role'
  ) then
    create policy "Allow update to service role"
      on public.policies for update
      to service_role
      using (true)
      with check (true);
  end if;
end $$;

-- Allow service role to delete policies
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'policies' and policyname = 'Allow delete to service role'
  ) then
    create policy "Allow delete to service role"
      on public.policies for delete
      to service_role
      using (true);
  end if;
end $$;

-- Trigger to keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_policies_set_updated_at on public.policies;
create trigger trg_policies_set_updated_at
before update on public.policies
for each row
execute function public.set_updated_at();


