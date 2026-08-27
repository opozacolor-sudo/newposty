revoke update on table public.profiles from authenticated;
grant update (display_name, brand_name, brand_voice, timezone)
  on table public.profiles to authenticated;

revoke insert on table public.profiles from authenticated;
grant insert (id, email, display_name, brand_name, brand_voice, timezone)
  on table public.profiles to authenticated;

revoke delete on table public.profiles from authenticated;

revoke insert, update, delete on table public.social_accounts from authenticated;
