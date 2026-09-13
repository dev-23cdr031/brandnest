-- =============================================
-- BrandNest: Update Team 2 members
-- Run this ENTIRE file in Supabase SQL Editor
-- =============================================
-- 1. Remove 'Nadhin' and 'Pushparajan' from Team 2 (keeps existing points
--    of all remaining members intact).
-- 2. Add 'Keerthi' and 'Ranjani' to Team 2.
-- 3. Make 'Ranjani' the Team Lead (and clear the lead flag from everyone else).
--
-- Team changes are stored in the public.teams table (members jsonb), so every
-- dashboard (HR / CRM / Tester / Developer / Admin) reads the same DB rows.
-- =============================================

-- Step 1: remove Nadhin and Pushparajan from Team 2
update public.teams
set members = coalesce((
  select jsonb_agg(elem)
  from jsonb_array_elements(members) as elem
  where lower(elem->>'name') not in ('nadhin', 'pushparajan')
), '[]'::jsonb)
where id = 'team2';

-- Step 2: append Keerthi and Ranjani to Team 2 (skip if they already exist)
update public.teams
set members = members || '[
  {"id": "t2m7", "name": "Keerthi", "points": 0},
  {"id": "t2m8", "name": "Ranjani", "points": 0, "isTeamLead": true}
]'::jsonb
where id = 'team2'
  and not exists (
    select 1 from jsonb_array_elements(members) as elem
    where lower(elem->>'name') = 'keerthi' or lower(elem->>'name') = 'ranjani'
  );

-- Step 3: make Ranjani the Team Lead and clear isTeamLead from all other members
update public.teams
set members = (
  select jsonb_agg(
    case
      when lower(elem->>'name') = 'ranjani' then elem || '{"isTeamLead": true}'::jsonb
      else elem - 'isTeamLead'
    end
  )
  from jsonb_array_elements(members) as elem
)
where id = 'team2';

-- Verify the result
select id, name, members from public.teams order by id;