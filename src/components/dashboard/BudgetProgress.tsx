"use client";

import type { ExpenseWithCategory, Category } from "@/types/database.types";
import { useMemo } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface BudgetProgressProps {
  categories: Category[];
  expenses: ExpenseWithCategory[];
}

export default function BudgetProgress({ categories, expenses }: BudgetProgressProps) {
  const budgetStats = useMemo(() => {

    const categoriesWithBudget = categories.filter(
      c => c.budget !== null && c.budget > 0 && c.name.toLowerCase() !== "tabungan"
    );
    
    if (categoriesWithBudget.length === 0) return [];

    const spentPerCategory = expenses.reduce((acc, expense) => {
      const catId = expense.category_id;
      if (catId) {
        if (!acc[catId]) acc[catId] = 0;
        acc[catId] += expense.amount;
      }
      return acc;
    }, {} as Record<string, number>);

    return categoriesWithBudget.map(cat => {
      const spent = spentPerCategory[cat.id] || 0;
      const budget = cat.budget as number;
      const percentage = Math.min((spent / budget) * 100, 100);
      const isOverBudget = spent > budget;
      const isNearBudget = percentage >= 80 && !isOverBudget;
      
      return {
        ...cat,
        spent,
        percentage,
        isOverBudget,
        isNearBudget
      };
    }).sort((a, b) => b.percentage - a.percentage);
  }, [categories, expenses]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (budgetStats.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-white">Realisasi Anggaran</h2>
        <p className="text-sm text-gray-400">Pantau pengeluaran Anda terhadap batas anggaran bulan ini.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {budgetStats.map((stat) => (
          <div key={stat.id} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="h-3 w-3 rounded-full" 
                  style={{ backgroundColor: stat.color || "#FFF" }} 
                />
                <span className="text-sm font-medium text-white">{stat.name}</span>
                {stat.isOverBudget && <AlertCircle className="h-4 w-4 text-red-500" />}
                {!stat.isOverBudget && stat.percentage >= 100 && <CheckCircle2 className="h-4 w-4 text-orange-500" />}
              </div>
              <span className="text-sm font-medium text-white">
                {stat.percentage.toFixed(0)}%
              </span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800">
              <div 
                className={`h-full transition-all duration-500 ${
                  stat.isOverBudget ? "bg-red-500" : stat.isNearBudget ? "bg-orange-500" : "bg-green-500"
                }`}
                style={{ width: `${stat.percentage}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-gray-400">
              <span>Terpakai: {formatCurrency(stat.spent)}</span>
              <span>Batas: {formatCurrency(stat.budget!)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
