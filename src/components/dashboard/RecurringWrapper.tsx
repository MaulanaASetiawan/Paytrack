"use client";

import { useState } from "react";
import type { Category, RecurringExpenseWithCategory } from "@/types/database.types";
import RecurringForm from "./RecurringForm";
import RecurringList from "./RecurringList";
import { Plus } from "lucide-react";

interface RecurringWrapperProps {
  categories: Category[];
  expenses: RecurringExpenseWithCategory[];
}

export default function RecurringWrapper({ categories, expenses }: RecurringWrapperProps) {
  const [editingExpense, setEditingExpense] = useState<RecurringExpenseWithCategory | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (expense: RecurringExpenseWithCategory) => {
    setEditingExpense(expense);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditingExpense(undefined);
    setShowForm(false);
  };

  const handleSuccess = () => {
    setEditingExpense(undefined);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {!showForm && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-700"
          >
            <Plus className="h-4 w-4" />
            <span>Buat Templat Baru</span>
          </button>
        </div>
      )}

      {showForm && (
        <RecurringForm
          categories={categories}
          expense={editingExpense}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      )}

      <RecurringList expenses={expenses} onEdit={handleEdit} />
    </div>
  );
}
