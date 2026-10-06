"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { X, Check } from "lucide-react";
import { processSavingsTransaction } from "@/lib/actions/savings";
import type { SavingsGoal } from "@/types/database.types";
import CurrencyInput from "@/components/ui/CurrencyInput";

interface TransactionModalProps {
  goal: SavingsGoal;
  walletBalance: number;
  onClose: () => void;
}

export default function TransactionModal({ goal, walletBalance, onClose }: TransactionModalProps) {
  const [state, action, isPending] = useActionState(processSavingsTransaction, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const [transactionType, setTransactionType] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    if (state?.data) {
      onClose();
    }
  }, [state, onClose]);

  const defaultDate = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Transaksi Tabungan</h2>
          <button onClick={onClose} className="rounded-md p-2 text-gray-400 hover:bg-neutral-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6 rounded-lg bg-neutral-800/50 p-4 flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <p className="text-sm text-gray-400">Target:</p>
            <p className="font-semibold text-white">{goal.name}</p>
            <p className="text-xs text-gray-500 mt-1">
              Dari: {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(goal.target_amount)}
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-sm text-gray-400">Terkumpul Saat Ini:</p>
            <p className="font-semibold text-emerald-500">
              {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(goal.current_amount)}
            </p>
          </div>
        </div>

        {state?.error && (
          <div className="mb-6 rounded-md bg-red-500/10 p-3 text-sm font-medium text-red-500 border border-red-500/20">
            {state.error}
          </div>
        )}

        <form action={action} ref={formRef} className="space-y-4">
          <input type="hidden" name="goal_id" value={goal.id} />
          
          <div className="space-y-1.5">
            <label htmlFor="type" className="text-sm font-medium text-gray-400">Jenis Transaksi *</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="type" 
                  value="deposit" 
                  checked={transactionType === "deposit"}
                  onChange={() => setTransactionType("deposit")}
                  className="text-orange-500 focus:ring-orange-500" 
                />
                <span className="text-sm text-white">Setor (Tambah)</span>
              </label>
              <label className={`flex items-center gap-2 ${goal.is_completed ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                <input 
                  type="radio" 
                  name="type" 
                  value="withdraw" 
                  disabled={goal.is_completed} 
                  checked={transactionType === "withdraw"}
                  onChange={() => setTransactionType("withdraw")}
                  className="text-orange-500 focus:ring-orange-500 disabled:opacity-50" 
                />
                <span className="text-sm text-white">Tarik (Ambil)</span>
              </label>
            </div>
            {goal.is_completed && (
              <p className="text-xs text-orange-400 mt-1">Target sudah tercapai, dana tidak dapat ditarik kembali.</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="amount" className="text-sm font-medium text-gray-400">Jumlah (Rp) *</label>
            <CurrencyInput
              id="amount"
              name="amount"
              required
              placeholder="500.000"
              onValueChange={setAmount}
            />
            {transactionType === "deposit" && amount > walletBalance && (
              <p className="text-xs text-red-400 mt-1">
                Sisa Saldo Utama tidak mencukupi ({new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(walletBalance)}). Silakan Top Up di Dashboard terlebih dahulu sebelum menyetor tabungan.
              </p>
            )}
            {transactionType === "withdraw" && amount > goal.current_amount && (
              <p className="text-xs text-red-400 mt-1">
                Penarikan gagal: Anda tidak bisa menarik melebihi dana yang terkumpul ({new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(goal.current_amount)}).
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="date" className="text-sm font-medium text-gray-400">Tanggal *</label>
            <input
              id="date"
              name="date"
              type="date"
              required
              defaultValue={defaultDate}
              className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="notes" className="text-sm font-medium text-gray-400">Catatan (Opsional)</label>
            <input
              id="notes"
              name="notes"
              type="text"
              placeholder="Catatan transaksi..."
              className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div className="mt-6 rounded-lg border border-orange-500/30 bg-orange-500/5 p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                name="accountability" 
                required 
                className="mt-1 shrink-0 rounded border-gray-600 bg-neutral-800 text-orange-500 focus:ring-orange-500 focus:ring-offset-neutral-900"
              />
              <span className="text-xs text-orange-200">
                <strong>Pernyataan Akuntabilitas:</strong><br />
                Saya mengkonfirmasi bahwa uang fisik sejumlah ini <strong>telah saya pisahkan/transfer</strong> secara nyata di rekening bank atau celengan saya (bukan sekadar angka di aplikasi ini).
              </span>
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending || (transactionType === "deposit" && amount > walletBalance) || (transactionType === "withdraw" && amount > goal.current_amount)}
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
              Proses Transaksi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
