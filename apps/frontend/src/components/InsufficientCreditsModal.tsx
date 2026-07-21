import { Link } from "react-router-dom";
import { Coins, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMe } from "@/lib/useMe";
import { useActionCosts } from "@/lib/useActionCosts";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Credits required for the action that failed (from API message when possible). */
  required?: number | null;
  /** Which action the user attempted — drives copy. */
  action?: "video" | "image" | "template_render";
}

const ACTION_LABEL: Record<NonNullable<Props["action"]>, string> = {
  video: "this video",
  image: "this image",
  template_render: "this template export",
};

/**
 * Shown on HTTP 402 / insufficient credits so the user never dead-ends mid-create.
 * Primary CTA → billing; secondary explains pack math.
 */
export function InsufficientCreditsModal({
  open,
  onOpenChange,
  required,
  action = "video",
}: Props) {
  const { me } = useMe();
  const costs = useActionCosts();
  const balance = me?.credits ?? 0;
  const need = required ?? costs?.[action] ?? null;
  const shortfall = need != null ? Math.max(0, need - balance) : null;

  // Point users at the smallest pack that covers shortfall when we know it.
  const suggested =
    shortfall == null
      ? "Pro"
      : shortfall <= 500
        ? "Starter"
        : shortfall <= 2200
          ? "Pro"
          : "Studio";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 overflow-hidden p-0">
        <div className="border-b border-white/10 bg-gradient-to-br from-primary/20 via-card to-card px-6 py-5">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Coins className="h-5 w-5 text-primary" />
              Not enough credits
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              You need more credits to generate {ACTION_LABEL[action]}. Top up in seconds — failed
              generations are refunded automatically.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Your balance
              </div>
              <div className="mt-1 text-2xl font-semibold tabular-nums">{balance}</div>
            </div>
            <div className="rounded-xl border border-primary/25 bg-primary/10 p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                Required
              </div>
              <div className="mt-1 text-2xl font-semibold tabular-nums text-primary">
                {need ?? "—"}
              </div>
            </div>
          </div>

          {shortfall != null && shortfall > 0 && (
            <p className="text-sm text-muted-foreground">
              You&apos;re short <span className="font-semibold text-foreground">{shortfall}</span>{" "}
              credits. The <span className="font-semibold text-primary">{suggested}</span> pack is a
              good fit.
            </p>
          )}

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild className="flex-1 rounded-full" size="lg">
              <Link to="/billing" onClick={() => onOpenChange(false)}>
                <Sparkles className="h-4 w-4" />
                Buy credits
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 rounded-full"
              size="lg"
              onClick={() => onOpenChange(false)}
            >
              <Link to="/pricing">See pricing</Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
