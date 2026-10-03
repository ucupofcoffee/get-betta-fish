import Link from "next/link";

import { createAssessor } from "./actions";

type NewAssessorPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewAssessorPage({
  searchParams,
}: NewAssessorPageProps) {
  const { error } = await searchParams;

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
          Add Assessor
        </h1>
      </div>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error === "invalid_input" &&
            "Periksa kembali data assessor."}

          {error === "create_failed" &&
            "Assessor gagal disimpan."}
        </div>
      )}

      <form action={createAssessor} className="mt-8 space-y-6">
        <Field label="Name">
          <input
            name="name"
            required
            placeholder="Nama assessor"
            className={inputClass}
          />
        </Field>

        <Field label="Title">
          <input
            name="title"
            required
            defaultValue="GBF Fish Assessor"
            className={inputClass}
          />
        </Field>

        <Field label="Bio">
          <textarea
            name="bio"
            rows={5}
            placeholder="Optional"
            className={inputClass}
          />
        </Field>

        <button
          type="submit"
          className="w-full rounded-lg bg-[#F26522] px-5 py-3 font-semibold text-white"
        >
          Save Assessor
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