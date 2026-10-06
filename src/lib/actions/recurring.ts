"use server";

import { createClient, getUser } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { RecurringExpense, RecurringExpenseWithCategory, ActionResult } from "@/types/database.types";

export async function getUserRecurringExpenses(): Promise<RecurringExpenseWithCategory[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("recurring_expenses")
    .select(`
      *,
      categories (name, color, icon)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching recurring expenses:", error);
    return [];
  }

  return data as unknown as RecurringExpenseWithCategory[];
}

export async function createRecurringExpense(
  _prevState: ActionResult<RecurringExpense> | undefined,
  formData: FormData
): Promise<ActionResult<RecurringExpense>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await getUser();

  if (!user) return { error: "Unauthorized" };

  const amountStr = formData.get("amount") as string;
  const description = formData.get("description") as string;
  const frequency = formData.get("frequency") as "daily" | "weekly" | "monthly" | "yearly";
  const nextDate = formData.get("next_date") as string;
  const categoryIdStr = formData.get("category_id") as string;

  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    return { error: "Jumlah pengeluaran harus lebih besar dari 0" };
  }

  if (!description || description.trim().length === 0) {
    return { error: "Deskripsi wajib diisi" };
  }
  if (description.length > 255) {
    return { error: "Deskripsi maksimal 255 karakter" };
  }

  if (!nextDate) {
    return { error: "Tanggal jatuh tempo pertama wajib diisi" };
  }
  
  if (!["daily", "weekly", "monthly", "yearly"].includes(frequency)) {
    return { error: "Frekuensi tidak valid" };
  }

  const category_id = categoryIdStr === "unassigned" || !categoryIdStr ? null : categoryIdStr;

  const { data, error } = await supabase
    .from("recurring_expenses")
    .insert({
      user_id: user.id,
      amount,
      description: description.trim(),
      frequency,
      next_date: nextDate,
      category_id,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    console.error("Create recurring expense error:", error);
    return { error: "Gagal mencatat pengeluaran otomatis" };
  }

  revalidatePath("/dashboard/recurring");
  return { data };
}

export async function updateRecurringExpense(
  id: string,
  _prevState: ActionResult<RecurringExpense> | undefined,
  formData: FormData
): Promise<ActionResult<RecurringExpense>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await getUser();

  if (!user) return { error: "Unauthorized" };

  const amountStr = formData.get("amount") as string;
  const description = formData.get("description") as string;
  const frequency = formData.get("frequency") as "daily" | "weekly" | "monthly" | "yearly";
  const nextDate = formData.get("next_date") as string;
  const categoryIdStr = formData.get("category_id") as string;

  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    return { error: "Jumlah pengeluaran harus lebih besar dari 0" };
  }

  if (!description || description.trim().length === 0) {
    return { error: "Deskripsi wajib diisi" };
  }
  
  if (!nextDate) {
    return { error: "Tanggal jatuh tempo wajib diisi" };
  }

  const category_id = categoryIdStr === "unassigned" || !categoryIdStr ? null : categoryIdStr;

  const { data, error } = await supabase
    .from("recurring_expenses")
    .update({
      amount,
      description: description.trim(),
      frequency,
      next_date: nextDate,
      category_id,
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Update recurring expense error:", error);
    return { error: "Gagal mengupdate pengeluaran otomatis" };
  }

  revalidatePath("/dashboard/recurring");
  return { data };
}

export async function toggleRecurringExpenseStatus(id: string, isActive: boolean): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("recurring_expenses")
    .update({ is_active: isActive })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: "Gagal mengubah status pengeluaran otomatis" };
  }

  revalidatePath("/dashboard/recurring");
  return {};
}

export async function deleteRecurringExpense(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("recurring_expenses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: "Gagal menghapus pengeluaran otomatis" };
  }

  revalidatePath("/dashboard/recurring");
  return {};
}
