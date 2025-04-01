import { Info, Send } from "lucide-react";
import { ChatMessages } from "./ChatMessages";
import { Input } from "./Input";
import { AppUserProps } from "@/types/User";
import { useState } from "react";
import { useChat } from "@/context/ChatContext";

interface ChatBoxProps {
  otherUser: AppUserProps | undefined;
}

export function ChatBox({ otherUser }: ChatBoxProps) {
  const [message, setMessage] = useState("");
  const { sendMessage } = useChat();

  return (
    <div className="flex h-[80vh] flex-1 flex-col gap-6 rounded-lg bg-surface shadow-sm">
      <div className="mt-6 flex items-center justify-between px-4 py-2 text-text-secondary">
        <div className="flex items-center gap-3">
          <img
            src={`https://ui-avatars.com/api/?name=${otherUser?.nome}&background=5D5FEF&color=fff`}
            alt=""
            className="h-12 w-12 rounded-full border border-border object-cover"
          />
          <div className="flex flex-col">
            <h3 className="text-textPrimary text-md font-semibold">
              {otherUser?.nome}
            </h3>
            <span className="w-20 truncate text-xs text-text-secondary">{`#${otherUser?.uid}`}</span>
          </div>
        </div>

        <Info
          size={20}
          className="cursor-pointer text-primary hover:text-primary-dark"
        />
      </div>

      <div className="border border-border"></div>

      <ChatMessages messages={[]} />

      <div className="mb-4 px-2">
        <Input
          type="text"
          placeholder="Mensagem"
          onChange={(e) => setMessage(e.target.value)}
          rightIcon={
            <button
              onClick={() => sendMessage(message)}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white transition hover:bg-primary-dark"
            >
              <Send size={16} />
            </button>
          }
        />
      </div>
    </div>
  );
}
