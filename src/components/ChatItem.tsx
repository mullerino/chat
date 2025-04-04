import { formatTime } from "@/utils/timestampConverter";
import { Timestamp } from "firebase/firestore";

interface ChatItemProps {
  name: string | undefined;
  timestamp: Timestamp | null;
  lastMessage: string;
  unread?: number;
  isActive: boolean;
  onClick: () => void;
}

export default function ChatItem({
  name,
  timestamp,
  lastMessage,
  unread,
  isActive,
  onClick,
}: ChatItemProps) {
  return (
    <div
      className={`flex cursor-pointer items-center gap-3 rounded-md px-4 py-3 text-text-secondary transition-all duration-200 ${
        isActive
          ? "border-l-4 border-violet-500 bg-indigo-50 shadow-sm"
          : "bg-white hover:bg-gray-100"
      }`}
      onClick={onClick}
    >
      <img
        src={`https://ui-avatars.com/api/?name=${name}&background=5D5FEF&color=fff`}
        className="h-12 w-12 rounded-full object-cover"
        alt={`${name}`}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center justify-between">
          <h3 className="truncate text-sm font-medium text-text-primary">
            {name}
          </h3>
          <span className="text-right text-xs">{formatTime(timestamp)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="truncate text-sm">{lastMessage}</span>
          {unread !== 0 && (
            <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-center text-xs font-bold text-primary">
              {unread}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
