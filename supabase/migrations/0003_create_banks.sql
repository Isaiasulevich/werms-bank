-- Banks, bank supply and scoping policies to a bank
-- Run this in Supabase SQL editor or migrations pipeline

create extension if not exists pgcrypto;

-- Core bank entity
create table if not exists public.banks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  primary_employee_id text references public.employees(id) on delete set null,
  is_default boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at in sync
drop trigger if exists trg_banks_set_updated_at on public.banks;
create trigger trg_banks_set_updated_at
before update on public.banks
for each row
execute function public.set_updated_at();

-- Per-coin supply owned by a bank
-- Uses existing enum public.werm_tier ('gold', 'silver', 'bronze')
create table if not exists public.bank_coin_supply (
  bank_id uuid not null references public.banks(id) on delete cascade,
  werm_type public.werm_tier not null,
  digital_amount integer not null default 0 check (digital_amount >= 0),
  physical_amount integer not null default 0 check (physical_amount >= 0),
  constraint bank_coin_supply_pk primary key (bank_id, werm_type),
  -- Enforce that physical equals digital to guarantee conservation between ledgers
  constraint coin_supply_equal check (digital_amount = physical_amount)
);

-- Scope policies to a bank when needed (null = global)
alter table public.policies
  add column if not exists bank_id uuid references public.banks(id) on delete set null;

create index if not exists idx_policies_bank_id on public.policies (bank_id);

-- RLS
alter table public.banks enable row level security;
alter table public.bank_coin_supply enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'banks' and policyname = 'Allow read to authenticated'
  ) then
    create policy "Allow read to authenticated"
      on public.banks for select
      to authenticated
      using (true);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'bank_coin_supply' and policyname = 'Allow read to authenticated'
  ) then
    create policy "Allow read to authenticated"
      on public.bank_coin_supply for select
      to authenticated
      using (true);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'banks' and policyname = 'Allow write to service role'
  ) then
    create policy "Allow write to service role"
      on public.banks for all
      to service_role
      using (true)
      with check (true);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'bank_coin_supply' and policyname = 'Allow write to service role'
  ) then
    create policy "Allow write to service role"
      on public.bank_coin_supply for all
      to service_role
      using (true)
      with check (true);
  end if;
end $$;

-- Seed a default bank if one does not exist
do $$
declare
  bank_id uuid;
begin
  if not exists (select 1 from public.banks where is_default = true) then
    insert into public.banks (name, slug, is_default)
    values ('Wermi Bank', 'wermi-bank', true)
    returning id into bank_id;
  else
    select id into bank_id from public.banks where is_default = true limit 1;
  end if;

  -- Ensure a system employee exists to represent the bank in existing transaction flows
  if not exists (select 1 from public.employees where id = 'bank') then
    insert into public.employees (
      id, email, name, department, role, avatar_url, slack_username,
      werm_balances, lifetime_earned, created_at, updated_at
    ) values (
      'bank', 'bank@system.local', 'Wermi Bank', null, 'bank', null, null,
      jsonb_build_object('gold', 0, 'silver', 0, 'bronze', 0), '{}'::jsonb, now(), now()
    );
  end if;

  -- Link the bank to its primary employee if not set
  update public.banks b
  set primary_employee_id = coalesce(primary_employee_id, 'bank')
  where b.id = bank_id;

  -- Initialize coin supply rows for all tiers
  insert into public.bank_coin_supply (bank_id, werm_type, digital_amount, physical_amount)
  select bank_id, t, 0, 0
  from unnest(ARRAY['gold','silver','bronze']::public.werm_tier[]) as t
  on conflict do nothing;
end $$;


