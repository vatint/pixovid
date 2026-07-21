import type { ReactNode } from "react";

/** Shared layout for legal/policy pages (privacy, refund, terms). */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:py-16">
      <p className="font-hud mb-3 text-[10px] text-primary/80">DOCUMENT // LEGAL</p>
      <h1 className="font-display text-3xl font-bold tracking-wider sm:text-4xl">{title}</h1>
      <p className="font-hud mt-2 text-[11px] text-muted-foreground">Last updated: {updated}</p>
      <div className="mt-8 space-y-8 rounded-sm border border-primary/15 bg-card/40 p-6 sm:p-8">
        {children}
      </div>
    </div>
  );
}

/** A titled section within a legal page. */
export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="font-display text-lg font-semibold tracking-wide text-primary">{heading}</h2>
      <div className="space-y-2 text-sm leading-7 text-muted-foreground">{children}</div>
    </section>
  );
}
