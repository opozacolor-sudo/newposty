-- Per-client trained lead agent: site knowledge, enable switch, click tracking.

create table if not exists public.lead_agents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  client_id uuid references public.clients (id) on delete cascade,
  site_url text,
  knowledge jsonb not null default '{}'::jsonb,
  trained_at timestamptz,
  enabled boolean not null default false,
  addon_status text not null default 'unsubscribed'
    check (addon_status in ('unsubscribed', 'active', 'canceled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lead_agents_user_idx on public.lead_agents (user_id, client_id);
create index if not exists lead_agents_enabled_idx on public.lead_agents (enabled, trained_at);

create table if not exists public.lead_clicks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  client_id uuid references public.clients (id) on delete cascade,
  thread_id uuid references public.lead_threads (id) on delete set null,
  lead_id uuid references public.leads (id) on delete set null,
  url text not null,
  created_at timestamptz not null default now()
);

create index if not exists lead_clicks_thread_idx on public.lead_clicks (thread_id, created_at desc);

alter table public.lead_agents enable row level security;
alter table public.lead_clicks enable row level security;

drop policy if exists "lead_agents_all_own" on public.lead_agents;
create policy "lead_agents_all_own" on public.lead_agents
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "lead_clicks_all_own" on public.lead_clicks;
create policy "lead_clicks_all_own" on public.lead_clicks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

revoke all on table public.lead_agents from public, anon, authenticated;
revoke all on table public.lead_clicks from public, anon, authenticated;

grant select, insert, update, delete on table public.lead_agents to authenticated;
grant select, insert, update, delete on table public.lead_clicks to authenticated;

grant all on table public.lead_agents to service_role;
grant all on table public.lead_clicks to service_role;
