"use client";

import { useState } from "react";
import type { SavingsGoal } from "@/types/database.types";
import GoalForm from "./GoalForm";
import GoalList from "./GoalList";
import { Plus } from "lucide-react";

interface SavingsWrapperProps {
  goals: SavingsGoal[];
  walletBalance: number;
}

export default function SavingsWrapper({ goals, walletBalance }: SavingsWrapperProps) {
  const [showForm, setShowForm] = useState(false);

  const totalTarget = goals.reduce((sum, goal) => sum + goal.target_amount, 0);
  const totalSaved = goals.reduce((sum, goal) => sum + goal.current_amount, 0);
  const globalProgress = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8">

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
          <p className="text-sm font-medium text-gray-400">Total Terkumpul</p>
          <p className="mt-1 text-2xl font-bold text-white">{formatCurrency(totalSaved)}</p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
          <p className="text-sm font-medium text-gray-400">Total Target Global</p>
          <p className="mt-1 text-2xl font-bold text-white">{formatCurrency(totalTarget)}</p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
          <p className="text-sm font-medium text-gray-400">Progres Keseluruhan</p>
          <div className="mt-2 flex items-center gap-3">
            <div className="h-2.5 w-full flex-1 overflow-hidden rounded-full bg-neutral-800">
              <div
                className="h-full rounded-full bg-orange-500 transition-all duration-500 ease-out"
                style={{ width: `${globalProgress}%` }}
              />
            </div>
            <span className="text-sm font-bold text-white">{globalProgress}%</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <h2 className="text-lg font-semibold text-white">Target Tabungan Saya ({goals.length})</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-700"
        >
          <Plus className="h-4 w-4" />
          <span>Buat Target Baru</span>
        </button>
      </div>

      <GoalList goals={goals} walletBalance={walletBalance} />

      {showForm && (
        <GoalForm 
          onCancel={() => setShowForm(false)} 
          onSuccess={() => setShowForm(false)} 
        />
      )}
    </div>
  );
}
