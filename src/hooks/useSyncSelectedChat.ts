import { ChatProps } from "@/types/Chat";
import { Dispatch, SetStateAction, useEffect } from "react";

export function useSyncSelectedChat(
  chats: ChatProps[],
  selectedChat: ChatProps | null,
  setSelectedChat: Dispatch<SetStateAction<ChatProps | null>>
) {
  useEffect(() => {
    if (!selectedChat || chats.length === 0) return;

    const updatedChat = chats.find((c) => c.id === selectedChat.id);
    if (
      updatedChat &&
      JSON.stringify(updatedChat) !== JSON.stringify(selectedChat)
    ) {
      setSelectedChat(updatedChat);
    }
  }, [chats, selectedChat, setSelectedChat]);
}
