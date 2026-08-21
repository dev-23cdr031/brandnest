-- =============================================
-- BrandNest Database Schema
-- Run this in Supabase Dashboard -> SQL Editor
-- =============================================

-- =============================================
-- 1. ORDERS table
-- Used by:
--   components/sections/ServicesPricingSection.tsx (insert)
--   app/admin/page.tsx (select, update status)
-- =============================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid
    references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  service text not null,
  price text not null,
  name text not null,
  company text not null default '',
  email text not null,
  phone text not null,
  budget text not null default '',
  details text not null,
  status text not null default 'New'
    check (status in ('New', 'In Progress', 'Completed'))
);

alter table public.orders enable row level security;

-- Anyone (including anonymous visitors) can submit an order
drop policy if exists "Allow anon insert orders" on public.orders;
create policy "Allow anon insert orders"
  on public.orders for insert
  to anon, authenticated
  with check (true);

-- Helper: is the current user the BrandNest admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from auth.users
    where id = auth.uid()
      and email = 'devdharrshans.23csd@kongu.edu'
  );
$$;

-- Customers can view their own orders only
drop policy if exists "Allow users select own orders" on public.orders;
create policy "Allow users select own orders"
  on public.orders for select
  to authenticated
  using (auth.uid() = user_id);

-- Admin can view all orders
drop policy if exists "Allow admin select all orders" on public.orders;
create policy "Allow admin select all orders"
  on public.orders for select
  to authenticated
  using (public.is_admin());

-- Authenticated users (admins) can update order status
drop policy if exists "Allow authenticated update orders" on public.orders;
create policy "Allow authenticated update orders"
  on public.orders for update
  to authenticated
  using (true) with check (true);

-- =============================================
-- 2. TEAMS table
--    Used by: app/admin/teams/page.tsx (select, upsert)
-- =============================================
create table if not exists public.teams (
  id text primary key,
  name text not null,
  color text not null default 'red',
  members jsonb not null default '[]'::jsonb
);

alter table public.teams enable row level security;

-- Read teams
drop policy if exists "Allow anon select teams" on public.teams;
create policy "Allow anon select teams"
  on public.teams for select
  to anon, authenticated
  using (true);

-- Authenticated users (admins) can insert/update (upsert = insert + update)
drop policy if exists "Allow authenticated insert teams" on public.teams;
create policy "Allow authenticated insert teams"
  on public.teams for insert
  to authenticated
  with check (true);

drop policy if exists "Allow authenticated update teams" on public.teams;
create policy "Allow authenticated update teams"
  on public.teams for update
  to authenticated
  using (true) with check (true);
