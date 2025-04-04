import { getAppUserDoc } from "@/services/firestore/userService";
import { ChatProps } from "@/types/Chat";
import { AppUserProps } from "@/types/User";
import { Dispatch, SetStateAction, useEffect } from "react";

export function useLoadOtherUser (
  appUser: AppUserProps | null,
  selectedChat: ChatProps | null,
  setOtherUser: Dispatch<SetStateAction<AppUserProps | null>>
) {
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
  }, [selectedChat, appUser?.uid, setOtherUser]);
}
