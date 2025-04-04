import { listenChatsUser } from "@/services/firestore/chatService";
import { ChatProps } from "@/types/Chat";
import { AppUserProps } from "@/types/User";
import { Dispatch, SetStateAction, useEffect } from "react";

export function useLoadChats (
  user: AppUserProps | null, 
  setChats: Dispatch<SetStateAction<ChatProps[]>>
) {
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = listenChatsUser(user.uid, (chatsUser) => {
      setChats(chatsUser);
    });

    return () => unsubscribe();
  }, [user?.uid, setChats]);
}
