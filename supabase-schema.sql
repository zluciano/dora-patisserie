-- Dora Patisserie Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Products table
create table products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price decimal(10,2) not null,
  category text not null,
  image_url text,
  available boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Customers table
create table customers (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text,
  phone text,
  address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Orders table
create table orders (
  id uuid default uuid_generate_v4() primary key,
  customer_name text not null,
  customer_phone text,
  customer_email text,
  delivery_address text,
  delivery_date date not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'in_progress', 'ready', 'delivered', 'cancelled')),
  notes text,
  total decimal(10,2) default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Order items table
create table order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) not null,
  product_name text not null,
  quantity integer not null,
  unit_price decimal(10,2) not null,
  subtotal decimal(10,2) not null
);

-- Indexes for better performance
create index idx_orders_delivery_date on orders(delivery_date);
create index idx_orders_status on orders(status);
create index idx_order_items_order_id on order_items(order_id);
create index idx_products_category on products(category);

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger update_products_updated_at before update on products
  for each row execute function update_updated_at_column();

create trigger update_orders_updated_at before update on orders
  for each row execute function update_updated_at_column();

-- Enable Row Level Security (RLS)
alter table products enable row level security;
alter table customers enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- For now, allow all operations (you can restrict later with auth)
create policy "Allow all operations on products" on products for all using (true);
create policy "Allow all operations on customers" on customers for all using (true);
create policy "Allow all operations on orders" on orders for all using (true);
create policy "Allow all operations on order_items" on order_items for all using (true);

-- Sample products (Brazilian Portuguese)
insert into products (name, description, price, category) values
  ('Macaron de Framboesa', 'Delicado macaron com recheio de framboesa', 8.50, 'Macarons'),
  ('Macaron de Pistache', 'Macaron artesanal com pistache siciliano', 9.00, 'Macarons'),
  ('Macaron de Chocolate', 'Macaron com ganache de chocolate belga', 8.50, 'Macarons'),
  ('Bolo de Chocolate', 'Bolo de chocolate com cobertura de brigadeiro', 85.00, 'Bolos'),
  ('Bolo Red Velvet', 'Classico red velvet com cream cheese', 95.00, 'Bolos'),
  ('Bolo de Morango', 'Bolo de baunilha com morangos frescos', 90.00, 'Bolos'),
  ('Croissant Tradicional', 'Croissant folhado amanteigado', 12.00, 'Paes'),
  ('Pain au Chocolat', 'Croissant com recheio de chocolate', 14.00, 'Paes'),
  ('Eclair de Cafe', 'Eclair recheado com creme de cafe', 15.00, 'Doces'),
  ('Tarte de Limao', 'Torta de limao siciliano com merengue', 18.00, 'Tortas');
