create or replace function public.protect_lifetime_access()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'UPDATE' and new.lifetime_access is distinct from old.lifetime_access then
    if auth.role() is distinct from 'service_role'
       and current_user not in ('postgres', 'supabase_admin') then
      raise exception 'Cannot change lifetime_access';
    end if;
  end if;
  return new;
end;
$$;

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
