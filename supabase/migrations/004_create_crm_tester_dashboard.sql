-- =============================================
-- BrandNest CRM & Project Tester Dashboard Schema
-- Run in Supabase Dashboard -> SQL Editor (after 003)
-- =============================================
--
-- 1. crm_clients — client relationship records
-- 2. crm_earnings — amount earned records for CRM
-- 3. tester_projects — project testing assignments
-- 4. tester_earnings — amount earned records for Testers
-- =============================================

-- =============================================
-- 1. CRM_CLIENTS (Client Relationship Management)
-- =============================================
create table if not exists public.crm_clients (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_email text not null default '',
  company text not null default '',
  project text not null default '',
  assigned_to text not null default '',
  status text not null default 'Assigned'
    check (status in ('Assigned', 'In Progress', 'Completed', 'On Hold')),
  assigned_at timestamptz not null default now(),
  notes text not null default '',
  created_at timestamptz not null default now()
);

alter table public.crm_clients enable row level security;

drop policy if exists "allow_crm_insert_clients" on public.crm_clients;
create policy "allow_crm_insert_clients"
  on public.crm_clients for insert
  to authenticated
  with check (true);

drop policy if exists "allow_crm_update_clients" on public.crm_clients;
create policy "allow_crm_update_clients"
  on public.crm_clients for update
  to authenticated
  using (true) with check (true);

drop policy if exists "allow_crm_delete_clients" on public.crm_clients;
create policy "allow_crm_delete_clients"
  on public.crm_clients for delete
  to authenticated
  using (true);

drop policy if exists "allow_crm_select_clients" on public.crm_clients;
create policy "allow_crm_select_clients"
  on public.crm_clients for select
  to authenticated
  using (true);

-- =============================================
-- 2. CRM_EARNINGS (Amount Earned for CRM)
-- =============================================
create table if not exists public.crm_earnings (
  id uuid primary key default gen_random_uuid(),
  client_name text not null default '',
  project text not null default '',
  amount_earned text not null default '0',
  source text not null default '',
  earned_date date,
  notes text not null default '',
  created_at timestamptz not null default now()
);

alter table public.crm_earnings enable row level security;

drop policy if exists "allow_crm_insert_earnings" on public.crm_earnings;
create policy "allow_crm_insert_earnings"
  on public.crm_earnings for insert
  to authenticated
  with check (true);

drop policy if exists "allow_crm_update_earnings" on public.crm_earnings;
create policy "allow_crm_update_earnings"
  on public.crm_earnings for update
  to authenticated
  using (true) with check (true);

drop policy if exists "allow_crm_delete_earnings" on public.crm_earnings;
create policy "allow_crm_delete_earnings"
  on public.crm_earnings for delete
  to authenticated
  using (true);

drop policy if exists "allow_crm_select_earnings" on public.crm_earnings;
create policy "allow_crm_select_earnings"
  on public.crm_earnings for select
  to authenticated
  using (true);

-- =============================================
-- 3. TESTER_PROJECTS (Project Testing Assignments)
-- =============================================
create table if not exists public.tester_projects (
  id uuid primary key default gen_random_uuid(),
  project_name text not null,
  project_type text not null default '',
  assigned_to text not null default '',
  client text not null default '',
  status text not null default 'Assigned'
    check (status in ('Assigned', 'In Progress', 'Testing', 'Completed', 'On Hold')),
  assigned_at timestamptz not null default now(),
  notes text not null default '',
  created_at timestamptz not null default now()
);

alter table public.tester_projects enable row level security;

drop policy if exists "allow_tester_insert_projects" on public.tester_projects;
create policy "allow_tester_insert_projects"
  on public.tester_projects for insert
  to authenticated
  with check (true);

drop policy if exists "allow_tester_update_projects" on public.tester_projects;
create policy "allow_tester_update_projects"
  on public.tester_projects for update
  to authenticated
  using (true) with check (true);

drop policy if exists "allow_tester_delete_projects" on public.tester_projects;
create policy "allow_tester_delete_projects"
  on public.tester_projects for delete
  to authenticated
  using (true);

drop policy if exists "allow_tester_select_projects" on public.tester_projects;
create policy "allow_tester_select_projects"
  on public.tester_projects for select
  to authenticated
  using (true);

-- =============================================
-- 4. TESTER_EARNINGS (Amount Earned for Testers)
-- =============================================
create table if not exists public.tester_earnings (
  id uuid primary key default gen_random_uuid(),
  project_name text not null default '',
  amount_earned text not null default '0',
  source text not null default '',
  earned_date date,
  notes text not null default '',
  created_at timestamptz not null default now()
);

alter table public.tester_earnings enable row level security;

drop policy if exists "allow_tester_insert_earnings" on public.tester_earnings;
create policy "allow_tester_insert_earnings"
  on public.tester_earnings for insert
  to authenticated
  with check (true);

drop policy if exists "allow_tester_update_earnings" on public.tester_earnings;
create policy "allow_tester_update_earnings"
  on public.tester_earnings for update
  to authenticated
  using (true) with check (true);

drop policy if exists "allow_tester_delete_earnings" on public.tester_earnings;
create policy "allow_tester_delete_earnings"
  on public.tester_earnings for delete
  to authenticated
  using (true);

drop policy if exists "allow_tester_select_earnings" on public.tester_earnings;
create policy "allow_tester_select_earnings"
