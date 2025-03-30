import { FirestoreDataConverter, Timestamp } from "firebase/firestore";
import { AppUserProps } from "@/types/User"

export const userConverter: FirestoreDataConverter<AppUserProps> = {
  toFirestore(user: AppUserProps) {
    return {
      uid: user.uid,
      nome: user.nome,
      email: user.email,
      status: user.status,
      createdAt: user.createdAt,
    };
  },
  fromFirestore(snapshot, options): AppUserProps {
    const data = snapshot.data(options);
    return {
      uid: data.uid,
      nome: data.nome,
      email: data.email,
      status: data.status,
      createdAt: data.createdAt as Timestamp,
    };
  },
};
