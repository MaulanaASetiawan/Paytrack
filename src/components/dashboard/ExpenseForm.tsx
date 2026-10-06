"use client";

import { useActionState, useRef, useEffect } from "react";
import { createExpense, updateExpense } from "@/lib/actions/expenses";
import type { ExpenseWithCategory, Category } from "@/types/database.types";
import { Check } from "lucide-react";
import CurrencyInput from "@/components/ui/CurrencyInput";
import { toast } from "react-hot-toast";
import CategorySelector from "@/components/ui/CategorySelector";

interface ExpenseFormProps {
  expense?: ExpenseWithCategory;
  categories: Category[];
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function ExpenseForm({ expense, categories, onCancel, onSuccess }: ExpenseFormProps) {
  const isEditing = !!expense;
  
  const updateAction = updateExpense.bind(null, expense?.id || "");
  const [state, action, isPending] = useActionState(
    isEditing ? updateAction : createExpense,
    undefined
  );

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.data) {
      if (!isEditing) {
        formRef.current?.reset();
      }
      toast.success(isEditing ? "Pengeluaran berhasil diperbarui" : "Pengeluaran berhasil ditambahkan");
      onSuccess?.();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, isEditing, onSuccess]);

  const today = new Date().toISOString().split("T")[0];

  return (
    <form
      ref={formRef}
      action={action}
      className={`relative rounded-lg border border-neutral-800 bg-neutral-900/50 p-4 ${isEditing ? "shadow-md" : ""}`}
    >
      <div className="mb-4">
        <h3 className="text-sm font-medium text-white">
          {isEditing ? "Edit Pengeluaran" : "Pengeluaran Baru"}
        </h3>
      </div>

      {state?.error && (
        <div className="mb-4 rounded-md bg-red-500/10 p-3 text-xs font-medium text-red-500 border border-red-500/20">
          {state.error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="description" className="text-xs font-medium text-gray-400">
            Deskripsi *
          </label>
          <input
            id="description"
            name="description"
            type="text"
            required
            defaultValue={expense?.description || ""}
            placeholder="Makan siang..."
            className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div className="space-y-1.5">
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

        <div className="space-y-1.5">
          <label htmlFor="date" className="text-xs font-medium text-gray-400">
            Tanggal *
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            max={today}
            defaultValue={expense?.date || today}
            className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2 lg:col-span-4 mt-2">
          <label className="text-xs font-medium text-gray-400 mb-2 block">
            Pilih Kategori
          </label>
          <CategorySelector 
            categories={categories} 
            defaultValue={expense?.category_id || "unassigned"}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            Batal
          </button>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-1.5 rounded-md bg-orange-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-orange-700 disabled:opacity-50"
        >
          {isPending ? (
            <svg className="h-3 w-3 animate-spin text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <Check className="h-3.5 w-3.5" />
          )}
          {isEditing ? "Simpan" : "Tambah"}
        </button>
      </div>
    </form>
  );
}
