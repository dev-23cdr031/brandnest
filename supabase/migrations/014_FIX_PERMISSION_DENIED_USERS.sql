-- =============================================
-- BrandNest: FIX "permission denied for table users"
-- Run this ENTIRE file in Supabase SQL Editor
-- =============================================
-- Root cause: RLS policies use inline subqueries like
--   (select email from auth.users where id = auth.uid())
-- which fail because authenticated users don't have
-- SELECT permission on auth.users.
--
-- Fix: Create a SECURITY DEFINER helper function that
-- returns the current user's email, and update all
-- RLS policies to use it.
-- =============================================

-- =============================================
-- 1. Create SECURITY DEFINER helper function
-- =============================================
create or replace function public.current_user_email()
returns text
language sql
security definer
set search_path = public
as $$
  select coalesce(
    (select email from auth.users where id = auth.uid()),
    ''
  );
$$;

-- Grant execute to authenticated users
grant execute on function public.current_user_email() to authenticated, anon;

-- =============================================
-- 2. Fix is_admin() function (SECURITY DEFINER already)
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
-- 3. HR_CANDIDATES - Fix all policies
-- =============================================
drop policy if exists "allow_hr_select_candidates" on public.hr_candidates;
create policy "allow_hr_select_candidates"
  on public.hr_candidates for select
  to authenticated
  using (
    public.is_admin()
    or lower(assigned_to_email) = lower(public.current_user_email())
  );

drop policy if exists "allow_hr_insert_candidates" on public.hr_candidates;
create policy "allow_hr_insert_candidates"
  on public.hr_candidates for insert
  to authenticated
  with check (
    public.is_admin()
    or lower(assigned_to_email) = lower(public.current_user_email())
  );

drop policy if exists "allow_hr_update_candidates" on public.hr_candidates;
create policy "allow_hr_update_candidates"
  on public.hr_candidates for update
  to authenticated
  using (
    public.is_admin()
    or lower(assigned_to_email) = lower(public.current_user_email())
  )
  with check (
    public.is_admin()
    or lower(assigned_to_email) = lower(public.current_user_email())
  );

drop policy if exists "allow_hr_delete_candidates" on public.hr_candidates;
create policy "allow_hr_delete_candidates"
  on public.hr_candidates for delete
  to authenticated
  using (public.is_admin());

-- =============================================
-- 4. HR_EARNINGS - Fix all policies
-- =============================================
drop policy if exists "allow_hr_select_earnings" on public.hr_earnings;
create policy "allow_hr_select_earnings"
  on public.hr_earnings for select
  to authenticated
  using (
    public.is_admin()
    or lower(assigned_to_email) = lower(public.current_user_email())
  );

drop policy if exists "allow_hr_insert_earnings" on public.hr_earnings;
create policy "allow_hr_insert_earnings"
  on public.hr_earnings for insert
  to authenticated
  with check (
    public.is_admin()
    or lower(assigned_to_email) = lower(public.current_user_email())
  );

drop policy if exists "allow_hr_update_earnings" on public.hr_earnings;
create policy "allow_hr_update_earnings"
  on public.hr_earnings for update
  to authenticated
  using (
    public.is_admin()
    or lower(assigned_to_email) = lower(public.current_user_email())
  )
  with check (
    public.is_admin()
    or lower(assigned_to_email) = lower(public.current_user_email())
  );

drop policy if exists "allow_hr_delete_earnings" on public.hr_earnings;
create policy "allow_hr_delete_earnings"
  on public.hr_earnings for delete
  to authenticated
  using (public.is_admin());

-- =============================================
-- 5. HR_INTERVIEWS - Fix all policies
-- =============================================
drop policy if exists "allow_hr_select_interviews_own" on public.hr_interviews;
create policy "allow_hr_select_interviews_own"
  on public.hr_interviews for select
  to authenticated
  using (
    public.is_admin()
    or lower(assigned_to_email) = lower(public.current_user_email())
  );

drop policy if exists "allow_hr_insert_interviews_own" on public.hr_interviews;
create policy "allow_hr_insert_interviews_own"
  on public.hr_interviews for insert
  to authenticated
  with check (
    public.is_admin()
    or lower(assigned_to_email) = lower(public.current_user_email())
  );

drop policy if exists "allow_hr_update_interviews_own" on public.hr_interviews;
create policy "allow_hr_update_interviews_own"
  on public.hr_interviews for update
  to authenticated
  using (
    public.is_admin()
    or lower(assigned_to_email) = lower(public.current_user_email())
  )
  with check (
    public.is_admin()
    or lower(assigned_to_email) = lower(public.current_user_email())
  );

drop policy if exists "allow_hr_delete_interviews_own" on public.hr_interviews;
create policy "allow_hr_delete_interviews_own"
  on public.hr_interviews for delete
  to authenticated
  using (public.is_admin());

-- =============================================
-- 6. CRM_CLIENTS - Fix select policy
-- =============================================
drop policy if exists "allow_crm_select_clients" on public.crm_clients;
create policy "allow_crm_select_clients"
  on public.crm_clients for select
  to authenticated
  using (
    public.is_admin()
    or lower(assigned_to_email) = lower(public.current_user_email())
  );

-- =============================================
-- 7. CRM_EARNINGS - Fix select policy
-- =============================================
drop policy if exists "allow_crm_select_earnings" on public.crm_earnings;
create policy "allow_crm_select_earnings"
  on public.crm_earnings for select
  to authenticated
  using (
    public.is_admin()
    or lower(assigned_to_email) = lower(public.current_user_email())
  );

-- =============================================
-- 8. TESTER_PROJECTS - Fix select policy
-- =============================================
drop policy if exists "allow_tester_select_projects" on public.tester_projects;
create policy "allow_tester_select_projects"
  on public.tester_projects for select
  to authenticated
  using (
    public.is_admin()
    or lower(assigned_to_email) = lower(public.current_user_email())
  );

-- =============================================
-- 9. TESTER_EARNINGS - Fix select policy
-- =============================================
drop policy if exists "allow_tester_select_earnings" on public.tester_earnings;
create policy "allow_tester_select_earnings"
  on public.tester_earnings for select
  to authenticated
  using (
    public.is_admin()
    or lower(assigned_to_email) = lower(public.current_user_email())
  );

-- =============================================
-- 10. DEVELOPER_PROJECTS - Fix select policy
-- =============================================
drop policy if exists "allow_dev_select_own_projects" on public.developer_projects;
create policy "allow_dev_select_own_projects"
  on public.developer_projects for select
  to authenticated
  using (
    lower(developer_email) = lower(public.current_user_email())
  );

-- =============================================
-- 11. DEVELOPER_EARNINGS - Fix select policy
-- =============================================
drop policy if exists "allow_dev_select_own_earnings" on public.developer_earnings;
create policy "allow_dev_select_own_earnings"
  on public.developer_earnings for select
  to authenticated
  using (
    lower(developer_email) = lower(public.current_user_email())
  );

-- =============================================
-- 12. GRANT table permissions
-- =============================================
-- Allow authenticated users to read auth.users via the helper function
-- (the function is SECURITY DEFINER so it bypasses RLS)
grant execute on function public.current_user_email() to authenticated;

-- Ensure service_role has full access
grant all on public.hr_candidates to service_role;
grant all on public.hr_earnings to service_role;
grant all on public.hr_interviews to service_role;
grant all on public.crm_clients to service_role;
grant all on public.crm_earnings to service_role;
grant all on public.tester_projects to service_role;
grant all on public.tester_earnings to service_role;
grant all on public.developer_projects to service_role;
grant all on public.developer_earnings to service_role;