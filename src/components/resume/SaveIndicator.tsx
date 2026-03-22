import { Check, Cloud, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface SaveIndicatorProps {
  isSaving: boolean;
  lastSavedAt: Date | null;
}

export function SaveIndicator({ isSaving, lastSavedAt }: SaveIndicatorProps) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      {isSaving ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin" /> Saving...
        </>
      ) : lastSavedAt ? (
        <>
          <Check className="h-3 w-3 text-green-500" /> Saved {formatDistanceToNow(lastSavedAt)} ago
        </>
      ) : (
        <>
          <Cloud className="h-3 w-3" /> Not saved yet
        </>
      )}
    </div>
  );
}
