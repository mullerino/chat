import { ChatProps } from "@/types/Chat";
import { Dispatch, SetStateAction, useEffect } from "react";

export function useAutoSelectFirstChat(
  chats: ChatProps[],
  selectedChat: ChatProps | null,
  setSelectedChat: Dispatch<SetStateAction<ChatProps | null>>
) {
  useEffect(() => {
    if (!selectedChat && chats.length > 0) {
      setSelectedChat(chats[0]);
    }
  }, [chats, selectedChat, setSelectedChat]);

}
