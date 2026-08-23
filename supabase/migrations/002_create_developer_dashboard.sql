-- =============================================
-- BrandNest Developer Dashboard Schema
-- Run in Supabase Dashboard -> SQL Editor (after 001)
-- =============================================
--
-- 1. developer_projects — projects assigned to a developer
-- 2. developer_earnings — payment records / earnings per developer
-- =============================================

create table if not exists public.developer_projects (
  id uuid primary key default gen_random_uuid(),
  developer_email text not null,
  title text not null,
  description text not null default '',
  client text not null default '',
  amount text not null default '0',
  status text not null default 'Assigned'
    check (status in ('Assigned', 'In Progress', 'Completed')),
  deadline date,
  created_at timestamptz not null default now()
);

alter table public.developer_projects enable row level security;

-- Admin can add projects
drop policy if exists "allow_admin_insert_dev_projects" on public.developer_projects;
create policy "allow_admin_insert_dev_projects"
  on public.developer_projects for insert
  to authenticated
  with check (public.is_admin());

-- Admin can edit projects
drop policy if exists "allow_admin_update_dev_projects" on public.developer_projects;
create policy "allow_admin_update_dev_projects"
  on public.developer_projects for update
  to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Admin can delete projects
drop policy if exists "allow_admin_delete_dev_projects" on public.developer_projects;
create policy "allow_admin_delete_dev_projects"
  on public.developer_projects for delete
  to authenticated
  using (public.is_admin());

-- Developer can select only projects assigned to them
drop policy if exists "allow_dev_select_own_projects" on public.developer_projects;
create policy "allow_dev_select_own_projects"
  on public.developer_projects for select
  to authenticated
  using (
    developer_email = coalesce(
      (select email from auth.users where id = auth.uid()),
      ''
    )
  );

-- Admin can select all projects
drop policy if exists "allow_admin_select_all_dev_projects" on public.developer_projects;
create policy "allow_admin_select_all_dev_projects"
  on public.developer_projects for select
  to authenticated
  using (public.is_admin());

-- =============================================
-- 2. DEVELOPER_EARNINGS
-- =============================================
create table if not exists public.developer_earnings (
  id uuid primary key default gen_random_uuid(),
  developer_email text not null,
  project_title text not null default '',
  amount_earned text not null default '0',
  paid boolean not null default false,
  paid_at timestamptz,
  description text not null default '',
  created_at timestamptz not null default now()
);

alter table public.developer_earnings enable row level security;

-- Admin can add earnings
drop policy if exists "allow_admin_insert_earnings" on public.developer_earnings;
create policy "allow_admin_insert_earnings"
  on public.developer_earnings for insert
  to authenticated
  with check (public.is_admin());

-- Admin can update earnings
drop policy if exists "allow_admin_update_earnings" on public.developer_earnings;
create policy "allow_admin_update_earnings"
  on public.developer_earnings for update
  to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Admin can delete earnings
drop policy if exists "allow_admin_delete_earnings" on public.developer_earnings;
create policy "allow_admin_delete_earnings"
  on public.developer_earnings for delete
  to authenticated
  using (public.is_admin());

-- Developer can select only their own earnings
drop policy if exists "allow_dev_select_own_earnings" on public.developer_earnings;
create policy "allow_dev_select_own_earnings"
  on public.developer_earnings for select
  to authenticated
  using (
    developer_email = coalesce(
      (select email from auth.users where id = auth.uid()),
      ''
    )
  );