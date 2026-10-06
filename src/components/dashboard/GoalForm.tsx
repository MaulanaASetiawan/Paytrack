"use client";

import { useActionState, useRef, useEffect } from "react";
import { X, Check } from "lucide-react";
import { createSavingsGoal, updateSavingsGoal } from "@/lib/actions/savings";
import type { SavingsGoal } from "@/types/database.types";
import CurrencyInput from "@/components/ui/CurrencyInput";
import { toast } from "react-hot-toast";

interface GoalFormProps {
  goal?: SavingsGoal;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function GoalForm({ goal, onCancel, onSuccess }: GoalFormProps) {
  const isEditing = !!goal;
  
  const updateAction = updateSavingsGoal.bind(null, goal?.id || "");
  const [state, action, isPending] = useActionState(
    isEditing ? updateAction : createSavingsGoal,
    undefined
  );

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.data) {
      if (!isEditing) {
        formRef.current?.reset();
      }
      toast.success(isEditing ? "Target tabungan diperbarui" : "Target tabungan berhasil dibuat");
      onSuccess();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, isEditing, onSuccess]);

  const defaultDate = goal?.target_date 
    ? new Date(goal.target_date).toISOString().split('T')[0]
    : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? "Edit Target Tabungan" : "Buat Target Tabungan"}
          </h2>
          <button onClick={onCancel} className="rounded-md p-2 text-gray-400 hover:bg-neutral-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {state?.error && (
          <div className="mb-6 rounded-md bg-red-500/10 p-3 text-sm font-medium text-red-500 border border-red-500/20">
            {state.error}
          </div>
        )}

        <form action={action} ref={formRef} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium text-gray-400">Nama Target *</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={goal?.name || ""}
              placeholder="Misal: Liburan ke Bali"
              className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {isEditing && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-400">Terkumpul Saat Ini</label>
              <div className="w-full rounded-md border border-neutral-700 bg-neutral-800/50 px-3 py-2 text-sm text-neutral-400">
                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(goal?.current_amount || 0)}
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="target_amount" className="text-sm font-medium text-gray-400">Target Nominal (Rp) *</label>
            <CurrencyInput
              id="target_amount"
              name="target_amount"
              required
              defaultValue={goal?.target_amount || ""}
              placeholder="15.000.000"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="target_date" className="text-sm font-medium text-gray-400">Tenggat Waktu (Opsional)</label>
            <input
              id="target_date"
              name="target_date"
              type="date"
              defaultValue={defaultDate}
              className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="color" className="text-sm font-medium text-gray-400">Warna Kartu (Opsional)</label>
            <div className="flex items-center gap-3">
              <input
                id="color"
                name="color"
                type="color"
                defaultValue={goal?.color || "#f97316"}
                className="h-10 w-20 cursor-pointer rounded-md border border-neutral-700 bg-neutral-800 p-1"
              />
              <span className="text-xs text-gray-500">Pilih warna penanda untuk target ini</span>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isPending}
              className="rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center justify-center gap-2 rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
            >
              {isPending ? (
                <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <Check className="h-4 w-4" />
              )}
              {isEditing ? "Simpan" : "Buat Target"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
