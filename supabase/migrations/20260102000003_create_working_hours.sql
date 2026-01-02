-- Create working_hours table
create table if not exists working_hours (
  id uuid default uuid_generate_v4() primary key,
  day_of_week integer not null check (day_of_week between 0 and 6), -- 0=Sunday
  open_time time,
  close_time time,
  is_closed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table working_hours enable row level security;

-- Anyone can read hours
create policy "Anyone can view hours" on working_hours
  for select using (true);

-- Only owners can modify hours
create policy "Owners can insert hours" on working_hours
  for insert with check (
    exists (select 1 from profiles where id = auth.uid() and role = 'owner')
  );

create policy "Owners can update hours" on working_hours
  for update using (
    exists (select 1 from profiles where id = auth.uid() and role = 'owner')
  );

create policy "Owners can delete hours" on working_hours
  for delete using (
    exists (select 1 from profiles where id = auth.uid() and role = 'owner')
  );

-- Insert default working hours (Mon-Sat open, Sunday closed)
insert into working_hours (day_of_week, open_time, close_time, is_closed) values
  (0, null, null, true),           -- Sunday closed
  (1, '08:00', '18:00', false),    -- Monday
  (2, '08:00', '18:00', false),    -- Tuesday
  (3, '08:00', '18:00', false),    -- Wednesday
  (4, '08:00', '18:00', false),    -- Thursday
  (5, '08:00', '18:00', false),    -- Friday
  (6, '09:00', '14:00', false)     -- Saturday
on conflict do nothing;
