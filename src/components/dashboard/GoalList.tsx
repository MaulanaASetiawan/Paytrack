"use client";

import { useState } from "react";
import type { SavingsGoal } from "@/types/database.types";
import { deleteSavingsGoal } from "@/lib/actions/savings";
import { Edit2, Trash2, ArrowRightLeft, Target, Calendar } from "lucide-react";
import TransactionModal from "./TransactionModal";
import GoalForm from "./GoalForm";

import { toast } from "react-hot-toast";

interface GoalListProps {
  goals: SavingsGoal[];
  walletBalance: number;
}

export default function GoalList({ goals, walletBalance }: GoalListProps) {
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | undefined>(undefined);
  const [transactingGoal, setTransactingGoal] = useState<SavingsGoal | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
      year: "numeric",
    });
  };

  const confirmDelete = async (id: string) => {
    setDeletingId(id);
    const loadingToast = toast.loading("Menghapus target tabungan...");
    try {
      const result = await deleteSavingsGoal(id);
      if (result.error) {
        toast.error(result.error, { id: loadingToast });
      } else {
        toast.success("Target tabungan berhasil dihapus", { id: loadingToast });
      }
    } catch (_e) {
      toast.error("Terjadi kesalahan.", { id: loadingToast });
    } finally {
      setDeletingId(null);
    }
  };

  const handleDelete = (id: string) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium">Yakin ingin menghapus target tabungan ini? (Histori transaksi juga akan terhapus)</span>
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

  if (goals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-800 bg-neutral-900/30 py-16 text-center text-gray-400">
        <Target className="mb-3 h-10 w-10 text-neutral-600" />
        <p className="text-base font-medium text-white">Belum ada target tabungan.</p>
        <p className="text-sm text-neutral-500 mt-1">Buat target baru di atas untuk mulai menabung.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {goals.map((goal) => {
          const isDeleting = deletingId === goal.id;
          const percentage = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100));
          const color = goal.color || "#f97316"; // Default orange
          const isCompleted = goal.is_completed || percentage >= 100;

          return (
            <div 
              key={goal.id} 
              className={`relative flex flex-col justify-between overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 transition-colors hover:bg-neutral-900 ${isCompleted ? 'ring-1 ring-green-500/30' : ''}`}
            >
              {isCompleted && (
                <div className="absolute top-0 right-0 rounded-bl-lg bg-green-500/20 px-2 py-1 text-xs font-bold text-green-500">
                  TERCAPAI
                </div>
              )}

              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="flex h-10 w-10 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${color}20`, color: color }}
                    >
                      <Target className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{goal.name}</h3>
                      {goal.target_date && (
                        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-neutral-400">
                          <Calendar className="h-3 w-3" />
                          <span>Tenggat: {formatDate(goal.target_date)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-white">{formatCurrency(goal.current_amount)}</span>
                    <span className="text-neutral-500">{formatCurrency(goal.target_amount)}</span>
                  </div>

                  <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-neutral-800">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{ 
                        width: `${percentage}%`, 
                        backgroundColor: isCompleted ? '#10b981' : color 
                      }}
                    />
                  </div>
                  <div className="mt-1.5 flex justify-between text-xs text-neutral-400">
                    <span>{percentage}% Tercapai</span>
                    <span>Sisa: {formatCurrency(Math.max(0, goal.target_amount - goal.current_amount))}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-neutral-800 pt-4">
                <button
                  onClick={() => setTransactingGoal(goal)}
                  className="flex items-center gap-2 rounded-md bg-neutral-800 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                  Setor / Tarik
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingGoal(goal)}
                    disabled={isDeleting}
                    title="Edit"
                    className="rounded p-1.5 text-gray-400 hover:text-blue-500 disabled:opacity-50"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    disabled={isDeleting}
                    title="Hapus"
                    className="rounded p-1.5 text-gray-400 hover:text-red-500 disabled:opacity-50"
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
              </div>
            </div>
          );
        })}
      </div>

      {transactingGoal && (
        <TransactionModal 
          goal={transactingGoal} 
          walletBalance={walletBalance}
          onClose={() => setTransactingGoal(undefined)} 
        />
      )}

      {editingGoal && (
        <GoalForm 
          goal={editingGoal} 
          onCancel={() => setEditingGoal(undefined)} 
          onSuccess={() => setEditingGoal(undefined)} 
        />
      )}
    </>
  );
}
