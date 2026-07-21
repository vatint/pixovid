import { cn } from "@/lib/utils";
import type { GenerationStatus } from "@/lib/api";

const statusStyles: Record<GenerationStatus, string> = {
  PENDING: "bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/30 font-hud tracking-wider",
  IN_PROGRESS: "bg-primary/15 text-primary ring-1 ring-primary/35 font-hud tracking-wider shadow-[0_0_12px_-4px_oklch(0.82_0.14_210/0.5)]",
  COMPLETED: "bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-400/30 font-hud tracking-wider",
  FAILED: "bg-destructive/15 text-destructive ring-1 ring-destructive/30 font-hud tracking-wider",
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
