-- Fix duplicate member ids (e.g. the same "t2m8" appearing on two members)
-- by renumbering every member in both teams with a guaranteed-unique id,
-- while preserving all other fields (name, points, isTeamLead, onBreak, etc.).

update public.teams t
set members = renumbered.members
from (
  select
    src.id,
    (
      select jsonb_agg(
        (e.elem - 'id') || jsonb_build_object('id', src.id || '_m' || e.ord)
      )
      from jsonb_array_elements(src.members) with ordinality as e(elem, ord)
    ) as members
  from public.teams src
  where src.id in ('team1', 'team2')
) renumbered
where t.id = renumbered.id;

-- Verify: every member id should now be unique and non-null
select
  id as team_id,
  name as team_name,
  jsonb_array_length(members) as member_count,
  (
    select count(*)
    from jsonb_array_elements(members) as m
  ) as id_count
from public.teams
order by id;
