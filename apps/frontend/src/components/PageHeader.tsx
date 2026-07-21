import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <section className="hud-corners relative overflow-hidden rounded-3xl border border-primary/20 bg-card/70 p-6 shadow-[0_0_40px_-16px_oklch(0.72_0.16_250/0.35)] backdrop-blur-xl sm:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,oklch(0.82_0.12_235/0.1)_0%,transparent_40%,oklch(0.55_0.16_265/0.1)_100%)]" />
      <div className="absolute -right-16 -top-24 h-56 w-56 rounded-full bg-brand/30 blur-3xl" />
      <div className="absolute -bottom-24 left-12 h-56 w-56 rounded-full bg-brand-2/25 blur-3xl" />
      <div className="absolute right-1/3 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-blue-sky/10 blur-3xl" />
      {/* Top HUD line */}
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="font-hud mb-3 inline-flex items-center gap-2 rounded-2xl border border-primary/25 bg-primary/10 px-3 py-1 text-[0.65rem] font-medium text-primary">
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-primary shadow-[0_0_8px_oklch(0.72_0.16_250)]" />
            {eyebrow}
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-wider text-balance text-gradient sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>
        {children}
      </div>
    </section>
  );
}
