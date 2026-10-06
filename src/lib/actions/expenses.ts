"use server";

import { createClient, getUser } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Expense, ExpenseWithCategory, ActionResult } from "@/types/database.types";

export async function getUserExpenses(filters?: {
  month?: number;
  year?: number;
  categoryId?: string;
}): Promise<ExpenseWithCategory[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await getUser();

  if (!user) return [];

  let query = supabase
    .from("expenses")
    .select(`
      *,
      categories (name, color, icon)
    `)
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (filters?.categoryId) {
    query = query.eq("category_id", filters.categoryId);
  }

  if (filters?.month && filters?.year) {

    const startDate = new Date(filters.year, filters.month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(filters.year, filters.month, 0).toISOString().split('T')[0];
    
    query = query.gte("date", startDate).lte("date", endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching expenses:", error);
    return [];
  }

  return data as unknown as ExpenseWithCategory[];
}

export async function createExpense(
  _prevState: ActionResult<Expense> | undefined,
  formData: FormData
): Promise<ActionResult<Expense>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await getUser();

  if (!user) return { error: "Unauthorized" };

  const amountStr = formData.get("amount") as string;
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  const categoryIdStr = formData.get("category_id") as string;

  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    return { error: "Jumlah pengeluaran harus lebih besar dari 0" };
  }

  if (!description || description.trim().length === 0) {
    return { error: "Deskripsi pengeluaran wajib diisi" };
  }
  if (description.length > 255) {
    return { error: "Deskripsi maksimal 255 karakter" };
  }

  if (!date) {
    return { error: "Tanggal wajib diisi" };
  }

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return { error: "Format tanggal tidak valid" };
  }
  if (parsedDate > new Date()) {
    return { error: "Tanggal tidak boleh lebih dari hari ini" };
  }

  const category_id = categoryIdStr === "unassigned" || !categoryIdStr ? null : categoryIdStr;

  const { data, error } = await supabase
    .from("expenses")
    .insert({
      user_id: user.id,
      amount,
      description: description.trim(),
      date,
      category_id,
    })
    .select()
    .single();

  if (error) {
    console.error("Create expense error:", error);
    return { error: "Gagal mencatat pengeluaran" };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/expenses");
  return { data };
}

export async function updateExpense(
  id: string,
  _prevState: ActionResult<Expense> | undefined,
  formData: FormData
): Promise<ActionResult<Expense>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await getUser();

  if (!user) return { error: "Unauthorized" };

  const amountStr = formData.get("amount") as string;
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  const categoryIdStr = formData.get("category_id") as string;

  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    return { error: "Jumlah pengeluaran harus lebih besar dari 0" };
  }

  if (!description || description.trim().length === 0) {
    return { error: "Deskripsi pengeluaran wajib diisi" };
  }
  if (description.length > 255) {
    return { error: "Deskripsi maksimal 255 karakter" };
  }

  if (!date) {
    return { error: "Tanggal wajib diisi" };
  }

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return { error: "Format tanggal tidak valid" };
  }
  if (parsedDate > new Date()) {
    return { error: "Tanggal tidak boleh lebih dari hari ini" };
  }

  const category_id = categoryIdStr === "unassigned" || !categoryIdStr ? null : categoryIdStr;

  const { data, error } = await supabase
    .from("expenses")
    .update({
      amount,
      description: description.trim(),
      date,
      category_id,
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Update expense error:", error);
    return { error: "Gagal mengupdate pengeluaran" };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/expenses");
  return { data };
}

export async function deleteExpense(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: "Gagal menghapus pengeluaran" };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/expenses");
  return {};
}
