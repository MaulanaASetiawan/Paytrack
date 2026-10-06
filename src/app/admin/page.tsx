import { getGlobalStats } from "@/lib/actions/admin";
import SummaryCard from "@/components/dashboard/SummaryCard";
import { Users, Tags, ReceiptText, Wallet } from "lucide-react";

export const metadata = {
  title: "Admin Overview | Paytrack",
};

export default async function AdminPage() {
  const stats = await getGlobalStats();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Global Overview</h1>
        <p className="text-sm text-gray-400">
          Statistik keseluruhan platform Paytrack. Anda hanya memiliki akses baca (Read-Only) terhadap data pengguna.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Pengguna"
          value={stats.totalUsers.toString()}
          icon={<Users className="h-5 w-5" />}
        />
        <SummaryCard
          title="Total Kategori"
          value={stats.totalCategories.toString()}
          icon={<Tags className="h-5 w-5" />}
        />
        <SummaryCard
          title="Total Transaksi"
          value={stats.totalExpensesCount.toString()}
          icon={<ReceiptText className="h-5 w-5" />}
        />
        <SummaryCard
          title="Total Nilai Pengeluaran"
          value={formatCurrency(stats.totalExpensesAmount)}
          icon={<Wallet className="h-5 w-5" />}
        />
      </div>

      <div className="rounded-xl border border-blue-900/50 bg-blue-900/10 p-6">
        <h3 className="text-sm font-medium text-blue-400">Informasi Keamanan & Privasi</h3>
        <p className="mt-2 text-sm text-gray-400">
          Sebagai administrator, Anda dapat melihat seluruh statistik platform, namun Anda <strong>tidak memiliki izin</strong> untuk mengubah, menghapus, atau membuat data atas nama pengguna lain. Hal ini diatur oleh kebijakan <em>Row Level Security</em> (RLS) di level database untuk menjaga privasi pengguna.
        </p>
      </div>
    </div>
  );
}
