"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-9 rounded-md bg-neutral-800/50 animate-pulse" />;
  }

  return (
    <div className="flex items-center gap-1 rounded-md border border-neutral-700 bg-neutral-800/50 p-1">
      <button
        onClick={() => setTheme("light")}
        className={`rounded p-1.5 transition-colors ${
          theme === "light" ? "bg-white text-orange-500 shadow-sm" : "text-gray-400 hover:text-white"
        }`}
        aria-label="Light mode"
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`rounded p-1.5 transition-colors ${
          theme === "system" ? "bg-neutral-600 text-white shadow-sm" : "text-gray-400 hover:text-white"
        }`}
        aria-label="System theme"
      >
        <Monitor className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`rounded p-1.5 transition-colors ${
          theme === "dark" ? "bg-neutral-900 text-orange-500 shadow-sm border border-neutral-700" : "text-gray-400 hover:text-white"
        }`}
        aria-label="Dark mode"
      >
        <Moon className="h-4 w-4" />
      </button>
    </div>
  );
}
