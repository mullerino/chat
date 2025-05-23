import { motion } from "framer-motion";

interface TypingProps {
  isTyping: boolean;
  userName: string | undefined;
}

const TypingDots = () => {
  return (
    <span>
      <motion.span
        className="inline-block"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 1, times: [0, 0.5, 1] }}
      >
        .
      </motion.span>
      <motion.span
        className="inline-block"
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          repeat: Infinity,
          duration: 1,
          delay: 0.2,
          times: [0, 0.5, 1],
        }}
      >
        .
      </motion.span>
      <motion.span
        className="inline-block"
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          repeat: Infinity,
          duration: 1,
          delay: 0.4,
          times: [0, 0.5, 1],
        }}
      >
        .
      </motion.span>
    </span>
  );
};

export default function Typing({ isTyping, userName }: TypingProps) {
  if (!isTyping) {
    return null;
  }

  return (
    <div className="ml-6 flex h-8 items-center gap-1 text-sm text-text-secondary">
      <img
        className="h-6 w-6 rounded-full object-cover"
        src={`https://ui-avatars.com/api/?name=${userName}&background=5D5FEF&color=fff`}
        alt={userName || "username"}
      />
      <span className="text-3xl opacity-70">
        <TypingDots />
      </span>
    </div>
  );
}
