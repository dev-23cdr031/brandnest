-- =============================================
-- BrandNest Database Schema
-- Run this in Supabase Dashboard -> SQL Editor
-- =============================================

-- =============================================
-- 1. ORDERS table
-- Used by: components/sections/ServicesPricingSection.tsx (insert)
--          app/admin/page.tsx (select, update status)
-- =============================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
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

-- Anyone (visitors) can submit an order
create policy "Allow anon insert orders"
  on public.orders for insert
  to anon, authenticated
  with check (true);

-- Admins (authenticated) can view orders
create policy "Allow anon select orders"
  on public.orders for select
  to anon, authenticated
  using (true);

-- Admins (authenticated) can update order status
create policy "Allow authenticated update orders"
  on public.orders for update
  to authenticated
  using (true) with check (true);

-- =============================================
-- 2. TEAMS table
-- Used by: app/admin/teams/page.tsx (select, upsert)
-- =============================================
create table if not exists public.teams (
  id text primary key,
  name text not null,
  color text not null default 'red',
  members jsonb not null default '[]'::jsonb
);

alter table public.teams enable row level security;

-- Read teams
create policy "Allow anon select teams"
  on public.teams for select
  to anon, authenticated
  using (true);

-- Admins (authenticated) can upsert teams
create policy "Allow authenticated upsert teams"
  on public.teams for upsert
  to authenticated
  using (true) with check (true);