import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { updateAssessor } from "./actions";

type EditAssessorPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function EditAssessorPage({
  params,
  searchParams,
}: EditAssessorPageProps) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: assessor, error: assessorError } = await supabase
    .from("assessors")
    .select("id, name, title, bio, is_active")
    .eq("id", id)
    .single();

  if (assessorError || !assessor) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <Link
        href="/admin/assessors"
        className="text-sm text-black/60"
      >
        ← Assessors
      </Link>

      <div className="mt-6">
        <p className="text-sm font-semibold text-[#F26522]">
          GBF CMS
        </p>

        <h1 className="mt-1 text-3xl font-bold text-[#123F32]">
          Edit Assessor
        </h1>

        <p className="mt-2 text-sm text-black/50">
          {assessor.name}
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error === "invalid_input" &&
            "Periksa kembali data assessor."}

          {error === "update_failed" &&
            "Perubahan assessor gagal disimpan."}
        </div>
      )}

      <form action={updateAssessor} className="mt-8 space-y-6">
        <input
          type="hidden"
          name="id"
          value={assessor.id}
        />

        <Field label="Name">
          <input
            name="name"
            required
            defaultValue={assessor.name}
            className={inputClass}
          />
        </Field>

        <Field label="Title">
          <input
            name="title"
            required
            defaultValue={assessor.title}
            className={inputClass}
          />
        </Field>

        <Field label="Bio">
          <textarea
            name="bio"
            rows={5}
            defaultValue={assessor.bio ?? ""}
            className={inputClass}
          />
        </Field>

        <Field label="Status">
          <select
            name="isActive"
            defaultValue={assessor.is_active ? "true" : "false"}
            className={inputClass}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
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