"use client";
import { Input } from "@/components/Input";
import { Lock, Mail, User } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { useRouter } from "next/navigation";

export default function Login() {
  const { user, loading, register, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/chat");
    }
  }, [user]);

  const [isLogin, setisLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassowrd] = useState("");

  const toogleLoginMode = () => {
    setisLogin(!isLogin);
  };

  const submitForm = async () => {
    isLogin ? handleLogin() : handleRegister();
  };

  const handleLogin = async () => {
    await login({ email, password });
    toast.success("Logado com sucesso!");
    router.push("/chat");
  };

  const handleRegister = async () => {
    await register({ name, email, password });
    toogleLoginMode();
    toast.success("Cadastrado com sucesso!");
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-primary to-primary-dark">
      <div className="relative flex w-full max-w-md flex-col items-center rounded-lg bg-surface p-12 shadow-lg">
        {loading && <LoadingOverlay />}

        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : "register"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex w-full flex-col gap-4"
          >
            <h1 className="mb-6 text-center text-3xl font-bold tracking-wide text-primary">
              {isLogin ? "Seja bem vindo!" : "Crie sua conta"}
            </h1>

            <form className="flex w-full flex-col gap-4">
              {!isLogin && (
                <Input
                  label="Nome"
                  type="text"
                  placeholder="Fulano"
                  id="nome"
                  icon={<User size={16} />}
                  onChange={(e) => setName(e.target.value)}
                />
              )}

              <Input
                label="Email"
                type="email"
                placeholder="seu@email.com"
                id="email"
                icon={<Mail size={16} />}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                label="Senha"
                type="password"
                placeholder="••••••"
                id="senha"
                icon={<Lock size={16} />}
                onChange={(e) => setPassowrd(e.target.value)}
              />

              <p className="mt-4 text-center text-sm text-text-secondary">
                {isLogin ? "Não possui sua conta?" : "Ja possui uma conta?"}{" "}
                <a
                  className="cursor-pointer font-medium text-primary hover:underline"
                  onClick={() => toogleLoginMode()}
                >
                  {isLogin ? "Cadastre-se" : "Entre agora"}{" "}
                </a>
              </p>

              <button
                type="button"
                className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark"
                onClick={submitForm}
              >
                {isLogin ? "Entrar" : "Cadastrar"}
              </button>
            </form>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
