"use client";

import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { ChatProvider } from "@/context/ChatContext";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ChatProvider>
        <Toaster richColors position="top-right" />
        {children}
      </ChatProvider>
    </AuthProvider>
  );
}
