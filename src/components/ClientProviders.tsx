"use client";

import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Toaster richColors position="top-right" />
      {children}
    </AuthProvider>
  );
}
