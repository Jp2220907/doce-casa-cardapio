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

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;
