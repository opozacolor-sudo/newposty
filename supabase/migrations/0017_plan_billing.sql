-- Applied remotely to the newposty Supabase project via MCP.

alter table public.profiles
  add column if not exists stripe_customer_id text unique,
  add column if not exists plan text not null default 'none';

alter table public.profiles
  drop constraint if exists profiles_plan_check;

alter table public.profiles
  add constraint profiles_plan_check
  check (plan in ('none', 'studio', 'promote', 'growth'));

create table if not exists public.billing_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text not null unique,
  stripe_price_id text not null default '',
  lookup_key text not null,
  plan text not null check (plan in ('studio', 'promote', 'growth')),
  status text not null,
  cancel_at_period_end boolean not null default false,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists billing_subscriptions_user_idx
  on public.billing_subscriptions (user_id, status);

create table if not exists public.credit_packs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('image', 'video', 'leads')),
  units_total integer not null,
  units_remaining integer not null,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists credit_packs_user_kind_idx
  on public.credit_packs (user_id, kind, expires_at);

create table if not exists public.plan_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  period_start date not null,
  leads_used integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, period_start)
);

alter table public.billing_events
  drop constraint if exists billing_events_kind_check;

alter table public.billing_events
  add constraint billing_events_kind_check
  check (kind in ('refund', 'cancel_subscription', 'delete_account', 'subscribe', 'pack'));

create or replace function public.protect_plan_fields()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' and (
    new.plan is distinct from old.plan
    or new.stripe_customer_id is distinct from old.stripe_customer_id
  ) then
    if auth.role() is distinct from 'service_role'
      and current_user not in ('postgres', 'supabase_admin') then
      raise exception 'Cannot change plan billing fields';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_plan_fields on public.profiles;
create trigger profiles_protect_plan_fields
  before update on public.profiles
  for each row execute function public.protect_plan_fields();

create or replace function public.consume_credit_pack(p_user_id uuid, p_kind text)
returns table(pack_id uuid, units_remaining integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  select id into v_id
  from public.credit_packs
  where user_id = p_user_id
    and kind = p_kind
    and units_remaining > 0
    and expires_at > now()
  order by expires_at asc
  for update skip locked
  limit 1;

  if v_id is null then
    return;
  end if;

  return query
  update public.credit_packs as packs
  set units_remaining = packs.units_remaining - 1
  where packs.id = v_id
  returning packs.id, packs.units_remaining;
end;
$$;

create or replace function public.refund_credit_pack(p_pack_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.credit_packs
  set units_remaining = units_remaining + 1
  where id = p_pack_id
    and units_remaining < units_total;
end;
$$;

create or replace function public.take_lead_slot(
  p_user_id uuid,
  p_included integer,
  p_period_start date
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_used integer;
  v_pack uuid;
begin
  insert into public.plan_usage (user_id, period_start, leads_used)
  values (p_user_id, p_period_start, 0)
  on conflict (user_id, period_start) do nothing;

  select leads_used into v_used
  from public.plan_usage
  where user_id = p_user_id and period_start = p_period_start
  for update;

  if v_used < p_included then
    update public.plan_usage
      set leads_used = leads_used + 1, updated_at = now()
      where user_id = p_user_id and period_start = p_period_start;
    return 'included';
  end if;

  select id into v_pack
  from public.credit_packs
  where user_id = p_user_id
    and kind = 'leads'
    and units_remaining > 0
    and expires_at > now()
  order by expires_at asc
  for update skip locked
  limit 1;

  if v_pack is null then
    return 'none';
  end if;

  update public.credit_packs
    set units_remaining = units_remaining - 1
    where id = v_pack;
  return 'pack';
end;
$$;

alter table public.billing_subscriptions enable row level security;
alter table public.credit_packs enable row level security;
alter table public.plan_usage enable row level security;

revoke all on table public.billing_subscriptions from public, anon, authenticated;
revoke all on table public.credit_packs from public, anon, authenticated;
revoke all on table public.plan_usage from public, anon, authenticated;

grant select on table public.billing_subscriptions to authenticated;
grant select on table public.credit_packs to authenticated;
grant select on table public.plan_usage to authenticated;

grant all on table public.billing_subscriptions to service_role;
grant all on table public.credit_packs to service_role;
grant all on table public.plan_usage to service_role;

create policy billing_subscriptions_select_own
  on public.billing_subscriptions for select
  using (auth.uid() = user_id);

create policy credit_packs_select_own
  on public.credit_packs for select
  using (auth.uid() = user_id);

create policy plan_usage_select_own
  on public.plan_usage for select
  using (auth.uid() = user_id);

revoke all on function public.protect_plan_fields() from public, anon, authenticated;
revoke all on function public.consume_credit_pack(uuid, text) from public, anon, authenticated;
revoke all on function public.refund_credit_pack(uuid) from public, anon, authenticated;
revoke all on function public.take_lead_slot(uuid, integer, date) from public, anon, authenticated;

grant execute on function public.consume_credit_pack(uuid, text) to service_role;
grant execute on function public.refund_credit_pack(uuid) to service_role;
grant execute on function public.take_lead_slot(uuid, integer, date) to service_role;
