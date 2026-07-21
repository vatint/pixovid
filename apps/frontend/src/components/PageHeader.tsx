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
    <section className="hud-corners relative overflow-hidden rounded-lg border border-primary/20 bg-card/70 p-6 shadow-[0_0_40px_-16px_oklch(0.82_0.14_210/0.35)] backdrop-blur-xl sm:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,oklch(0.82_0.14_210/0.08)_0%,transparent_45%,oklch(0.7_0.2_330/0.06)_100%)]" />
      <div className="absolute -right-16 -top-24 h-56 w-56 rounded-full bg-brand/25 blur-3xl" />
      <div className="absolute -bottom-24 left-12 h-56 w-56 rounded-full bg-brand-2/15 blur-3xl" />
      {/* Top HUD line */}
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="font-hud mb-3 inline-flex items-center gap-2 rounded-sm border border-primary/25 bg-primary/10 px-3 py-1 text-[0.65rem] font-medium text-primary">
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-primary shadow-[0_0_8px_oklch(0.82_0.14_210)]" />
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
