-- Add user_id column to orders (nullable for guest checkout)
alter table orders add column if not exists user_id uuid references auth.users(id);

-- Create index for user_id lookups
create index if not exists idx_orders_user_id on orders(user_id);

-- Update RLS policies for orders
drop policy if exists "Allow all operations on orders" on orders;

-- Customers can view their own orders
create policy "Customers can view own orders" on orders
  for select using (
    auth.uid() = user_id
    or exists (select 1 from profiles where id = auth.uid() and role = 'owner')
  );

-- Anyone can create orders (guest checkout supported)
create policy "Anyone can create orders" on orders
  for insert with check (true);

-- Owners can update any order, customers can't update
create policy "Owners can update orders" on orders
  for update using (
    exists (select 1 from profiles where id = auth.uid() and role = 'owner')
  );

-- Owners can delete orders
create policy "Owners can delete orders" on orders
  for delete using (
    exists (select 1 from profiles where id = auth.uid() and role = 'owner')
  );
