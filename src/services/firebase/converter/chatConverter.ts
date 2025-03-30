import { ChatProps } from "@/types/Chat";
import { FirestoreDataConverter, Timestamp } from "firebase/firestore";

export const chatConverter: FirestoreDataConverter<ChatProps> = {
  toFirestore: (chat) => ({
    ...chat
  }),
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options)

    return {
      id: snapshot.id,
      users: data.users,
      typing: data.typing,
      unreadCountByUser: data.unreadCountByUser,
      lastMessage: data.lastMessage,
      lastMessageSender: data.lastMessageSender,
      createdAt: data.createdAt as Timestamp,
      updatedAt: data.updatedAt as Timestamp,
      lastMessageTime: data.lastMessageTime as Timestamp,
    }
  }
}
