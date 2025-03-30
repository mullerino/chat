"use client";
import { AuthProvider } from "@/context/AuthContext";
import { Login } from "./login/page";

export default function Home() {
  return (
    <div>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </div>
  );
}
