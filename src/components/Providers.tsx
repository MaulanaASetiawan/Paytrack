"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: 'var(--color-neutral-800, #262626)',
            color: '#fff',
            border: '1px solid var(--color-neutral-700, #404040)',
          },
          success: {
            iconTheme: {
              primary: '#10B981', // green-500
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444', // red-500
              secondary: '#fff',
            },
          },
        }} 
      />
    </ThemeProvider>
  );
}
