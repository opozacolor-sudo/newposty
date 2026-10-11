alter table public.profiles
  add column if not exists company_site text,
  add column if not exists contact_phone text,
  add column if not exists contact_email text,
  add column if not exists billing_name text,
  add column if not exists billing_tax_id text,
  add column if not exists billing_address text,
  add column if not exists billing_city text,
  add column if not exists billing_postal_code text,
  add column if not exists billing_country text;

revoke update on table public.profiles from authenticated;
grant update (
  display_name,
  brand_name,
  brand_voice,
  timezone,
  company_site,
  contact_phone,
  contact_email,
  billing_name,
  billing_tax_id,
  billing_address,
  billing_city,
  billing_postal_code,
  billing_country
) on table public.profiles to authenticated;
