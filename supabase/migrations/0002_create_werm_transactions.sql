-- Create table for Werm transaction logs
-- Run this in your Supabase SQL editor or migrations pipeline

create extension if not exists pgcrypto;

create table if not exists public.werm_transactions (
  id uuid primary key default gen_random_uuid(),
  sender_id text references public.employees(id) on delete set null,
  receiver_id text references public.employees(id) on delete set null,
  sender_email text not null,
  receiver_username text not null,
  werm_type text check (werm_type in ('gold','silver','bronze','mixed')),
  amount integer check (amount >= 0),
  value_aud numeric not null default 0,
  total_werms numeric not null default 0,
  breakdown jsonb,
  description text,
  policy_id text,
  source text default 'app',
  status text default 'completed',
  created_at timestamptz not null default now()
);

-- Indexes for common queries
create index if not exists idx_wt_created_at on public.werm_transactions (created_at desc);
create index if not exists idx_wt_receiver on public.werm_transactions (receiver_id);
create index if not exists idx_wt_sender on public.werm_transactions (sender_id);

-- Enable row level security and basic policies
alter table public.werm_transactions enable row level security;

-- Allow authenticated users to read logs
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'werm_transactions' and policyname = 'Allow read to authenticated'
  ) then
    create policy "Allow read to authenticated"
      on public.werm_transactions for select
      to authenticated
      using (true);
  end if;
end $$;

-- Allow service role to insert (handled server-side with service key)
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'werm_transactions' and policyname = 'Allow insert to service role'
  ) then
    create policy "Allow insert to service role"
      on public.werm_transactions for insert
      to service_role
      with check (true);
  end if;
end $$;


