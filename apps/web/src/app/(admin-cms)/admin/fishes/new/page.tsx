import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { createFish } from "./actions";

type NewFishPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewFishPage({ searchParams }: NewFishPageProps) {
  const { error } = await searchParams;

  const supabase = await createClient();

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
        <h1 className="mt-1 text-3xl font-bold text-[#123F32]">Add Fish</h1>
      </div>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error === "invalid_input" && "Periksa kembali data ikan."}
          {error === "invalid_image" && "File foto ikan tidak valid."}
          {error === "image_upload_failed" && "Upload foto ikan gagal."}
          {error === "media_create_failed" && "Data media ikan gagal disimpan."}
          {error === "create_failed" && "Ikan gagal disimpan."}
        </div>
      )}
      <form action={createFish} className="mt-8 space-y-6">
        <Field label="Fish Code">
          <input
            name="code"
            required
            placeholder="GBF-0001"
            className={inputClass}
          />
        </Field>

        <Field label="Slug">
          <input
            name="slug"
            required
            placeholder="gbf-0001"
            className={inputClass}
          />
        </Field>

        <Field label="Type">
          <input
            name="type"
            required
            placeholder="Halfmoon Plakat"
            className={inputClass}
          />
        </Field>

        <Field label="Pattern">
          <input
            name="pattern"
            placeholder="Koi Galaxy"
            className={inputClass}
          />
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Sex">
            <select name="sex" className={inputClass} defaultValue="MALE">
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
              placeholder="4"
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
              placeholder="450000"
              className={inputClass}
            />
          </Field>

          <Field label="GBF Point">
            <input
              name="gbfPoint"
              type="number"
              min="0"
              max="100"
              placeholder="92"
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Assessor">
          <select name="assessorId" defaultValue="" className={inputClass}>
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
          <textarea name="description" rows={5} className={inputClass} />
        </Field>

        <Field label="Fish Photo">
          <input
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            required
            className={inputClass}
          />
        </Field>

        <Field label="Status">
          <select name="status" defaultValue="DRAFT" className={inputClass}>
            <option value="DRAFT">Draft</option>
            <option value="AVAILABLE">Available / Publish</option>
          </select>
        </Field>

        <button
          type="submit"
          className="w-full rounded-lg bg-[#F26522] px-5 py-3 font-semibold text-white"
        >
          Save Fish
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
