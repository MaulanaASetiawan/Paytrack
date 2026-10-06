"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Users, ShieldCheck } from "lucide-react";

export default function AdminNav() {
  const pathname = usePathname();

  const links = [
    {
      name: "Global Overview",
      href: "/admin",
      icon: BarChart3,
      exact: true,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      exact: false,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 rounded-md bg-orange-500/10 px-3 py-2 text-sm font-medium text-orange-500">
        <ShieldCheck className="h-5 w-5" />
        <span>Admin Dashboard</span>
      </div>
      <nav className="flex space-x-1 lg:flex-col lg:space-x-0 lg:space-y-1">
        {links.map((link) => {
          const isActive = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
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
    </div>
  );
}
