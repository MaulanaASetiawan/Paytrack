"use client";

import { useState } from "react";
import type { Category } from "@/types/database.types";
import { Check } from "lucide-react";

interface CategorySelectorProps {
  categories: Category[];
  defaultValue?: string;
  name?: string;
}

export default function CategorySelector({ 
  categories, 
  defaultValue = "unassigned", 
  name = "category_id" 
}: CategorySelectorProps) {
  const [selectedId, setSelectedId] = useState<string>(defaultValue);

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={selectedId} />
      
      <div className="flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => setSelectedId("unassigned")}
          className={`flex items-center gap-1.5 rounded-md border px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
            selectedId === "unassigned"
              ? "border-orange-500 bg-orange-500/10 text-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.1)]"
              : "border-neutral-700 bg-neutral-800/40 text-gray-400 hover:border-neutral-500 hover:bg-neutral-800 hover:text-white"
          }`}
        >
          {selectedId === "unassigned" && <Check className="h-3.5 w-3.5" />}
          Tanpa Kategori
        </button>

        {categories.map((cat) => {
          const isSelected = selectedId === cat.id;
          const color = cat.color || "#f97316"; 
          
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedId(cat.id)}
              className={`flex items-center gap-2 rounded-md border px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                isSelected
                  ? "bg-opacity-10 text-white"
                  : "border-neutral-700 bg-neutral-800/40 text-gray-400 hover:border-neutral-500 hover:bg-neutral-800 hover:text-white"
              }`}
              style={
                isSelected 
                  ? { 
                      borderColor: color, 
                      backgroundColor: `${color}1A`,
                      boxShadow: `0 0 12px ${color}33`
                    } 
                  : {}
              }
            >
              {cat.icon && (
                <span className="text-base leading-none drop-shadow-sm">{cat.icon}</span>
              )}
              <span style={{ color: isSelected ? color : undefined }}>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
