-- =============================================
-- BrandNest HR Manager Dashboard Schema
-- Run in Supabase Dashboard -> SQL Editor (after 002)
-- =============================================
--
-- 1. hr_interviews — interview tracking for candidates
-- 2. hr_candidates — candidate assignment records
-- 3. hr_earnings — amount earned records
-- =============================================

-- =============================================
-- 1. HR_INTERVIEWS
-- =============================================
create table if not exists public.hr_interviews (
  id uuid primary key default gen_random_uuid(),
  candidate_name text not null,
  candidate_email text not null default '',
  position text not null default '',
  interview_date date,
  interview_time text not null default '',
  interviewer text not null default '',
  status text not null default 'Scheduled'
    check (status in ('Scheduled', 'In Progress', 'Completed', 'Rejected', 'Selected')),
  notes text not null default '',
  created_at timestamptz not null default now()
);

alter table public.hr_interviews enable row level security;

-- HR Manager can insert interviews
drop policy if exists "allow_hr_insert_interviews" on public.hr_interviews;
create policy "allow_hr_insert_interviews"
  on public.hr_interviews for insert
  to authenticated
  with check (true);

-- HR Manager can update interviews
drop policy if exists "allow_hr_update_interviews" on public.hr_interviews;
create policy "allow_hr_update_interviews"
  on public.hr_interviews for update
  to authenticated
  using (true) with check (true);

-- HR Manager can delete interviews
drop policy if exists "allow_hr_delete_interviews" on public.hr_interviews;
create policy "allow_hr_delete_interviews"
  on public.hr_interviews for delete
  to authenticated
  using (true);

-- HR Manager can select interviews
drop policy if exists "allow_hr_select_interviews" on public.hr_interviews;
create policy "allow_hr_select_interviews"
  on public.hr_interviews for select
  to authenticated
  using (true);

-- =============================================
-- 2. HR_CANDIDATES (Candidate Assignment)
-- =============================================
create table if not exists public.hr_candidates (
  id uuid primary key default gen_random_uuid(),
  candidate_name text not null,
  candidate_email text not null default '',
  assigned_role text not null default '',
  assigned_to text not null default '',
  project text not null default '',
  status text not null default 'Assigned'
    check (status in ('Assigned', 'In Progress', 'Completed', 'On Hold')),
  assigned_at timestamptz not null default now(),
  notes text not null default '',
  created_at timestamptz not null default now()
);

alter table public.hr_candidates enable row level security;

-- HR Manager can insert candidates
drop policy if exists "allow_hr_insert_candidates" on public.hr_candidates;
create policy "allow_hr_insert_candidates"
  on public.hr_candidates for insert
  to authenticated
  with check (true);

-- HR Manager can update candidates
drop policy if exists "allow_hr_update_candidates" on public.hr_candidates;
create policy "allow_hr_update_candidates"
  on public.hr_candidates for update
  to authenticated
  using (true) with check (true);

-- HR Manager can delete candidates
drop policy if exists "allow_hr_delete_candidates" on public.hr_candidates;
create policy "allow_hr_delete_candidates"
  on public.hr_candidates for delete
  to authenticated
  using (true);

-- HR Manager can select candidates
drop policy if exists "allow_hr_select_candidates" on public.hr_candidates;
create policy "allow_hr_select_candidates"
  on public.hr_candidates for select
  to authenticated
  using (true);

-- =============================================
-- 3. HR_EARNINGS (Amount Earned)
-- =============================================
create table if not exists public.hr_earnings (
  id uuid primary key default gen_random_uuid(),
  candidate_name text not null default '',
  project text not null default '',
  amount_earned text not null default '0',
  source text not null default '',
  earned_date date,
  notes text not null default '',
  created_at timestamptz not null default now()
);

alter table public.hr_earnings enable row level security;

-- HR Manager can insert earnings
drop policy if exists "allow_hr_insert_earnings" on public.hr_earnings;
create policy "allow_hr_insert_earnings"
  on public.hr_earnings for insert
  to authenticated
  with check (true);

-- HR Manager can update earnings
drop policy if exists "allow_hr_update_earnings" on public.hr_earnings;
create policy "allow_hr_update_earnings"
  on public.hr_earnings for update
  to authenticated
  using (true) with check (true);

-- HR Manager can delete earnings
drop policy if exists "allow_hr_delete_earnings" on public.hr_earnings;
create policy "allow_hr_delete_earnings"
  on public.hr_earnings for delete
  to authenticated
  using (true);

-- HR Manager can select earnings
drop policy if exists "allow_hr_select_earnings" on public.hr_earnings;
create policy "allow_hr_select_earnings"
  on public.hr_earnings for select
  to authenticated
  using (true);