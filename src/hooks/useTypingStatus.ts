import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import { ChatProps } from "@/types/Chat";
import { useRef } from "react";

export const useTypingStatus = (chat: ChatProps | null) => {
  const { appUser } = useAuth();
  const { setTyping } = useChat()

  const timeoutRef  = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  const startTyping = () => {
    if (!chat || !appUser?.uid) return;

    if (!isTypingRef.current) {
      setTyping(chat, true);
      isTypingRef.current = true;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setTyping(chat, false);
      isTypingRef.current = false;
    }, 1000);
  };

  const stopTyping = () => {
    if (!chat || !appUser?.uid) return;

    if (isTypingRef.current) {
      setTyping(chat, false);
      isTypingRef.current = false;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  return {
    startTyping,
    stopTyping,
  };
}
