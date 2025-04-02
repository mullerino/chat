import { Search } from "lucide-react";
import { Input } from "./Input";
import ChatItem from "./ChatItem";
import { useEffect, useState } from "react";
import ListUsersModal from "./ListUsersModal";
import { useChat } from "@/context/ChatContext";
import { getAppUserDoc } from "@/services/firestore/userService";

export default function Sidebar() {
  const { changeOtherUser, chats, selectChat } = useChat();

  const [modalOpen, setModalOpen] = useState(false);
  const [usernames, setUsernames] = useState<{ [key: string]: string }>({});

  const handleModal = () => {
    setModalOpen(!modalOpen);
  };

  const convertUidToUsername = async (userId: string) => {
    const user = await getAppUserDoc(userId);
    return user.nome;
  };

  useEffect(() => {
    const fetchUsernames = async () => {
      const usernamesMap: { [key: string]: string } = {};

      await Promise.all(
        chats.map(async (chat) => {
          const userId = chat.users[1];
          const username = await convertUidToUsername(userId);
          usernamesMap[chat.id] = username;
        }),
      );

      setUsernames(usernamesMap);
    };

    fetchUsernames();
  }, [chats]);

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
        {chats.length !== 0 ? (
          chats.map((chat) => {
            if (chat.lastMessage) {
              const username = usernames[chat.id] || "Carregando...";
              return (
                <ChatItem
                  key={chat.id}
                  name={username}
                  timestamp={chat.lastMessageTime}
                  lastMessage={chat.lastMessage}
                  onClick={() => selectChat(chat)}
                />
              );
            }
          })
        ) : (
          <p className="text-sm italic text-text-secondary">
            Nenhum chat encontrado
          </p>
        )}
      </div>

      <ListUsersModal
        isOpen={modalOpen}
        onClose={handleModal}
        onSelectUser={(selectedUser) => {
          changeOtherUser(selectedUser);
          handleModal();
        }}
      />
    </aside>
  );
}
