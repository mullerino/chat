import { Search } from "lucide-react";
import { Input } from "./Input";
import ChatItem from "./ChatItem";
import { useState } from "react";
import ListUsersModal from "./ListUsersModal";

export default function Sidebar() {
  const [modalOpen, setModalOpen] = useState(false);

  const handleModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <aside className="flex h-[80vh] w-96 flex-col gap-6 rounded-lg bg-surface p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-text-primary">Mensagens</h2>

      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Pesquisar..."
          icon={<Search size={16} />}
        />{" "}
        <button
          onClick={handleModal}
          className="h-10 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          + Chat
        </button>
      </div>

      <div className="mt-2 flex-1 space-y-1 overflow-y-auto pr-1">
        <ChatItem />
        <ChatItem />
        <ChatItem />

        {/* <p className="text-sm italic text-text-secondary">
          Nenhum chat encontrado
        </p> */}
      </div>

      <ListUsersModal
        isOpen={modalOpen}
        onClose={handleModal}
        onSelectUser={(selectedUser) => {
          console.log(selectedUser);
          handleModal();
        }}
      />
    </aside>
  );
}
