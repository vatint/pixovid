import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, ArrowLeft, Coins, Loader2, RefreshCw, Users } from "lucide-react";
import { API_URL } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { useMe } from "@/lib/useMe";
import { SignedOut } from "@/components/SignedOut";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";

interface Metrics {
  generatedAt: string;
  users: { total: number; newLast7d: number; creditLiability: number };
  revenue: {
    currency: string;
    totalInr: number;
    last30dInr: number;
    paidOrders: number;
    paidOrders30d: number;
    creditsGrantedViaPurchase: number;
    creditsGrantedViaPurchase30d: number;
  };
  credits: {
    purchased: number;
    spent: number;
    refunded: number;
    bonus: number;
    netSpentAfterRefunds: number;
    freeBurnVsPurchasedPct: number | null;
    refundRatePct: number | null;
  };
  generations: {
    video: Record<string, number>;
    image: Record<string, number>;
    faceSwap: Record<string, number>;
    templateRender: Record<string, number>;
  };
  unitEconomics: {
    providerCostReported: number;
    completedVideosWithCost: number;
    completedImagesWithCost: number;
    estCreditRevenueInrAtStarterRate: number;
    inrPerCreditStarter: number;
    note: string;
  };
  packs: { id: string; name: string; priceInr: number; credits: number; sold: number }[];
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-card/60 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

function statusLine(map: Record<string, number>) {
  const parts = Object.entries(map).map(([k, v]) => `${k}: ${v}`);
  return parts.length ? parts.join(" · ") : "none";
}

export function AdminMetricsPage() {
  const { data: session, isPending } = useSession();
  const { me } = useMe();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_URL}/api/admin/metrics`, { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `Failed (${res.status})`);
        }
        return res.json() as Promise<Metrics>;
      })
      .then(setMetrics)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load metrics"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (session?.user && me?.isAdmin) load();
  }, [session?.user, me?.isAdmin, load]);

  if (isPending) return null;
  if (!session?.user) return <SignedOut />;
  if (me && !me.isAdmin) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-xl font-semibold">Admin only</h1>
        <p className="mt-2 text-muted-foreground">You need an admin account to view metrics.</p>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" /> Back home
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          eyebrow="Admin"
          title="Monetization metrics"
          description="Revenue, credit ledger health, and generation throughput. Numbers are live from Postgres."
        />
        <Button variant="outline" className="rounded-full" onClick={load} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {loading && !metrics && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      )}

      {metrics && (
        <>
          <p className="text-xs text-muted-foreground">
            Generated {new Date(metrics.generatedAt).toLocaleString()}
          </p>

          <section>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <Users className="h-4 w-4" /> Users
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <Stat label="Total users" value={metrics.users.total} />
              <Stat label="New (7d)" value={metrics.users.newLast7d} />
              <Stat
                label="Credit liability"
                value={metrics.users.creditLiability.toLocaleString()}
                hint="Unspent credits on all accounts"
              />
            </div>
          </section>

          <section>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <Coins className="h-4 w-4" /> Revenue
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Stat
                label="Total revenue"
                value={`₹${metrics.revenue.totalInr.toLocaleString("en-IN")}`}
                hint={`${metrics.revenue.paidOrders} paid orders`}
              />
              <Stat
                label="Last 30 days"
                value={`₹${metrics.revenue.last30dInr.toLocaleString("en-IN")}`}
                hint={`${metrics.revenue.paidOrders30d} orders`}
              />
              <Stat
                label="Credits sold"
                value={metrics.revenue.creditsGrantedViaPurchase.toLocaleString()}
              />
              <Stat
                label="Credits sold (30d)"
                value={metrics.revenue.creditsGrantedViaPurchase30d.toLocaleString()}
              />
            </div>
          </section>

          <section>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <Activity className="h-4 w-4" /> Credits ledger
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Stat label="Purchased" value={metrics.credits.purchased.toLocaleString()} />
              <Stat label="Spent" value={metrics.credits.spent.toLocaleString()} />
              <Stat label="Refunded" value={metrics.credits.refunded.toLocaleString()} />
              <Stat label="Bonus (free)" value={metrics.credits.bonus.toLocaleString()} />
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Stat
                label="Refund rate"
                value={
                  metrics.credits.refundRatePct != null
                    ? `${metrics.credits.refundRatePct}%`
                    : "—"
                }
                hint="Refunded / spent"
              />
              <Stat
                label="Free burn vs purchased"
                value={
                  metrics.credits.freeBurnVsPurchasedPct != null
                    ? `${metrics.credits.freeBurnVsPurchasedPct}%`
                    : "—"
                }
                hint="Target &lt; 20% once paid volume is steady"
              />
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Generations by status
            </h2>
            <div className="space-y-2 rounded-2xl border border-white/[0.08] bg-card/40 p-4 text-sm">
              <div>
                <span className="font-medium">Video</span>
                <span className="text-muted-foreground"> — {statusLine(metrics.generations.video)}</span>
              </div>
              <div>
                <span className="font-medium">Image</span>
                <span className="text-muted-foreground"> — {statusLine(metrics.generations.image)}</span>
              </div>
              <div>
                <span className="font-medium">Face swap</span>
                <span className="text-muted-foreground"> — {statusLine(metrics.generations.faceSwap)}</span>
              </div>
              <div>
                <span className="font-medium">Template render</span>
                <span className="text-muted-foreground">
                  {" "}
                  — {statusLine(metrics.generations.templateRender)}
                </span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Unit economics (proxy)
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Stat
                label="Provider cost (reported)"
                value={metrics.unitEconomics.providerCostReported.toFixed(2)}
                hint="Sum of stored generation cost fields"
              />
              <Stat
                label="Est. spend value @ starter"
                value={`₹${metrics.unitEconomics.estCreditRevenueInrAtStarterRate.toLocaleString("en-IN")}`}
                hint={`₹${metrics.unitEconomics.inrPerCreditStarter}/credit`}
              />
              <Stat
                label="Completed w/ cost"
                value={`${metrics.unitEconomics.completedVideosWithCost}v / ${metrics.unitEconomics.completedImagesWithCost}i`}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{metrics.unitEconomics.note}</p>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Pack sales
            </h2>
            <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/[0.03] text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Pack</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Credits</th>
                    <th className="px-4 py-3 font-medium">Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.packs.map((p) => (
                    <tr key={p.id} className="border-t border-white/[0.06]">
                      <td className="px-4 py-3 font-medium">{p.name}</td>
                      <td className="px-4 py-3 tabular-nums">₹{p.priceInr.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3 tabular-nums">{p.credits.toLocaleString()}</td>
                      <td className="px-4 py-3 tabular-nums">{p.sold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
