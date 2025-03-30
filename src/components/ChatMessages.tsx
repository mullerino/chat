"use client";

import Message from "./Message";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageProps } from "@/types/Message";

interface ChatMessagesProps {
  messages: MessageProps[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="scrollbar-thin scrollbar-thumb-primary/50 scrollbar-thumb-rounded-md flex h-[60vh] flex-col gap-3 overflow-y-auto px-4 py-6">
      <AnimatePresence>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Message
              text={msg.text}
              time={msg.time}
              isOwnMessage={msg.isOwnMessage}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      <div ref={bottomRef} />
    </div>
  );
}
