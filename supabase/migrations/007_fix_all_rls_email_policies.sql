-- =============================================
-- BrandNest: Comprehensive RLS email-based policies
-- Run in Supabase Dashboard -> SQL Editor (after 006)
-- =============================================
--
-- Updates all RLS policies so that:
-- 1. HR managers only see their assigned candidates/earnings
-- 2. CRM managers only see their assigned clients/earnings
-- 3. Testers only see their assigned projects/earnings
-- 4. Developers only see their assigned projects/earnings
-- 5. Admins can see everything
-- 6. All email comparisons are case-insensitive
-- =============================================

-- =============================================
-- 1. HR_CANDIDATES — restrict select to assigned email
-- =============================================
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

-- =============================================
-- 2. HR_EARNINGS — restrict select to assigned email
-- =============================================
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
-- 3. CRM_CLIENTS — restrict select to assigned email
-- =============================================
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

-- =============================================
-- 4. CRM_EARNINGS — restrict select to assigned email
-- =============================================
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
-- 5. TESTER_PROJECTS — restrict select to assigned email
-- =============================================
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

-- =============================================
-- 6. TESTER_EARNINGS — restrict select to assigned email
-- =============================================
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
-- 7. DEVELOPER_PROJECTS — already fixed in 006, ensure admin can see all
-- =============================================
drop policy if exists "allow_admin_select_all_dev_projects" on public.developer_projects;
create policy "allow_admin_select_all_dev_projects"
  on public.developer_projects for select
  to authenticated
  using (public.is_admin());

-- =============================================
-- 8. DEVELOPER_EARNINGS — already fixed in 006, ensure admin can see all
-- =============================================
drop policy if exists "allow_admin_select_all_dev_earnings" on public.developer_earnings;
create policy "allow_admin_select_all_dev_earnings"
  on public.developer_earnings for select
  to authenticated
  using (public.is_admin());