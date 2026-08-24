alter table public.profiles
  add column if not exists lifetime_access boolean not null default false;

create or replace function public.protect_lifetime_access()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'UPDATE' and new.lifetime_access is distinct from old.lifetime_access then
    if auth.role() is distinct from 'service_role' then
      raise exception 'Cannot change lifetime_access';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_lifetime_access on public.profiles;
create trigger profiles_protect_lifetime_access
  before update on public.profiles
  for each row execute function public.protect_lifetime_access();

create table if not exists public.presale_purchases (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  slot_number integer not null unique,
  tranche integer not null,
  price_eur integer not null,
  stripe_customer_id text,
  stripe_payment_intent_id text unique,
  status text not null default 'paid' check (status in ('paid', 'registered')),
  created_at timestamptz not null default now(),
  registered_at timestamptz,
  user_id uuid references auth.users(id)
);

create index if not exists presale_purchases_email_idx on public.presale_purchases (email);
create index if not exists presale_purchases_status_idx on public.presale_purchases (status);

alter table public.presale_purchases enable row level security;

create table if not exists public.presale_registration_tokens (
  id uuid primary key default gen_random_uuid(),
  purchase_id uuid not null references public.presale_purchases(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists presale_registration_tokens_purchase_id_idx
  on public.presale_registration_tokens (purchase_id);

alter table public.presale_registration_tokens enable row level security;

create or replace function public.presale_public_status()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'sold', (
      select count(*)::int
      from public.presale_purchases
      where status in ('paid', 'registered')
    ),
    'byTranche', coalesce((
      select jsonb_object_agg(tranche::text, cnt)
      from (
        select tranche, count(*)::int as cnt
        from public.presale_purchases
        where status in ('paid', 'registered')
        group by tranche
      ) s
    ), '{}'::jsonb)
  );
$$;

revoke all on function public.presale_public_status() from public;
grant execute on function public.presale_public_status() to anon, authenticated;

create or replace function public.record_presale_purchase(
  p_email text,
  p_payment_intent_id text,
  p_stripe_customer_id text,
  p_paid_price_eur integer
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_next_slot integer;
  v_tranche integer;
  v_catalog_price integer;
  v_result public.presale_purchases;
  v_existing public.presale_purchases;
begin
  if p_email is null or length(trim(p_email)) = 0 then
    raise exception 'PRESALE_EMAIL_REQUIRED';
  end if;
  if p_payment_intent_id is null or length(trim(p_payment_intent_id)) = 0 then
    raise exception 'PRESALE_PAYMENT_REQUIRED';
  end if;

  lock table public.presale_purchases in exclusive mode;

  select * into v_existing
  from public.presale_purchases
  where stripe_payment_intent_id = p_payment_intent_id;

  if found then
    return jsonb_build_object(
      'purchase', to_jsonb(v_existing),
      'catalog_price', v_existing.price_eur,
      'price_mismatch', false,
      'replay', true
    );
  end if;

  select coalesce(max(slot_number), 0) + 1 into v_next_slot from public.presale_purchases;

  if v_next_slot > 1500 then
    raise exception 'PRESALE_SOLD_OUT';
  end if;

  select tranche, price_eur into v_tranche, v_catalog_price
  from (values
    (1, 1, 300, 100),
    (2, 301, 600, 150),
    (3, 601, 900, 200),
    (4, 901, 1200, 250),
    (5, 1201, 1500, 300)
  ) as t(tranche, slot_from, slot_to, price)
  where v_next_slot between slot_from and slot_to;

  insert into public.presale_purchases (
    email,
    slot_number,
    tranche,
    price_eur,
    stripe_payment_intent_id,
    stripe_customer_id,
    status
  ) values (
    lower(trim(p_email)),
    v_next_slot,
    v_tranche,
    coalesce(p_paid_price_eur, v_catalog_price),
    p_payment_intent_id,
    nullif(trim(coalesce(p_stripe_customer_id, '')), ''),
    'paid'
  ) returning * into v_result;

  return jsonb_build_object(
    'purchase', to_jsonb(v_result),
    'catalog_price', v_catalog_price,
    'price_mismatch', coalesce(p_paid_price_eur, v_catalog_price) is distinct from v_catalog_price,
    'replay', false
  );
end;
$$;

revoke all on function public.record_presale_purchase(text, text, text, integer) from public;
grant execute on function public.record_presale_purchase(text, text, text, integer) to service_role;

create or replace function public.complete_presale_registration(
  p_token_hash text,
  p_user_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_token public.presale_registration_tokens;
  v_purchase public.presale_purchases;
begin
  if p_token_hash is null or p_user_id is null then
    raise exception 'PRESALE_TOKEN_INVALID';
  end if;

  select * into v_token
  from public.presale_registration_tokens
  where token_hash = p_token_hash
  for update;

  if not found then
    raise exception 'PRESALE_TOKEN_INVALID';
  end if;
  if v_token.used_at is not null then
    raise exception 'PRESALE_TOKEN_USED';
  end if;
  if v_token.expires_at <= now() then
    raise exception 'PRESALE_TOKEN_EXPIRED';
  end if;

  select * into v_purchase
  from public.presale_purchases
  where id = v_token.purchase_id
  for update;

  update public.presale_registration_tokens
    set used_at = now()
    where purchase_id = v_purchase.id
      and used_at is null;

  update public.presale_purchases
    set status = 'registered',
        user_id = p_user_id,
        registered_at = now()
    where id = v_purchase.id;

  update public.profiles
    set lifetime_access = true
    where id = p_user_id;

  return jsonb_build_object('ok', true, 'email', v_purchase.email);
end;
$$;

revoke all on function public.complete_presale_registration(text, uuid) from public;
grant execute on function public.complete_presale_registration(text, uuid) to service_role;
