import { createContext, ReactNode, useContext, useState } from "react";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { AppUserProps, createUserProps, LoginProps } from "@/types/user";
import { auth, firestore } from "@/lib/firebase";
import { translateFirebaseError } from "@/utils/translateFirebaseError";
import { toast } from "sonner";
import { doc, serverTimestamp, setDoc, Timestamp } from "firebase/firestore";

interface AuthContextProps {
  user: User | null;
  appUser: AppUserProps | null;
  loading: boolean;
  login: ({ email, password }: LoginProps) => Promise<void>;
  register: ({ name, email, password }: createUserProps) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUserProps | null>(null);
  const [loading, setLoading] = useState(true);

  const register = async ({ name, email, password }: createUserProps) => {
    try {
      const createdUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const uid = createdUser.user.uid;

      const newUser: AppUserProps = {
        uid,
        nome: name,
        email,
        status: "online",
        createdAt: serverTimestamp() as Timestamp,
      };

      await setDoc(doc(firestore, "users", uid), newUser);
      setAppUser(newUser);
      setUser(createdUser.user);
    } catch (err: any) {
      const message = translateFirebaseError(err.code || err.message);
      toast.error(message);
      throw err;
    }
  };

  const login = async ({ email, password }: LoginProps) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser: User = result.user;

      setUser(firebaseUser);
    } catch (err: any) {
      const message = translateFirebaseError(err.code || err.message);
      toast.error(message);
      throw err;
    }
  };

  const logout = async () => {
    signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ user, appUser, loading, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve estar dentro de <AuthProvider>");
  return context;
};
