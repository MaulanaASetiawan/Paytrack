import { getUserCategories } from "@/lib/actions/categories";
import CategoryList from "@/components/dashboard/CategoryList";
import CategoryForm from "@/components/dashboard/CategoryForm";

export const metadata = {
  title: "Kategori Pengeluaran | Paytrack",
};

export default async function CategoriesPage() {
  const categories = await getUserCategories();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Kategori Pengeluaran</h1>
        <p className="text-sm text-gray-400">
          Kelola kategori untuk mengelompokkan pengeluaran harian Anda.
        </p>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-6">
        <CategoryForm existingCategories={categories} />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-white">Daftar Kategori ({categories.length})</h2>
        </div>
        <CategoryList categories={categories} />
      </div>
    </div>
  );
}
