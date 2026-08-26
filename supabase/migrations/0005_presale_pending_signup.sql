create table if not exists public.presale_pending_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  password_cipher text not null,
  locale text not null default 'ro',
  stripe_session_id text unique,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists presale_pending_signups_email_idx
  on public.presale_pending_signups (email);

alter table public.presale_pending_signups enable row level security;
revoke all on public.presale_pending_signups from public, anon, authenticated;
grant all on public.presale_pending_signups to service_role;

create or replace function public.activate_presale_account(
  p_purchase_id uuid,
  p_user_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_purchase public.presale_purchases;
begin
  if p_purchase_id is null or p_user_id is null then
    raise exception 'PRESALE_PURCHASE_INVALID';
  end if;

  select * into v_purchase
  from public.presale_purchases
  where id = p_purchase_id
  for update;

  if not found then
    raise exception 'PRESALE_PURCHASE_INVALID';
  end if;

  update public.presale_purchases
    set status = 'registered',
        user_id = p_user_id,
        registered_at = coalesce(registered_at, now())
    where id = v_purchase.id;

  insert into public.profiles (id, email, display_name, lifetime_access)
  values (
    p_user_id,
    v_purchase.email,
    split_part(v_purchase.email, '@', 1),
    true
  )
  on conflict (id) do update
    set lifetime_access = true,
        email = coalesce(public.profiles.email, excluded.email);

  return jsonb_build_object('ok', true, 'email', v_purchase.email);
end;
$$;

revoke all on function public.activate_presale_account(uuid, uuid) from public;
grant execute on function public.activate_presale_account(uuid, uuid) to service_role;
