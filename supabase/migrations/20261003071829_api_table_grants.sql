-- =========================================================
-- API TABLE PRIVILEGES
-- RLS remains responsible for row-level authorization.
-- =========================================================

grant select on table public.admin_profiles
to authenticated;

grant select, insert, update, delete
on table public.assessors
to authenticated;

grant select, insert, update, delete
on table public.fishes
to authenticated;

grant select, insert, update, delete
on table public.fish_media
to authenticated;

grant select, insert, update, delete
on table public.products
to authenticated;

grant select, insert, update, delete
on table public.product_links
to authenticated;

grant select, insert, update, delete
on table public.articles
to authenticated;

grant select, insert, update, delete
on table public.faqs
to authenticated;

grant select, insert, update, delete
on table public.site_settings
to authenticated;

grant select, insert, update, delete
on table public.water_test_reference_sets
to authenticated;

grant select, insert, update, delete
on table public.water_test_reference_values
to authenticated;

grant select, insert, update, delete
on table public.water_standards
to authenticated;

grant select, insert, update, delete
on table public.water_standard_ranges
to authenticated;