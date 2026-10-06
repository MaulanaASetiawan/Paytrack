import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl">
        <LoginForm
          onSwitchToRegister={() => undefined} // Handled by Next.js router instead
          onSwitchToForgot={() => undefined}
        />

        <div className="mt-6 flex flex-col space-y-2 text-center text-sm text-gray-400">
          <div>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-orange-500 hover:text-orange-400 hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}