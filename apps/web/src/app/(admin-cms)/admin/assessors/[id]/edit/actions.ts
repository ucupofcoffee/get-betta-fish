"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

const updateAssessorSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1).max(150),
  title: z.string().trim().min(1).max(150),
  bio: z.string().trim().optional(),
  isActive: z.enum(["true", "false"]),
});

export async function updateAssessor(formData: FormData) {
  const parsed = updateAssessorSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    title: formData.get("title"),
    bio: formData.get("bio") || undefined,
    isActive: formData.get("isActive"),
  });

  if (!parsed.success) {
    redirect(
      `/admin/assessors/${formData.get("id")}/edit?error=invalid_input`
    );
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

  const assessor = parsed.data;

  const { error } = await supabase
    .from("assessors")
    .update({
      name: assessor.name,
      title: assessor.title,
      bio: assessor.bio ?? null,
      is_active: assessor.isActive === "true",
    })
    .eq("id", assessor.id);

  if (error) {
    console.error("UPDATE ASSESSOR ERROR:", error);

    redirect(
      `/admin/assessors/${assessor.id}/edit?error=update_failed`
    );
  }

  redirect("/admin/assessors");
}