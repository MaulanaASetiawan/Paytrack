import type { ReactNode } from "react";

interface SummaryCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: {
    value: number; // percentage
    isPositive: boolean;
  };
}

export default function SummaryCard({
  title,
  value,
  description,
  icon,
  trend,
}: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 shadow-sm transition-colors hover:bg-neutral-800/80">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        {icon && <div className="text-gray-500">{icon}</div>}
      </div>
      <div className="mt-4 flex items-baseline gap-2 min-w-0">
        <p 
          className="text-2xl sm:text-3xl lg:text-2xl xl:text-3xl font-bold text-white truncate" 
          title={String(value)}
        >
          {value}
        </p>
        {trend && (
          <span
            className={`text-xs font-medium ${
              trend.isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {trend.isPositive ? "+" : "-"}
            {trend.value}%
          </span>
        )}
      </div>
      {description && (
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      )}
    </div>
  );
}
