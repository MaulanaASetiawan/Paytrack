"use client";

import { useActionState, useRef, useEffect } from "react";
import { createRecurringExpense, updateRecurringExpense } from "@/lib/actions/recurring";
import type { Category, RecurringExpenseWithCategory } from "@/types/database.types";
import { X, Check } from "lucide-react";
import CurrencyInput from "@/components/ui/CurrencyInput";
import CategorySelector from "@/components/ui/CategorySelector";

import { toast } from "react-hot-toast";

interface RecurringFormProps {
  categories: Category[];
  expense?: RecurringExpenseWithCategory;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function RecurringForm({ categories, expense, onCancel, onSuccess }: RecurringFormProps) {
  const isEditing = !!expense;
  
  const updateAction = updateRecurringExpense.bind(null, expense?.id || "");
  const [state, action, isPending] = useActionState(
    isEditing ? updateAction : createRecurringExpense,
    undefined
  );

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.data) {
      if (!isEditing) {
        formRef.current?.reset();
      }
      toast.success(isEditing ? "Templat otomatis diperbarui" : "Templat otomatis berhasil dibuat");
      onSuccess?.();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, isEditing, onSuccess]);

  const defaultDate = expense?.next_date 
    ? new Date(expense.next_date).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  return (
    <form
      ref={formRef}
      action={action}
      className={`relative rounded-lg border border-neutral-800 bg-neutral-900/50 p-4 ${isEditing ? "shadow-md" : ""}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">
          {isEditing ? "Edit Pengeluaran Otomatis" : "Buat Templat Otomatis"}
        </h3>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {state?.error && (
        <div className="mb-4 rounded-md bg-red-500/10 p-3 text-xs font-medium text-red-500 border border-red-500/20">
          {state.error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-12">
        <div className="space-y-1.5 sm:col-span-2 md:col-span-5">
          <label htmlFor="description" className="text-xs font-medium text-gray-400">
            Deskripsi Pengeluaran *
          </label>
          <input
            id="description"
            name="description"
            type="text"
            required
            defaultValue={expense?.description || ""}
            placeholder="Misal: Tagihan Listrik, Internet..."
            className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div className="space-y-1.5 md:col-span-3">
          <label htmlFor="amount" className="text-xs font-medium text-gray-400">
            Jumlah (Rp) *
          </label>
          <CurrencyInput
            id="amount"
            name="amount"
            required
            defaultValue={expense?.amount || ""}
            placeholder="50.000"
          />
        </div>

        <div className="space-y-1.5 md:col-span-4">
          <label htmlFor="frequency" className="text-xs font-medium text-gray-400">
            Frekuensi *
          </label>
          <select
            id="frequency"
            name="frequency"
            defaultValue={expense?.frequency || "monthly"}
            className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm text-white outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          >
            <option value="daily">Harian</option>
            <option value="weekly">Mingguan</option>
            <option value="monthly">Bulanan</option>
            <option value="yearly">Tahunan</option>
          </select>
        </div>

        <div className="space-y-1.5 md:col-span-4">
          <label htmlFor="next_date" className="text-xs font-medium text-gray-400">
            Jadwal Berikutnya *
          </label>
          <input
            id="next_date"
            name="next_date"
            type="date"
            required
            defaultValue={defaultDate}
            className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2 md:col-span-12 mt-2">
          <label className="text-xs font-medium text-gray-400 mb-2 block">
            Pilih Kategori
          </label>
          <CategorySelector 
            categories={categories} 
            defaultValue={expense?.category_id || "unassigned"}
          />
        </div>
        
        <div className="md:col-span-4 flex items-end">
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-1.5 rounded-md bg-orange-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-orange-700 disabled:opacity-50"
          >
            {isPending ? (
              <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <Check className="h-4 w-4" />
            )}
            {isEditing ? "Simpan" : "Buat Templat"}
          </button>
        </div>
      </div>
    </form>
  );
}
