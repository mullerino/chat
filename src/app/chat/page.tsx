"use client";
import { ChatBox } from "@/components/ChatBox";
import { ChatMessages } from "@/components/ChatMessages";
import { Input } from "@/components/Input";
import Message from "@/components/Message";
import { PrivateRoute } from "@/components/PrivateRoute";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import { getAppUserDoc } from "@/services/firestore/userService";
import { AppUserProps } from "@/types/User";
import { Info, LogOut, Send, User } from "lucide-react";
import { useState } from "react";

export default function Chat() {
  const { user, appUser, logout } = useAuth();
  const { selectedChat, createChat } = useChat();

  const [otherUser, setOtherUser] = useState<AppUserProps>();

  const handleOtherUser = async (selectedUser: AppUserProps) => {
    await createChat(selectedUser);
    setOtherUser(selectedUser);
  };

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
          <Sidebar handleOtherUser={handleOtherUser} />
          <ChatBox otherUser={otherUser} />
        </main>
      </div>
    </PrivateRoute>
  );
}
