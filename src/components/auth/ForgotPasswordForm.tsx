"use client";

import { useActionState } from "react";
import { resetPassword } from "@/lib/actions/auth";

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

export default function ForgotPasswordForm({ onBackToLogin }: ForgotPasswordFormProps) {
  const [state, action, isPending] = useActionState(resetPassword, undefined);

  if (state?.success) {
    return (
      <div className="space-y-6 text-center py-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
          <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-white">Check your email</h2>
          <p className="text-sm text-gray-400">
            {state.success}
          </p>
        </div>
        <button
          onClick={onBackToLogin}
          className="w-full rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
        >
          Back to login
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-white">Reset password</h2>
        <p className="text-sm text-gray-400">
          Enter your email address and we&apos;ll send you a link to reset your password
        </p>
      </div>

      <form action={action} className="space-y-4">
        {state?.error && (
          <div className="rounded-md bg-red-500/10 p-3 text-sm font-medium text-red-500 border border-red-500/20">
            {state.error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-300">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className="w-full rounded-md border border-neutral-700 bg-neutral-800/50 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center h-10"
        >
          {isPending ? (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            "Send reset link"
          )}
        </button>
      </form>

      <div className="text-center text-sm text-gray-400">
        Remember your password?{" "}
        <button
          type="button"
          onClick={onBackToLogin}
          className="font-medium text-orange-500 hover:text-orange-400 hover:underline"
        >
          Back to login
        </button>
      </div>
    </div>
  );
}
