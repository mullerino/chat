import { firestore } from "@/lib/firebase"
import { addDoc, collection, doc, DocumentData, getDocs, onSnapshot, orderBy, query, QuerySnapshot, Timestamp, updateDoc, writeBatch } from "firebase/firestore"
import { messageConverter } from "../firebase/converter/messageConverter"
import { MessageFirebaseProps, SendMessageProps } from "@/types/Message"
import { chatRef } from "./chatService"

const messagesCollection = (chatId: string) => {
  return collection(firestore, "chats", chatId, "messages").withConverter(messageConverter)
}

export const sendMessage = async ({ message, chatId, user }: SendMessageProps): Promise<MessageFirebaseProps>=> {
  const ref = messagesCollection(chatId)

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
    const collectionRef = messagesCollection(chatId)
    const q = query(collectionRef, orderBy("time", "asc"))
  
    const snapshot = await getDocs(q)
  
    const messages = snapshot.docs.map((doc) => doc.data())
  
    return messages
  }

  return []
}

export const listenMessages = (chatId: string, callback: (messages: MessageFirebaseProps[]) => void) => {
  const collectionRef = messagesCollection(chatId)
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

export const markMessagesAsRead = async (chatId: string, userUid: string | undefined) => {
  const messagesSnapshot = await getDocs(messagesCollection(chatId));

  const batch = writeBatch(firestore);

  messagesSnapshot.forEach((messageDoc) => {
    const messageData = messageDoc.data() as MessageFirebaseProps;

    if (messageData.status === 'sent' && messageData.senderId !== userUid) {
      const messageRef = doc(firestore, "chats", chatId, "messages", messageDoc.id);
      batch.update(messageRef, { status: 'read' });   
    }
  });

  const unreadCountRef = chatRef(chatId);

  batch.update(unreadCountRef, {
    [`unreadCountByUser.${userUid}`]: 0
  });

  await batch.commit();
};
