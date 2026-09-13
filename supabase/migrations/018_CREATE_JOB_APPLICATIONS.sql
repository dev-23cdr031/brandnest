-- =============================================
-- BrandNest: Job Applications (Careers page)
-- Run this ENTIRE file in Supabase SQL Editor
-- =============================================
-- Stores applications submitted from the public /careers
-- "Apply Now" form. Anyone (anon) can submit; signed-in
-- team members (admin/HR) can view and manage them.
-- =============================================

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),

  -- Personal details
  full_name text not null,
  email text not null,
  phone text not null default '',

  -- Education & background
  college_company text not null default '',
  qualification text not null default '',
  graduation_year text not null default '',
  experience_level text not null default 'Fresher',
  years_experience text not null default '0',
  skills text not null default '',

  -- Role applied for
  position text not null default '',
  job_type text not null default 'Full-time',
  work_location text not null default 'Remote',

  -- Links
  resume_url text not null default '',
  portfolio_url text not null default '',
  github_url text not null default '',
  linkedin_url text not null default '',

  -- Preferences & message
  available_from date,
  cover_letter text not null default '',
  heard_from text not null default '',

  -- Pipeline
  status text not null default 'New'
    check (status in ('New', 'Screening', 'Task Round', 'Interview', 'Offered', 'Hired', 'Rejected')),
  notes text not null default ''
);

alter table public.job_applications enable row level security;

-- Anyone (including anonymous visitors) can submit an application
drop policy if exists "allow_anon_insert_job_applications" on public.job_applications;
create policy "allow_anon_insert_job_applications"
  on public.job_applications for insert
  to anon, authenticated
  with check (true);

-- Signed-in team members (admin / HR) can view all applications
drop policy if exists "allow_authenticated_select_job_applications" on public.job_applications;
create policy "allow_authenticated_select_job_applications"
  on public.job_applications for select
  to authenticated
  using (true);

-- Signed-in team members can update the pipeline status
drop policy if exists "allow_authenticated_update_job_applications" on public.job_applications;
create policy "allow_authenticated_update_job_applications"
  on public.job_applications for update
  to authenticated
  using (true) with check (true);

-- Signed-in team members can delete applications
drop policy if exists "allow_authenticated_delete_job_applications" on public.job_applications;
create policy "allow_authenticated_delete_job_applications"
  on public.job_applications for delete
  to authenticated
  using (true);

-- Useful indexes
create index if not exists job_applications_status_idx on public.job_applications (status);
create index if not exists job_applications_created_at_idx on public.job_applications (created_at desc);