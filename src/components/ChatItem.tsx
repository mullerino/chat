interface ChatItemProps {
  name: string;
  time: string;
  lastMessage: string;
  unread?: number;
}

export default function ChatItem({}) {
  return (
    <div className="flex cursor-pointer items-center gap-3 rounded-md px-4 py-3 text-text-secondary transition hover:bg-background">
      <img
        src="https://ui-avatars.com/api/?name=Leandro&background=5D5FEF&color=fff"
        className="h-12 w-12 rounded-full object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center justify-between">
          <h3 className="truncate text-sm font-medium text-text-primary">
            Leandro
          </h3>
          <span className="text-right text-xs">19:37</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="truncate text-sm">Eai cara, tudo bem?</span>
          <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-center text-xs font-bold text-primary">
            1
          </span>
        </div>
      </div>
    </div>
  );
}
