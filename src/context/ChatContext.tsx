import { ChatProps } from "@/types/Chat";
import { AppUserProps } from "@/types/User";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import {
  createChatWithUser,
  getAllChatsUser,
} from "@/services/firestore/chatService";
import { sendMessage } from "@/services/firestore/messageService";
import { SendMessageProps } from "@/types/Message";

interface ChatContextProps {
  chats: ChatProps[];
  createChat: (targetUser: AppUserProps) => Promise<void>;
  selectedChat: ChatProps | null;
  selectChat: (chat: ChatProps) => void;
  sendMessage: (message: string) => void;
  isTyping: boolean;
  setTyping: (status: boolean) => void;
  unreadCount: { [chatId: string]: number } | undefined;
}

const ChatContext = createContext<ChatContextProps | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { appUser } = useAuth();
  const [chats, setChats] = useState<ChatProps[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatProps | null>(null);
  const [isTyping, setisTyping] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<{
    [chatId: string]: number;
  }>();

  useEffect(() => {
    const getChats = async () => {
      if (appUser?.uid) {
        const chats = await getAllChatsUser(appUser?.uid);
        setChats(chats);
      }
    };

    getChats();
  }, [appUser?.uid]);

  const createChat = async (targetUser: AppUserProps): Promise<void> => {
    if (!appUser) throw new Error("Usuário não autenticado");

    const newChat = await createChatWithUser(appUser, targetUser);

    setChats((prevChats) => [...prevChats, newChat]);
    setSelectedChat(newChat);
  };

  const sendMessageUser = async (message: string) => {
    if (!selectedChat?.id || !appUser)
      throw new Error("Usuário ou chat não encontrado!");

    await sendMessage({ message, chatId: selectedChat?.id, user: appUser });
  };

  const selectChat = (chatSelected: ChatProps) => {
    setSelectedChat(chatSelected);
  };

  const setTyping = () => {};

  return (
    <ChatContext.Provider
      value={{
        chats,
        selectedChat,
        createChat,
        isTyping,
        unreadCount,
        selectChat,
        sendMessage: sendMessageUser,
        setTyping,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useAuth deve estar dentro de <AuthProvider>");
  return context;
};
