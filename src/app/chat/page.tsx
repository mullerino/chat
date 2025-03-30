"use client";
import { ChatMessages } from "@/components/ChatMessages";
import { Input } from "@/components/Input";
import Message from "@/components/Message";
import { PrivateRoute } from "@/components/PrivateRoute";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { Info, LogOut, Send, User } from "lucide-react";

export default function Chat() {
  const { user, appUser, logout } = useAuth();

  const mockMessages = [
    {
      id: "1",
      text: "Oi, tudo bem?",
      time: "20:00",
      isOwnMessage: true,
    },
    {
      id: "2",
      text: "Tudo sim! E você?",
      time: "20:01",
      isOwnMessage: false,
    },
    {
      id: "3",
      text: "Tava resolvendo umas coisas do projeto aqui!",
      time: "20:03",
      isOwnMessage: true,
    },
    {
      id: "4",
      text: "Ah, que massa! Depois me mostra.",
      time: "20:05",
      isOwnMessage: false,
    },
    {
      id: "5",
      text: "Ah, que massa! Depois me mostra.",
      time: "20:05",
      isOwnMessage: false,
    },
    {
      id: "6",
      text: "Ah, que massa! Depois me mostra.",
      time: "20:05",
      isOwnMessage: false,
    },
    {
      id: "7",
      text: "Ah, que massa! Depois me mostra.",
      time: "20:05",
      isOwnMessage: false,
    },
  ];

  return (
    <PrivateRoute>
      <div className="flex h-screen w-full flex-col bg-background">
        <header className="flex h-16 w-full items-center justify-end gap-4 bg-primary px-6 shadow-sm">
          <User
            size={22}
            className="cursor-pointer text-white transition hover:text-white/80"
          />
          <LogOut
            size={22}
            className="cursor-pointer text-white transition hover:text-white/80"
            onClick={logout}
          />
        </header>
        <main className="flex flex-1 flex-row items-center justify-center gap-4 p-8">
          <Sidebar />
          <div className="flex h-[80vh] flex-1 flex-col gap-6 rounded-lg bg-surface shadow-sm">
            <div className="mt-6 flex items-center justify-between px-4 py-2 text-text-secondary">
              <div className="flex items-center gap-3">
                <img
                  src={`https://ui-avatars.com/api/?name=Usuario&background=5D5FEF&color=fff`}
                  alt=""
                  className="h-12 w-12 rounded-full border border-border object-cover"
                />
                <div className="flex flex-col">
                  <h3 className="text-textPrimary text-md font-semibold">
                    Leandro
                  </h3>
                  <span className="text-textSecondary text-xs">#3287FDSH3</span>
                </div>
              </div>

              <Info
                size={20}
                className="cursor-pointer text-primary hover:text-primary-dark"
              />
            </div>

            <div className="border border-border"></div>

            <ChatMessages messages={mockMessages} />

            <div className="mb-4 px-2">
              <Input
                type="text"
                placeholder="Mensagem"
                rightIcon={
                  <button className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white transition hover:bg-primary-dark">
                    <Send size={16} />
                  </button>
                }
              />
            </div>
          </div>
        </main>
      </div>
    </PrivateRoute>
  );
}
