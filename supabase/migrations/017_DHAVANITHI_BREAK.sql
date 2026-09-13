-- =============================================
-- BrandNest: Dhavanithi on 2-month break
-- Run this ENTIRE file in Supabase SQL Editor
-- =============================================
-- Marks Dhavanithi (Team 2) as on break for 2 months with a
-- live return countdown, exactly like Roshini's existing break.
-- Break state lives in the teams.members JSONB, so it shows on
-- every dashboard (Admin / HR / CRM / Tester / Developer).
-- =============================================

update public.teams
set members = (
  select jsonb_agg(
    case
      when lower(elem->>'name') = 'dhavanithi'
        then elem || '{"onBreak": true, "breakDuration": "2 months", "breakReturnDate": "2026-11-13T00:00:00"}'::jsonb
      else elem
    end
  )
  from jsonb_array_elements(members) as elem
)
where id = 'team2';

-- Verify
select id, name, members from public.teams where id = 'team2';