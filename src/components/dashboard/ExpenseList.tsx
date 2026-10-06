"use client";

import { useState, useTransition } from "react";
import type { ExpenseWithCategory, Category } from "@/types/database.types";
import { deleteExpense } from "@/lib/actions/expenses";
import { Pencil, Trash2, ReceiptText } from "lucide-react";
import ExpenseForm from "./ExpenseForm";

import { toast } from "react-hot-toast";

interface ExpenseListProps {
  expenses: ExpenseWithCategory[];
  categories: Category[];
}

export default function ExpenseList({ expenses, categories }: ExpenseListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const confirmDelete = (id: string) => {
    const loadingToast = toast.loading("Menghapus pengeluaran...");
    startTransition(async () => {
      const result = await deleteExpense(id);
      if (result?.error) {
        toast.error(result.error, { id: loadingToast });
      } else {
        toast.success("Pengeluaran berhasil dihapus!", { id: loadingToast });
      }
    });
  };

  const handleDelete = (id: string) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium">Yakin ingin menghapus pengeluaran ini?</span>
          <div className="flex justify-end gap-2">
            <button
              className="rounded bg-neutral-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-600 transition-colors"
              onClick={() => toast.dismiss(t.id)}
            >
              Batal
            </button>
            <button
              className="rounded bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500 transition-colors"
              onClick={() => {
                toast.dismiss(t.id);
                confirmDelete(id);
              }}
            >
              Hapus
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/30 py-16 text-center">
        <ReceiptText className="mb-4 h-12 w-12 text-neutral-600" />
        <h3 className="text-lg font-medium text-white">Belum ada pengeluaran</h3>
        <p className="mt-1 max-w-sm text-sm text-gray-400">
          Catat pengeluaran pertama Anda untuk mulai melacak keuangan.
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-[600px] overflow-y-auto space-y-3 pr-2 scrollbar-custom">
      {expenses.map((expense) => (
        <div key={expense.id}>
          {editingId === expense.id ? (
            <ExpenseForm
              expense={expense}
              categories={categories}
              onCancel={() => setEditingId(null)}
              onSuccess={() => setEditingId(null)}
            />
          ) : (
            <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 transition-colors hover:bg-neutral-800/80">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg mt-0.5 sm:mt-0"
                  style={{ backgroundColor: expense.categories?.color ? `${expense.categories.color}20` : "#333" }}
                >
                  {expense.categories?.icon ? (
                    <span className="text-xs font-bold" style={{ color: expense.categories.color || "white" }}>
                      {expense.categories.icon.slice(0, 2).toUpperCase()}
                    </span>
                  ) : (
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: expense.categories?.color || "#FFF" }}
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-white truncate">{expense.description}</h4>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                    <span>{formatDate(expense.date)}</span>
                    <span className="hidden sm:inline">•</span>
                    <span
                      className="rounded-full px-1.5 py-0.5 font-medium whitespace-nowrap"
                      style={{
                        backgroundColor: expense.categories?.color ? `${expense.categories.color}20` : "#333",
                        color: expense.categories?.color || "#AAA",
                      }}
                    >
                      {expense.categories?.name || "Tanpa Kategori"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-neutral-800/50 pt-3 sm:border-0 sm:pt-0">
                <div className="font-medium text-white text-lg sm:text-base">
                  {formatCurrency(expense.amount)}
                </div>
                <div className="flex opacity-100 sm:opacity-0 transition-opacity sm:group-hover:opacity-100 focus-within:opacity-100">
                  <button
                    onClick={() => setEditingId(expense.id)}
                    disabled={isPending}
                    className="rounded-md p-1.5 text-gray-400 hover:bg-neutral-700 hover:text-white"
                    aria-label="Edit Pengeluaran"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    disabled={isPending}
                    className="rounded-md p-1.5 text-gray-400 hover:bg-red-500/20 hover:text-red-400"
                    aria-label="Hapus Pengeluaran"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
