import { Info, Send } from "lucide-react";
import { ChatMessages } from "./ChatMessages";
import { Input } from "./Input";
import { useRef, useState } from "react";
import { useChat } from "@/context/ChatContext";
import Typing from "./Typing";
import { useAuth } from "@/context/AuthContext";
import { useTypingStatus } from "@/hooks/useTypingStatus";

export function ChatBox() {
  const { appUser } = useAuth();
  const { otherUser, messages, sendMessage, selectedChat } = useChat();

  const [message, setMessage] = useState("");
  const { startTyping, stopTyping } = useTypingStatus(selectedChat);

  const handleTypingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    startTyping();
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    sendMessage(message);
    setMessage("");
    stopTyping();
  };

  const otherUserId = selectedChat?.users.find((id) => id !== appUser?.uid);
  const isOtherUserTyping = selectedChat?.typing?.[otherUserId ?? ""] || false;

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

      <ChatMessages messages={messages} />

      {isOtherUserTyping && (
        <Typing isTyping={true} userName={otherUser?.nome} />
      )}

      <div className="mb-4 px-2">
        <Input
          type="text"
          placeholder="Mensagem"
          onChange={(e) => handleTypingChange(e)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
          value={message}
          rightIcon={
            <button
              onClick={() => {
                handleSendMessage();
              }}
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
