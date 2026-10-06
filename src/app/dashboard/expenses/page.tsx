import { getUserExpenses } from "@/lib/actions/expenses";
import { getUserCategories } from "@/lib/actions/categories";
import ExpenseList from "@/components/dashboard/ExpenseList";
import ExpenseForm from "@/components/dashboard/ExpenseForm";
import ExpenseFilter from "@/components/dashboard/ExpenseFilter";
import ExportCSVButton from "@/components/dashboard/ExportCSVButton";

import { getWalletBalance } from "@/lib/actions/incomes";
import { Wallet } from "lucide-react";

export const metadata = {
  title: "Daftar Pengeluaran | Paytrack",
};

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string; categoryId?: string }>;
}) {

  const params = await searchParams;
  const month = params.month ? parseInt(params.month, 10) : new Date().getMonth() + 1;
  const year = params.year ? parseInt(params.year, 10) : new Date().getFullYear();
  const categoryId = params.categoryId;

  const [expenses, categories, wallet] = await Promise.all([
    getUserExpenses({ month, year, categoryId }),
    getUserCategories(),
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
          <h1 className="text-2xl font-bold tracking-tight text-white">Daftar Pengeluaran</h1>
          <p className="text-sm text-gray-400">
            Kelola dan lacak semua pengeluaran harian Anda.
          </p>
        </div>
        
        {wallet.totalIncome > 0 && (
          <div className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium ${wallet.balance < 0 ? 'border-red-900/50 bg-red-500/10 text-red-500' : 'border-neutral-800 bg-neutral-900 text-neutral-300'}`}>
            <Wallet className="h-4 w-4" />
            <span>Sisa Saldo: {formatCurrency(wallet.balance)}</span>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-6">
        <ExpenseForm categories={categories} />
      </div>

      <div>
        <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-lg font-medium text-white">Riwayat Pengeluaran ({expenses.length})</h2>
          <div className="flex items-center gap-3">
            <ExportCSVButton expenses={expenses} month={month} year={year} />
            <ExpenseFilter />
          </div>
        </div>
        <ExpenseList expenses={expenses} categories={categories} />
      </div>
    </div>
  );
}
