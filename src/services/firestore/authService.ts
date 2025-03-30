import { auth } from "@/lib/firebase";
import { LoginProps } from "@/types/User";
import { translateFirebaseError } from "@/utils/translateFirebaseError";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { toast } from "sonner";
import { getAppUserDoc } from "./userService";

export const registerUser  = async (email: string, password: string): Promise<User> => {
  try {
    const createdUser = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    return createdUser.user
  } catch (err: any) {
    const message = translateFirebaseError(err.code || err.message);
    toast.error(message);
    throw err;
  }
};

export const loginUser = async ({ email, password }: LoginProps) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser: User = result.user;

    const appUser = await getAppUserDoc(firebaseUser.uid)

    return { appUser, firebaseUser }
  } catch (err: any) {
    const message = translateFirebaseError(err.code || err.message);
    toast.error(message);
    throw err;
  }
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const listenToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}
