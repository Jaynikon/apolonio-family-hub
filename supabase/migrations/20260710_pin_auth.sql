create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique check (username = lower(username)),
  display_name text not null,
  avatar_url text,
  role text not null default 'member' check (role in ('admin','member')),
  active boolean not null default true,
  must_change_pin boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles login list" on public.profiles;
create policy "profiles login list" on public.profiles for select to anon using (active = true);

drop policy if exists "profiles authenticated read" on public.profiles;
create policy "profiles authenticated read" on public.profiles for select to authenticated using (true);

drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create or replace function public.is_family_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin' and active = true); $$;

drop policy if exists "profiles admin update" on public.profiles;
create policy "profiles admin update" on public.profiles for update to authenticated using (public.is_family_admin()) with check (public.is_family_admin());

-- Calendar is private once PIN authentication is enabled.
drop policy if exists "Allow public event viewing" on public.calendar_events;
drop policy if exists "Allow public event creation" on public.calendar_events;
drop policy if exists "Allow public event updates" on public.calendar_events;
drop policy if exists "Allow public event deletion" on public.calendar_events;

create policy "family can view events" on public.calendar_events for select to authenticated using (true);
create policy "family can create events" on public.calendar_events for insert to authenticated with check (true);
create policy "family can update events" on public.calendar_events for update to authenticated using (true) with check (true);
create policy "family can delete events" on public.calendar_events for delete to authenticated using (true);
