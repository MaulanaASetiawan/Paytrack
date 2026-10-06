"use server";

import { createClient, getUser } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Income, ActionResult } from "@/types/database.types";

export async function getUserIncomes(): Promise<Income[]> {
  const supabase = await createClient();
  const { data: { user } } = await getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("incomes")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching incomes:", error);
    return [];
  }

  return data as Income[];
}

export async function getWalletBalance(): Promise<{ balance: number; totalIncome: number; totalExpense: number }> {
  const supabase = await createClient();
  const { data: { user } } = await getUser();

  if (!user) return { balance: 0, totalIncome: 0, totalExpense: 0 };

  const { data: incomes } = await supabase
    .from("incomes")
    .select("amount")
    .eq("user_id", user.id);

  const totalIncome = incomes?.reduce((sum, inc) => sum + inc.amount, 0) || 0;

  const { data: expenses } = await supabase
    .from("expenses")
    .select("amount, is_from_wallet")
    .eq("user_id", user.id);

  let totalExpense = 0;
  let totalSavingsReturn = 0;

  expenses?.forEach((exp) => {

    if (exp.is_from_wallet === false) {
      totalSavingsReturn += exp.amount;
    } else {
      totalExpense += exp.amount;
    }
  });

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome + totalSavingsReturn - totalExpense,
  };
}

export async function createIncome(
  _prevState: ActionResult<Income> | undefined,
  formData: FormData
): Promise<ActionResult<Income>> {
  const supabase = await createClient();
  const { data: { user } } = await getUser();

  if (!user) return { error: "Unauthorized" };

  const amountStr = formData.get("amount") as string;
  const description = formData.get("description") as string;
  const dateStr = formData.get("date") as string;

  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    return { error: "Nominal pemasukan tidak valid" };
  }

  if (!description || description.trim().length === 0) {
    return { error: "Deskripsi wajib diisi" };
  }

  if (!dateStr) {
    return { error: "Tanggal wajib diisi" };
  }

  const { data, error } = await supabase
    .from("incomes")
    .insert({
      user_id: user.id,
      amount,
      description: description.trim(),
      date: dateStr,
    })
    .select()
    .single();

  if (error) {
    console.error("Create income error:", error);
    return { error: "Gagal menambahkan pemasukan" };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/wallet");
  return { data };
}

export async function deleteIncome(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("incomes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: "Gagal menghapus pemasukan" };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/wallet");
  return {};
}
