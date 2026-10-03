import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";

import { createClient } from "@/lib/supabase/server";
import {
  addFishImage,
  deleteFishImage,
  setFishMainImage,
  updateFish,
} from "./actions";

type EditFishPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function EditFishPage({
  params,
  searchParams,
}: EditFishPageProps) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: fish, error: fishError } = await supabase
    .from("fishes")
    .select(
      `
      id,
      code,
      slug,
      type,
      pattern,
      sex,
      size_cm,
      price,
      gbf_point,
      assessor_id,
      description,
      status,
      fish_media (
        id,
        media_type,
        storage_path,
        alt_text,
        sort_order
      )
    `,
    )
    .eq("id", id)
    .single();

  if (fishError || !fish) {
    notFound();
  }

  const media = [...(fish.fish_media ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => {
      const { data } = supabase.storage
        .from("fish-media")
        .getPublicUrl(item.storage_path);

      return {
        ...item,
        publicUrl: data.publicUrl,
      };
    });

  const { data: assessors } = await supabase
    .from("assessors")
    .select("id, name, title")
    .eq("is_active", true)
    .order("name");

  return (
    <main className="mx-auto max-w-2xl p-8">
      <Link href="/admin/fishes" className="text-sm text-black/60">
        ← Fish Catalog
      </Link>

      <div className="mt-6">
        <p className="text-sm font-semibold text-[#F26522]">GBF CMS</p>

        <h1 className="mt-1 text-3xl font-bold text-[#123F32]">Edit Fish</h1>

        <p className="mt-2 text-sm text-black/50">{fish.code}</p>
      </div>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error === "invalid_input" && "Periksa kembali data ikan."}

          {error === "update_failed" && "Perubahan ikan gagal disimpan."}

          {error === "invalid_image" && "File gambar tidak valid."}

          {error === "image_upload_failed" && "Upload gambar gagal."}

          {error === "media_create_failed" && "Data gambar gagal disimpan."}

          {error === "media_not_found" && "Gambar tidak ditemukan."}

          {error === "media_delete_failed" && "Gambar gagal dihapus."}
        </div>
      )}

      {/* ==================================================
          Fish Media
      ================================================== */}

      <section className="mt-8">
        <div>
          <h2 className="text-lg font-semibold text-[#123F32]">Fish Media</h2>

          <p className="mt-1 text-sm text-black/50">
            {media.length} image
            {media.length === 1 ? "" : "s"}
          </p>
        </div>

        {/* Upload image */}

        <form
          action={addFishImage}
          className="mt-4 flex flex-col gap-3 rounded-xl border border-black/10 p-4 sm:flex-row sm:items-center"
        >
          <input type="hidden" name="fishId" value={fish.id} />

          <input
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            required
            className="min-w-0 flex-1 rounded-lg border border-black/15 bg-white px-3 py-2 text-sm"
          />

          <button
            type="submit"
            className="shrink-0 rounded-lg bg-[#123F32] px-4 py-2 text-sm font-semibold text-white"
          >
            Add Image
          </button>
        </form>

        {/* Gallery */}

        {media.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-black/15 p-8 text-center text-sm text-black/50">
            No media uploaded.
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {media.map((item, index) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-xl border border-black/10 bg-white"
              >
                <div className="relative aspect-square overflow-hidden bg-black/5">
                  <Image
                    src={item.publicUrl}
                    alt={item.alt_text ?? fish.code}
                    fill
                    sizes="(max-width: 640px) 50vw, 220px"
                    className="object-cover"
                  />
                </div>

                <div className="p-3">
                  <p className="text-xs font-semibold text-[#123F32]">
                    {index === 0 ? "Main image" : `Image ${index + 1}`}
                  </p>

                  <p className="mt-1 text-xs text-black/40">
                    Order: {item.sort_order}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-3">
                    {index !== 0 && (
                      <form action={setFishMainImage}>
                        <input type="hidden" name="fishId" value={fish.id} />

                        <input type="hidden" name="mediaId" value={item.id} />

                        <button
                          type="submit"
                          className="text-xs font-semibold text-[#123F32] hover:underline"
                        >
                          Set as Main
                        </button>
                      </form>
                    )}

                    <form action={deleteFishImage}>
                      <input type="hidden" name="fishId" value={fish.id} />

                      <input type="hidden" name="mediaId" value={item.id} />

                      <button
                        type="submit"
                        className="text-xs font-semibold text-red-600 hover:underline"
                      >
                        Delete image
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ==================================================
          Fish Data
      ================================================== */}

      <form action={updateFish} className="mt-10 space-y-6">
        <input type="hidden" name="id" value={fish.id} />

        <Field label="Fish Code">
          <input
            name="code"
            required
            defaultValue={fish.code}
            className={inputClass}
          />
        </Field>

        <Field label="Slug">
          <input
            name="slug"
            required
            defaultValue={fish.slug}
            className={inputClass}
          />
        </Field>

        <Field label="Type">
          <input
            name="type"
            required
            defaultValue={fish.type}
            className={inputClass}
          />
        </Field>

        <Field label="Pattern">
          <input
            name="pattern"
            defaultValue={fish.pattern ?? ""}
            className={inputClass}
          />
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Sex">
            <select
              name="sex"
              defaultValue={fish.sex ?? "MALE"}
              className={inputClass}
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </Field>

          <Field label="Size (cm)">
            <input
              name="sizeCm"
              type="number"
              step="0.1"
              min="0.1"
              defaultValue={fish.size_cm ?? ""}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Price (Rp)">
            <input
              name="price"
              type="number"
              min="0"
              required
              defaultValue={fish.price}
              className={inputClass}
            />
          </Field>

          <Field label="GBF Point">
            <input
              name="gbfPoint"
              type="number"
              min="0"
              max="100"
              defaultValue={fish.gbf_point ?? ""}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Assessor">
          <select
            name="assessorId"
            defaultValue={fish.assessor_id ?? ""}
            className={inputClass}
          >
            <option value="">No assessor</option>

            {(assessors ?? []).map((assessor) => (
              <option key={assessor.id} value={assessor.id}>
                {assessor.name}
                {assessor.title ? ` — ${assessor.title}` : ""}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Description">
          <textarea
            name="description"
            rows={5}
            defaultValue={fish.description ?? ""}
            className={inputClass}
          />
        </Field>

        <Field label="Status">
          <select
            name="status"
            defaultValue={fish.status}
            className={inputClass}
          >
            <option value="DRAFT">Draft</option>

            <option value="AVAILABLE">Available / Publish</option>

            <option value="SOLD">Sold</option>
          </select>
        </Field>

        <button
          type="submit"
          className="w-full rounded-lg bg-[#F26522] px-5 py-3 font-semibold text-white"
        >
          Save Changes
        </button>
      </form>
    </main>
  );
}

const inputClass =
  "w-full rounded-lg border border-black/15 bg-white px-4 py-3 outline-none focus:border-[#123F32]";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#123F32]">
        {label}
      </span>

      {children}
    </label>
  );
}
