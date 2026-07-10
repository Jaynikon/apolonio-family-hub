-- Family Hub authentication, profiles, people data, photo storage, and secure calendar access.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default 'Family Member',
  role text not null default 'member' check (role in ('admin', 'member')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Family members can view profiles"
on public.profiles for select
to authenticated
using (true);

create policy "Users can update their profile"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  initial_role text;
begin
  select case when count(*) = 0 then 'admin' else 'member' end
  into initial_role
  from public.profiles;

  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1), 'Family Member'),
    initial_role
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create table if not exists public.people (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  name text not null unique,
  role text not null,
  birthday date not null,
  color text not null,
  photo_url text,
  favorite_foods jsonb not null default '[]'::jsonb,
  favorite_drinks jsonb not null default '[]'::jsonb,
  favorite_snacks jsonb not null default '[]'::jsonb,
  gift_ideas jsonb not null default '[]'::jsonb,
  notes jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.people enable row level security;

create policy "Signed-in family can view people"
on public.people for select
to authenticated
using (true);

create policy "Signed-in family can update people"
on public.people for update
to authenticated
using (true)
with check (true);

insert into public.people (name, role, birthday, color, sort_order)
values
  ('Jason Apolonio', 'Dad', '1975-10-24', 'from-cyan-500 to-blue-600', 1),
  ('Theresa Apolonio', 'Mom', '1980-03-07', 'from-pink-500 to-purple-600', 2),
  ('Brandon Grinder', 'Young Adult', '2008-06-27', 'from-blue-500 to-indigo-600', 3),
  ('Emma Grinder', 'Teen', '2010-02-17', 'from-purple-500 to-fuchsia-600', 4),
  ('Jacob Apolonio', 'Family', '2011-09-21', 'from-emerald-500 to-teal-600', 5),
  ('Andrew Apolonio', 'Family', '2013-03-27', 'from-orange-500 to-amber-600', 6),
  ('Noelle Ray', 'Family', '2011-06-29', 'from-rose-500 to-pink-600', 7),
  ('Autumn Ray', 'Family', '2012-12-28', 'from-amber-500 to-orange-600', 8),
  ('Summer Ray', 'Family', '2014-03-19', 'from-sky-500 to-cyan-600', 9)
on conflict (name) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'family-photos',
  'family-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Signed-in family can upload photos"
on storage.objects for insert
to authenticated
with check (bucket_id = 'family-photos');

create policy "Signed-in family can update photos"
on storage.objects for update
to authenticated
using (bucket_id = 'family-photos')
with check (bucket_id = 'family-photos');

create policy "Signed-in family can delete photos"
on storage.objects for delete
to authenticated
using (bucket_id = 'family-photos');

-- Replace temporary anonymous calendar policies with authenticated access.
drop policy if exists "Allow public event viewing" on public.calendar_events;
drop policy if exists "Allow public event creation" on public.calendar_events;
drop policy if exists "Allow public event updates" on public.calendar_events;
drop policy if exists "Allow public event deletion" on public.calendar_events;

create policy "Signed-in family can view calendar"
on public.calendar_events for select
to authenticated
using (true);

create policy "Signed-in family can create calendar events"
on public.calendar_events for insert
to authenticated
with check (true);

create policy "Signed-in family can update calendar events"
on public.calendar_events for update
to authenticated
using (true)
with check (true);

create policy "Signed-in family can delete calendar events"
on public.calendar_events for delete
to authenticated
using (true);
