"use server";

import { createClient, getUser } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { SavingsGoal, SavingsTransaction, ActionResult } from "@/types/database.types";

export async function getUserSavingsGoals(): Promise<SavingsGoal[]> {
  const supabase = await createClient();
  const { data: { user } } = await getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("savings_goals")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching savings goals:", error);
    return [];
  }

  return data as SavingsGoal[];
}

export async function getSavingsTransactions(goalId: string): Promise<SavingsTransaction[]> {
  const supabase = await createClient();
  const { data: { user } } = await getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("savings_transactions")
    .select("*")
    .eq("goal_id", goalId)
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching savings transactions:", error);
    return [];
  }

  return data as SavingsTransaction[];
}

export async function createSavingsGoal(
  _prevState: ActionResult<SavingsGoal> | undefined,
  formData: FormData
): Promise<ActionResult<SavingsGoal>> {
  const supabase = await createClient();
  const { data: { user } } = await getUser();

  if (!user) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const targetAmountStr = formData.get("target_amount") as string;
  const targetDateStr = formData.get("target_date") as string;
  const color = formData.get("color") as string;

  const target_amount = parseFloat(targetAmountStr);
  if (isNaN(target_amount) || target_amount <= 0) {
    return { error: "Target tabungan harus lebih besar dari 0" };
  }

  if (!name || name.trim().length === 0) {
    return { error: "Nama target tabungan wajib diisi" };
  }

  const target_date = targetDateStr ? targetDateStr : null;

  const { data, error } = await supabase
    .from("savings_goals")
    .insert({
      user_id: user.id,
      name: name.trim(),
      target_amount,
      target_date,
      color: color || null,
      current_amount: 0,
      is_completed: false,
    })
    .select()
    .single();

  if (error) {
    console.error("Create savings goal error:", error);
    return { error: "Gagal membuat target tabungan baru" };
  }

  revalidatePath("/dashboard/savings");
  return { data };
}

export async function updateSavingsGoal(
  id: string,
  _prevState: ActionResult<SavingsGoal> | undefined,
  formData: FormData
): Promise<ActionResult<SavingsGoal>> {
  const supabase = await createClient();
  const { data: { user } } = await getUser();

  if (!user) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const targetAmountStr = formData.get("target_amount") as string;
  const targetDateStr = formData.get("target_date") as string;
  const color = formData.get("color") as string;

  const target_amount = parseFloat(targetAmountStr);
  if (isNaN(target_amount) || target_amount <= 0) {
    return { error: "Target tabungan harus lebih besar dari 0" };
  }

  if (!name || name.trim().length === 0) {
    return { error: "Nama target tabungan wajib diisi" };
  }

  const target_date = targetDateStr ? targetDateStr : null;

  const { data: currentData } = await supabase.from("savings_goals").select("current_amount").eq("id", id).single();
  const is_completed = currentData ? currentData.current_amount >= target_amount : false;

  const { data, error } = await supabase
    .from("savings_goals")
    .update({
      name: name.trim(),
      target_amount,
      target_date,
      color: color || null,
      is_completed,
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Update savings goal error:", error);
    return { error: "Gagal mengupdate target tabungan" };
  }

  revalidatePath("/dashboard/savings");
  return { data };
}

export async function processSavingsTransaction(
  _prevState: ActionResult<SavingsTransaction> | undefined,
  formData: FormData
): Promise<ActionResult<SavingsTransaction>> {
  const supabase = await createClient();
  const { data: { user } } = await getUser();

  if (!user) return { error: "Unauthorized" };

  const goalId = formData.get("goal_id") as string;
  const amountStr = formData.get("amount") as string;
  const type = formData.get("type") as "deposit" | "withdraw";
  const dateStr = formData.get("date") as string;
  const notes = formData.get("notes") as string;
  const accountabilityChecked = formData.get("accountability") === "on";

  if (!accountabilityChecked) {
    return { error: "Anda harus mengkonfirmasi bahwa uang fisik telah dipindahkan." };
  }

  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    return { error: "Jumlah nominal transaksi tidak valid" };
  }

  if (!["deposit", "withdraw"].includes(type)) {
    return { error: "Tipe transaksi tidak valid" };
  }

  if (!dateStr) {
    return { error: "Tanggal transaksi wajib diisi" };
  }

  const { data: goal } = await supabase
    .from("savings_goals")
    .select("current_amount, name")
    .eq("id", goalId)
    .eq("user_id", user.id)
    .single();

  if (!goal) return { error: "Target tabungan tidak ditemukan" };

  if (type === "withdraw" && amount > goal.current_amount) {
    return { error: "Jumlah penarikan tidak boleh melebihi saldo tabungan saat ini" };
  }

  let expense_id = null;

  const categoryName = type === "deposit" ? "Tabungan" : "Penarikan Tabungan";
  let { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("user_id", user.id)
    .eq("name", categoryName)
    .single();

  if (!category) {
    const { data: newCat } = await supabase.from("categories").insert({
      user_id: user.id,
      name: categoryName,
      color: type === "deposit" ? "#10b981" : "#ef4444", 
      icon: type === "deposit" ? "PiggyBank" : "Wallet"
    }).select().single();
    category = newCat;
  }

  if (category) {

    const descPrefix = type === "deposit" ? "Setoran Tabungan:" : "Penarikan Tabungan:";
    const { data: expenseRecord } = await supabase.from("expenses").insert({
      user_id: user.id,
      category_id: category.id,
      amount: amount,
      description: `${descPrefix} ${goal.name}${notes ? ` - ${notes}` : ''}`,
      date: dateStr,
      is_from_wallet: type === "deposit"
    }).select().single();

    if (expenseRecord) {
      expense_id = expenseRecord.id;
    }
  }

  const { data, error } = await supabase
    .from("savings_transactions")
    .insert({
      goal_id: goalId,
      user_id: user.id,
      amount,
      type,
      date: dateStr,
      notes: notes?.trim() || null,
      expense_id,
    })
    .select()
    .single();

  if (error) {
    console.error("Transaction error:", error);

    return { error: "Gagal memproses transaksi tabungan" };
  }

  revalidatePath("/dashboard/savings");
  revalidatePath("/dashboard/expenses"); // Force update for the newly added expense
  revalidatePath("/dashboard");
  return { data };
}

export async function deleteSavingsGoal(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("savings_goals")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: "Gagal menghapus target tabungan" };
  }

  revalidatePath("/dashboard/savings");
  return {};
}
