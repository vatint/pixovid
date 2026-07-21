import { Router } from "express";
import { prisma } from "@repo/db";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { CREDIT_PACKS, packTotalCredits } from "../lib/credits.js";

export const adminMetricsRouter: Router = Router();

function daysAgo(n: number): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d;
}

/**
 * Superadmin/admin dashboard numbers for monetization health.
 * GET /api/admin/metrics
 */
adminMetricsRouter.get("/", requireAdmin, async (_req, res) => {
  const since7 = daysAgo(7);
  const since30 = daysAgo(30);

  const [
    usersTotal,
    users7d,
    paymentsPaid,
    paymentsPaid30,
    creditAgg,
    videos,
    images,
    faceSwaps,
    templateRenders,
    videoCostSum,
    imageCostSum,
    openBalances,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: since7 } } }),
    prisma.payment.findMany({
      where: { status: "PAID" },
      select: { amount: true, credits: true, currency: true, createdAt: true, packId: true },
    }),
    prisma.payment.findMany({
      where: { status: "PAID", createdAt: { gte: since30 } },
      select: { amount: true, credits: true },
    }),
    prisma.creditTransaction.groupBy({
      by: ["type"],
      _sum: { amount: true },
      _count: true,
    }),
    prisma.video.groupBy({ by: ["status"], _count: true }),
    prisma.image.groupBy({ by: ["status"], _count: true }),
    prisma.faceSwap.groupBy({ by: ["status"], _count: true }),
    prisma.templateRender.groupBy({ by: ["status"], _count: true }),
    prisma.video.aggregate({
      where: { status: "COMPLETED", cost: { not: null } },
      _sum: { cost: true },
      _count: true,
    }),
    prisma.image.aggregate({
      where: { status: "COMPLETED", cost: { not: null } },
      _sum: { cost: true },
      _count: true,
    }),
    prisma.user.aggregate({ _sum: { credits: true } }),
  ]);

  const revenuePaiseAll = paymentsPaid.reduce((s, p) => s + p.amount, 0);
  const revenuePaise30 = paymentsPaid30.reduce((s, p) => s + p.amount, 0);
  const creditsFromPaymentsAll = paymentsPaid.reduce((s, p) => s + p.credits, 0);
  const creditsFromPayments30 = paymentsPaid30.reduce((s, p) => s + p.credits, 0);

  const ledger: Record<string, { sum: number; count: number }> = {};
  for (const row of creditAgg) {
    ledger[row.type] = { sum: row._sum.amount ?? 0, count: row._count };
  }

  const purchasedCredits = ledger.PURCHASE?.sum ?? 0;
  const spentCredits = Math.abs(ledger.SPEND?.sum ?? 0);
  const refundedCredits = ledger.REFUND?.sum ?? 0;
  const bonusCredits = ledger.BONUS?.sum ?? 0;

  // Rough INR value of spent credits at Starter pack rate (₹1/credit baseline).
  const starter = CREDIT_PACKS[0]!;
  const inrPerCreditStarter = starter.priceInr / packTotalCredits(starter);
  const estRevenueAtStarterRate = spentCredits * inrPerCreditStarter;

  const providerCostUsd =
    (videoCostSum._sum.cost ?? 0) + (imageCostSum._sum.cost ?? 0);

  const byStatus = (rows: { status: string; _count: number }[]) =>
    Object.fromEntries(rows.map((r) => [r.status, r._count]));

  res.json({
    generatedAt: new Date().toISOString(),
    users: {
      total: usersTotal,
      newLast7d: users7d,
      creditLiability: openBalances._sum.credits ?? 0,
    },
    revenue: {
      currency: "INR",
      /** Gross from PAID Razorpay rows (paise / 100 = INR). */
      totalInr: revenuePaiseAll / 100,
      last30dInr: revenuePaise30 / 100,
      paidOrders: paymentsPaid.length,
      paidOrders30d: paymentsPaid30.length,
      creditsGrantedViaPurchase: creditsFromPaymentsAll,
      creditsGrantedViaPurchase30d: creditsFromPayments30,
    },
    credits: {
      purchased: purchasedCredits,
      spent: spentCredits,
      refunded: refundedCredits,
      bonus: bonusCredits,
      netSpentAfterRefunds: spentCredits - refundedCredits,
      /** Free credit burn as % of paid credits granted (proxy for abuse/marketing cost). */
      freeBurnVsPurchasedPct:
        purchasedCredits > 0 ? Math.round((bonusCredits / purchasedCredits) * 1000) / 10 : null,
      refundRatePct:
        spentCredits > 0 ? Math.round((refundedCredits / spentCredits) * 1000) / 10 : null,
    },
    generations: {
      video: byStatus(videos),
      image: byStatus(images),
      faceSwap: byStatus(faceSwaps),
      templateRender: byStatus(templateRenders),
    },
    unitEconomics: {
      /** Sum of OpenRouter-reported cost on completed rows (USD when provider sends USD). */
      providerCostReported: providerCostUsd,
      completedVideosWithCost: videoCostSum._count,
      completedImagesWithCost: imageCostSum._count,
      estCreditRevenueInrAtStarterRate: Math.round(estRevenueAtStarterRate * 100) / 100,
      inrPerCreditStarter: Math.round(inrPerCreditStarter * 1000) / 1000,
      note: "Margin is approximate until provider costs are fully attributed per credit.",
    },
    packs: CREDIT_PACKS.map((p) => ({
      id: p.id,
      name: p.name,
      priceInr: p.priceInr,
      credits: packTotalCredits(p),
      sold: paymentsPaid.filter((x) => x.packId === p.id).length,
    })),
  });
});
