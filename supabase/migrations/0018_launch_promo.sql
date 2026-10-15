-- Applied remotely to the newposty Supabase project via MCP.

alter table public.profiles
  add column if not exists promo_until timestamptz;

create or replace function public.protect_plan_fields()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' and (
    new.plan is distinct from old.plan
    or new.stripe_customer_id is distinct from old.stripe_customer_id
    or new.promo_until is distinct from old.promo_until
  ) then
    if auth.role() is distinct from 'service_role'
      and current_user not in ('postgres', 'supabase_admin') then
      raise exception 'Cannot change plan billing fields';
    end if;
  end if;
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  kind text;
  promo_end timestamptz := timestamptz '2026-11-15 21:59:59+00';
begin
  kind := lower(coalesce(new.raw_user_meta_data->>'account_kind', 'individual'));
  if kind not in ('individual', 'team') then
    kind := 'individual';
  end if;

  insert into public.profiles (id, email, display_name, account_kind, promo_until)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(coalesce(new.email, 'user'), '@', 1)),
    kind,
    case when now() < promo_end then promo_end else null end
  );

  if now() < promo_end then
    insert into public.credit_packs (
      user_id, kind, units_total, units_remaining, stripe_checkout_session_id, expires_at
    ) values
      (new.id, 'image', 15, 15, 'promo-nov2026-image-' || new.id::text, promo_end),
      (new.id, 'video', 15, 15, 'promo-nov2026-video-' || new.id::text, promo_end)
    on conflict (stripe_checkout_session_id) do nothing;
  end if;

  return new;
end;
$$;
