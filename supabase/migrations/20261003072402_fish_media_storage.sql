-- =========================================================
-- FISH MEDIA STORAGE
-- =========================================================

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'fish-media',
  'fish-media',
  true,
  10485760,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif'
  ]
)
on conflict (id) do nothing;


-- Public may read fish media.
create policy "Public can read fish media storage"
on storage.objects
for select
to anon, authenticated
using (
  bucket_id = 'fish-media'
);


-- Only active GBF admins may upload.
create policy "Admins can upload fish media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'fish-media'
  and public.is_active_admin()
);


-- Only active GBF admins may update.
create policy "Admins can update fish media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'fish-media'
  and public.is_active_admin()
)
with check (
  bucket_id = 'fish-media'
  and public.is_active_admin()
);


-- Only active GBF admins may delete.
create policy "Admins can delete fish media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'fish-media'
  and public.is_active_admin()
);