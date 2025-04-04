"use client";
import { ChatBox } from "@/components/ChatBox";
import { PrivateRoute } from "@/components/PrivateRoute";
import Sidebar from "@/components/Sidebar";
import UsersDetailsModal from "@/components/UserDetailsModal";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User } from "lucide-react";
import { useState } from "react";

export default function Chat() {
  const { appUser, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <PrivateRoute>
      <div className="flex h-screen w-full flex-col bg-background">
        <header className="flex h-16 w-full items-center justify-end gap-4 bg-primary px-6 shadow-sm">
          <span className="text-sm text-white">{appUser?.nome}</span>
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
        </header>
        <main className="flex flex-1 flex-row items-center justify-center gap-4 p-8">
          <Sidebar />
          <ChatBox />
        </main>
      </div>

      {isModalOpen && (
        <UsersDetailsModal isOpen={isModalOpen} onClose={toggleModal} />
      )}
    </PrivateRoute>
  );
}
