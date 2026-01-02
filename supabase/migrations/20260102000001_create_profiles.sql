-- Create profiles table linked to auth.users
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  phone text unique,
  email text,
  address text,
  role text default 'customer' check (role in ('customer', 'owner')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index if not exists idx_profiles_phone on profiles(phone);
create index if not exists idx_profiles_role on profiles(role);

-- Enable RLS
alter table profiles enable row level security;

-- Users can view their own profile
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- Allow insert for new user signup (triggered by function)
create policy "Allow insert for authenticated users" on profiles
  for insert with check (auth.uid() = id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, phone, email, name)
  values (
    new.id,
    new.phone,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for auto-creating profile on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Trigger for updated_at
create trigger update_profiles_updated_at before update on profiles
  for each row execute function update_updated_at_column();
