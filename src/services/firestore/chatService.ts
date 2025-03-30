import { firestore } from "@/lib/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { chatConverter } from "../firebase/converter/chatConverter"
import { ChatProps } from "@/types/Chat"

const chatRef = (chatId: string) => {
  return doc(firestore, "chats", chatId).withConverter(chatConverter)
}

export const createChat = async (chat: ChatProps): Promise<ChatProps> => {
  const ref = chatRef(chat.id)
  const existing = await getDoc(ref)

  if(existing) {
    console.log("Já existe chat entre os usuários");
    return existing.data() as ChatProps;
  }

  await setDoc(ref, chat);

  return chat;
}
