import { listenMessages } from "@/services/firestore/messageService";
import { ChatProps } from "@/types/Chat";
import { MessageFirebaseProps } from "@/types/Message";
import { Dispatch, SetStateAction, useEffect } from "react";

export function useLoadMessages (
  selectedChat: ChatProps | null, 
  setMessages: Dispatch<SetStateAction<MessageFirebaseProps[]>>
) {
  useEffect(() => {
    if (!selectedChat?.id) return;

    const unsubscribe = listenMessages(selectedChat.id, (msgs) => {
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [selectedChat?.id, setMessages]);
}
