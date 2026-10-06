"use client";

import { useMemo } from "react";
import type { SavingsGoal } from "@/types/database.types";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SavingsPieChartProps {
  goals: SavingsGoal[];
}

export default function SavingsPieChart({ goals }: SavingsPieChartProps) {
  const chartData = useMemo(() => {
    return goals
      .filter((goal) => goal.current_amount > 0)
      .map((goal) => ({
        name: goal.name,
        value: goal.current_amount,
        color: goal.color || "#10b981",
      }))
      .sort((a, b) => b.value - a.value);
  }, [goals]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-neutral-700 bg-neutral-900 p-3 shadow-xl">
          <p className="mb-1 text-sm font-medium text-white">{payload[0].name}</p>
          <p className="text-sm font-bold text-emerald-500">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
      <h3 className="mb-6 text-base font-medium text-white">Distribusi Tabungan</h3>
      <div className="flex-1 w-full flex items-center justify-center min-h-[250px]">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
        {chartData.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-xs text-neutral-400">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
