-- =============================================
-- BrandNest: CONSOLIDATED FIX - Run this entire file in Supabase SQL Editor
-- =============================================
-- This fixes everything needed for email-based assignment distribution:
-- 1. Adds assigned_to_email columns to all tables
-- 2. Fixes all RLS policies to be email-based and case-insensitive
-- 3. Ensures admins can see everything
-- =============================================

-- =============================================
-- PART 1: ADD assigned_to_email COLUMNS
-- =============================================

-- HR_CANDIDATES
alter table public.hr_candidates
  add column if not exists assigned_to_email text not null default '';

-- HR_EARNINGS
alter table public.hr_earnings
  add column if not exists assigned_to_email text not null default '';

-- CRM_CLIENTS
alter table public.crm_clients
  add column if not exists assigned_to_email text not null default '';

-- CRM_EARNINGS
alter table public.crm_earnings
  add column if not exists assigned_to_email text not null default '';

-- TESTER_PROJECTS
alter table public.tester_projects
  add column if not exists assigned_to_email text not null default '';

-- TESTER_EARNINGS
alter table public.tester_earnings
  add column if not exists assigned_to_email text not null default '';

-- =============================================
-- PART 2: FIX RLS POLICIES - HR
-- =============================================

-- HR_CANDIDATES - select only assigned
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

-- HR_EARNINGS - select only assigned
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

-- =============================================
-- PART 3: FIX RLS POLICIES - CRM
-- =============================================

-- CRM_CLIENTS - select only assigned
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

-- CRM_EARNINGS - select only assigned
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

-- =============================================
-- PART 4: FIX RLS POLICIES - TESTER
-- =============================================

-- TESTER_PROJECTS - select only assigned
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

-- TESTER_EARNINGS - select only assigned
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

-- =============================================
-- PART 5: FIX RLS POLICIES - DEVELOPER
-- =============================================

-- DEVELOPER_PROJECTS - select only assigned (case-insensitive)
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

-- DEVELOPER_EARNINGS - select only assigned (case-insensitive)
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

-- =============================================
-- PART 6: ENSURE ADMIN CAN SEE EVERYTHING
-- =============================================

-- Developer projects - admin select all
drop policy if exists "allow_admin_select_all_dev_projects" on public.developer_projects;
create policy "allow_admin_select_all_dev_projects"
  on public.developer_projects for select
  to authenticated
  using (public.is_admin());

-- Developer earnings - admin select all
drop policy if exists "allow_admin_select_all_dev_earnings" on public.developer_earnings;
create policy "allow_admin_select_all_dev_earnings"
  on public.developer_earnings for select
  to authenticated
  using (public.is_admin());

-- =============================================
-- PART 7: ENSURE ADMIN CAN INSERT/UPDATE/DELETE EVERYTHING
-- =============================================

-- HR_CANDIDATES - admin insert/update/delete
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

-- HR_EARNINGS - admin insert/update/delete
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

-- CRM_CLIENTS - admin insert/update/delete
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

-- CRM_EARNINGS - admin insert/update/delete
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

-- TESTER_PROJECTS - admin insert/update/delete
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

-- TESTER_EARNINGS - admin insert/update/delete
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

-- DEVELOPER_PROJECTS - admin insert/update/delete
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

-- DEVELOPER_EARNINGS - admin insert/update/delete
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