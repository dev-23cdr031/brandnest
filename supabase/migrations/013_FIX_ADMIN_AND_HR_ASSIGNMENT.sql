-- =============================================
-- BrandNest: COMPLETE FIX - Admin & HR Assignment
-- Run this ENTIRE file in Supabase SQL Editor
-- =============================================
-- This fixes:
-- 1. is_admin() function to check ALL admin emails
-- 2. HR RLS policies so HR managers can view/update their assigned tasks
-- 3. Ensures admin can insert candidates/earnings/interviews
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
-- 2. HR_CANDIDATES - Fix all policies
-- =============================================
drop policy if exists "allow_hr_select_candidates" on public.hr_candidates;
create policy "allow_hr_select_candidates"
  on public.hr_candidates for select
  to authenticated
  using (
    public.is_admin()
    or lower(assigned_to_email) = lower(coalesce(
      (select email from auth.users where id = auth.uid()), ''
    ))
  );

drop policy if exists "allow_hr_insert_candidates" on public.hr_candidates;
create policy "allow_hr_insert_candidates"
  on public.hr_candidates for insert
  to authenticated
  with check (
    public.is_admin()
    or lower(assigned_to_email) = lower(coalesce(
      (select email from auth.users where id = auth.uid()), ''
    ))
  );

drop policy if exists "allow_hr_update_candidates" on public.hr_candidates;
create policy "allow_hr_update_candidates"
  on public.hr_candidates for update
  to authenticated
  using (
    public.is_admin()
    or lower(assigned_to_email) = lower(coalesce(
      (select email from auth.users where id = auth.uid()), ''
    ))
  )
  with check (
    public.is_admin()
    or lower(assigned_to_email) = lower(coalesce(
      (select email from auth.users where id = auth.uid()), ''
    ))
  );

drop policy if exists "allow_hr_delete_candidates" on public.hr_candidates;
create policy "allow_hr_delete_candidates"
  on public.hr_candidates for delete
  to authenticated
  using (public.is_admin());

-- =============================================
-- 3. HR_EARNINGS - Fix all policies
-- =============================================
drop policy if exists "allow_hr_select_earnings" on public.hr_earnings;
create policy "allow_hr_select_earnings"
  on public.hr_earnings for select
  to authenticated
  using (
    public.is_admin()
    or lower(assigned_to_email) = lower(coalesce(
      (select email from auth.users where id = auth.uid()), ''
    ))
  );

drop policy if exists "allow_hr_insert_earnings" on public.hr_earnings;
create policy "allow_hr_insert_earnings"
  on public.hr_earnings for insert
  to authenticated
  with check (
    public.is_admin()
    or lower(assigned_to_email) = lower(coalesce(
      (select email from auth.users where id = auth.uid()), ''
    ))
  );

drop policy if exists "allow_hr_update_earnings" on public.hr_earnings;
create policy "allow_hr_update_earnings"
  on public.hr_earnings for update
  to authenticated
  using (
    public.is_admin()
    or lower(assigned_to_email) = lower(coalesce(
      (select email from auth.users where id = auth.uid()), ''
    ))
  )
  with check (
    public.is_admin()
    or lower(assigned_to_email) = lower(coalesce(
      (select email from auth.users where id = auth.uid()), ''
    ))
  );

drop policy if exists "allow_hr_delete_earnings" on public.hr_earnings;
create policy "allow_hr_delete_earnings"
  on public.hr_earnings for delete
  to authenticated
  using (public.is_admin());

-- =============================================
-- 4. HR_INTERVIEWS - Fix all policies
-- =============================================
drop policy if exists "allow_hr_select_interviews_own" on public.hr_interviews;
create policy "allow_hr_select_interviews_own"
  on public.hr_interviews for select
  to authenticated
  using (
    public.is_admin()
    or lower(assigned_to_email) = lower(coalesce(
      (select email from auth.users where id = auth.uid()), ''
    ))
  );

drop policy if exists "allow_hr_insert_interviews_own" on public.hr_interviews;
create policy "allow_hr_insert_interviews_own"
  on public.hr_interviews for insert
  to authenticated
  with check (
    public.is_admin()
    or lower(assigned_to_email) = lower(coalesce(
      (select email from auth.users where id = auth.uid()), ''
    ))
  );

drop policy if exists "allow_hr_update_interviews_own" on public.hr_interviews;
create policy "allow_hr_update_interviews_own"
  on public.hr_interviews for update
  to authenticated
  using (
    public.is_admin()
    or lower(assigned_to_email) = lower(coalesce(
      (select email from auth.users where id = auth.uid()), ''
    ))
  )
  with check (
    public.is_admin()
    or lower(assigned_to_email) = lower(coalesce(
      (select email from auth.users where id = auth.uid()), ''
    ))
  );

drop policy if exists "allow_hr_delete_interviews_own" on public.hr_interviews;
create policy "allow_hr_delete_interviews_own"
  on public.hr_interviews for delete
  to authenticated
  using (public.is_admin());