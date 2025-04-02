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
  listenChatsUser,
  updateTypingUser,
} from "@/services/firestore/chatService";
import {
  listenMessages,
  sendMessage,
} from "@/services/firestore/messageService";
import { MessageFirebaseProps } from "@/types/Message";
import { getAppUserDoc } from "@/services/firestore/userService";

interface ChatContextProps {
  chats: ChatProps[];
  otherUser: AppUserProps | null;
  changeOtherUser: (user: AppUserProps) => void;
  messages: MessageFirebaseProps[];
  selectedChat: ChatProps | null;
  isTyping: boolean;
  unreadCount: { [chatId: string]: number } | undefined;
  createChat: (targetUser: AppUserProps) => Promise<void>;
  selectChat: (chat: ChatProps) => void;
  sendMessage: (message: string) => void;
  setTyping: (selectedChat: ChatProps | null, isTyping: boolean) => void;
}

const ChatContext = createContext<ChatContextProps | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { appUser } = useAuth();

  const [chats, setChats] = useState<ChatProps[]>([]);
  const [messages, setMessages] = useState<MessageFirebaseProps[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatProps | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [otherUser, setOtherUser] = useState<AppUserProps | null>(null);
  const [unreadCount, setUnreadCount] = useState<{
    [chatId: string]: number;
  }>();

  useEffect(() => {
    if (!appUser?.uid) return;

    setSelectedChat(null);
    setMessages([]);
    setIsTyping(false);
    setOtherUser(null);
  }, [appUser?.uid]);

  useEffect(() => {
    if (selectedChat) {
      const getOtherUser = async () => {
        const userId = selectedChat.users.find((user) => user !== appUser?.uid);
        if (userId) {
          const user = await getAppUserDoc(userId);
          setOtherUser(user);
        }
      };
      getOtherUser();
    }
  }, [selectedChat]);

  useEffect(() => {
    if (!appUser?.uid) return;

    const unsubscribe = listenChatsUser(appUser.uid, (chatsUser) => {
      setChats(chatsUser);
    });

    return () => unsubscribe();
  }, [appUser?.uid]);

  useEffect(() => {
    if (!selectedChat && chats.length > 0) {
      setSelectedChat(chats[0]);
    }
  }, [chats, selectedChat]);

  useEffect(() => {
    if (!selectedChat || chats.length === 0) return;

    const updatedChat = chats.find((c) => c.id === selectedChat.id);
    if (
      updatedChat &&
      JSON.stringify(updatedChat) !== JSON.stringify(selectedChat)
    ) {
      setSelectedChat(updatedChat);
    }
  }, [chats]);

  useEffect(() => {
    if (!selectedChat?.id) return;

    const unsubscribe = listenMessages(selectedChat.id, (msgs) => {
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [selectedChat?.id]);

  const createChat = async (targetUser: AppUserProps): Promise<void> => {
    if (!appUser) throw new Error("Usuário não autenticado");

    const newChat = await createChatWithUser(appUser, targetUser);

    setChats((prevChats) => [...prevChats, newChat]);
    setSelectedChat(newChat);
  };

  const sendMessageUser = async (message: string) => {
    if (!selectedChat?.id || !appUser)
      throw new Error("Usuário ou chat não encontrado!");

    await sendMessage({
      message,
      chatId: selectedChat?.id,
      user: appUser,
    });
  };

  const changeOtherUserById = async (userId: string) => {
    const user = await getAppUserDoc(userId);
    setOtherUser(user);
  };

  const selectChat = (chatSelected: ChatProps) => {
    setSelectedChat(chatSelected);
    changeOtherUserById(chatSelected.users[1]);
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
        unreadCount,
        changeOtherUser,
        createChat,
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
