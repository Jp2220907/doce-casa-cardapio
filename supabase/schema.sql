create table if not exists public.products (
  id bigint primary key,
  name text not null,
  description text not null,
  price numeric(10,2) not null default 0,
  category text not null default 'Bolos',
  image text not null default '🍰',
  active boolean not null default true,
  translations jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.store_settings (
  id text primary key default 'main',
  currency text not null default 'BRL',
  language text not null default 'pt-BR',
  updated_at timestamptz not null default now()
);

insert into public.store_settings (id, currency, language)
values ('main', 'BRL', 'pt-BR')
on conflict (id) do nothing;

alter table public.products enable row level security;
alter table public.store_settings enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create or replace function public.save_catalog(p_products jsonb, p_settings jsonb)
returns void
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
begin
  if jsonb_typeof(p_products) <> 'array' or jsonb_typeof(p_settings) <> 'object' then
    raise exception 'Invalid catalog payload';
  end if;

  delete from public.products p
  where not exists (
    select 1 from jsonb_array_elements(p_products) item
    where (item->>'id')::bigint = p.id
  );

  insert into public.products (id, name, description, price, category, image, active, translations, updated_at)
  select p.id, p.name, p.description, p.price, p.category, p.image, p.active, coalesce(p.translations, '{}'::jsonb), now()
  from jsonb_to_recordset(p_products) as p(
    id bigint, name text, description text, price numeric, category text,
    image text, active boolean, translations jsonb
  )
  on conflict (id) do update set
    name = excluded.name,
    description = excluded.description,
    price = excluded.price,
    category = excluded.category,
    image = excluded.image,
    active = excluded.active,
    translations = excluded.translations,
    updated_at = now();

  insert into public.store_settings (id, currency, language, updated_at)
  values (
    'main',
    coalesce(nullif(p_settings->>'currency', ''), 'BRL'),
    coalesce(nullif(p_settings->>'language', ''), 'pt-BR'),
    now()
  )
  on conflict (id) do update set
    currency = excluded.currency,
    language = excluded.language,
    updated_at = now();
end;
$$;

create table if not exists public.admin_login_attempts (
  ip_hash text primary key,
  window_started_at timestamptz not null default now(),
  attempts integer not null default 0 check (attempts >= 0)
);
alter table public.admin_login_attempts enable row level security;
revoke all on public.admin_login_attempts from anon, authenticated;
grant select, insert, update, delete on public.admin_login_attempts to service_role;

create or replace function public.check_admin_login_limit(p_ip_hash text)
returns boolean
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare current_attempts integer;
begin
  if p_ip_hash is null or length(p_ip_hash) > 128 then
    raise exception 'Invalid IP hash';
  end if;
  delete from public.admin_login_attempts where window_started_at < now() - interval '1 day';
  insert into public.admin_login_attempts (ip_hash, window_started_at, attempts)
  values (p_ip_hash, now(), 1)
  on conflict (ip_hash) do update set
    window_started_at = case
      when public.admin_login_attempts.window_started_at < now() - interval '15 minutes' then now()
      else public.admin_login_attempts.window_started_at end,
    attempts = case
      when public.admin_login_attempts.window_started_at < now() - interval '15 minutes' then 1
      else public.admin_login_attempts.attempts + 1 end
  returning attempts into current_attempts;
  return current_attempts <= 8;
end;
$$;

create or replace function public.reset_admin_login_limit(p_ip_hash text)
returns void
language sql
security invoker
set search_path = public, pg_temp
as $$
  delete from public.admin_login_attempts where ip_hash = p_ip_hash;
$$;

revoke all on function public.save_catalog(jsonb, jsonb) from public, anon, authenticated;
revoke all on function public.check_admin_login_limit(text) from public, anon, authenticated;
revoke all on function public.reset_admin_login_limit(text) from public, anon, authenticated;
grant execute on function public.save_catalog(jsonb, jsonb) to service_role;
grant execute on function public.check_admin_login_limit(text) to service_role;
grant execute on function public.reset_admin_login_limit(text) to service_role;
