"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export type AuthActionResult = {
  error?: string;
  success?: string;
};

export async function signIn(
  _prevState: AuthActionResult | undefined,
  formData: FormData
): Promise<AuthActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !email.includes("@")) {
    return { error: "Masukkan alamat email yang valid." };
  }
  if (!password || password.length < 6) {
    return { error: "Password minimal 6 karakter." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Supabase signIn error:", error);

    return { error: error.message === "Invalid login credentials" 
      ? "Email atau password salah." 
      : `Gagal login: ${error.message}` };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role || "user";

    const cookieStore = await cookies();
    cookieStore.set("user_role", role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return { success: role === "admin" ? "/admin" : "/dashboard" };
  }

  return { success: "/dashboard" };
}

export async function signUp(
  _prevState: AuthActionResult | undefined,
  formData: FormData
): Promise<AuthActionResult> {
  const fullName = formData.get("full_name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirm_password") as string;

  if (!fullName || fullName.trim().length < 2) {
    return { error: "Nama lengkap minimal 2 karakter." };
  }
  if (!email || !email.includes("@")) {
    return { error: "Masukkan alamat email yang valid." };
  }
  if (!password || password.length < 6) {
    return { error: "Password minimal 6 karakter." };
  }
  if (password !== confirmPassword) {
    return { error: "Konfirmasi password tidak cocok." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName.trim(),
      },
    },
  });

  if (error) {
    console.error("Supabase signUp error:", error);
    if (error.message.includes("already registered")) {
      return { error: "Email sudah terdaftar. Silakan login." };
    }
    return { error: `Gagal mendaftar: ${error.message}` };
  }

  if (!data.session) {
    return { success: "Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi akun sebelum login." };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  
  const cookieStore = await cookies();
  cookieStore.delete("user_role");
  
  revalidatePath("/", "layout");
  redirect("/");
}

export async function resetPassword(
  _prevState: AuthActionResult | undefined,
  formData: FormData
): Promise<AuthActionResult> {
  const email = formData.get("email") as string;

  if (!email || !email.includes("@")) {
    return { error: "Masukkan alamat email yang valid." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL ? "" : "http://localhost:3000"}/auth/callback?type=recovery`,
  });

  if (error) {
    return { error: "Gagal mengirim email reset. Silakan coba lagi." };
  }

  return { success: "Link reset password telah dikirim ke email Anda." };
}
