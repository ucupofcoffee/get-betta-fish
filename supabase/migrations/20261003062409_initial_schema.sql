-- =========================================================
-- GET BETTA FISH
-- Initial Database Schema
-- =========================================================

create extension if not exists pgcrypto;

-- =========================================================
-- ENUMS
-- =========================================================

create type public.admin_role as enum (
  'OWNER',
  'ADMIN'
);

create type public.fish_status as enum (
  'DRAFT',
  'AVAILABLE',
  'SOLD'
);

create type public.fish_media_type as enum (
  'IMAGE',
  'VIDEO'
);

create type public.product_status as enum (
  'DRAFT',
  'ACTIVE',
  'HIDDEN'
);

create type public.product_platform as enum (
  'TIKTOK_SHOP',
  'TOKOPEDIA',
  'SHOPEE',
  'OTHER'
);

create type public.article_status as enum (
  'DRAFT',
  'PUBLISHED'
);

create type public.water_parameter as enum (
  'KH',
  'PH',
  'GH',
  'CHLORINE',
  'NITRATE',
  'NITRITE'
);


-- =========================================================
-- ADMIN PROFILES
-- =========================================================

create table public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  name text not null,
  role public.admin_role not null default 'ADMIN',
  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- =========================================================
-- ASSESSORS
-- =========================================================

create table public.assessors (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  title text not null default 'GBF Fish Assessor',
  photo_path text,
  bio text,
  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- =========================================================
-- FISHES
-- =========================================================

create table public.fishes (
  id uuid primary key default gen_random_uuid(),

  code text not null unique,
  slug text not null unique,

  type text not null,
  pattern text,
  sex text,

  size_cm numeric(5,2),
  price integer not null,

  gbf_point smallint,
  assessor_id uuid references public.assessors(id)
    on delete set null,

  description text,

  status public.fish_status not null default 'DRAFT',
  published_at timestamptz,

  created_by uuid references auth.users(id)
    on delete set null,

  updated_by uuid references auth.users(id)
    on delete set null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint fishes_price_non_negative
    check (price >= 0),

  constraint fishes_size_positive
    check (size_cm is null or size_cm > 0),

  constraint fishes_gbf_point_range
    check (
      gbf_point is null
      or gbf_point between 0 and 100
    )
);


-- =========================================================
-- FISH MEDIA
-- =========================================================

create table public.fish_media (
  id uuid primary key default gen_random_uuid(),

  fish_id uuid not null references public.fishes(id)
    on delete cascade,

  media_type public.fish_media_type not null default 'IMAGE',

  storage_path text not null,
  alt_text text,

  sort_order integer not null default 0,

  created_at timestamptz not null default now(),

  constraint fish_media_sort_order_non_negative
    check (sort_order >= 0)
);


-- =========================================================
-- PRODUCTS
-- =========================================================

create table public.products (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  slug text not null unique,

  short_description text,
  description text,

  image_path text,

  status public.product_status not null default 'DRAFT',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- =========================================================
-- PRODUCT LINKS
-- =========================================================

create table public.product_links (
  id uuid primary key default gen_random_uuid(),

  product_id uuid not null references public.products(id)
    on delete cascade,

  platform public.product_platform not null,
  url text not null,

  is_active boolean not null default true,
  sort_order integer not null default 0,

  created_at timestamptz not null default now(),

  constraint product_links_sort_order_non_negative
    check (sort_order >= 0)
);


-- =========================================================
-- ARTICLES
-- =========================================================

create table public.articles (
  id uuid primary key default gen_random_uuid(),

  title text not null,
  slug text not null unique,

  excerpt text,
  content text not null,

  cover_image_path text,

  status public.article_status not null default 'DRAFT',
  published_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- =========================================================
-- FAQ
-- =========================================================

create table public.faqs (
  id uuid primary key default gen_random_uuid(),

  question text not null,
  answer text not null,

  sort_order integer not null default 0,
  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint faqs_sort_order_non_negative
    check (sort_order >= 0)
);


-- =========================================================
-- SITE SETTINGS
-- =========================================================

create table public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,

  updated_at timestamptz not null default now(),

  updated_by uuid references auth.users(id)
    on delete set null
);


-- =========================================================
-- WATER TEST REFERENCE SETS
-- =========================================================

create table public.water_test_reference_sets (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  version text not null unique,

  is_active boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


create table public.water_test_reference_values (
  id uuid primary key default gen_random_uuid(),

  reference_set_id uuid not null
    references public.water_test_reference_sets(id)
    on delete cascade,

  parameter public.water_parameter not null,

  value numeric not null,
  unit text,

  lab_l numeric not null,
  lab_a numeric not null,
  lab_b numeric not null,

  sort_order integer not null default 0,

  created_at timestamptz not null default now(),

  constraint water_reference_sort_order_non_negative
    check (sort_order >= 0),

  constraint water_reference_unique_value
    unique (reference_set_id, parameter, value)
);


-- =========================================================
-- GBF WATER STANDARDS
-- =========================================================

create table public.water_standards (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  version text not null unique,

  description text,

  is_active boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


create table public.water_standard_ranges (
  id uuid primary key default gen_random_uuid(),

  water_standard_id uuid not null
    references public.water_standards(id)
    on delete cascade,

  parameter public.water_parameter not null,

  min_value numeric,
  max_value numeric,

  status text not null,
  priority integer not null default 0,

  created_at timestamptz not null default now(),

  constraint water_standard_valid_range
    check (
      min_value is null
      or max_value is null
      or min_value <= max_value
    )
);


-- =========================================================
-- INDEXES
-- =========================================================

create index fishes_public_catalog_idx
  on public.fishes(status, published_at);

create index fishes_assessor_idx
  on public.fishes(assessor_id);

create index fish_media_fish_sort_idx
  on public.fish_media(fish_id, sort_order);

create index products_status_idx
  on public.products(status);

create index product_links_product_sort_idx
  on public.product_links(product_id, sort_order);

create index articles_public_idx
  on public.articles(status, published_at);

create index faqs_active_sort_idx
  on public.faqs(is_active, sort_order);

create index water_reference_lookup_idx
  on public.water_test_reference_values(
    reference_set_id,
    parameter,
    sort_order
  );

create index water_standard_lookup_idx
  on public.water_standard_ranges(
    water_standard_id,
    parameter,
    priority
  );


-- =========================================================
-- UPDATED_AT TRIGGER
-- =========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


create trigger admin_profiles_set_updated_at
before update on public.admin_profiles
for each row execute function public.set_updated_at();

create trigger assessors_set_updated_at
before update on public.assessors
for each row execute function public.set_updated_at();

create trigger fishes_set_updated_at
before update on public.fishes
for each row execute function public.set_updated_at();

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger articles_set_updated_at
before update on public.articles
for each row execute function public.set_updated_at();

create trigger faqs_set_updated_at
before update on public.faqs
for each row execute function public.set_updated_at();

create trigger water_test_reference_sets_set_updated_at
before update on public.water_test_reference_sets
for each row execute function public.set_updated_at();

create trigger water_standards_set_updated_at
before update on public.water_standards
for each row execute function public.set_updated_at();


-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

alter table public.admin_profiles enable row level security;
alter table public.assessors enable row level security;
alter table public.fishes enable row level security;
alter table public.fish_media enable row level security;
alter table public.products enable row level security;
alter table public.product_links enable row level security;
alter table public.articles enable row level security;
alter table public.faqs enable row level security;
alter table public.site_settings enable row level security;
alter table public.water_test_reference_sets enable row level security;
alter table public.water_test_reference_values enable row level security;
alter table public.water_standards enable row level security;
alter table public.water_standard_ranges enable row level security;


-- =========================================================
-- ADMIN AUTHORIZATION HELPER
-- =========================================================

create or replace function public.is_active_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_profiles
    where id = auth.uid()
      and is_active = true
  );
$$;


-- =========================================================
-- PUBLIC READ POLICIES
-- =========================================================

create policy "Public can read active assessors"
on public.assessors
for select
to anon, authenticated
using (is_active = true);


create policy "Public can read available published fishes"
on public.fishes
for select
to anon, authenticated
using (
  status = 'AVAILABLE'
  and published_at is not null
  and published_at <= now()
);


create policy "Public can read media of public fishes"
on public.fish_media
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.fishes
    where fishes.id = fish_media.fish_id
      and fishes.status = 'AVAILABLE'
      and fishes.published_at is not null
      and fishes.published_at <= now()
  )
);


create policy "Public can read active products"
on public.products
for select
to anon, authenticated
using (status = 'ACTIVE');


create policy "Public can read active product links"
on public.product_links
for select
to anon, authenticated
using (
  is_active = true
  and exists (
    select 1
    from public.products
    where products.id = product_links.product_id
      and products.status = 'ACTIVE'
  )
);


create policy "Public can read published articles"
on public.articles
for select
to anon, authenticated
using (
  status = 'PUBLISHED'
  and published_at is not null
  and published_at <= now()
);


create policy "Public can read active FAQs"
on public.faqs
for select
to anon, authenticated
using (is_active = true);


-- =========================================================
-- ADMIN POLICIES
-- =========================================================

create policy "Admins can read admin profiles"
on public.admin_profiles
for select
to authenticated
using (public.is_active_admin());


create policy "Admins manage assessors"
on public.assessors
for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());


create policy "Admins manage fishes"
on public.fishes
for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());


create policy "Admins manage fish media"
on public.fish_media
for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());


create policy "Admins manage products"
on public.products
for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());


create policy "Admins manage product links"
on public.product_links
for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());


create policy "Admins manage articles"
on public.articles
for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());


create policy "Admins manage FAQs"
on public.faqs
for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());


create policy "Admins manage site settings"
on public.site_settings
for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());


create policy "Admins manage reference sets"
on public.water_test_reference_sets
for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());


create policy "Admins manage reference values"
on public.water_test_reference_values
for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());


create policy "Admins manage water standards"
on public.water_standards
for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());


create policy "Admins manage water standard ranges"
on public.water_standard_ranges
for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());