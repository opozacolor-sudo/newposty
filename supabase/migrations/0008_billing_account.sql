alter table public.presale_purchases
  add column if not exists immediate_start_consent boolean not null default false;

alter table public.presale_purchases
  add column if not exists refunded_at timestamptz;

alter table public.presale_purchases
  add column if not exists refund_amount_eur integer;

alter table public.presale_purchases
  drop constraint if exists presale_purchases_status_check;

alter table public.presale_purchases
  add constraint presale_purchases_status_check
  check (status in ('paid', 'registered', 'refunded'));

alter table public.presale_purchases
  drop constraint if exists presale_purchases_user_id_fkey;

alter table public.presale_purchases
  add constraint presale_purchases_user_id_fkey
  foreign key (user_id) references auth.users (id) on delete set null;

create table if not exists public.billing_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  email text,
  kind text not null check (kind in ('refund', 'cancel_subscription', 'delete_account')),
  amount_eur integer,
  stripe_refund_id text,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.billing_events enable row level security;
revoke all on public.billing_events from public, anon, authenticated;
grant all on public.billing_events to service_role;
