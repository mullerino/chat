import { Loader2 } from "lucide-react";

export function LoadingOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/60 backdrop-blur-sm">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
}
