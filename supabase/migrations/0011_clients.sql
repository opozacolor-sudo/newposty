-- Team/Individual workspaces and per-client social accounts.

alter table public.profiles
  add column if not exists account_kind text not null default 'individual';

alter table public.profiles
  drop constraint if exists profiles_account_kind_check;

alter table public.profiles
  add constraint profiles_account_kind_check
  check (account_kind in ('individual', 'team'));

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create index if not exists clients_user_id_idx on public.clients (user_id);

alter table public.clients enable row level security;

drop policy if exists "clients_all_own" on public.clients;
create policy "clients_all_own"
  on public.clients
  for all
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and char_length(trim(name)) between 1 and 80
  );

alter table public.social_accounts
  add column if not exists client_id uuid references public.clients (id) on delete cascade;

alter table public.conversations
  add column if not exists client_id uuid references public.clients (id) on delete cascade;

alter table public.posts
  add column if not exists client_id uuid references public.clients (id) on delete cascade;

create index if not exists social_accounts_user_client_idx
  on public.social_accounts (user_id, client_id);

create index if not exists conversations_user_client_idx
  on public.conversations (user_id, client_id);

create index if not exists posts_user_client_idx
  on public.posts (user_id, client_id);

revoke all on table public.clients from public, anon, authenticated;
grant select, insert, update, delete on table public.clients to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  kind text;
begin
  kind := lower(coalesce(new.raw_user_meta_data->>'account_kind', 'individual'));
  if kind not in ('individual', 'team') then
    kind := 'individual';
  end if;

  insert into public.profiles (id, email, display_name, account_kind)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(coalesce(new.email, 'user'), '@', 1)),
    kind
  );
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;
