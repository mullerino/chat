import { firestore } from "@/lib/firebase"
import { addDoc, collection, doc, getDocs, query, setDoc, Timestamp, updateDoc } from "firebase/firestore"
import { messageConverter } from "../firebase/converter/messageConverter"
import { MessageFirebaseProps, SendMessageProps } from "@/types/Message"
import { chatRef } from "./chatService"
import { ChatProps } from "@/types/Chat"

const messageCollection = (chatId: string) => {
  return collection(firestore, "chats", chatId, "messages").withConverter(messageConverter)
}

export const sendMessage = async ({ message, chatId, user }: SendMessageProps) => {
  const ref = messageCollection(chatId)

  const newMessage = {
    text: message,
    time: Timestamp.now(),
    senderId: user?.uid,
    status: "sent",
  };

  await addDoc(ref, newMessage)

  const chatReference = chatRef(chatId)

  updateDoc(chatReference, {
    lastMessage: message,
    lastMessageSender: user.uid,
    lastMessageTime: Timestamp.now() 
  })
};

export const getMessages = async (chatId: string): Promise<MessageFirebaseProps[]>=> {
  // pegar referencia da collection 
  // fazer query para buscar todas as mensagens
  // puxo as mensagens com getDocs passando a query
  // retornar mensagens em forma de lista

  const collectionRef = messageCollection(chatId)
  const q = query(collectionRef)

  const snapshot = await getDocs(q)

  const messages = snapshot.docs.map((doc) => doc.data())

  return messages
}
