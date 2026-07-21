import { useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

const STORAGE_KEY = "va_promo_dismissed";

/**
 * Full-width cyan HUD promo bar pinned above the navbar.
 * Dismissible; the choice is remembered in localStorage.
 */
export function PromoBanner() {
  const [dismissed, setDismissed] = useState(
    () => typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "1",
  );
  if (dismissed) return null;

  return (
    <div className="relative z-50 flex items-center justify-center border-b border-primary/30 bg-gradient-to-r from-blue-royal via-primary to-brand px-10 py-2 text-primary-foreground shadow-[0_0_24px_oklch(0.72_0.16_250/0.4)]">
      <Link
        to="/billing"
        className="group font-hud flex items-center gap-3 text-center text-xs font-semibold tracking-[0.14em] sm:text-sm"
      >
        <span className="hidden group-hover:underline sm:inline">
          SIGNAL BOOST — SIGN UP FOR PREMIUM CREDIT PACKS
        </span>
        <span className="group-hover:underline sm:hidden">PREMIUM CREDIT SIGNAL</span>
        <span className="inline-flex items-center gap-1 rounded-2xl border border-white/20 bg-black/25 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-white">
          UPLINK
        </span>
      </Link>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => {
          localStorage.setItem(STORAGE_KEY, "1");
          setDismissed(true);
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-2xl p-1 text-primary-foreground/70 transition-colors hover:bg-black/15 hover:text-primary-foreground"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
