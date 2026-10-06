import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function RegisterPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl">
        <RegisterForm
          onSwitchToLogin={() => undefined}
        />
        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-orange-500 hover:text-orange-400 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}