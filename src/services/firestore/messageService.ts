import { firestore } from "@/lib/firebase"
import { addDoc, collection, DocumentData, getDocs, onSnapshot, orderBy, query, QuerySnapshot, Timestamp, updateDoc } from "firebase/firestore"
import { messageConverter } from "../firebase/converter/messageConverter"
import { MessageFirebaseProps, SendMessageProps } from "@/types/Message"
import { chatRef } from "./chatService"

const messageCollection = (chatId: string) => {
  return collection(firestore, "chats", chatId, "messages").withConverter(messageConverter)
}

export const sendMessage = async ({ message, chatId, user }: SendMessageProps): Promise<MessageFirebaseProps>=> {
  const ref = messageCollection(chatId)

  const newMessage = {
    text: message,
    time: Timestamp.now(),
    senderId: user?.uid,
    status: "sent",
  };

  await addDoc(ref, newMessage)

  const chatReference = chatRef(chatId)

  await updateDoc(chatReference, {
    lastMessage: message,
    lastMessageSender: user.uid,
    lastMessageTime: Timestamp.now() 
  })

  return newMessage as MessageFirebaseProps
};

export const getMessages = async (chatId: string | undefined): Promise<MessageFirebaseProps[]> => {
  if(chatId) {
    const collectionRef = messageCollection(chatId)
    const q = query(collectionRef, orderBy("time", "asc"))
  
    const snapshot = await getDocs(q)
  
    const messages = snapshot.docs.map((doc) => doc.data())
  
    return messages
  }

  return []
}

export const listenMessages = (chatId: string, callback: (messages: MessageFirebaseProps[]) => void) => {
  const collectionRef = messageCollection(chatId)
  const q = query(collectionRef, orderBy("time", "asc"))

  const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const messages: MessageFirebaseProps[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })) as MessageFirebaseProps[]

    callback(messages)
  })

  return unsubscribe
}
