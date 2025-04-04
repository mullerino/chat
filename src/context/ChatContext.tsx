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
  updateTypingUser,
  updateUnreadMessages,
} from "@/services/firestore/chatService";
import {
  markMessagesAsRead,
  sendMessage,
} from "@/services/firestore/messageService";
import { MessageFirebaseProps } from "@/types/Message";
import { useLoadChats } from "@/hooks/useLoadChats";
import { useLoadOtherUser } from "@/hooks/useLoadOtherUser";
import { useAutoSelectFirstChat } from "@/hooks/useAutoSelectFirstChat";
import { useLoadMessages } from "@/hooks/useLoadMessages";
import { useSyncSelectedChat } from "@/hooks/useSyncSelectedChat";

interface ChatContextProps {
  chats: ChatProps[];
  otherUser: AppUserProps | null;
  messages: MessageFirebaseProps[];
  selectedChat: ChatProps | null;
  isTyping: boolean;
  createChat: (targetUser: AppUserProps) => Promise<void>;
  selectChat: (chat: ChatProps | null) => void;
  sendMessage: (message: string) => void;
  changeOtherUser: (user: AppUserProps) => void;
  setTyping: (selectedChat: ChatProps | null, isTyping: boolean) => void;
  getUnreadCountMessages: (selectedChat: ChatProps | null) => number;
  readMessages: (chatId: string, userId: string | undefined) => void;
}

const ChatContext = createContext<ChatContextProps | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { appUser } = useAuth();

  const [chats, setChats] = useState<ChatProps[]>([]);
  const [messages, setMessages] = useState<MessageFirebaseProps[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatProps | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [otherUser, setOtherUser] = useState<AppUserProps | null>(null);

  useEffect(() => {
    if (!appUser?.uid) return;

    setChats([]);
    setSelectedChat(null);
    setMessages([]);
    setIsTyping(false);
    setOtherUser(null);
  }, [appUser?.uid]);

  useLoadChats(appUser, setChats);
  useLoadOtherUser(appUser, selectedChat, setOtherUser);
  //useAutoSelectFirstChat(chats, selectedChat, setSelectedChat);
  useLoadMessages(selectedChat, setMessages);
  useSyncSelectedChat(chats, selectedChat, setSelectedChat);

  const createChat = async (targetUser: AppUserProps): Promise<void> => {
    if (!appUser) throw new Error("Usuário não autenticado");

    const newChat = await createChatWithUser(appUser, targetUser);

    setChats((prevChats) => [...prevChats, newChat]);
    setSelectedChat(newChat);
  };

  const sendMessageAndUpdateUnreadCount = async (message: string) => {
    if (!selectedChat?.id || !appUser)
      throw new Error("Usuário ou chat não encontrado!");

    await sendMessage({
      message,
      chatId: selectedChat?.id,
      user: appUser,
    });

    await updateUnreadMessages(selectedChat, appUser.uid);
  };

  const getUnreadCountMessages = (chat?: ChatProps | null): number => {
    if (!appUser) return 0;

    const unreadCount = chat?.unreadCountByUser;

    const count = unreadCount ? unreadCount[appUser?.uid] : 0;

    return count;
  };

  const selectChat = async (chatSelected: ChatProps | null) => {
    if (!chatSelected) {
      console.log("mostrar chats");
      setSelectedChat(null);
      return;
    }

    await markMessagesAsRead(chatSelected.id, appUser?.uid);
    setSelectedChat(chatSelected);
  };

  const changeOtherUser = (user: AppUserProps) => {
    setOtherUser(user);
  };

  const setTyping = async (
    selectedChat: ChatProps | null,
    isTyping: boolean,
  ) => {
    if (!appUser?.uid || !selectedChat) return;

    await updateTypingUser(appUser?.uid, selectedChat, isTyping);
    setIsTyping(isTyping);
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        otherUser,
        messages,
        selectedChat,
        isTyping,
        readMessages: markMessagesAsRead,
        getUnreadCountMessages,
        changeOtherUser,
        createChat,
        selectChat,
        sendMessage: sendMessageAndUpdateUnreadCount,
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
