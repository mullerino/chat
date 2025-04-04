import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/utils/formatDate";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UsersDetailsModal({
  isOpen,
  onClose,
}: UserDetailsModalProps) {
  const { appUser } = useAuth();

  if (!isOpen) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-[400px] -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-6 shadow-xl">
          <Dialog.Title className="mb-4 text-center text-lg font-semibold text-text-primary">
            Detalhes do usuário
          </Dialog.Title>

          <Dialog.Close className="absolute right-4 top-4 text-xl text-gray-500 transition hover:text-gray-700">
            <X size={20} />
          </Dialog.Close>

          <div className="flex flex-col items-center">
            <img
              src={`https://ui-avatars.com/api/?name=${appUser?.nome}&background=5D5FEF&color=fff`}
              alt="User"
              className="mb-4 h-20 w-20 rounded-full object-cover"
            />

            <p className="text-xl font-semibold text-text-primary">
              {appUser?.nome}
            </p>
            <p className="text-sm text-gray-600">{appUser?.email}</p>

            <div className="mt-4 text-sm text-gray-600">
              <strong>Data de criação:</strong> {formatDate(appUser?.createdAt)}
            </div>
          </div>

          <Dialog.Close className="mt-6 w-full rounded-md bg-primary py-2 text-white transition hover:bg-primary-dark">
            Fechar
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
