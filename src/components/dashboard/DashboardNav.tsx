"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ReceiptText, Tags, Repeat, PiggyBank } from "lucide-react";

export default function DashboardNav() {
  const pathname = usePathname();

  const links = [
    {
      name: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: "Expenses",
      href: "/dashboard/expenses",
      icon: ReceiptText,
      exact: false,
    },
    {
      name: "Categories",
      href: "/dashboard/categories",
      icon: Tags,
      exact: false,
    },
    {
      name: "Recurring",
      href: "/dashboard/recurring",
      icon: Repeat,
      exact: false,
    },
    {
      name: "Savings",
      href: "/dashboard/savings",
      icon: PiggyBank,
      exact: false,
    },
  ];

  return (
    <nav className="flex w-full space-x-1 overflow-x-auto pb-2 scrollbar-hide lg:flex-col lg:space-x-0 lg:space-y-1 lg:overflow-visible lg:pb-0">
      {links.map((link) => {
        const isActive = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        const Icon = link.icon;

        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex items-center gap-3 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-neutral-800 text-white"
                : "text-gray-400 hover:bg-neutral-800/50 hover:text-white"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon className={`h-4 w-4 ${isActive ? "text-orange-500" : ""}`} />
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
