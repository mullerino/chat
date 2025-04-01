import { firestore } from "@/lib/firebase"
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, Timestamp, where } from "firebase/firestore"
import { chatConverter } from "../firebase/converter/chatConverter"
import { ChatProps } from "@/types/Chat"
import { AppUserProps } from "@/types/User"

export const chatRef = (chatId: string) => {
  return doc(firestore, "chats", chatId).withConverter(chatConverter)
}

const chatCollectionConverted = collection(firestore, "chats").withConverter(chatConverter)

export const createChat = async (chat: ChatProps): Promise<ChatProps> => {
  const ref = chatRef(chat.id)
  const existing = await getDoc(ref)

  if(existing.data()) {
    return existing.data() as ChatProps;
  }

  await setDoc(ref, chat);
  return chat;
}

export const createChatWithUser = async (appUser: AppUserProps, selectedUser: AppUserProps): Promise<ChatProps> => {
  const chatId = [appUser.uid, selectedUser.uid].sort().join("_");

  const chat: ChatProps = {
    id: chatId,
    users: [appUser.uid, selectedUser.uid],
    typing: {
      [appUser.uid]: false,
      [selectedUser.uid]: false,
    },
    unreadCountByUser: {
      [appUser.uid]: 0,
      [selectedUser.uid]: 0,
    },
    lastMessage: "",
    lastMessageTime: null,
    lastMessageSender: "",
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp
  }

  const newChat = await createChat(chat)
  return newChat
}

export const getAllChatsUser = async (userUid: string) => {
  const q = query(chatCollectionConverted, where("users", "array-contains", userUid))
  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => doc.data())
}
