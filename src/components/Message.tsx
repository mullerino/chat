import { MessageProps } from "@/types/Message";

export default function Message({
  text,
  time,
  isOwnMessage = false,
}: MessageProps) {
  return (
    <div
      className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"}`}
    >
      <div
        className={`max-w-xs rounded-xl px-4 py-2 ${
          isOwnMessage
            ? "rounded-br-none bg-primary text-white"
            : "rounded-bl-none border border-primary text-primary"
        } `}
      >
        <p className="text-sm">{text}</p>
      </div>

      <span className="mt-1 text-xs text-text-secondary">{time}</span>
    </div>
  );
}
