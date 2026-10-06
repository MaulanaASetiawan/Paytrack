import { getUserRecurringExpenses } from "@/lib/actions/recurring";
import { getUserCategories } from "@/lib/actions/categories";
import RecurringWrapper from "@/components/dashboard/RecurringWrapper";

export const metadata = {
  title: "Pengeluaran Berulang | Paytrack",
};

export default async function RecurringPage() {
  const [expenses, categories] = await Promise.all([
    getUserRecurringExpenses(),
    getUserCategories(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Pengeluaran Otomatis</h1>
        <p className="text-sm text-gray-400">
          Atur templat untuk tagihan rutin (listrik, internet, dll) agar tercatat otomatis oleh sistem.
        </p>
      </div>

      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
        <p className="text-sm text-blue-200">
          <strong>Info:</strong> Pengeluaran otomatis akan diproses setiap tengah malam (00:00) pada hari jatuh temponya. Sistem akan langsung memasukkan tagihan tersebut ke daftar pengeluaran utama Anda.
        </p>
      </div>

      <RecurringWrapper categories={categories} expenses={expenses} />
    </div>
  );
}
