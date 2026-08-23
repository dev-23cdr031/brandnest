-- =============================================
-- BrandNest: Fix RLS policies to be case-insensitive
-- Run in Supabase Dashboard -> SQL Editor (after 005)
-- =============================================
--
-- The developer_projects and developer_earnings tables have RLS policies
-- that compare developer_email directly with the auth user's email.
-- This is case-sensitive and can fail if the stored email has different
-- casing than the auth user's email. This migration makes the comparison
-- case-insensitive using lower().
-- =============================================

-- =============================================
-- 1. DEVELOPER_PROJECTS — fix select policy
-- =============================================
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

-- =============================================
-- 2. DEVELOPER_EARNINGS — fix select policy
-- =============================================
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