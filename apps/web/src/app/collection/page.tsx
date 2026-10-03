import Link from "next/link";
import Image from "next/image";

import { createClient } from "@/lib/supabase/server";

export default async function CollectionPage() {
  const supabase = await createClient();

  const { data: fishes, error } = await supabase
    .from("fishes")
    .select(
      `
      id,
      code,
      slug,
      type,
      pattern,
      price,
      gbf_point,
      fish_media (
        id,
        storage_path,
        alt_text,
        sort_order
      )
    `,
    )
    .eq("status", "AVAILABLE")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("COLLECTION ERROR:", error);
  }

  return (
    <main className="min-h-screen bg-[#F5E8DD]">
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#F26522]">
            Get Betta Fish
          </p>

          <h1 className="mt-2 text-4xl font-bold text-[#123F32]">
            Latest Collection
          </h1>

          <p className="mt-3 max-w-xl text-black/60">
            Explore ikan cupang pilihan yang tersedia dari GBF.
          </p>
        </div>

        {!fishes || fishes.length === 0 ? (
          <div className="rounded-2xl border border-black/10 bg-white/50 p-10 text-center">
            <p className="text-[#123F32]">Belum ada ikan yang tersedia.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fishes.map((fish) => {
              const media = [...(fish.fish_media ?? [])].sort(
                (a, b) => a.sort_order - b.sort_order,
              )[0];

              const imageUrl = media
                ? supabase.storage
                    .from("fish-media")
                    .getPublicUrl(media.storage_path).data.publicUrl
                : null;

              return (
                <Link
                  key={fish.id}
                  href={`/fish/${fish.slug}`}
                  className="group overflow-hidden rounded-2xl bg-white transition hover:-translate-y-1"
                >
                  <div className="relative aspect-4/5 overflow-hidden bg-[#123F32]/10">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={media?.alt_text || fish.code}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-black/40">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#F26522]">
                          {fish.code}
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-[#123F32]">
                          {fish.type}
                        </h2>

                        {fish.pattern && (
                          <p className="mt-1 text-sm text-black/55">
                            {fish.pattern}
                          </p>
                        )}
                      </div>

                      {fish.gbf_point !== null && (
                        <div className="shrink-0 rounded-full bg-[#123F32] px-3 py-2 text-xs font-bold text-white">
                          {fish.gbf_point}
                        </div>
                      )}
                    </div>

                    <p className="mt-5 font-semibold text-[#123F32]">
                      Rp {fish.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
