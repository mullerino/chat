import { ChevronLeft, Info, Send } from "lucide-react";
import { ChatMessages } from "./ChatMessages";
import { Input } from "./Input";
import { useState } from "react";
import { useChat } from "@/context/ChatContext";
import Typing from "./Typing";
import { useAuth } from "@/context/AuthContext";
import { useTypingStatus } from "@/hooks/useTypingStatus";

export function ChatBox() {
  const { appUser } = useAuth();
  const {
    otherUser,
    messages,
    sendMessage,
    selectedChat,
    readMessages,
    selectChat,
  } = useChat();

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

  const handleReadMessages = () => {
    if (!selectedChat || !appUser) return;

    readMessages(selectedChat.id, appUser?.uid);
  };

  const otherUserId = selectedChat?.users.find((id) => id !== appUser?.uid);
  const isOtherUserTyping = selectedChat?.typing?.[otherUserId ?? ""] || false;

  return (
    <div
      className={`flex h-[80vh] flex-1 flex-col gap-6 rounded-lg bg-surface shadow-sm`}
    >
      <div className="mt-6 flex items-center justify-between px-4 py-2 text-text-secondary">
        {selectedChat && (
          <>
            <div className="flex items-center gap-3">
              <button
                onClick={() => selectChat(null)}
                className="hover:text-primary-dark md:hidden"
              >
                <ChevronLeft size={20} />
              </button>
              <img
                src={`https://ui-avatars.com/api/?name=${otherUser?.nome}&background=5D5FEF&color=fff`}
                alt={`${otherUser?.nome}`}
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
          </>
        )}
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
          className="disabled:cursor-not-allowed"
          onChange={(e) => handleTypingChange(e)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
          disabled={selectedChat ? false : true}
          onClick={handleReadMessages}
          value={message}
          rightIcon={
            <button
              onClick={() => {
                handleSendMessage();
              }}
              disabled={selectedChat ? false : true}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white transition hover:bg-primary-dark disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </button>
          }
        />
      </div>
    </div>
  );
}
