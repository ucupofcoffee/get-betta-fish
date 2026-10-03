"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

// ========================================================
// Validation
// ========================================================

const updateFishSchema = z.object({
  id: z.string().uuid(),
  code: z.string().trim().min(1).max(50),
  slug: z.string().trim().min(1).max(100),
  type: z.string().trim().min(1).max(100),
  pattern: z.string().trim().max(100).optional(),
  sex: z.enum(["MALE", "FEMALE"]),
  sizeCm: z.coerce.number().positive().optional(),
  price: z.coerce.number().int().nonnegative(),
  gbfPoint: z.coerce.number().int().min(0).max(100).optional(),
  assessorId: z.string().uuid().optional(),
  description: z.string().trim().optional(),
  status: z.enum(["DRAFT", "AVAILABLE", "SOLD"]),
});

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

// ========================================================
// Update Fish
// ========================================================

export async function updateFish(formData: FormData) {
  const rawSize = formData.get("sizeCm");
  const rawPoint = formData.get("gbfPoint");
  const rawAssessorId = formData.get("assessorId");

  const parsed = updateFishSchema.safeParse({
    id: formData.get("id"),
    code: formData.get("code"),
    slug: formData.get("slug"),
    type: formData.get("type"),
    pattern: formData.get("pattern") || undefined,
    sex: formData.get("sex"),
    sizeCm: rawSize === "" ? undefined : rawSize,
    price: formData.get("price"),
    gbfPoint: rawPoint === "" ? undefined : rawPoint,
    assessorId: rawAssessorId === "" ? undefined : rawAssessorId,
    description: formData.get("description") || undefined,
    status: formData.get("status"),
  });

  if (!parsed.success) {
    redirect(`/admin/fishes/${formData.get("id")}/edit?error=invalid_input`);
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: adminProfile } = await supabase
    .from("admin_profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!adminProfile) {
    redirect("/admin/login?error=unauthorized");
  }

  const fish = parsed.data;

  // Ambil status lama supaya published_at tidak berubah
  // setiap kali fish AVAILABLE diedit.
  const { data: existingFish, error: existingFishError } = await supabase
    .from("fishes")
    .select("status, published_at")
    .eq("id", fish.id)
    .single();

  if (existingFishError || !existingFish) {
    redirect("/admin/fishes?error=fish_not_found");
  }

  let publishedAt = existingFish.published_at;

  if (fish.status === "AVAILABLE") {
    // Publish pertama kali atau publish ulang.
    if (existingFish.status !== "AVAILABLE" || !publishedAt) {
      publishedAt = new Date().toISOString();
    }
  } else {
    // DRAFT dan SOLD tidak dianggap published.
    publishedAt = null;
  }

  const { error } = await supabase
    .from("fishes")
    .update({
      code: fish.code,
      slug: fish.slug,
      type: fish.type,
      pattern: fish.pattern ?? null,
      sex: fish.sex,
      size_cm: fish.sizeCm ?? null,
      price: fish.price,
      gbf_point: fish.gbfPoint ?? null,
      assessor_id: fish.assessorId ?? null,
      description: fish.description ?? null,
      status: fish.status,
      published_at: publishedAt,
      updated_by: user.id,
    })
    .eq("id", fish.id);

  if (error) {
    console.error("UPDATE FISH ERROR:", error);

    redirect(`/admin/fishes/${fish.id}/edit?error=update_failed`);
  }

  redirect("/admin/fishes");
}

// ========================================================
// Add Fish Image
// ========================================================

export async function addFishImage(formData: FormData) {
  const fishId = formData.get("fishId");
  const image = formData.get("image");

  if (
    typeof fishId !== "string" ||
    !(image instanceof File) ||
    image.size === 0 ||
    image.size > MAX_IMAGE_SIZE ||
    !ALLOWED_IMAGE_TYPES.has(image.type)
  ) {
    redirect(`/admin/fishes/${fishId}/edit?error=invalid_image`);
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: adminProfile } = await supabase
    .from("admin_profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!adminProfile) {
    redirect("/admin/login?error=unauthorized");
  }

  // Pastikan fish memang ada.
  const { data: fish, error: fishError } = await supabase
    .from("fishes")
    .select("id, code, type")
    .eq("id", fishId)
    .single();

  if (fishError || !fish) {
    redirect("/admin/fishes?error=fish_not_found");
  }

  // Cari sort_order paling besar.
  const { data: lastMedia } = await supabase
    .from("fish_media")
    .select("sort_order")
    .eq("fish_id", fishId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextSortOrder = (lastMedia?.sort_order ?? -1) + 1;

  const extension = image.name.split(".").pop()?.toLowerCase() || "jpg";

  const storagePath = `${fishId}/${crypto.randomUUID()}.${extension}`;

  // Upload file ke Supabase Storage.
  const { error: uploadError } = await supabase.storage
    .from("fish-media")
    .upload(storagePath, image, {
      contentType: image.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("ADD FISH IMAGE STORAGE ERROR:", uploadError);

    redirect(`/admin/fishes/${fishId}/edit?error=image_upload_failed`);
  }

  // Simpan metadata media.
  const { error: mediaError } = await supabase.from("fish_media").insert({
    fish_id: fishId,
    media_type: "IMAGE",
    storage_path: storagePath,
    alt_text: `${fish.code} ${fish.type}`,
    sort_order: nextSortOrder,
  });

  if (mediaError) {
    console.error("CREATE FISH MEDIA ERROR:", mediaError);

    // Rollback file jika insert DB gagal.
    await supabase.storage.from("fish-media").remove([storagePath]);

    redirect(`/admin/fishes/${fishId}/edit?error=media_create_failed`);
  }

  redirect(`/admin/fishes/${fishId}/edit`);
}

// ========================================================
// Delete Fish Image
// ========================================================

export async function deleteFishImage(formData: FormData) {
  const fishId = formData.get("fishId");
  const mediaId = formData.get("mediaId");

  if (typeof fishId !== "string" || typeof mediaId !== "string") {
    redirect("/admin/fishes");
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: adminProfile } = await supabase
    .from("admin_profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!adminProfile) {
    redirect("/admin/login?error=unauthorized");
  }

  // Pastikan media benar-benar milik fish tersebut.
  const { data: media, error: mediaLookupError } = await supabase
    .from("fish_media")
    .select("id, storage_path")
    .eq("id", mediaId)
    .eq("fish_id", fishId)
    .single();

  if (mediaLookupError || !media) {
    redirect(`/admin/fishes/${fishId}/edit?error=media_not_found`);
  }

  // Hapus file fisik dari Storage.
  const { error: storageError } = await supabase.storage
    .from("fish-media")
    .remove([media.storage_path]);

  if (storageError) {
    console.error("DELETE FISH IMAGE STORAGE ERROR:", storageError);

    redirect(`/admin/fishes/${fishId}/edit?error=media_delete_failed`);
  }

  // Hapus record metadata.
  const { error: deleteError } = await supabase
    .from("fish_media")
    .delete()
    .eq("id", media.id);

  if (deleteError) {
    console.error("DELETE FISH MEDIA ERROR:", deleteError);

    redirect(`/admin/fishes/${fishId}/edit?error=media_delete_failed`);
  }

  // Ambil ulang media yang masih tersisa.
  const { data: remainingMedia, error: remainingMediaError } = await supabase
    .from("fish_media")
    .select("id, sort_order")
    .eq("fish_id", fishId)
    .order("sort_order", { ascending: true });

  if (remainingMediaError) {
    console.error("FETCH REMAINING FISH MEDIA ERROR:", remainingMediaError);

    redirect(`/admin/fishes/${fishId}/edit?error=media_reorder_failed`);
  }

  // Rapikan kembali urutan menjadi 0, 1, 2, ...
  for (let index = 0; index < remainingMedia.length; index++) {
    if (remainingMedia[index].sort_order === index) {
      continue;
    }

    const { error: reorderError } = await supabase
      .from("fish_media")
      .update({
        sort_order: index,
      })
      .eq("id", remainingMedia[index].id)
      .eq("fish_id", fishId);

    if (reorderError) {
      console.error("REORDER AFTER DELETE ERROR:", reorderError);

      redirect(`/admin/fishes/${fishId}/edit?error=media_reorder_failed`);
    }
  }

  redirect(`/admin/fishes/${fishId}/edit`);
}

export async function setFishMainImage(formData: FormData) {
  const fishId = formData.get("fishId");
  const mediaId = formData.get("mediaId");

  if (typeof fishId !== "string" || typeof mediaId !== "string") {
    redirect("/admin/fishes");
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: adminProfile } = await supabase
    .from("admin_profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!adminProfile) {
    redirect("/admin/login?error=unauthorized");
  }

  // Ambil semua media fish sesuai urutan saat ini.
  const { data: media, error: mediaError } = await supabase
    .from("fish_media")
    .select("id, sort_order")
    .eq("fish_id", fishId)
    .order("sort_order", { ascending: true });

  if (mediaError || !media) {
    redirect(`/admin/fishes/${fishId}/edit?error=media_reorder_failed`);
  }

  const selectedMedia = media.find((item) => item.id === mediaId);

  if (!selectedMedia) {
    redirect(`/admin/fishes/${fishId}/edit?error=media_not_found`);
  }

  // Gambar yang dipilih dipindahkan ke posisi pertama.
  const reorderedMedia = [
    selectedMedia,
    ...media.filter((item) => item.id !== mediaId),
  ];

  // Renumber menjadi 0, 1, 2, 3, ...
  for (let index = 0; index < reorderedMedia.length; index++) {
    const { error: updateError } = await supabase
      .from("fish_media")
      .update({
        sort_order: index,
      })
      .eq("id", reorderedMedia[index].id)
      .eq("fish_id", fishId);

    if (updateError) {
      console.error("REORDER FISH MEDIA ERROR:", updateError);

      redirect(`/admin/fishes/${fishId}/edit?error=media_reorder_failed`);
    }
  }

  redirect(`/admin/fishes/${fishId}/edit`);
}
