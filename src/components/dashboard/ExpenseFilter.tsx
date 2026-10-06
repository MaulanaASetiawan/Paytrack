"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

export default function ExpenseFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentMonth = searchParams.get("month") || new Date().getMonth() + 1;
  const currentYear = searchParams.get("year") || new Date().getFullYear();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`${pathname}?${createQueryString("month", e.target.value)}`);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`${pathname}?${createQueryString("year", e.target.value)}`);
  };

  const currentYearNum = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYearNum - i);

  const months = [
    { value: 1, label: "Januari" },
    { value: 2, label: "Februari" },
    { value: 3, label: "Maret" },
    { value: 4, label: "April" },
    { value: 5, label: "Mei" },
    { value: 6, label: "Juni" },
    { value: 7, label: "Juli" },
    { value: 8, label: "Agustus" },
    { value: 9, label: "September" },
    { value: 10, label: "Oktober" },
    { value: 11, label: "November" },
    { value: 12, label: "Desember" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <label htmlFor="month-filter" className="text-sm font-medium text-neutral-400">
          Bulan
        </label>
        <select
          id="month-filter"
          value={currentMonth}
          onChange={handleMonthChange}
          className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm text-white outline-none focus:border-orange-500"
        >
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex items-center gap-2">
        <label htmlFor="year-filter" className="text-sm font-medium text-neutral-400">
          Tahun
        </label>
        <select
          id="year-filter"
          value={currentYear}
          onChange={handleYearChange}
          className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm text-white outline-none focus:border-orange-500"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
