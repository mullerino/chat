"use client";
import { ChatBox } from "@/components/ChatBox";
import { PrivateRoute } from "@/components/PrivateRoute";
import Sidebar from "@/components/Sidebar";
import UsersDetailsModal from "@/components/UserDetailsModal";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import { LogOut, User } from "lucide-react";
import { useState } from "react";

export default function Chat() {
  const { appUser, logout } = useAuth();
  const { selectedChat } = useChat();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <PrivateRoute>
      <div className="flex h-screen w-full flex-col bg-background">
        <header className="flex h-16 w-full items-center justify-end gap-4 bg-primary px-4 shadow-sm">
          <span className="hidden text-sm text-white md:inline">
            {appUser?.nome}
          </span>
          <div className="flex items-center gap-3">
            <User
              size={22}
              onClick={() => toggleModal()}
              className="cursor-pointer text-white transition hover:text-white/80"
            />
            <LogOut
              size={22}
              className="cursor-pointer text-white transition hover:text-white/80"
              onClick={logout}
            />
          </div>
        </header>
        <main className="flex flex-1 flex-row items-center justify-center gap-4 p-8">
          <div
            className={`w-full md:w-1/3 lg:w-1/4 ${selectedChat ? "hidden" : "block"} md:block`}
          >
            <Sidebar />
          </div>
          <div
            className={`w-full md:w-2/3 lg:w-3/4 ${selectedChat ? "block" : "hidden"} md:block`}
          >
            <ChatBox />
          </div>
        </main>
      </div>

      {isModalOpen && (
        <UsersDetailsModal isOpen={isModalOpen} onClose={toggleModal} />
      )}
    </PrivateRoute>
  );
}
