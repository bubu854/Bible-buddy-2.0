-- Bible Buddy Community: profile table setup
-- Run this entire script in Supabase Dashboard > SQL Editor > New query.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  display_name text,
  bio text,
  is_public boolean not null default false,
  favorite_verse text,
  favorite_worship_song text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists username text;
alter table public.profiles add column if not exists display_name text;
alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists is_public boolean not null default false;
alter table public.profiles add column if not exists favorite_verse text;
alter table public.profiles add column if not exists favorite_worship_song text;
alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

create unique index if not exists profiles_username_lower_unique
  on public.profiles (lower(username))
  where username is not null and username <> '';

alter table public.profiles enable row level security;

drop policy if exists "Users can read own or public profiles" on public.profiles;
create policy "Users can read own or public profiles"
  on public.profiles for select to authenticated
  using (auth.uid() = id or is_public = true);

drop policy if exists "Users can create own profile" on public.profiles;
create policy "Users can create own profile"
  on public.profiles for insert to authenticated
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

grant select, insert, update on public.profiles to authenticated;
