import { Timestamp } from "firebase/firestore"

export interface AppUserProps {
  uid: string
  nome: string
  email: string
  status: "online" | "offline" | "ausente"
  createdAt: Timestamp
}

export interface LoginProps {
  email: string
  password: string
}

export interface createUserProps {
  name: string;
  email: string;
  password: string;
}
