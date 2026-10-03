import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function AssessorsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: assessors, error } = await supabase
    .from("assessors")
    .select("id, name, title, is_active, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Gagal mengambil data assessor.");
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-[#F26522]">GBF CMS</p>
          <h1 className="mt-1 text-3xl font-bold text-[#123F32]">Assessors</h1>
        </div>

        <Link
          href="/admin/assessors/new"
          className="rounded-lg bg-[#F26522] px-4 py-3 font-semibold text-white"
        >
          Add Assessor
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-black/10">
        {assessors.length === 0 ? (
          <p className="p-8 text-sm text-black/60">Belum ada assessor.</p>
        ) : (
          <div className="divide-y divide-black/10">
            {assessors.map((assessor) => (
              <div
                key={assessor.id}
                className="flex items-center justify-between p-5"
              >
                <div>
                  <p className="font-semibold text-[#123F32]">
                    {assessor.name}
                  </p>

                  <p className="mt-1 text-sm text-black/60">{assessor.title}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">
                    {assessor.is_active ? "ACTIVE" : "INACTIVE"}
                  </span>

                  <Link
                    href={`/admin/assessors/${assessor.id}/edit`}
                    className="rounded-lg border border-[#123F32]/20 px-4 py-2 text-sm font-semibold text-[#123F32] transition hover:bg-[#123F32] hover:text-white"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
