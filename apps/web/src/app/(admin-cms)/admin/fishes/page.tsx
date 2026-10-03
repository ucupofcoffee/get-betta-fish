import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function FishesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: fishes, error } = await supabase
    .from("fishes")
    .select("id, code, type, pattern, price, gbf_point, status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Gagal mengambil data ikan.");
  }

  return (
    <main className="mx-auto max-w-6xl p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-[#F26522]">GBF CMS</p>
          <h1 className="mt-1 text-3xl font-bold text-[#123F32]">
            Fish Catalog
          </h1>
        </div>

        <Link
          href="/admin/fishes/new"
          className="rounded-lg bg-[#F26522] px-4 py-3 font-semibold text-white"
        >
          Add Fish
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-black/10">
        {fishes.length === 0 ? (
          <p className="p-8 text-sm text-black/60">Belum ada ikan.</p>
        ) : (
          <div className="divide-y divide-black/10">
            {fishes.map((fish) => (
              <div
                key={fish.id}
                className="flex items-center justify-between p-5"
              >
                <div>
                  <p className="font-semibold text-[#123F32]">
                    {fish.code} — {fish.type}
                  </p>

                  <p className="mt-1 text-sm text-black/60">
                    {fish.pattern || "No pattern"} · Rp
                    {fish.price.toLocaleString("id-ID")}
                  </p>
                </div>

                <div className="flex items-center gap-5">
                  <div className="text-right text-sm">
                    <p className="font-medium text-[#123F32]">{fish.status}</p>

                    <p className="mt-1 text-black/50">
                      GBF Point: {fish.gbf_point ?? "-"}
                    </p>
                  </div>

                  <Link
                    href={`/admin/fishes/${fish.id}/edit`}
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
