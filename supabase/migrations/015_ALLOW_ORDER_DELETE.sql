-- =============================================
-- BrandNest: Allow admins to DELETE orders
-- Run this ENTIRE file in Supabase SQL Editor
-- =============================================
-- Root cause: RLS was enabled on public.orders, but no
-- DELETE policy existed. Supabase therefore blocks every
-- DELETE coming from the browser client (the admin page's
-- "delete order" button did nothing).
-- =============================================

-- 1. Delete policy: any signed-in user who can see the
--    admin dashboard (authenticated) may delete orders.
drop policy if exists "Allow authenticated delete orders" on public.orders;
create policy "Allow authenticated delete orders"
  on public.orders for delete
  to authenticated
  using (true);

-- 2. Ensure authenticated role has the table-level DELETE grant too
grant delete on public.orders to authenticated;

-- 3. Sanity check: make sure RLS is still on (it should be)
--    so anonymous visitors still cannot read/delete orders.
alter table public.orders enable row level security;