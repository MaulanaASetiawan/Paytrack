"use client";

import type { RecurringExpenseWithCategory } from "@/types/database.types";
import { useState } from "react";
import { Trash2, Edit2, Play, Pause, CalendarClock } from "lucide-react";
import { deleteRecurringExpense, toggleRecurringExpenseStatus } from "@/lib/actions/recurring";

import { toast } from "react-hot-toast";

interface RecurringListProps {
  expenses: RecurringExpenseWithCategory[];
  onEdit: (expense: RecurringExpenseWithCategory) => void;
}

export default function RecurringList({ expenses, onEdit }: RecurringListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const translateFrequency = (freq: string) => {
    switch (freq) {
      case 'daily': return 'Harian';
      case 'weekly': return 'Mingguan';
      case 'monthly': return 'Bulanan';
      case 'yearly': return 'Tahunan';
      default: return freq;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus templat ini? (Pengeluaran yang sudah dicatat sebelumnya tidak akan dihapus)")) {
      return;
    }

    setDeletingId(id);
    const loadingToast = toast.loading("Menghapus templat...");
    try {
      const result = await deleteRecurringExpense(id);
      if (result.error) {
        toast.error(result.error, { id: loadingToast });
      } else {
        toast.success("Templat berhasil dihapus", { id: loadingToast });
      }
    } catch (_e) {
      toast.error("Terjadi kesalahan.", { id: loadingToast });
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setTogglingId(id);
    const loadingToast = toast.loading("Mengubah status...");
    try {
      const result = await toggleRecurringExpenseStatus(id, !currentStatus);
      if (result.error) {
        toast.error(result.error, { id: loadingToast });
      } else {
        toast.success(currentStatus ? "Otomatisasi dijeda" : "Otomatisasi diaktifkan", { id: loadingToast });
      }
    } catch (_e) {
      toast.error("Terjadi kesalahan.", { id: loadingToast });
    } finally {
      setTogglingId(null);
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-800 bg-neutral-900/30 py-12 text-center text-gray-400">
        <CalendarClock className="mb-3 h-8 w-8 text-neutral-600" />
        <p>Belum ada templat pengeluaran otomatis.</p>
        <p className="text-xs text-neutral-500 mt-1">Buat templat baru di atas untuk memulai.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-900/50">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-neutral-800 bg-neutral-800/50 text-xs uppercase text-gray-400">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">Status</th>
            <th scope="col" className="px-4 py-3 font-medium">Deskripsi</th>
            <th scope="col" className="px-4 py-3 font-medium">Jadwal Selanjutnya</th>
            <th scope="col" className="px-4 py-3 font-medium">Siklus</th>
            <th scope="col" className="px-4 py-3 text-right font-medium">Jumlah</th>
            <th scope="col" className="px-4 py-3 text-right font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800">
          {expenses.map((expense) => {
            const isDeleting = deletingId === expense.id;
            const isToggling = togglingId === expense.id;
            
            return (
              <tr 
                key={expense.id} 
                className={`transition-colors hover:bg-neutral-800/30 ${!expense.is_active ? 'opacity-50 grayscale' : ''}`}
              >
                <td className="whitespace-nowrap px-4 py-4">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
                    expense.is_active 
                      ? "bg-green-500/10 text-green-500 border border-green-500/20" 
                      : "bg-neutral-700/50 text-neutral-400 border border-neutral-700"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${expense.is_active ? 'bg-green-500' : 'bg-neutral-500'}`}></span>
                    {expense.is_active ? 'Aktif' : 'Jeda'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium text-white">{expense.description}</div>
                  <div className="mt-1 flex items-center gap-2 text-xs">
                    <span
                      className="inline-flex rounded-full px-1.5 py-0.5"
                      style={{
                        backgroundColor: expense.categories?.color ? `${expense.categories.color}20` : "#333",
                        color: expense.categories?.color || "#AAA",
                      }}
                    >
                      {expense.categories?.name || "Tanpa Kategori"}
                    </span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-gray-300 font-medium">
                  {formatDate(expense.next_date)}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-gray-300">
                  {translateFrequency(expense.frequency)}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-right font-medium text-white">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleToggle(expense.id, expense.is_active)}
                      disabled={isToggling || isDeleting}
                      title={expense.is_active ? "Jeda Otomatisasi" : "Aktifkan Otomatisasi"}
                      className="rounded p-1.5 text-gray-400 transition-colors hover:bg-neutral-800 hover:text-white disabled:opacity-50"
                    >
                      {expense.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => onEdit(expense)}
                      disabled={isDeleting || isToggling}
                      title="Edit"
                      className="rounded p-1.5 text-gray-400 transition-colors hover:bg-neutral-800 hover:text-blue-500 disabled:opacity-50"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      disabled={isDeleting || isToggling}
                      title="Hapus"
                      className="rounded p-1.5 text-gray-400 transition-colors hover:bg-neutral-800 hover:text-red-500 disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
