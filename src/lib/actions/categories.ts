"use server";

import { createClient, getUser } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Category, ActionResult } from "@/types/database.types";

export async function getUserCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data || [];
}

export async function createCategory(
  _prevState: ActionResult<Category> | undefined,
  formData: FormData
): Promise<ActionResult<Category>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await getUser();

  if (!user) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const color = formData.get("color") as string;
  const icon = formData.get("icon") as string;
  const budgetStr = formData.get("budget") as string;
  const budget = budgetStr ? parseFloat(budgetStr) : null;

  if (!name || name.trim().length === 0) {
    return { error: "Nama kategori tidak boleh kosong" };
  }
  if (name.length > 50) {
    return { error: "Nama kategori maksimal 50 karakter" };
  }
  if (budget !== null && (isNaN(budget) || budget < 0)) {
    return { error: "Batas anggaran harus berupa angka positif" };
  }

  if (color && !/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
    return { error: "Format warna tidak valid" };
  }

  const { data, error } = await supabase
    .from("categories")
    .insert({
      user_id: user.id,
      name: name.trim(),
      color: color || null,
      icon: icon || null,
      budget,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") { // Unique constraint violation
      return { error: "Kategori dengan nama tersebut sudah ada" };
    }
    return { error: "Gagal membuat kategori" };
  }

  revalidatePath("/dashboard/categories");
  return { data };
}

export async function updateCategory(
  id: string,
  _prevState: ActionResult<Category> | undefined,
  formData: FormData
): Promise<ActionResult<Category>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await getUser();

  if (!user) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const color = formData.get("color") as string;
  const icon = formData.get("icon") as string;
  const budgetStr = formData.get("budget") as string;
  const budget = budgetStr ? parseFloat(budgetStr) : null;

  if (!name || name.trim().length === 0) {
    return { error: "Nama kategori tidak boleh kosong" };
  }
  if (name.length > 50) {
    return { error: "Nama kategori maksimal 50 karakter" };
  }
  if (budget !== null && (isNaN(budget) || budget < 0)) {
    return { error: "Batas anggaran harus berupa angka positif" };
  }

  if (color && !/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
    return { error: "Format warna tidak valid" };
  }

  const { data, error } = await supabase
    .from("categories")
    .update({
      name: name.trim(),
      color: color || null,
      icon: icon || null,
      budget,
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return { error: "Kategori dengan nama tersebut sudah ada" };
    }
    return { error: "Gagal mengupdate kategori" };
  }

  revalidatePath("/dashboard/categories");
  return { data };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: "Gagal menghapus kategori" };
  }

  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard/expenses"); // because expenses might lose their category
  return {};
}
