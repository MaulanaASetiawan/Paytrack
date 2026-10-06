"use client";

import { useState, useTransition } from "react";
import type { Category } from "@/types/database.types";
import { deleteCategory } from "@/lib/actions/categories";
import { Pencil, Trash2, Tag } from "lucide-react";
import CategoryForm from "./CategoryForm";

import { toast } from "react-hot-toast";

interface CategoryListProps {
  categories: Category[];
}

export default function CategoryList({ categories }: CategoryListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus kategori ini? Pengeluaran yang terkait akan menjadi tanpa kategori.")) {
      const loadingToast = toast.loading("Menghapus kategori...");
      startTransition(async () => {
        const result = await deleteCategory(id);
        if (result?.error) {
          toast.error(result.error, { id: loadingToast });
        } else {
          toast.success("Kategori berhasil dihapus!", { id: loadingToast });
        }
      });
    }
  };

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/30 py-16 text-center">
        <Tag className="mb-4 h-12 w-12 text-neutral-600" />
        <h3 className="text-lg font-medium text-white">Belum ada kategori</h3>
        <p className="mt-1 max-w-sm text-sm text-gray-400">
          Buat kategori pertama Anda untuk mulai mengelompokkan pengeluaran.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <div key={category.id}>
          {editingId === category.id ? (
            <CategoryForm
              category={category}
              existingCategories={categories}
              onCancel={() => setEditingId(null)}
              onSuccess={() => setEditingId(null)}
            />
          ) : (
            <div className="group relative flex h-full flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 transition-colors hover:bg-neutral-800/80 hover:shadow-md">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: category.color ? `${category.color}20` : "#333" }}
                >

                  {category.icon ? (
                    <span className="text-xs text-white opacity-80" style={{ color: category.color || "white" }}>
                      {category.icon.slice(0, 2).toUpperCase()}
                    </span>
                  ) : (
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: category.color || "#FFF" }}
                    />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-white">{category.name}</h4>
                  <p className="text-xs text-gray-500">Dibuat pada {new Date(category.created_at).toLocaleDateString("id-ID")}</p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                <button
                  onClick={() => setEditingId(category.id)}
                  disabled={isPending}
                  className="rounded-md p-1.5 text-gray-400 hover:bg-neutral-700 hover:text-white"
                  aria-label="Edit Kategori"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  disabled={isPending}
                  className="rounded-md p-1.5 text-gray-400 hover:bg-red-500/20 hover:text-red-400"
                  aria-label="Hapus Kategori"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
