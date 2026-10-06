import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { getUser } from "@/lib/supabase/server";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport: Viewport = {
  themeColor: "#f97316", // Orange 500
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "PayTrack",
  description: "Lacak pengeluaran dan kelola keuangan Anda dengan mudah.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PayTrack",
  },
  formatDetection: {
    telephone: false,
  },
};

import Providers from "@/components/Providers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: { user } } = await getUser();

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${inter.className} bg-white dark:bg-eerie-black text-neutral-900 dark:text-white min-h-screen antialiased transition-colors`}>
        <Providers>
          <Navbar user={user} />
          {children}
        </Providers>
      </body>
    </html>
  );
}