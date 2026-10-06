"use client";

import { useState, useTransition } from "react";
import { Plus, Wallet, ArrowDownToLine, History, Trash2, X } from "lucide-react";
import { createIncome, deleteIncome } from "@/lib/actions/incomes";
import { toast } from "react-hot-toast";
import type { Income } from "@/types/database.types";

interface WalletBalanceCardProps {
  balance: number;
  totalIncome: number;
  incomes: Income[];
}

export default function WalletBalanceCard({ balance, totalIncome, incomes }: WalletBalanceCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [rawAmount, setRawAmount] = useState("");
  const [displayAmount, setDisplayAmount] = useState("");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddIncome = async (formData: FormData) => {
    const loadingToast = toast.loading("Menyimpan pemasukan...");
    startTransition(async () => {
      const result = await createIncome(undefined, formData);
      if (result?.error) {
        toast.error(result.error, { id: loadingToast });
      } else {
        toast.success("Pemasukan berhasil ditambahkan!", { id: loadingToast });
        setIsModalOpen(false);
        setRawAmount("");
        setDisplayAmount("");
      }
    });
  };

  const handleDeleteIncome = async (id: string) => {
    const loadingToast = toast.loading("Menghapus riwayat top up...");
    startTransition(async () => {
      const result = await deleteIncome(id);
      if (result?.error) {
        toast.error(result.error, { id: loadingToast });
      } else {
        toast.success("Riwayat berhasil dihapus!", { id: loadingToast });
      }
    });
  };

  return (
    <>
      <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 sm:p-8 shadow-lg ${balance < 0 ? 'border-red-900/50 from-neutral-900/80 to-red-950/20' : 'border-neutral-800 from-neutral-900/80 to-neutral-950'}`}>
        <div className={`absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl ${balance < 0 ? 'bg-red-600/10' : 'bg-blue-600/10'}`} />
        
        <div className="relative z-10 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between h-full">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Wallet className={`h-5 w-5 ${balance < 0 ? 'text-red-500' : 'text-blue-500'}`} />
              <h3 className="text-sm font-medium text-gray-400">Sisa Saldo Utama</h3>
            </div>
            
            {totalIncome > 0 ? (
              <p className={`mt-1 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight break-words ${balance < 0 ? 'text-red-500' : 'text-white'}`}>
                {formatCurrency(balance)}
              </p>
            ) : (
              <div>
                <p className="mt-1 text-2xl font-bold tracking-tight text-white">Tidak Aktif</p>
                <p className="text-xs text-gray-500 mt-1">Tambahkan pemasukan pertama Anda untuk mengaktifkan fitur Saldo Utama.</p>
              </div>
            )}
          </div>

          <div className="flex gap-2 shrink-0">
            {totalIncome > 0 && (
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="flex items-center justify-center rounded-md border border-neutral-700 bg-neutral-800 p-2 text-gray-400 transition-colors hover:bg-neutral-700 hover:text-white"
                title="Riwayat Top Up"
              >
                <History className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span>Top Up</span>
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-neutral-800 bg-[#0a0a0a] shadow-2xl">
            <div className="border-b border-neutral-800 p-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <ArrowDownToLine className="h-5 w-5 text-blue-500" />
                Tambah Pemasukan
              </h3>
            </div>
            <form action={(formData) => {
              formData.set("amount", rawAmount);
              handleAddIncome(formData);
            }} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Jumlah Pemasukan (Rp)
                </label>
                <input
                  type="text"
                  required
                  value={displayAmount}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setRawAmount(value);
                    setDisplayAmount(value ? parseInt(value).toLocaleString("id-ID") : "");
                  }}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-white placeholder:text-neutral-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Contoh: 5.000.000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Deskripsi
                </label>
                <input
                  type="text"
                  name="description"
                  required
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-white placeholder:text-neutral-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Contoh: Gaji Bulan Ini"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Tanggal
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  defaultValue={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 [color-scheme:dark]"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isPending}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-neutral-800 bg-[#0a0a0a] shadow-2xl flex flex-col max-h-[80vh]">
            <div className="border-b border-neutral-800 p-4 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <History className="h-5 w-5 text-blue-500" />
                Riwayat Top Up
              </h3>
              <button onClick={() => setIsHistoryOpen(false)} className="rounded p-1 text-gray-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-4 flex-1">
              {incomes.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-sm">Belum ada riwayat top up.</div>
              ) : (
                <div className="space-y-3">
                  {incomes.map((income) => (
                    <div key={income.id} className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
                      <div>
                        <p className="text-sm font-medium text-white">{income.description}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(income.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-emerald-500">+{formatCurrency(income.amount)}</span>
                        <button
                          onClick={() => {
                            toast.custom((t) => (
                              <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-neutral-900 shadow-xl rounded-xl border border-neutral-800 pointer-events-auto flex flex-col p-4`}>
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium text-white">Hapus riwayat top up?</p>
                                    <p className="mt-1 text-sm text-gray-400">Saldo utama akan otomatis berkurang menyesuaikan penghapusan ini.</p>
                                  </div>
                                </div>
                                <div className="mt-4 flex gap-2 justify-end">
                                  <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1.5 text-sm font-medium text-gray-400 hover:text-white transition-colors">Batal</button>
                                  <button onClick={() => { toast.dismiss(t.id); handleDeleteIncome(income.id); }} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">Hapus</button>
                                </div>
                              </div>
                            ), { duration: 4000 });
                          }}
                          disabled={isPending}
                          className="rounded p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
