-- =============================================
-- BrandNest: Route hr_interviews to a specific HR Manager
-- Run in Supabase Dashboard -> SQL Editor (after 010)
-- =============================================
-- Adds an assigned_to_email column so that when the admin
-- schedules an interview for a specific HR manager, that
-- manager sees the interview on their dashboard.
-- =============================================

-- =============================================
-- 1. HR_INTERVIEWS — add assigned_to_email
-- =============================================
alter table public.hr_interviews
  add column if not exists assigned_to_email text not null default '';

-- =============================================
-- 2. RLS: HR managers only see interviews assigned to them
-- =============================================
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

-- =============================================
-- 3. RLS: admins / HR can still manage interviews
-- =============================================
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

drop policy if exists "allow_hr_delete_interviews_own" on public.hr_interviews;
create policy "allow_hr_delete_interviews_own"
  on public.hr_interviews for delete
  to authenticated
  using (
    public.is_admin()
    or lower(assigned_to_email) = lower(coalesce(
      (select email from auth.users where id = auth.uid()),
      ''
    ))
  );

-- =============================================
-- 4. Remove the old permissive policies (superseded above)
-- =============================================
drop policy if exists "allow_hr_insert_interviews" on public.hr_interviews;
drop policy if exists "allow_hr_update_interviews" on public.hr_interviews;
drop policy if exists "allow_hr_delete_interviews" on public.hr_interviews;
drop policy if exists "allow_hr_select_interviews" on public.hr_interviews;