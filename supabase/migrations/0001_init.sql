-- Applied remotely to the newposty Supabase project via MCP.
-- Kept here so the repo documents the schema.

create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  brand_name text,
  brand_voice text,
  timezone text not null default 'UTC',
  zernio_profile_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

create table public.social_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  platform text not null,
  zernio_account_id text not null,
  username text,
  display_name text,
  avatar_url text,
  is_active boolean not null default true,
  connected_at timestamptz not null default now(),
  unique (user_id, zernio_account_id)
);

create index social_accounts_user_id_idx on public.social_accounts (user_id);
alter table public.social_accounts enable row level security;
create policy "social_accounts_all_own" on public.social_accounts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  content text,
  media jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  scheduled_for timestamptz,
  timezone text not null default 'UTC',
  zernio_post_id text,
  platform_results jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index posts_user_id_idx on public.posts (user_id);
create index posts_scheduled_for_idx on public.posts (scheduled_for);
alter table public.posts enable row level security;
create policy "posts_all_own" on public.posts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.conversations enable row level security;
create policy "conversations_all_own" on public.conversations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create index messages_conversation_id_idx on public.messages (conversation_id);
alter table public.messages enable row level security;
create policy "messages_all_own" on public.messages for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media_insert_own" on storage.objects for insert
with check (bucket_id = 'media' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "media_select_public" on storage.objects for select
using (bucket_id = 'media');

create policy "media_delete_own" on storage.objects for delete
using (bucket_id = 'media' and auth.uid()::text = (storage.foldername(name))[1]);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(coalesce(new.email, 'user'), '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.touch_updated_at();

create trigger posts_updated_at before update on public.posts
  for each row execute function public.touch_updated_at();

create trigger conversations_updated_at before update on public.conversations
  for each row execute function public.touch_updated_at();
