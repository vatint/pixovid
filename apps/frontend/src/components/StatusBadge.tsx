import { cn } from "@/lib/utils";
import type { GenerationStatus } from "@/lib/api";

const statusStyles: Record<GenerationStatus, string> = {
  PENDING: "bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/20",
  IN_PROGRESS: "bg-primary/15 text-primary ring-1 ring-primary/25",
  COMPLETED: "bg-green-500/15 text-green-400 ring-1 ring-green-500/20",
  FAILED: "bg-destructive/15 text-destructive ring-1 ring-destructive/20",
};

const labels: Record<GenerationStatus, string> = {
  PENDING: "queued",
  IN_PROGRESS: "generating",
  COMPLETED: "ready",
  FAILED: "failed",
};

/** Coloured pill showing a generation's lifecycle status. Shared across galleries. */
export function StatusBadge({ status }: { status: GenerationStatus }) {
  const live = status === "PENDING" || status === "IN_PROGRESS";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium backdrop-blur-sm",
        statusStyles[status],
      )}
    >
      {live && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full bg-current",
            status === "IN_PROGRESS" ? "animate-pulse-soft" : "opacity-70",
          )}
        />
      )}
      {labels[status]}
    </span>
  );
}
