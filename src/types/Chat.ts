import { Timestamp } from "firebase/firestore";

export interface ChatProps {
  id: string;
  users: string[];
  typing: Record<string, boolean>;
  unreadCountByUser: Record<string, number>;
  lastMessage: string;
  lastMessageSender: string;
  lastMessageTime: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
