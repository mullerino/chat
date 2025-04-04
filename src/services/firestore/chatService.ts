import { firestore } from "@/lib/firebase"
import { collection, doc, DocumentData, getDoc, getDocs, increment, onSnapshot, query, QuerySnapshot, serverTimestamp, setDoc, Timestamp, updateDoc, where } from "firebase/firestore"
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

export const updateUnreadMessages = async (chat: ChatProps, userId: string) => {
  const otherUserId = chat.users.find(id => id !== userId)

  const chatReference = chatRef(chat.id)

  await updateDoc(chatReference, {
    [`unreadCountByUser.${otherUserId}`]: increment(1)
  })
}

export const updateTypingUser = async (userUid: string, chat: ChatProps, isTyping: boolean) => {
  const ref = chatRef(chat.id)

  await updateDoc(ref, {
    [`typing.${userUid}`] : isTyping
  })
}

export const getExistingChats = async(currentUid: string | null): Promise<string[]> => {
  if (!currentUid) return [];

  const existingChats: string[] = [];
  
  const snapshot = await getDocs(chatCollectionConverted);
  
  snapshot.docs.forEach((doc) => {
    const chat = doc.data() as ChatProps;
    if (chat.users.includes(currentUid)) {
      const otherUserUid = chat.users.find((uid) => uid !== currentUid);
      
      if (otherUserUid) {
        existingChats.push(otherUserUid);
      }
    }
  });

  return existingChats;
}

export const listenChatsUser = (userUid: string, callback: (chats: ChatProps[]) => void) => {
  const q = query(chatCollectionConverted, where("users", "array-contains", userUid))

  const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const chats = (snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }) as ChatProps)
      .sort((a, b) => {
        const aTime =
        a.lastMessageTime instanceof Date
          ? a.lastMessageTime
          : a.lastMessageTime?.toDate?.() ?? new Date(0);
  
        const bTime =
          b.lastMessageTime instanceof Date
            ? b.lastMessageTime
            : b.lastMessageTime?.toDate?.() ?? new Date(0);
        
        return bTime.getTime() - aTime.getTime();
      })) as ChatProps[];

    callback(chats)
  })

  return unsubscribe
}
