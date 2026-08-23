-- =============================================
-- BrandNest: Fix HR RLS policies so HR managers can
-- update the status of tasks assigned to them
-- Run in Supabase Dashboard -> SQL Editor (after 011)
-- =============================================
--
-- Problem: The previous migrations (008/010) restricted
-- hr_candidates and hr_earnings insert/update/delete to
-- admins only. This meant HR managers could VIEW their
-- assigned tasks but could NOT update the status.
--
-- This migration allows:
--   1. HR managers to UPDATE candidates/interviews/earnings
--      assigned to them (by email)
--   2. HR managers to INSERT their own candidates/earnings
--   3. Admins can still do everything
-- =============================================

-- =============================================
-- 1. HR_CANDIDATES
-- =============================================

-- SELECT: admin or assigned HR (already correct, keep)
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

-- INSERT: admin or HR assigning to themselves
drop policy if exists "allow_hr_insert_candidates" on public.hr_candidates;
create policy "allow_hr_insert_candidates"
  on public.hr_candidates for insert
  to authenticated
  with check (
    public.is_admin()
    or lower(assigned_to_email) = lower(coalesce(
      (select email from auth.users where id = auth.uid()),
      ''
    ))
  );

-- UPDATE: admin or HR updating their own assigned candidates
drop policy if exists "allow_hr_update_candidates" on public.hr_candidates;
create policy "allow_hr_update_candidates"
  on public.hr_candidates for update
  to authenticated
  using (
    public.is_admin()
    or lower(assigned_to_email) = lower(coalesce(
      (select email from auth.users where id = auth.uid()),
      ''
    ))
  )
  with check (
    public.is_admin()
    or lower(assigned_to_email) = lower(coalesce(
      (select email from auth.users where id = auth.uid()),
      ''
    ))
  );

-- DELETE: admin only (HR should not delete assignments)
drop policy if exists "allow_hr_delete_candidates" on public.hr_candidates;
create policy "allow_hr_delete_candidates"
  on public.hr_candidates for delete
  to authenticated
  using (public.is_admin());

-- =============================================
-- 2. HR_EARNINGS
-- =============================================

-- SELECT: admin or assigned HR (already correct, keep)
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

-- INSERT: admin or HR assigning to themselves
drop policy if exists "allow_hr_insert_earnings" on public.hr_earnings;
create policy "allow_hr_insert_earnings"
  on public.hr_earnings for insert
  to authenticated
  with check (
    public.is_admin()
    or lower(assigned_to_email) = lower(coalesce(
      (select email from auth.users where id = auth.uid()),
      ''
    ))
  );

-- UPDATE: admin or HR updating their own earnings
drop policy if exists "allow_hr_update_earnings" on public.hr_earnings;
create policy "allow_hr_update_earnings"
  on public.hr_earnings for update
  to authenticated
  using (
    public.is_admin()
    or lower(assigned_to_email) = lower(coalesce(
      (select email from auth.users where id = auth.uid()),
      ''
    ))
  )
  with check (
    public.is_admin()
    or lower(assigned_to_email) = lower(coalesce(
      (select email from auth.users where id = auth.uid()),
      ''
    ))
  );

-- DELETE: admin only (HR should not delete earnings)
drop policy if exists "allow_hr_delete_earnings" on public.hr_earnings;
create policy "allow_hr_delete_earnings"
  on public.hr_earnings for delete
  to authenticated
  using (public.is_admin());

-- =============================================
-- 3. HR_INTERVIEWS
-- =============================================

-- SELECT: admin or assigned HR (already correct, keep)
drop policy if exists "allow_hr_select_interviews_own" on public.hr_interviews;
create policy "allow_hr_select_interviews_own"
  on public.hr_interviews for select
  to authenticated
  using (
    public.is_admin()
    or lower(assigned_to_email) = lower(coalesce(
      (select email from auth.users where id = auth.uid()),
      ''
    ))
  );

-- INSERT: admin or HR assigning to themselves
drop policy if exists "allow_hr_insert_interviews_own" on public.hr_interviews;
create policy "allow_hr_insert_interviews_own"
  on public.hr_interviews for insert
  to authenticated
  with check (
    public.is_admin()
    or lower(assigned_to_email) = lower(coalesce(
      (select email from auth.users where id = auth.uid()),
      ''
    ))
  );

-- UPDATE: admin or HR updating their own interviews
drop policy if exists "allow_hr_update_interviews_own" on public.hr_interviews;
create policy "allow_hr_update_interviews_own"
  on public.hr_interviews for update
  to authenticated
  using (
    public.is_admin()
    or lower(assigned_to_email) = lower(coalesce(
      (select email from auth.users where id = auth.uid()),
      ''
    ))
  )
  with check (
    public.is_admin()
    or lower(assigned_to_email) = lower(coalesce(
      (select email from auth.users where id = auth.uid()),
      ''
    ))
  );

-- DELETE: admin only (HR should not delete interviews)
drop policy if exists "allow_hr_delete_interviews_own" on public.hr_interviews;
create policy "allow_hr_delete_interviews_own"
  on public.hr_interviews for delete
  to authenticated
  using (public.is_admin());