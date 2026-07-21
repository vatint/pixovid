import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Clapperboard, Coins, Image as ImageIcon, Sparkles } from "lucide-react";
import { fetchCreditPacks, type CreditPacksResponse } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { AuthModal } from "@/components/AuthModal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Fallback copy when API is unreachable (keeps marketing page useful offline). */
const FALLBACK: CreditPacksResponse = {
  currency: "INR",
  razorpayConfigured: false,
  razorpayKeyId: null,
  welcomeCredits: 120,
  actionCosts: { video: 60, image: 6, template_render: 1000 },
  packs: [
    {
      id: "starter",
      name: "Starter",
      description: "Enough credits to try things out.",
      priceInr: 499,
      credits: 500,
      baseCredits: 500,
      bonusCredits: 0,
    },
    {
      id: "pro",
      name: "Pro",
      description: "Best for regular creators — 10% bonus credits.",
      priceInr: 1999,
      credits: 2200,
      baseCredits: 2000,
      bonusCredits: 200,
    },
    {
      id: "studio",
      name: "Studio",
      description: "For heavy use — 20% bonus credits.",
      priceInr: 4999,
      credits: 6000,
      baseCredits: 5000,
      bonusCredits: 1000,
    },
  ],
};

function videosFrom(credits: number, videoCost: number) {
  return Math.floor(credits / videoCost);
}
function imagesFrom(credits: number, imageCost: number) {
  return Math.floor(credits / imageCost);
}

export function PricingPage() {
  const { data: session } = useSession();
  const signedIn = Boolean(session?.user);
  const [data, setData] = useState<CreditPacksResponse | null>(null);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    fetchCreditPacks()
      .then(setData)
      .catch(() => setData(FALLBACK));
  }, []);

  const packs = data ?? FALLBACK;
  const videoCost = packs.actionCosts.video;
  const imageCost = packs.actionCosts.image;
  const templateCost = packs.actionCosts.template_render;
  const welcome = packs.welcomeCredits ?? 120;

  const cta = (label: string, primary?: boolean) => {
    if (signedIn) {
      return (
        <Button asChild size="lg" className="w-full rounded-full" variant={primary ? "default" : "outline"}>
          <Link to="/billing">
            {label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      );
    }
    return (
      <Button
        size="lg"
        className="w-full rounded-full"
        variant={primary ? "default" : "outline"}
        onClick={() => setAuthOpen(true)}
      >
        {label}
        <ArrowRight className="h-4 w-4" />
      </Button>
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <div className="font-hud mb-4 inline-flex items-center gap-2 rounded-sm border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] tracking-wider text-primary">
          <Coins className="h-4 w-4" />
          PREPAID CREDIT UPLINK
        </div>
        <h1 className="font-display text-4xl font-semibold tracking-wider sm:text-5xl">
          Pricing that matches your <span className="text-gradient-brand">output</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Buy credits, spend on video, image, or music-video templates. Failed generations are
          refunded. New accounts get <strong className="text-foreground">{welcome} free credits</strong>{" "}
          to start.
        </p>
      </div>

      {/* What things cost */}
      <div className="mx-auto mt-12 grid max-w-3xl gap-3 sm:grid-cols-3">
        {[
          { icon: Clapperboard, label: "Video", cost: videoCost, hint: `~${videosFrom(welcome, videoCost)} free trial clips` },
          { icon: ImageIcon, label: "Image", cost: imageCost, hint: `~${imagesFrom(welcome, imageCost)} free trial stills` },
          { icon: Sparkles, label: "Template export", cost: templateCost, hint: "Music-video star mode" },
        ].map((row) => (
          <div
            key={row.label}
            className="rounded-sm border border-primary/15 bg-card/60 px-4 py-4 text-center shadow-[inset_0_0_24px_oklch(0.5_0.1_260/0.1)]"
          >
            <row.icon className="mx-auto h-5 w-5 text-primary" />
            <div className="font-display mt-2 text-sm font-semibold tracking-wide">{row.label}</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">{row.cost}</div>
            <div className="text-xs text-muted-foreground">credits each</div>
            <div className="mt-2 text-[11px] text-muted-foreground">{row.hint}</div>
          </div>
        ))}
      </div>

      {/* Packs */}
      <div className="mt-14 grid gap-5 lg:grid-cols-3">
        {packs.packs.map((pack, i) => {
          const featured = i === 1;
          const v = videosFrom(pack.credits, videoCost);
          const imgs = imagesFrom(pack.credits, imageCost);
          const templates = Math.floor(pack.credits / templateCost);
          return (
            <div
              key={pack.id}
              className={cn(
                "relative flex flex-col rounded-sm border bg-card p-6 shadow-xl shadow-black/40",
                featured
                  ? "border-primary/45 shadow-[0_0_40px_-12px_oklch(0.82_0.14_210/0.4)] ring-1 ring-primary/30"
                  : "border-primary/15",
              )}
            >
              {featured && (
                <span className="font-hud absolute -top-3 left-1/2 -translate-x-1/2 rounded-sm bg-primary px-3 py-0.5 text-[10px] font-bold tracking-wider text-primary-foreground shadow-[0_0_16px_oklch(0.82_0.14_210/0.5)]">
                  BEST VALUE
                </span>
              )}
              <h2 className="font-display text-lg font-semibold tracking-wide">{pack.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{pack.description}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">
                  ₹{pack.priceInr.toLocaleString("en-IN")}
                </span>
                <span className="text-sm text-muted-foreground">one-time</span>
              </div>
              <p className="mt-1 text-sm font-medium text-primary">
                {pack.credits.toLocaleString("en-IN")} credits
                {pack.bonusCredits > 0 && (
                  <span className="ml-1 text-muted-foreground">
                    (+{pack.bonusCredits.toLocaleString("en-IN")} bonus)
                  </span>
                )}
              </p>

              <ul className="mt-6 flex-1 space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  Up to <strong className="text-foreground">{v}</strong> videos
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  Up to <strong className="text-foreground">{imgs}</strong> images
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {templates > 0 ? (
                    <>
                      Up to <strong className="text-foreground">{templates}</strong> template export
                      {templates === 1 ? "" : "s"}
                    </>
                  ) : (
                    <>Combine with video/image gens (template needs {templateCost} credits)</>
                  )}
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  Auto-refund on failed generations
                </li>
              </ul>

              <div className="mt-8">{cta(signedIn ? `Buy ${pack.name}` : "Get started", featured)}</div>
            </div>
          );
        })}
      </div>

      <p className="mx-auto mt-10 max-w-xl text-center text-sm text-muted-foreground">
        Payments via Razorpay (UPI, cards). Subscriptions and team plans are on the roadmap — see{" "}
        <Link to="/billing" className="text-primary hover:underline">
          billing
        </Link>{" "}
        after signup. Full checklist:{" "}
        <span className="text-foreground/80">docs/MONETIZATION-PHASE-0-1.md</span> in the repo.
      </p>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
}
