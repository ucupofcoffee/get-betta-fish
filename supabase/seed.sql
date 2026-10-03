-- =========================================================
-- GET BETTA FISH
-- Development Seed Data
-- =========================================================

-- ---------------------------------------------------------
-- Site Settings
-- ---------------------------------------------------------

insert into public.site_settings (key, value)
values
(
  'brand',
  '{
    "name": "Get Betta Fish",
    "abbreviation": "GBF",
    "tagline": "Better Fish, Brighter Days.",
    "colors": {
      "orange": "#F26522",
      "forestGreen": "#123F32",
      "cream": "#F5E8DD"
    }
  }'::jsonb
)
on conflict (key)
do update set
  value = excluded.value,
  updated_at = now();


insert into public.site_settings (key, value)
values
(
  'socials',
  '{
    "tiktok": "https://www.tiktok.com/@getbettafish_",
    "instagram": null
  }'::jsonb
)
on conflict (key)
do update set
  value = excluded.value,
  updated_at = now();


insert into public.site_settings (key, value)
values
(
  'contact',
  '{
    "whatsapp": null
  }'::jsonb
)
on conflict (key)
do update set
  value = excluded.value,
  updated_at = now();


insert into public.site_settings (key, value)
values
(
  'homepage',
  '{
    "heroTitle": "Better Fish, Brighter Days.",
    "heroDescription": null
  }'::jsonb
)
on conflict (key)
do update set
  value = excluded.value,
  updated_at = now();