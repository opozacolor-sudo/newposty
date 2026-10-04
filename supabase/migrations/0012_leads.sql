-- Lead qualification CRM: triggers, playbooks, threads, qualified contacts.

create table if not exists public.lead_triggers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  client_id uuid references public.clients (id) on delete cascade,
  phrase text not null,
  created_at timestamptz not null default now()
);

create index if not exists lead_triggers_user_idx on public.lead_triggers (user_id, client_id);

create table if not exists public.lead_playbooks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  client_id uuid references public.clients (id) on delete cascade,
  kind text not null default 'auto_credit',
  product_name text,
  product_price numeric,
  debt_ratio numeric not null default 0.4,
  months integer not null default 60,
  cash_factor numeric not null default 0.6,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, client_id, kind)
);

create table if not exists public.lead_threads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  client_id uuid references public.clients (id) on delete cascade,
  source text not null check (source in ('message', 'comment', 'ad')),
  platform text,
  account_id text not null,
  external_id text not null,
  conversation_id text,
  post_id text,
  comment_id text,
  author_name text,
  author_handle text,
  trigger_text text,
  post_context text,
  stage text not null default 'invited',
  answers jsonb not null default '{}'::jsonb,
  transcript jsonb not null default '[]'::jsonb,
  last_external_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, source, account_id, external_id)
);

create index if not exists lead_threads_user_stage_idx on public.lead_threads (user_id, stage);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  client_id uuid references public.clients (id) on delete cascade,
  thread_id uuid references public.lead_threads (id) on delete set null,
  source text not null check (source in ('message', 'comment', 'ad')),
  platform text,
  account_id text,
  full_name text,
  phone text,
  email text,
  trigger_text text,
  transcript jsonb not null default '[]'::jsonb,
  qualification jsonb not null default '{}'::jsonb,
  status text not null default 'new' check (status in ('new', 'contacted', 'dismissed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_user_created_idx on public.leads (user_id, created_at desc);
create index if not exists leads_user_source_idx on public.leads (user_id, source, status);

alter table public.lead_triggers enable row level security;
alter table public.lead_playbooks enable row level security;
alter table public.lead_threads enable row level security;
alter table public.leads enable row level security;

drop policy if exists "lead_triggers_all_own" on public.lead_triggers;
create policy "lead_triggers_all_own" on public.lead_triggers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "lead_playbooks_all_own" on public.lead_playbooks;
create policy "lead_playbooks_all_own" on public.lead_playbooks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "lead_threads_all_own" on public.lead_threads;
create policy "lead_threads_all_own" on public.lead_threads
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "leads_all_own" on public.leads;
create policy "leads_all_own" on public.leads
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

revoke all on table public.lead_triggers from public, anon, authenticated;
revoke all on table public.lead_playbooks from public, anon, authenticated;
revoke all on table public.lead_threads from public, anon, authenticated;
revoke all on table public.leads from public, anon, authenticated;

grant select, insert, update, delete on table public.lead_triggers to authenticated;
grant select, insert, update, delete on table public.lead_playbooks to authenticated;
grant select, insert, update, delete on table public.lead_threads to authenticated;
grant select, insert, update, delete on table public.leads to authenticated;

grant all on table public.lead_triggers to service_role;
grant all on table public.lead_playbooks to service_role;
grant all on table public.lead_threads to service_role;
grant all on table public.leads to service_role;
