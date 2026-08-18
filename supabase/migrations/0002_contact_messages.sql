-- Applied remotely to the newposty Supabase project via MCP.

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

create policy "contact_messages_insert_public"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (
    char_length(trim(name)) between 1 and 200
    and char_length(trim(email)) between 3 and 320
    and char_length(trim(message)) between 1 and 8000
  );

grant insert on table public.contact_messages to anon, authenticated;
