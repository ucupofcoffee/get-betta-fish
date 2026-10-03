"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

const assessorSchema = z.object({
  name: z.string().trim().min(1).max(150),
  title: z.string().trim().min(1).max(150),
  bio: z.string().trim().optional(),
});

export async function createAssessor(formData: FormData) {
  const parsed = assessorSchema.safeParse({
    name: formData.get("name"),
    title: formData.get("title"),
    bio: formData.get("bio") || undefined,
  });

  if (!parsed.success) {
    redirect("/admin/assessors/new?error=invalid_input");
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: adminProfile } = await supabase
    .from("admin_profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!adminProfile) {
    redirect("/admin/login?error=unauthorized");
  }

  const { error } = await supabase.from("assessors").insert({
    name: parsed.data.name,
    title: parsed.data.title,
    bio: parsed.data.bio ?? null,
    is_active: true,
  });

  if (error) {
    console.error("CREATE ASSESSOR ERROR:", error);
    redirect("/admin/assessors/new?error=create_failed");
  }

  redirect("/admin/assessors");
}