-- =============================================
-- BrandNest: Fix is_admin() function to check ALL admin emails
-- Run in Supabase Dashboard -> SQL Editor (after 008)
-- =============================================
--
-- The original is_admin() function only checks for one admin email.
-- This updates it to check all admin emails from lib/roles.ts.
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