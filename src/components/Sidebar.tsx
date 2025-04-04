import { Search } from "lucide-react";
import { Input } from "./Input";
import ChatItem from "./ChatItem";
import { useEffect, useState } from "react";
import ListUsersModal from "./ListUsersModal";
import { useChat } from "@/context/ChatContext";
import { getAppUserDoc } from "@/services/firestore/userService";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const { appUser } = useAuth();
  const {
    changeOtherUser,
    chats,
    selectedChat,
    getUnreadCountMessages,
    selectChat,
    createChat,
  } = useChat();

  const [modalOpen, setModalOpen] = useState(false);
  const [usernames, setUsernames] = useState<{ [key: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState("");

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
          const userId = chat.users.find((id) => id !== appUser?.uid);

          if (userId) {
            const username = await convertUidToUsername(userId);
            usernamesMap[chat.id] = username;
          }
        }),
      );

      setUsernames(usernamesMap);
    };

    fetchUsernames();
  }, [chats, appUser?.uid]);

  return (
    <aside
      className={`flex h-[80vh] flex-col gap-6 rounded-lg bg-surface p-6 shadow-sm md:w-96`}
    >
      <h2 className="text-xl font-semibold text-text-primary">Conversas</h2>

      <div className="flex w-full items-center gap-2">
        <Input
          type="text"
          placeholder="Pesquisar..."
          icon={<Search size={16} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
          chats
            .filter((chat) => {
              const username = usernames[chat.id]?.toLowerCase() || "";
              return username.includes(searchTerm.toLowerCase());
            })
            .map((chat) => {
              if (chat.lastMessage) {
                const username = usernames[chat.id] || "Carregando...";
                const isActive = selectedChat?.id === chat.id;
                const unreadCountMessages = getUnreadCountMessages(chat);

                return (
                  <ChatItem
                    key={chat.id}
                    name={username}
                    timestamp={chat.lastMessageTime}
                    lastMessage={chat.lastMessage}
                    onClick={() => selectChat(chat)}
                    unread={unreadCountMessages}
                    isActive={isActive}
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
          createChat(selectedUser);
          changeOtherUser(selectedUser);
          handleModal();
        }}
      />
    </aside>
  );
}
