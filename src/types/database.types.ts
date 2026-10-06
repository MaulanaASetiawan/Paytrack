import type { Database } from "@/types/supabase";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Expense = Database["public"]["Tables"]["expenses"]["Row"];
export type RecurringExpense = Database["public"]["Tables"]["recurring_expenses"]["Row"];
export type SavingsGoal = Database["public"]["Tables"]["savings_goals"]["Row"];
export type SavingsTransaction = Database["public"]["Tables"]["savings_transactions"]["Row"];

export type Income = {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  date: string;
  created_at: string;
};

export type NewProfile = Database["public"]["Tables"]["profiles"]["Insert"];
export type NewCategory = Database["public"]["Tables"]["categories"]["Insert"];
export type NewExpense = Database["public"]["Tables"]["expenses"]["Insert"];
export type NewRecurringExpense = Database["public"]["Tables"]["recurring_expenses"]["Insert"];
export type NewSavingsGoal = Database["public"]["Tables"]["savings_goals"]["Insert"];
export type NewSavingsTransaction = Database["public"]["Tables"]["savings_transactions"]["Insert"];

export type UpdateProfile = Database["public"]["Tables"]["profiles"]["Update"];
export type UpdateCategory = Database["public"]["Tables"]["categories"]["Update"];
export type UpdateExpense = Database["public"]["Tables"]["expenses"]["Update"];
export type UpdateRecurringExpense = Database["public"]["Tables"]["recurring_expenses"]["Update"];
export type UpdateSavingsGoal = Database["public"]["Tables"]["savings_goals"]["Update"];
export type UpdateSavingsTransaction = Database["public"]["Tables"]["savings_transactions"]["Update"];

export type ExpenseWithCategory = Expense & {
  categories: Pick<Category, "name" | "color" | "icon" | "budget"> | null;
  is_from_wallet?: boolean;
};

export type RecurringExpenseWithCategory = RecurringExpense & {
  categories: Pick<Category, "name" | "color" | "icon"> | null;
};

export type ActionResult<T = void> = {
  error?: string;
  data?: T;
};
