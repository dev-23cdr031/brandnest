-- =============================================
-- BrandNest: In-App Messages (chat for every dashboard)
-- Run this ENTIRE file in Supabase SQL Editor
-- =============================================
-- Creates a `messages` table so that any authenticated user
-- (admin, HR, CRM, tester, developer, customer) can message
-- any other user. Messages are delivered instantly through
-- Postgres realtime and stored persistently in Supabase.
-- =============================================

-- =============================================
-- 1. MESSAGES TABLE
-- =============================================
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_email text not null,
  recipient_email text not null,
  body text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

comment on table public.messages is 'Private 1-on-1 messages between BrandNest users';

-- Indexes for fast conversation lookups
create index if not exists messages_sender_idx on public.messages (lower(sender_email));
create index if not exists messages_recipient_idx on public.messages (lower(recipient_email));
create index if not exists messages_created_idx on public.messages (created_at desc);

-- =============================================
-- 2. CURRENT USER EMAIL HELPER (idempotent)
--    Same helper used by the other dashboards.
-- =============================================
create or replace function public.current_user_email()
returns text
language sql
security definer
set search_path = public
as $$
  select coalesce(
    (select email from auth.users where id = auth.uid()),
    ''
  );
$$;

grant execute on function public.current_user_email() to authenticated, anon;

-- =============================================
-- 3. ROW LEVEL SECURITY
-- =============================================
alter table public.messages enable row level security;

-- SELECT: you can read a message only if you are the sender or the recipient
drop policy if exists "allow_select_messages" on public.messages;
create policy "allow_select_messages"
  on public.messages for select
  to authenticated
  using (
    lower(sender_email) = lower(public.current_user_email())
    or lower(recipient_email) = lower(public.current_user_email())
  );

-- INSERT: you can only send a message as yourself
drop policy if exists "allow_insert_messages" on public.messages;
create policy "allow_insert_messages"
  on public.messages for insert
  to authenticated
  with check (lower(sender_email) = lower(public.current_user_email()));

-- UPDATE: only the recipient can mark a message as read
drop policy if exists "allow_update_messages" on public.messages;
create policy "allow_update_messages"
  on public.messages for update
  to authenticated
  using (lower(recipient_email) = lower(public.current_user_email()))
  with check (lower(recipient_email) = lower(public.current_user_email()));

-- =============================================
-- 4. GRANTS
-- =============================================
grant select, insert, update on public.messages to authenticated;
grant all on public.messages to service_role;

-- =============================================
-- 5. REALTIME (instant delivery)
-- =============================================
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    begin
      alter publication supabase_realtime add table public.messages;
    exception
      when duplicate_object then null;
    end;
  end if;
end $$;
