"use server";

import { createClient } from "@/lib/supabase/server";

export async function getGlobalStats() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Forbidden: Admins only");
  }

  const [usersCount, categoriesCount, expensesResult] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("expenses").select("amount"), // Need amounts to sum them up
  ]);

  const totalUsers = usersCount.count || 0;
  const totalCategories = categoriesCount.count || 0;
  const totalExpensesCount = expensesResult.data?.length || 0;
  const totalExpensesAmount = expensesResult.data?.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0
  ) || 0;

  return {
    totalUsers,
    totalCategories,
    totalExpensesCount,
    totalExpensesAmount,
  };
}

export async function getUsersList() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Forbidden: Admins only");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, created_at, last_active_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users list:", error);
    return [];
  }

  return data;
}
