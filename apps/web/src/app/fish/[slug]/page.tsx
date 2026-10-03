import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";

import { createClient } from "@/lib/supabase/server";

type FishDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function FishDetailPage({ params }: FishDetailPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: fish, error } = await supabase
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
      description,
      fish_media (
        id,
        media_type,
        storage_path,
        alt_text,
        sort_order
      ),
      assessors (
        name,
        title
      )
    `,
    )
    .eq("slug", slug)
    .eq("status", "AVAILABLE")
    .not("published_at", "is", null)
    .single();

  if (error || !fish) {
    notFound();
  }

  const assessor = fish.assessors as unknown as {
    name: string;
    title: string;
  } | null;

  const media = [...(fish.fish_media ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  );

  const primaryMedia = media[0];

  const imageUrl = primaryMedia
    ? supabase.storage
        .from("fish-media")
        .getPublicUrl(primaryMedia.storage_path).data.publicUrl
    : null;

  const { data: contactSetting } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "contact")
    .maybeSingle();

  const contact = contactSetting?.value as {
    whatsapp?: string | null;
  } | null;

  const whatsappNumber = contact?.whatsapp ?? null;

  const whatsappMessage = encodeURIComponent(
    `Halo GBF, saya tertarik dengan ${fish.code} - ${fish.type}. Apakah masih tersedia?`,
  );

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${whatsappMessage}`
    : null;

  return (
    <main className="min-h-screen bg-[#F5E8DD]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <Link
          href="/collection"
          className="text-sm font-medium text-[#123F32]/60 transition hover:text-[#123F32]"
        >
          ← Back to Collection
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Fish image */}
          <section>
            <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-[#123F32]/10">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={primaryMedia?.alt_text || fish.code}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-black/40">
                  No image
                </div>
              )}
            </div>
          </section>

          {/* Fish information */}
          <section className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F26522]">
              {fish.code}
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#123F32] sm:text-5xl">
              {fish.type}
            </h1>

            {fish.pattern && (
              <p className="mt-2 text-lg text-black/55">{fish.pattern}</p>
            )}

            <p className="mt-7 text-2xl font-bold text-[#123F32]">
              Rp {fish.price.toLocaleString("id-ID")}
            </p>

            {/* GBF Point */}
            {fish.gbf_point !== null && (
              <div className="mt-8 rounded-2xl bg-[#123F32] p-6 text-white">
                <div className="flex items-center justify-between gap-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                      GBF Point
                    </p>

                    <p className="mt-2 text-sm text-white/70">
                      GBF Fish Assessment
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-4xl font-bold">{fish.gbf_point}</span>
                    <span className="text-lg text-white/50"> / 100</span>
                  </div>
                </div>
                {assessor && (
                  <div className="mt-5 border-t border-white/15 pt-5">
                    <p className="text-sm text-white/60">Assessed by</p>

                    <p className="mt-1 font-semibold">{assessor.name}</p>

                    <p className="text-sm text-white/60">{assessor.title}</p>
                  </div>
                )}
              </div>
            )}

            {/* Specs */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <FishSpec
                label="Sex"
                value={fish.sex ? formatSex(fish.sex) : "—"}
              />

              <FishSpec
                label="Size"
                value={fish.size_cm !== null ? `± ${fish.size_cm} cm` : "—"}
              />

              <FishSpec label="Type" value={fish.type} />

              <FishSpec label="Pattern" value={fish.pattern || "—"} />
            </div>

            {/* Description */}
            {fish.description && (
              <div className="mt-8 border-t border-black/10 pt-8">
                <h2 className="font-semibold text-[#123F32]">
                  About This Fish
                </h2>

                <p className="mt-3 leading-7 text-black/60">
                  {fish.description}
                </p>
              </div>
            )}

            {/* WhatsApp */}
            <div className="mt-10">
              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center rounded-xl bg-[#F26522] px-6 py-4 font-semibold text-white transition hover:opacity-90"
                >
                  Ask via WhatsApp
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full cursor-not-allowed rounded-xl bg-black/10 px-6 py-4 font-semibold text-black/40"
                >
                  WhatsApp segera tersedia
                </button>
              )}

              <p className="mt-3 text-center text-xs text-black/45">
                Pembelian ikan dilakukan langsung melalui WhatsApp GBF.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function FishSpec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white/40 p-4">
      <p className="text-xs uppercase tracking-wider text-black/40">{label}</p>

      <p className="mt-1 font-semibold text-[#123F32]">{value}</p>
    </div>
  );
}

function formatSex(sex: string) {
  if (sex === "MALE") return "Male";
  if (sex === "FEMALE") return "Female";

  return sex;
}
