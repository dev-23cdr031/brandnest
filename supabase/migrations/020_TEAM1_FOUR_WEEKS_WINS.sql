-- =============================================
-- BrandNest: Set Team 1 to 4 week wins
-- Run this ENTIRE file in Supabase SQL Editor
-- =============================================
-- 1. Add the weeksWins column if it doesn't exist yet.
-- 2. Set Team 1's weeksWins to 4, and default every other team to 0.
-- Every dashboard (Admin / HR / CRM / Tester / Developer) reads from the same
-- public.teams rows, so this single update reflects everywhere.

-- Step 1: create the column if missing
alter table public.teams
  add column if not exists weeksWins integer default 0;

-- Step 2: Team 1 now has 4 week wins
update public.teams
set weeksWins = 4
where lower(name) in ('team 1', 'team1');

-- Step 3: make sure no other team keeps a stale/other value
update public.teams
set weeksWins = 0
where lower(name) not in ('team 1', 'team1');

-- Verify
select id, name, weeksWins from public.teams order by id;
