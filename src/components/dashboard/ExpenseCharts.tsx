"use client";

import { useMemo } from "react";
import type { ExpenseWithCategory } from "@/types/database.types";
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
  currentYear: number;
  currentMonth: number;
}

export default function ExpenseCharts({ expenses, currentYear, currentMonth }: ExpenseChartsProps) {

  const categoryData = useMemo(() => {
    const categoryTotals: Record<string, { value: number; color: string }> = {};

    expenses.forEach((expense) => {
      const catName = expense.categories?.name || "Lainnya";
      const catColor = expense.categories?.color || "#525252"; // neutral-600 fallback

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
      .sort((a, b) => b.value - a.value); // Sort descending
  }, [expenses]);

  const dailyTrendData = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

    const dailyTotals = Array.from({ length: daysInMonth }, (_, i) => ({
      day: (i + 1).toString(),
      amount: 0,
    }));

    expenses.forEach((expense) => {
      const date = new Date(expense.date);

      if (date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear) {
        const dayIndex = date.getDate() - 1;
        dailyTotals[dayIndex].amount += expense.amount;
      }
    });

    return dailyTotals;
  }, [expenses, currentYear, currentMonth]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name?: string, value: number, payload: { day?: string } }> }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-neutral-700 bg-neutral-900 p-3 shadow-xl">
          <p className="mb-1 text-sm font-medium text-white">{payload[0].name || `Tanggal ${payload[0].payload.day}`}</p>
          <p className="text-sm font-bold text-orange-500">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (expenses.length === 0) {
    return null; // Don't show charts if there is no data
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
        <h3 className="mb-6 text-base font-medium text-white">Tren Harian</h3>
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
              <Bar dataKey="amount" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
