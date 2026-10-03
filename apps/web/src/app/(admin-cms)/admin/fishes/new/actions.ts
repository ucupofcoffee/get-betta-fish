"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

const fishSchema = z.object({
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
  status: z.enum(["DRAFT", "AVAILABLE"]),
});

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export async function createFish(formData: FormData) {
  // -------------------------------------------------------
  // Validate image
  // -------------------------------------------------------

  const image = formData.get("image");

  if (!(image instanceof File) || image.size === 0) {
    redirect("/admin/fishes/new?error=invalid_image");
  }

  if (image.size > MAX_IMAGE_SIZE || !ALLOWED_IMAGE_TYPES.has(image.type)) {
    redirect("/admin/fishes/new?error=invalid_image");
  }

  // -------------------------------------------------------
  // Validate fish data
  // -------------------------------------------------------

  const rawSize = formData.get("sizeCm");
  const rawPoint = formData.get("gbfPoint");
  const rawAssessorId = formData.get("assessorId");

  const parsed = fishSchema.safeParse({
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
    redirect("/admin/fishes/new?error=invalid_input");
  }

  // -------------------------------------------------------
  // Authenticate admin
  // -------------------------------------------------------

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

  // -------------------------------------------------------
  // Create fish
  // -------------------------------------------------------

  const { data: createdFish, error: fishError } = await supabase
    .from("fishes")
    .insert({
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

      published_at:
        fish.status === "AVAILABLE" ? new Date().toISOString() : null,

      created_by: user.id,
      updated_by: user.id,
    })
    .select("id")
    .single();

  if (fishError || !createdFish) {
    console.error("CREATE FISH ERROR:", fishError);
    redirect("/admin/fishes/new?error=create_failed");
  }

  // -------------------------------------------------------
  // Upload image
  // -------------------------------------------------------

  const extension = image.name.split(".").pop()?.toLowerCase() || "jpg";

  const storagePath = `${createdFish.id}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("fish-media")
    .upload(storagePath, image, {
      contentType: image.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("FISH IMAGE UPLOAD ERROR:", uploadError);

    await supabase.from("fishes").delete().eq("id", createdFish.id);

    redirect("/admin/fishes/new?error=image_upload_failed");
  }

  // -------------------------------------------------------
  // Create fish_media record
  // -------------------------------------------------------

  const { error: mediaError } = await supabase.from("fish_media").insert({
    fish_id: createdFish.id,
    media_type: "IMAGE",
    storage_path: storagePath,
    alt_text: `${fish.code} ${fish.type}`,
    sort_order: 0,
  });

  if (mediaError) {
    console.error("CREATE FISH MEDIA ERROR:", mediaError);

    await supabase.storage.from("fish-media").remove([storagePath]);

    await supabase.from("fishes").delete().eq("id", createdFish.id);

    redirect("/admin/fishes/new?error=media_create_failed");
  }

  redirect("/admin/fishes");
}
