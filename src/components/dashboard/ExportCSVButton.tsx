"use client";

import type { ExpenseWithCategory } from "@/types/database.types";
import { Download } from "lucide-react";
import { useState } from "react";

interface ExportCSVButtonProps {
  expenses: ExpenseWithCategory[];
  month: number;
  year: number;
}

export default function ExportCSVButton({ expenses, month, year }: ExportCSVButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    try {
      setIsExporting(true);

      const headers = ["Tanggal", "Deskripsi", "Kategori", "Jumlah (IDR)"];

      const rows = expenses.map((exp) => [
        exp.date,

        `"${exp.description.replace(/"/g, '""')}"`,
        exp.categories?.name || "Tanpa Kategori",
        exp.amount
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Pengeluaran_${year}_${month.toString().padStart(2, "0")}.csv`);
      link.style.visibility = "hidden";
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export CSV", error);
      alert("Gagal mengekspor data ke CSV");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting || expenses.length === 0}
      className="flex items-center gap-2 rounded-md bg-neutral-800 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
      title="Ekspor data ke CSV"
    >
      <Download className="h-4 w-4" />
      <span>{isExporting ? "Mengekspor..." : "Ekspor CSV"}</span>
    </button>
  );
}
