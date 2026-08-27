create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.protect_lifetime_access()
returns trigger
language plpgsql
set search_path = public
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

revoke all on function public.touch_updated_at() from public, anon, authenticated;
revoke all on function public.protect_lifetime_access() from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.record_presale_purchase(text, text, text, integer) from public, anon, authenticated;
revoke all on function public.complete_presale_registration(text, uuid) from public, anon, authenticated;

do $$
begin
  if exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'activate_presale_account'
  ) then
    execute 'revoke all on function public.activate_presale_account(uuid, uuid) from public, anon, authenticated';
  end if;
end $$;

grant execute on function public.record_presale_purchase(text, text, text, integer) to service_role;
grant execute on function public.complete_presale_registration(text, uuid) to service_role;

revoke all on table public.profiles from public, anon, authenticated;
revoke all on table public.social_accounts from public, anon, authenticated;
revoke all on table public.posts from public, anon, authenticated;
revoke all on table public.conversations from public, anon, authenticated;
revoke all on table public.messages from public, anon, authenticated;
revoke all on table public.conversation_media from public, anon, authenticated;
revoke all on table public.chat_post_actions from public, anon, authenticated;
revoke all on table public.post_actions from public, anon, authenticated;
revoke all on table public.contact_messages from public, anon, authenticated;
revoke all on table public.presale_purchases from public, anon, authenticated;
revoke all on table public.presale_registration_tokens from public, anon, authenticated;
revoke all on table public.presale_pending_signups from public, anon, authenticated;
revoke all on table public.presale_waitlist from public, anon, authenticated;
revoke all on table public.billing_events from public, anon, authenticated;

grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.social_accounts to authenticated;
grant select, insert, update, delete on table public.posts to authenticated;
grant select, insert, update, delete on table public.conversations to authenticated;
grant select, insert, update, delete on table public.messages to authenticated;
grant select, insert, update, delete on table public.conversation_media to authenticated;
grant select, insert, update, delete on table public.chat_post_actions to authenticated;
grant select, insert, update, delete on table public.post_actions to authenticated;
grant insert on table public.contact_messages to anon, authenticated;

grant all on table public.presale_purchases to service_role;
grant all on table public.presale_registration_tokens to service_role;
grant all on table public.presale_pending_signups to service_role;
grant all on table public.presale_waitlist to service_role;
grant all on table public.billing_events to service_role;

alter default privileges in schema public revoke all on tables from public, anon, authenticated;
alter default privileges in schema public revoke all on functions from public, anon, authenticated;
alter default privileges in schema public revoke all on sequences from public, anon, authenticated;

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists media_select_public on storage.objects;
drop policy if exists media_select_own on storage.objects;
create policy media_select_own on storage.objects
  for select
  using (
    bucket_id = 'media'
    and (auth.uid())::text = (storage.foldername(name))[1]
  );
