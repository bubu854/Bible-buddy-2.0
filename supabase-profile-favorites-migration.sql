-- Run this once in Supabase > SQL Editor > New query for an existing Bible Buddy database.
alter table public.profiles add column if not exists favorite_verse text not null default '';
alter table public.profiles add column if not exists favorite_worship_song text not null default '';
