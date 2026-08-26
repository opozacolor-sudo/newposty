create or replace function public.join_presale_waitlist(
  p_email text,
  p_locale text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_email is null or p_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' or char_length(p_email) > 320 then
    raise exception 'PRESALE_EMAIL_REQUIRED';
  end if;

  insert into public.presale_waitlist (email, locale)
  values (
    lower(trim(p_email)),
    case when p_locale in ('en', 'ro') then p_locale else 'ro' end
  )
  on conflict (email) do nothing;

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.join_presale_waitlist(text, text) from public;
grant execute on function public.join_presale_waitlist(text, text) to anon, authenticated, service_role;
