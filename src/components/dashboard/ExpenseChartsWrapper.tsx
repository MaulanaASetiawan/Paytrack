"use client";

import dynamic from "next/dynamic";
import type { ExpenseWithCategory } from "@/types/database.types";

const ExpenseCharts = dynamic(() => import("./ExpenseCharts"), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 animate-pulse">
      <div className="h-[350px] rounded-xl border border-neutral-800 bg-neutral-900/30"></div>
      <div className="h-[350px] rounded-xl border border-neutral-800 bg-neutral-900/30"></div>
    </div>
  ),
});

interface ExpenseChartsWrapperProps {
  expenses: ExpenseWithCategory[];
  currentYear: number;
  currentMonth: number;
}

export default function ExpenseChartsWrapper(props: ExpenseChartsWrapperProps) {

  const filteredExpenses = props.expenses.filter(
    (exp) => exp.categories?.name.toLowerCase() !== "tabungan"
  );

  return <ExpenseCharts {...props} expenses={filteredExpenses} />;
}
