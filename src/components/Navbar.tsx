"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import type { User } from "@supabase/supabase-js";
import AuthModal, { AuthView } from "./auth/AuthModal";
import { signOut } from "@/lib/actions/auth";
import ThemeToggle from "./ThemeToggle";

interface NavbarProps {
  user?: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<AuthView>("login");
  const [isPending, startTransition] = useTransition();

  const openAuthModal = (view: AuthView) => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
    setIsOpen(false);
  };

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut();
    });
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-900 text-white">
        <div className="flex h-[60px] items-center justify-between px-6 md:px-16 lg:px-24">
          <Link href={user ? "/dashboard" : "/"} className="text-lg font-bold tracking-tight text-white hover:opacity-90">
            Paytrack<span className="text-orange-500">.</span>
          </Link>

          <ul className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-300">
            {!user ? (
              <>
                <li>
                  <Link href="/#home" className="transition-colors hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/#about" className="transition-colors hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/#contact" className="transition-colors hover:text-white">
                    Contact
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <Link href="/dashboard" className="transition-colors text-white hover:text-orange-400">
                  Dashboard
                </Link>
              </li>
            )}
          </ul>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <button
                onClick={handleSignOut}
                disabled={isPending}
                className="rounded-md bg-neutral-800 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700 disabled:opacity-50"
              >
                {isPending ? "Signing Out..." : "Sign Out"}
              </button>
            ) : (
              <div className="flex items-center space-x-3 ml-2">
                <button
                  onClick={() => openAuthModal("login")}
                  className="rounded-md px-3.5 py-1.5 text-sm font-medium text-gray-300 transition-colors hover:text-white"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal("register")}
                  className="rounded-md bg-orange-600 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-orange-700"
                >
                  Start using us
                </button>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2 text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-md"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden border-t border-neutral-800 bg-neutral-900 px-6 py-4 shadow-lg">
            <ul className="flex flex-col space-y-4 text-sm font-medium text-gray-300">
              {!user ? (
                <>
                  <li>
                    <Link href="/#home" className="block transition-colors hover:text-white" onClick={() => setIsOpen(false)}>
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/#about" className="block transition-colors hover:text-white" onClick={() => setIsOpen(false)}>
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/#contact" className="block transition-colors hover:text-white" onClick={() => setIsOpen(false)}>
                      Contact
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <Link href="/dashboard" className="block transition-colors text-white hover:text-orange-400" onClick={() => setIsOpen(false)}>
                    Dashboard
                  </Link>
                </li>
              )}
            </ul>
            <div className="mt-6 flex flex-col space-y-3 pt-4 border-t border-neutral-800">
              {user ? (
                <button
                  onClick={handleSignOut}
                  disabled={isPending}
                  className="w-full justify-center rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 disabled:opacity-50"
                >
                  {isPending ? "Signing Out..." : "Sign Out"}
                </button>
              ) : (
                <>
                  <button
                    onClick={() => openAuthModal("login")}
                    className="w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white border border-neutral-700 hover:bg-neutral-800"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuthModal("register")}
                    className="w-full justify-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-700"
                  >
                    Start using us
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialView={authModalView}
      />
    </>
  );
}