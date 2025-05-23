import { auth } from "@/lib/firebase";
import { AppUserProps, LoginProps } from "@/types/User";
import { translateFirebaseError } from "@/utils/translateFirebaseError";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { toast } from "sonner";
import { getAppUserDoc } from "./userService";

interface ILoginProps {
  appUser: AppUserProps,
  firebaseUser: User
}

export const registerUser  = async (email: string, password: string): Promise<User | undefined> => {
  try {
    const createdUser = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    return createdUser.user
  } catch (err: unknown) {
    if (err instanceof Error) {
      const message = translateFirebaseError(err.message);
      toast.error(message);
      throw err;
    }

    toast.error("Ocorreu um erro desconhecido.");
  }
};

export const loginUser = async ({ email, password }: LoginProps): Promise<ILoginProps> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser: User = result.user;

    const appUser = await getAppUserDoc(firebaseUser.uid)

    return { appUser, firebaseUser }
  } catch (err: unknown) {
    if (err instanceof Error) {
      const message = translateFirebaseError(err.message);
      toast.error(message);
      throw err;
    }

    toast.error("Ocorreu um erro desconhecido.");
    throw new Error("Erro desconhecido");
  }
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const listenToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}
