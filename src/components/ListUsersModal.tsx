import { useAuth } from "@/context/AuthContext";
import { getAllAppUsers } from "@/services/firestore/userService";
import { AppUserProps } from "@/types/User";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface ListUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (user: AppUserProps) => void;
}

export default function ListUsersModal({
  isOpen,
  onClose,
  onSelectUser,
}: ListUsersModalProps) {
  const { user: userLogged, appUser } = useAuth();
  const [users, setUsers] = useState<AppUserProps[]>([]);

  useEffect(() => {
    if (isOpen && appUser?.uid) {
      getAllAppUsers(appUser.uid).then(setUsers);
    }
  }, [isOpen, userLogged]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">
            Iniciar novo chat
          </h2>
          <button onClick={onClose}>
            <X className="text-text-secondary hover:text-primary" />
          </button>
        </div>

        <div className="scrollbar-thin scrollbar-thumb-primary/50 scrollbar-thumb-rounded-md flex max-h-96 flex-col gap-2 overflow-y-auto pr-1">
          {users.map((user) => (
            <button
              key={user.uid}
              onClick={() => onSelectUser(user)}
              className="flex items-center gap-3 rounded-md p-2 text-left transition hover:bg-background"
            >
              <img
                src={`https://ui-avatars.com/api/?name=${user.nome}&background=5D5FEF&color=fff`}
                alt=""
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-text-primary">
                  {user.nome}
                </span>
                <span className="text-xs text-text-secondary">
                  {user.email}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
