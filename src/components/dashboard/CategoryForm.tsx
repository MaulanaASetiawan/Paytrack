"use client";

import { useActionState, useRef, useEffect, useState } from "react";
import { createCategory, updateCategory } from "@/lib/actions/categories";
import type { Category } from "@/types/database.types";
import { Check, Info } from "lucide-react";
import CurrencyInput from "@/components/ui/CurrencyInput";
import { toast } from "react-hot-toast";

interface CategoryFormProps {
  category?: Category;
  existingCategories?: Category[];
  onCancel?: () => void;
  onSuccess?: () => void;
}

const PREDEFINED_COLORS = [
  "#EF4444", "#F97316", "#F59E0B", "#84CC16", "#22C55E", "#10B981", 
  "#06B6D4", "#3B82F6", "#6366F1", "#8B5CF6", "#D946EF", "#F43F5E",
];

const PREDEFINED_ICONS = ["🛒", "🍔", "🚗", "🏠", "💊", "🎮", "📚", "👕", "🎁", "✈️", "💡", "💰"];

export default function CategoryForm({ category, existingCategories = [], onCancel, onSuccess }: CategoryFormProps) {
  const isEditing = !!category;

  const updateAction = updateCategory.bind(null, category?.id || "");
  const [state, action, isPending] = useActionState(
    isEditing ? updateAction : createCategory,
    undefined
  );

  const formRef = useRef<HTMLFormElement>(null);
  
  const [selectedColor, setSelectedColor] = useState(category?.color || "");
  const [selectedIcon, setSelectedIcon] = useState(category?.icon || "");

  const otherCategories = existingCategories.filter(c => c.id !== category?.id);
  const usedColors = otherCategories.map(c => c.color?.toUpperCase());

  useEffect(() => {
    if (!selectedColor && PREDEFINED_COLORS.length > 0) {
      const available = PREDEFINED_COLORS.find(c => !usedColors.includes(c));
      if (available) setSelectedColor(available);
      else setSelectedColor(PREDEFINED_COLORS[0]);
    }
  }, [selectedColor, usedColors]);

  useEffect(() => {
    if (state?.data) {
      if (!isEditing) {
        formRef.current?.reset();
        setSelectedColor("");
        setSelectedIcon("");
      }
      toast.success(isEditing ? "Kategori berhasil diperbarui" : "Kategori berhasil ditambahkan");
      onSuccess?.();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, isEditing, onSuccess]);

  return (
    <form
      ref={formRef}
      action={action}
      className={`relative rounded-lg border border-neutral-800 bg-neutral-900/50 p-4 ${isEditing ? "shadow-md" : ""}`}
    >
      <div className="mb-4">
        <h3 className="text-sm font-medium text-white">
          {isEditing ? "Edit Kategori" : "Kategori Baru"}
        </h3>
      </div>

      {state?.error && (
        <div className="mb-4 rounded-md bg-red-500/10 p-3 text-xs font-medium text-red-500 border border-red-500/20">
          {state.error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-xs font-medium text-gray-400">
              Nama Kategori *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={category?.name || ""}
              placeholder="Contoh: Makanan"
              className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="budget" className="text-xs font-medium text-gray-400">
              Batas Anggaran Bulanan (Rp)
            </label>
            <CurrencyInput
              id="budget"
              name="budget"
              defaultValue={category?.budget || ""}
              placeholder="Opsional"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-400">Warna Kategori *</label>
            </div>
            <input type="hidden" name="color" value={selectedColor} />
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_COLORS.map((color) => {
                const isUsed = usedColors.includes(color);
                const isSelected = selectedColor === color;
                return (
                  <button
                    key={color}
                    type="button"
                    disabled={isUsed}
                    onClick={() => setSelectedColor(color)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-transform ${
                      isSelected ? "ring-2 ring-white ring-offset-2 ring-offset-neutral-900 scale-110" : ""
                    } ${isUsed ? "cursor-not-allowed opacity-20" : "hover:scale-110"}`}
                    style={{ backgroundColor: color }}
                    title={isUsed ? "Warna ini sudah digunakan" : "Pilih warna ini"}
                  >
                    {isSelected && <Check className="h-4 w-4 text-white drop-shadow-md" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400">Ikon Emoji (Opsional)</label>
            <input type="hidden" name="icon" value={selectedIcon} />
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(selectedIcon === icon ? "" : icon)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-lg transition-colors ${
                    selectedIcon === icon ? "bg-neutral-700" : "bg-neutral-800/50 hover:bg-neutral-800"
                  }`}
                >
                  {icon}
                </button>
              ))}
              {selectedIcon && !PREDEFINED_ICONS.includes(selectedIcon) && (
                <div className="flex h-8 items-center justify-center rounded-lg bg-neutral-700 px-2 text-lg">
                  {selectedIcon}
                </div>
              )}
            </div>
            <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-1">
              <Info className="h-3 w-3" /> Pilih ikon atau biarkan kosong
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-2 border-t border-neutral-800 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="rounded-md px-4 py-2 text-xs font-medium text-gray-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            Batal
          </button>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-1.5 rounded-md bg-orange-600 px-6 py-2 text-xs font-medium text-white transition-colors hover:bg-orange-700 disabled:opacity-50"
        >
          {isPending ? (
            <svg className="h-3.5 w-3.5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <Check className="h-4 w-4" />
          )}
          {isEditing ? "Simpan Perubahan" : "Simpan Kategori Baru"}
        </button>
      </div>
    </form>
  );
}
