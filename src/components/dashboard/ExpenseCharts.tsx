"use client";

import { useMemo, useState } from "react";
import type { ExpenseWithCategory, Income } from "@/types/database.types";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface ExpenseChartsProps {
  expenses: ExpenseWithCategory[];
  incomes?: Income[];
  currentYear: number;
  currentMonth: number;
}

export default function ExpenseCharts({ expenses, incomes = [], currentYear, currentMonth }: ExpenseChartsProps) {
  const [trendFilter, setTrendFilter] = useState<"all" | "income" | "expense">("all");

  const categoryData = useMemo(() => {
    const categoryTotals: Record<string, { value: number; color: string }> = {};

    expenses.forEach((expense) => {
      const catName = expense.categories?.name || "Lainnya";
      const catColor = expense.categories?.color || "#525252";

      if (!categoryTotals[catName]) {
        categoryTotals[catName] = { value: 0, color: catColor };
      }
      categoryTotals[catName].value += expense.amount;
    });

    return Object.entries(categoryTotals)
      .map(([name, data]) => ({
        name,
        value: data.value,
        color: data.color,
      }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const dailyTrendData = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

    const dailyTotals = Array.from({ length: daysInMonth }, (_, i) => ({
      day: (i + 1).toString(),
      amount: 0,
      income: 0,
    }));

    expenses.forEach((expense) => {
      const date = new Date(expense.date);

      if (date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear) {
        const dayIndex = date.getDate() - 1;
        if (dayIndex >= 0 && dayIndex < daysInMonth) {
          dailyTotals[dayIndex].amount += expense.amount;
        }
      }
    });

    incomes.forEach((inc) => {
      const date = new Date(inc.date);

      if (date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear) {
        const dayIndex = date.getDate() - 1;
        if (dayIndex >= 0 && dayIndex < daysInMonth) {
          dailyTotals[dayIndex].income += inc.amount;
        }
      }
    });

    return dailyTotals;
  }, [expenses, incomes, currentYear, currentMonth]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name?: string, value: number, dataKey?: string, payload: { day?: string; amount?: number; income?: number } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border border-neutral-700 bg-neutral-900 p-3 shadow-xl space-y-1">
          <p className="text-xs font-semibold text-white">
            {payload[0].name ? payload[0].name : `Tanggal ${data.day}`}
          </p>
          {data.income !== undefined && data.income > 0 && (
            <p className="text-xs font-medium text-emerald-400">
              Masuk: +{formatCurrency(data.income)}
            </p>
          )}
          {data.amount !== undefined && data.amount > 0 && (
            <p className="text-xs font-medium text-orange-400">
              Keluar: -{formatCurrency(data.amount)}
            </p>
          )}
          {(!data.income && !data.amount) && payload[0].value !== undefined && (
            <p className="text-xs font-bold text-orange-400">
              {formatCurrency(payload[0].value)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (expenses.length === 0 && incomes.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

      <div className="flex flex-col rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
        <h3 className="mb-6 text-base font-medium text-white">Distribusi Kategori</h3>
        <div className="flex-1 min-h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
          {categoryData.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-xs text-neutral-400">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h3 className="text-base font-medium text-white">Tren Transaksi Harian</h3>
          <div className="flex items-center gap-1 bg-neutral-800/80 p-0.5 rounded-lg text-xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setTrendFilter("all")}
              className={`px-2 py-1 rounded-md transition-colors ${trendFilter === "all" ? "bg-neutral-700 text-white font-medium" : "text-neutral-400 hover:text-white"}`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => setTrendFilter("income")}
              className={`px-2 py-1 rounded-md transition-colors ${trendFilter === "income" ? "bg-emerald-600/40 text-emerald-300 font-medium" : "text-neutral-400 hover:text-white"}`}
            >
              Uang Masuk
            </button>
            <button
              type="button"
              onClick={() => setTrendFilter("expense")}
              className={`px-2 py-1 rounded-md transition-colors ${trendFilter === "expense" ? "bg-orange-600/40 text-orange-300 font-medium" : "text-neutral-400 hover:text-white"}`}
            >
              Uang Keluar
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 11, fill: '#737373' }} 
                axisLine={false} 
                tickLine={false}
                tickMargin={10}
              />
              <YAxis 
                tickFormatter={(value) => {
                  if (value === 0) return "0";
                  return `Rp${(value / 1000).toFixed(0)}k`;
                }}
                tick={{ fontSize: 11, fill: '#737373' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#262626' }} />
              {(trendFilter === "all" || trendFilter === "income") && (
                <Bar dataKey="income" name="Uang Masuk" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={trendFilter === "all" ? 16 : 36} />
              )}
              {(trendFilter === "all" || trendFilter === "expense") && (
                <Bar dataKey="amount" name="Uang Keluar" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={trendFilter === "all" ? 16 : 36} />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
