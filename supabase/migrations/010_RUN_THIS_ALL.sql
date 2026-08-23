-- =============================================
-- BrandNest: RUN THIS ENTIRE FILE IN SUPABASE SQL EDITOR
-- =============================================
-- This is the COMPLETE fix. Copy and paste ALL of this
-- into your Supabase Dashboard -> SQL Editor and click Run.
-- =============================================

-- =============================================
-- 1. FIX is_admin() FUNCTION (check all admin emails)
-- =============================================
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from auth.users
    where id = auth.uid()
      and lower(email) in (
        'devdharrshans.23csd@kongu.edu',
        'divyadharshinis.23csd@kongu.edu',
        'anusreed.23csd@kongu.edu',
        'arvind.23cse@kongu.edu',
        'avaneeshr.23csd@kongu.edu',
        'ishhhu.10@gmail.com'
      )
  );
$$;

-- =============================================
-- 2. ADD assigned_to_email COLUMNS
-- =============================================
alter table public.hr_candidates
  add column if not exists assigned_to_email text not null default '';

alter table public.hr_earnings
  add column if not exists assigned_to_email text not null default '';

alter table public.crm_clients
  add column if not exists assigned_to_email text not null default '';

alter table public.crm_earnings
  add column if not exists assigned_to_email text not null default '';

alter table public.tester_projects
  add column if not exists assigned_to_email text not null default '';

alter table public.tester_earnings
  add column if not exists assigned_to_email text not null default '';

-- =============================================
-- 3. FIX ALL RLS POLICIES
-- =============================================

-- HR_CANDIDATES
drop policy if exists "allow_hr_select_candidates" on public.hr_candidates;
create policy "allow_hr_select_candidates"
  on public.hr_candidates for select
  to authenticated
  using (
    public.is_admin()
    or lower(assigned_to_email) = lower(coalesce(
      (select email from auth.users where id = auth.uid()),
      ''
    ))
  );

drop policy if exists "allow_hr_insert_candidates" on public.hr_candidates;
create policy "allow_hr_insert_candidates"
  on public.hr_candidates for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "allow_hr_update_candidates" on public.hr_candidates;
create policy "allow_hr_update_candidates"
  on public.hr_candidates for update
  to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "allow_hr_delete_candidates" on public.hr_candidates;
create policy "allow_hr_delete_candidates"
  on public.hr_candidates for delete
  to authenticated
  using (public.is_admin());

-- HR_EARNINGS
drop policy if exists "allow_hr_select_earnings" on public.hr_earnings;
create policy "allow_hr_select_earnings"
  on public.hr_earnings for select
  to authenticated
  using (
    public.is_admin()
    or lower(assigned_to_email) = lower(coalesce(
      (select email from auth.users where id = auth.uid()),
      ''
    ))
  );

drop policy if exists "allow_hr_insert_earnings" on public.hr_earnings;
create policy "allow_hr_insert_earnings"
  on public.hr_earnings for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "allow_hr_update_earnings" on public.hr_earnings;
create policy "allow_hr_update_earnings"
  on public.hr_earnings for update
  to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "allow_hr_delete_earnings" on public.hr_earnings;
create policy "allow_hr_delete_earnings"
  on public.hr_earnings for delete
  to authenticated
  using (public.is_admin());

-- CRM_CLIENTS
drop policy if exists "allow_crm_select_clients" on public.crm_clients;
create policy "allow_crm_select_clients"
  on public.crm_clients for select
  to authenticated
  using (
    public.is_admin()
    or lower(assigned_to_email) = lower(coalesce(
      (select email from auth.users where id = auth.uid()),
      ''
    ))
  );

drop policy if exists "allow_crm_insert_clients" on public.crm_clients;
create policy "allow_crm_insert_clients"
  on public.crm_clients for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "allow_crm_update_clients" on public.crm_clients;
create policy "allow_crm_update_clients"
  on public.crm_clients for update
  to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "allow_crm_delete_clients" on public.crm_clients;
create policy "allow_crm_delete_clients"
  on public.crm_clients for delete
  to authenticated
  using (public.is_admin());

-- CRM_EARNINGS
drop policy if exists "allow_crm_select_earnings" on public.crm_earnings;
create policy "allow_crm_select_earnings"
  on public.crm_earnings for select
  to authenticated
  using (
    public.is_admin()
    or lower(assigned_to_email) = lower(coalesce(
      (select email from auth.users where id = auth.uid()),
      ''
    ))
  );

drop policy if exists "allow_crm_insert_earnings" on public.crm_earnings;
create policy "allow_crm_insert_earnings"
  on public.crm_earnings for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "allow_crm_update_earnings" on public.crm_earnings;
create policy "allow_crm_update_earnings"
  on public.crm_earnings for update
  to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "allow_crm_delete_earnings" on public.crm_earnings;
create policy "allow_crm_delete_earnings"
  on public.crm_earnings for delete
  to authenticated
  using (public.is_admin());

-- TESTER_PROJECTS
drop policy if exists "allow_tester_select_projects" on public.tester_projects;
create policy "allow_tester_select_projects"
  on public.tester_projects for select
  to authenticated
  using (
    public.is_admin()
    or lower(assigned_to_email) = lower(coalesce(
      (select email from auth.users where id = auth.uid()),
      ''
    ))
  );

drop policy if exists "allow_tester_insert_projects" on public.tester_projects;
create policy "allow_tester_insert_projects"
  on public.tester_projects for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "allow_tester_update_projects" on public.tester_projects;
create policy "allow_tester_update_projects"
  on public.tester_projects for update
  to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "allow_tester_delete_projects" on public.tester_projects;
create policy "allow_tester_delete_projects"
  on public.tester_projects for delete
  to authenticated
  using (public.is_admin());

-- TESTER_EARNINGS
drop policy if exists "allow_tester_select_earnings" on public.tester_earnings;
create policy "allow_tester_select_earnings"
  on public.tester_earnings for select
  to authenticated
  using (
    public.is_admin()
    or lower(assigned_to_email) = lower(coalesce(
      (select email from auth.users where id = auth.uid()),
      ''
    ))
  );

drop policy if exists "allow_tester_insert_earnings" on public.tester_earnings;
create policy "allow_tester_insert_earnings"
  on public.tester_earnings for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "allow_tester_update_earnings" on public.tester_earnings;
create policy "allow_tester_update_earnings"
  on public.tester_earnings for update
  to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "allow_tester_delete_earnings" on public.tester_earnings;
create policy "allow_tester_delete_earnings"
  on public.tester_earnings for delete
  to authenticated
  using (public.is_admin());

-- DEVELOPER_PROJECTS
drop policy if exists "allow_dev_select_own_projects" on public.developer_projects;
create policy "allow_dev_select_own_projects"
  on public.developer_projects for select
  to authenticated
  using (
    lower(developer_email) = lower(coalesce(
      (select email from auth.users where id = auth.uid()),
      ''
    ))
  );

drop policy if exists "allow_admin_select_all_dev_projects" on public.developer_projects;
create policy "allow_admin_select_all_dev_projects"
  on public.developer_projects for select
  to authenticated
  using (public.is_admin());

drop policy if exists "allow_admin_insert_dev_projects" on public.developer_projects;
create policy "allow_admin_insert_dev_projects"
  on public.developer_projects for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "allow_admin_update_dev_projects" on public.developer_projects;
create policy "allow_admin_update_dev_projects"
  on public.developer_projects for update
  to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "allow_admin_delete_dev_projects" on public.developer_projects;
create policy "allow_admin_delete_dev_projects"
  on public.developer_projects for delete
  to authenticated
  using (public.is_admin());

-- DEVELOPER_EARNINGS
drop policy if exists "allow_dev_select_own_earnings" on public.developer_earnings;
create policy "allow_dev_select_own_earnings"
  on public.developer_earnings for select
  to authenticated
  using (
    lower(developer_email) = lower(coalesce(
      (select email from auth.users where id = auth.uid()),
      ''
    ))
  );

drop policy if exists "allow_admin_select_all_dev_earnings" on public.developer_earnings;
create policy "allow_admin_select_all_dev_earnings"
  on public.developer_earnings for select
  to authenticated
  using (public.is_admin());

drop policy if exists "allow_admin_insert_earnings" on public.developer_earnings;
create policy "allow_admin_insert_earnings"
  on public.developer_earnings for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "allow_admin_update_earnings" on public.developer_earnings;
create policy "allow_admin_update_earnings"
  on public.developer_earnings for update
  to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "allow_admin_delete_earnings" on public.developer_earnings;
create policy "allow_admin_delete_earnings"
  on public.developer_earnings for delete
  to authenticated
  using (public.is_admin());