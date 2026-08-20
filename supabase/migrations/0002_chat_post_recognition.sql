alter table public.conversations
  add column if not exists skip_confirmation boolean not null default false,
  add column if not exists pending_intent jsonb,
  add column if not exists pending_intent_at timestamptz;

alter table public.messages
  add column if not exists kind text not null default 'text',
  add column if not exists payload jsonb;

create table if not exists public.conversation_media (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  conversation_id uuid references public.conversations (id) on delete cascade,
  url text not null,
  type text not null,
  name text,
  created_at timestamptz not null default now()
);

create index if not exists conversation_media_user_id_idx on public.conversation_media (user_id);
create index if not exists conversation_media_conversation_id_idx on public.conversation_media (conversation_id);

alter table public.conversation_media enable row level security;

drop policy if exists conversation_media_all_own on public.conversation_media;
create policy conversation_media_all_own on public.conversation_media
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.chat_post_actions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  kind text not null default 'create',
  status text not null default 'pending',
  resolved jsonb not null default '{}'::jsonb,
  results jsonb,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists chat_post_actions_user_id_idx on public.chat_post_actions (user_id);
create index if not exists chat_post_actions_status_idx on public.chat_post_actions (status);

alter table public.chat_post_actions enable row level security;

drop policy if exists chat_post_actions_all_own on public.chat_post_actions;
create policy chat_post_actions_all_own on public.chat_post_actions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.post_actions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  conversation_id uuid references public.conversations (id) on delete set null,
  action_id uuid references public.chat_post_actions (id) on delete set null,
  post_id uuid references public.posts (id) on delete set null,
  platform text not null,
  account_id uuid references public.social_accounts (id) on delete set null,
  zernio_post_id text,
  status text not null,
  scheduled_at timestamptz,
  caption text,
  error_code text,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists post_actions_user_id_idx on public.post_actions (user_id);
create index if not exists post_actions_status_idx on public.post_actions (user_id, status, scheduled_at desc);

alter table public.post_actions enable row level security;

drop policy if exists post_actions_all_own on public.post_actions;
create policy post_actions_all_own on public.post_actions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop trigger if exists chat_post_actions_updated_at on public.chat_post_actions;
create trigger chat_post_actions_updated_at before update on public.chat_post_actions
  for each row execute function public.touch_updated_at();

drop trigger if exists post_actions_updated_at on public.post_actions;
create trigger post_actions_updated_at before update on public.post_actions
  for each row execute function public.touch_updated_at();
