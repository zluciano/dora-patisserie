-- Update RLS policies for products
-- Keep existing policy for reading (public)
-- Add owner-only policies for mutations

drop policy if exists "Allow all operations on products" on products;

-- Anyone can view available products
create policy "Anyone can view products" on products
  for select using (true);

-- Only owners can insert products
create policy "Owners can insert products" on products
  for insert with check (
    exists (select 1 from profiles where id = auth.uid() and role = 'owner')
  );

-- Only owners can update products
create policy "Owners can update products" on products
  for update using (
    exists (select 1 from profiles where id = auth.uid() and role = 'owner')
  );

-- Only owners can delete products
create policy "Owners can delete products" on products
  for delete using (
    exists (select 1 from profiles where id = auth.uid() and role = 'owner')
  );

-- Update order_items policies
drop policy if exists "Allow all operations on order_items" on order_items;

-- Anyone can view order items (needed for order details)
create policy "Anyone can view order_items" on order_items
  for select using (true);

-- Anyone can insert order items (for creating orders)
create policy "Anyone can insert order_items" on order_items
  for insert with check (true);

-- Owners can update order items
create policy "Owners can update order_items" on order_items
  for update using (
    exists (select 1 from profiles where id = auth.uid() and role = 'owner')
  );

-- Owners can delete order items
create policy "Owners can delete order_items" on order_items
  for delete using (
    exists (select 1 from profiles where id = auth.uid() and role = 'owner')
  );
