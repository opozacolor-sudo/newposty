alter table public.conversations
  add column if not exists video_job jsonb;
