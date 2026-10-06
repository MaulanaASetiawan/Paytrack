import { getUserExpenses } from "@/lib/actions/expenses";
import { getUserSavingsGoals } from "@/lib/actions/savings";
import { getUserIncomes, getWalletBalance } from "@/lib/actions/incomes";
import SummaryCard from "@/components/dashboard/SummaryCard";
import { Wallet, Receipt, TrendingUp, Calendar, PiggyBank } from "lucide-react";
import Link from "next/link";
import ExpenseChartsWrapper from "@/components/dashboard/ExpenseChartsWrapper";
import BudgetProgress from "@/components/dashboard/BudgetProgress";
import SavingsPieChartWrapper from "@/components/dashboard/SavingsPieChartWrapper";
import WalletBalanceCard from "@/components/dashboard/WalletBalanceCard";

export const metadata = {
  title: "Dashboard | Paytrack",
};

export default async function DashboardOverview() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const [expenses, categories, savingsGoals, walletData, incomes] = await Promise.all([
    getUserExpenses({
      month: currentMonth,
      year: currentYear,
    }),
    import("@/lib/actions/categories").then((m) => m.getUserCategories()),
    getUserSavingsGoals(),
    getWalletBalance(),
    getUserIncomes(),
  ]);

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const transactionCount = expenses.length;
  const totalSavings = savingsGoals.reduce((sum, goal) => sum + goal.current_amount, 0);
  
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const avgPerDay = totalAmount / daysInMonth;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const monthName = now.toLocaleString("id-ID", { month: "long" });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Ringkasan Bulan Ini</h1>
        <p className="text-sm text-gray-400">
          Ikhtisar pengeluaran Anda untuk bulan {monthName} {currentYear}.
        </p>
      </div>

      <WalletBalanceCard balance={walletData.balance} totalIncome={walletData.totalIncome} incomes={incomes} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900/80 to-neutral-950 p-6 sm:p-8 shadow-lg lg:col-span-2">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-600/10 blur-3xl" />
          
          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-orange-500" />
              <h3 className="text-sm font-medium text-gray-400">Total Pengeluaran</h3>
            </div>
            <p className="mt-1 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white break-words">
              {formatCurrency(totalAmount)}
            </p>
            <p className="mt-2 text-sm text-gray-500">Selama bulan {monthName}</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900/50 to-neutral-950 p-6 sm:p-8 shadow-lg">
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-emerald-600/10 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-2 h-full justify-center">
            <div className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-emerald-500" />
              <h3 className="text-sm font-medium text-gray-400">Total Tabungan Aktif</h3>
            </div>
            <p className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight text-white break-words">
              {formatCurrency(totalSavings)}
            </p>
            <Link href="/dashboard/savings" className="mt-2 text-sm text-emerald-500 hover:text-emerald-400 font-medium">
              Lihat Detail &rarr;
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          title="Transaksi"
          value={transactionCount.toString()}
          description="Jumlah struk/catatan"
          icon={<Receipt className="h-5 w-5" />}
        />
        <SummaryCard
          title="Rata-rata per Hari"
          value={formatCurrency(avgPerDay)}
          description={`Asumsi ${daysInMonth} hari dalam sebulan`}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <div className="flex flex-col justify-center rounded-xl border border-dashed border-neutral-700 bg-neutral-900/20 p-6 text-center transition-colors hover:border-orange-500/50 hover:bg-neutral-800/50">
          <Calendar className="mx-auto mb-2 h-6 w-6 text-orange-500" />
          <h3 className="text-sm font-medium text-white">Catat Pengeluaran</h3>
          <p className="mt-1 text-xs text-gray-400">Punya transaksi baru hari ini?</p>
          <Link
            href="/dashboard/expenses"
            className="mt-3 inline-flex items-center justify-center rounded-md bg-orange-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-orange-700"
          >
            Tambah Baru
          </Link>
        </div>
      </div>

      <BudgetProgress categories={categories} expenses={expenses} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          {expenses.length > 0 && (
            <ExpenseChartsWrapper 
              expenses={expenses} 
              currentYear={currentYear} 
              currentMonth={currentMonth} 
            />
          )}
        </div>
        <div className="xl:col-span-1">
          {totalSavings > 0 ? (
            <SavingsPieChartWrapper goals={savingsGoals} />
          ) : (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/30 p-6 text-center">
              <PiggyBank className="mb-4 h-12 w-12 text-neutral-600" />
              <h3 className="text-base font-medium text-white">Belum Ada Tabungan</h3>
              <p className="mt-2 text-sm text-gray-400">Mulailah menabung untuk masa depan Anda.</p>
              <Link
                href="/dashboard/savings"
                className="mt-4 rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
              >
                Buat Target
              </Link>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
