import { getUserSavingsGoals } from "@/lib/actions/savings";
import { getWalletBalance } from "@/lib/actions/incomes";
import SavingsWrapper from "@/components/dashboard/SavingsWrapper";
import { Wallet } from "lucide-react";

export const metadata = {
  title: "Tabungan | Paytrack",
};

export default async function SavingsPage() {
  const [goals, wallet] = await Promise.all([
    getUserSavingsGoals(),
    getWalletBalance(),
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Tabungan & Target</h1>
          <p className="text-sm text-gray-400">
            Kelola tabungan Anda berbasis target spesifik. Lacak progres impian Anda.
          </p>
        </div>
        
        {wallet.totalIncome > 0 && (
          <div className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${wallet.balance < 0 ? 'border-red-900/50 bg-red-500/10 text-red-500' : 'border-neutral-800 bg-neutral-900 text-neutral-300'}`}>
            <Wallet className="h-4 w-4" />
            <span>Sisa Saldo: {formatCurrency(wallet.balance)}</span>
          </div>
        )}
      </div>

      <SavingsWrapper goals={goals} walletBalance={wallet.balance} />
    </div>
  );
}
