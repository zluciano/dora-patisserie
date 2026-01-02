-- Fix RLS policies for orders to allow inserts

-- Drop all existing policies on orders
drop policy if exists "Allow all operations on orders" on orders;
drop policy if exists "Anyone can create orders" on orders;
drop policy if exists "Customers can view own orders" on orders;
drop policy if exists "Owners can update orders" on orders;
drop policy if exists "Owners can delete orders" on orders;

-- Create permissive insert policy - allow anyone to create orders
create policy "Anyone can create orders" on orders
  for insert with check (true);

-- Create select policy - customers see own orders, owners see all
create policy "View orders policy" on orders
  for select using (
    user_id = auth.uid()
    or user_id is null
    or exists (select 1 from profiles where id = auth.uid() and role = 'owner')
  );

-- Create update policy - only owners can update
create policy "Update orders policy" on orders
  for update using (
    exists (select 1 from profiles where id = auth.uid() and role = 'owner')
  );

-- Create delete policy - only owners can delete
create policy "Delete orders policy" on orders
  for delete using (
    exists (select 1 from profiles where id = auth.uid() and role = 'owner')
  );

-- Also fix order_items RLS
drop policy if exists "Allow all operations on order_items" on order_items;
drop policy if exists "Anyone can create order items" on order_items;
drop policy if exists "Anyone can view order items" on order_items;
drop policy if exists "Owners can update order items" on order_items;
drop policy if exists "Owners can delete order items" on order_items;

create policy "Anyone can create order items" on order_items
  for insert with check (true);

create policy "Anyone can view order items" on order_items
  for select using (true);

create policy "Owners can modify order items" on order_items
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'owner')
  );
