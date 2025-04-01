import { Timestamp } from "firebase/firestore";
import { AppUserProps } from "./User";

export interface MessageProps {
  id?: string;
  text: string;
  time: string;
  isOwnMessage?: boolean;
}
export interface MessageFirebaseProps {
  id: string;
  text: string;
  time: Timestamp;
  senderId: string;
  status: string;
}

export interface SendMessageProps {
  chatId: string,
  message: string,
  user: AppUserProps
}
