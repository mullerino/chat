"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "firebase/auth";
import {
  AppUserProps,
  createUserProps,
  LoginProps,
  NewAppUserProps,
} from "@/types/User";
import {
  listenToAuthChanges,
  loginUser,
  logoutUser,
  registerUser,
} from "@/services/firestore/authService";
import {
  createAppUserDoc,
  getAppUserDoc,
} from "@/services/firestore/userService";

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

  useEffect(() => {
    const unsubscribe = listenToAuthChanges(async (user) => {
      if (user) {
        setUser(user);
        const appUser = await getAppUserDoc(user.uid);
        setAppUser(appUser);
      } else {
        setUser(null);
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async ({ name, email, password }: createUserProps) => {
    setLoading(true);
    const newUser = await registerUser(email, password);

    const uid = newUser?.uid;

    if (!uid) return;

    const newAppUser: NewAppUserProps = {
      uid,
      nome: name,
      email,
      status: "online",
    };

    await createAppUserDoc(newAppUser);
    setLoading(false);
  };

  const login = async ({ email, password }: LoginProps) => {
    setLoading(true);

    try {
      const { appUser, firebaseUser } = await loginUser({ email, password });

      setUser(firebaseUser);
      setAppUser(appUser);
      setLoading(false);
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutUser();
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
