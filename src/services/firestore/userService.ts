import { AppUserProps, NewAppUserProps } from "@/types/User";
import { firestore } from "@/lib/firebase";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  Timestamp,
  getDocs,
  collection,
} from "firebase/firestore";
import { userConverter } from "../firebase/converter/userConverter";
import { getExistingChats } from "./chatService";

const userRef = (uid: string) => {
  return doc(firestore, "users", uid).withConverter(userConverter)
}

const userCollectionConverted = collection(firestore, "users").withConverter(userConverter)

export const createAppUserDoc = async (user: NewAppUserProps) => {
  const data = {
    ...user,
    createdAt: serverTimestamp() as Timestamp, 
  }

  await setDoc(userRef(user.uid), data)
}

export const getAppUserDoc = async (uid: string): Promise<AppUserProps> => {
  const docSnap  = await getDoc(userRef(uid))

  if (!docSnap.exists()) {
    throw new Error("Usuário não encontrado.");
  }

  return docSnap.data();
}

export const getAllAppUsers = async (currentUid: string | null): Promise<AppUserProps[]> => {
  const snapshot = await getDocs(userCollectionConverted);

  const allUsers = snapshot.docs
    .map((doc) => doc.data())
    .filter((user) => user.uid !== currentUid)
  
  const filteredUsers = allUsers.filter((user) => user.uid !== currentUid);

  const existingChats = await getExistingChats(currentUid);

  const usersWithoutChats = filteredUsers.filter((user) => !existingChats.includes(user.uid));

  return usersWithoutChats;

}
  
