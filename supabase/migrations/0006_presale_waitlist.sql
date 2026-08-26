create table if not exists public.presale_waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  locale text not null default 'ro',
  created_at timestamptz not null default now(),
  constraint presale_waitlist_email_key unique (email)
);

alter table public.presale_waitlist enable row level security;
revoke all on public.presale_waitlist from public, anon, authenticated;
grant all on public.presale_waitlist to service_role;
