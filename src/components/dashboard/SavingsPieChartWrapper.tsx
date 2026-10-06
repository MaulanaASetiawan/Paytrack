"use client";

import dynamic from "next/dynamic";
import type { SavingsGoal } from "@/types/database.types";

const SavingsPieChart = dynamic(() => import("./SavingsPieChart"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/30 p-6 animate-pulse">
      <div className="h-48 w-48 rounded-full bg-neutral-800" />
    </div>
  ),
});

interface SavingsPieChartWrapperProps {
  goals: SavingsGoal[];
}

export default function SavingsPieChartWrapper(props: SavingsPieChartWrapperProps) {
  return <SavingsPieChart {...props} />;
}
