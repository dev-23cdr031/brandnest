-- =============================================
-- BrandNest: Add assigned_to_email columns
-- Run in Supabase Dashboard -> SQL Editor (after 004)
-- =============================================
--
-- Adds email-based assignment tracking so that when the
-- admin assigns a candidate/client/project, it appears in
-- the respective manager's dashboard.
-- =============================================

-- =============================================
-- 1. HR_CANDIDATES — add assigned_to_email
-- =============================================
alter table public.hr_candidates
  add column if not exists assigned_to_email text not null default '';

-- =============================================
-- 2. HR_EARNINGS — add assigned_to_email
-- =============================================
alter table public.hr_earnings
  add column if not exists assigned_to_email text not null default '';

-- =============================================
-- 3. CRM_CLIENTS — add assigned_to_email
-- =============================================
alter table public.crm_clients
  add column if not exists assigned_to_email text not null default '';

-- =============================================
-- 4. CRM_EARNINGS — add assigned_to_email
-- =============================================
alter table public.crm_earnings
  add column if not exists assigned_to_email text not null default '';

-- =============================================
-- 5. TESTER_PROJECTS — add assigned_to_email
-- =============================================
alter table public.tester_projects
  add column if not exists assigned_to_email text not null default '';

-- =============================================
-- 6. TESTER_EARNINGS — add assigned_to_email
-- =============================================
alter table public.tester_earnings
  add column if not exists assigned_to_email text not null default '';