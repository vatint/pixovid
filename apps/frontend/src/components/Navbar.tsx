import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Coins, LogOut, Menu, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "@/lib/auth-client";
import { useMe } from "@/lib/useMe";
import { AuthModal } from "./AuthModal";
import { JupiterLogo } from "./JupiterLogo";

interface NavLink {
  to: string;
  label: string;
  badge?: string;
}

const NAV_LINKS: NavLink[] = [
  { to: "/video", label: "Video" },
  { to: "/image", label: "Image" },
  { to: "/face-swap", label: "Face Swap" },
  { to: "/user/templates", label: "Templates", badge: "New" },
  { to: "/user/avatar", label: "Avatar" },
];

export function Navbar() {
  const { data: session, isPending } = useSession();
  const { me } = useMe();
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const links: NavLink[] = me?.isAdmin
    ? [
        ...NAV_LINKS,
        { to: "/admin/template/create", label: "Admin" },
        { to: "/admin/metrics", label: "Metrics" },
      ]
    : NAV_LINKS;

  const isActive = (to: string) =>
    to === "/"
      ? location.pathname === "/"
      : location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-primary/20 glass">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-4 px-4 lg:gap-6 lg:px-6">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2.5" onClick={() => setMobileOpen(false)}>
          <JupiterLogo className="h-9 w-9" />
          <span className="font-display hidden text-[15px] font-semibold tracking-[0.18em] uppercase sm:inline">
            Pixovid
          </span>
        </Link>

        {/* Primary nav (desktop) */}
        <nav className="hidden min-w-0 flex-1 items-center gap-1 md:flex">
          <Link
            to="/"
            className={cn(
              "font-hud shrink-0 rounded-sm px-2.5 py-1.5 text-[11px] font-medium transition-colors",
              isActive("/")
                ? "bg-primary/10 text-primary shadow-[inset_0_-1px_0_0_oklch(0.72_0.16_250)]"
                : "text-muted-foreground hover:text-primary",
            )}
          >
            Explore
          </Link>
          {links.map(({ to, label, badge }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "font-hud flex shrink-0 items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-[11px] font-medium transition-colors",
                isActive(to)
                  ? "bg-primary/10 text-primary shadow-[inset_0_-1px_0_0_oklch(0.72_0.16_250)]"
                  : "text-muted-foreground hover:text-primary",
              )}
            >
              <span className="whitespace-nowrap">{label}</span>
              {badge && (
                <span className="rounded-sm bg-brand-2 px-1.5 py-0.5 text-[9px] font-bold leading-none tracking-wider text-white shadow-[0_0_10px_oklch(0.55_0.18_265/0.55)]">
                  {badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Right cluster */}
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          {isPending ? null : session?.user ? (
            <>
              <Link
                to="/billing"
                title="Credits & billing"
                className={cn(
                  "font-hud flex items-center gap-1.5 rounded-sm border border-primary/25 bg-primary/5 px-3 py-1.5 text-[11px] font-medium transition-colors hover:bg-primary/10 hover:border-primary/40",
                  location.pathname === "/billing" && "border-primary/50 text-primary shadow-[0_0_12px_-4px_oklch(0.72_0.16_250/0.55)]",
                )}
              >
                <Coins className="h-4 w-4 text-primary" />
                <span className="tabular-nums">{me?.credits ?? 0}</span>
                <span className="hidden text-muted-foreground sm:inline">CR</span>
              </Link>
              <div className="hidden items-center gap-2 sm:flex">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="h-8 w-8 rounded-full ring-1 ring-white/10"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-medium ring-1 ring-white/10">
                    {session.user.name?.charAt(0).toUpperCase() ?? "U"}
                  </div>
                )}
                <span className="hidden max-w-28 truncate text-sm lg:inline">
                  {session.user.name}
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => signOut()} title="Sign out">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/pricing"
                className="font-hud relative hidden items-center gap-1.5 rounded-sm border border-primary/25 bg-primary/5 px-3 py-1.5 text-[11px] font-medium text-foreground transition-colors hover:bg-primary/10 sm:flex"
              >
                <Tag className="h-3.5 w-3.5 text-primary" />
                Pricing
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-sm bg-brand-2 px-1.5 py-px text-[9px] font-bold leading-none tracking-wider text-white">
                  30% OFF
                </span>
              </Link>
              <span className="hidden h-5 w-px bg-primary/20 sm:block" />
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="font-hud hidden text-[11px] font-medium text-muted-foreground transition-colors hover:text-primary sm:inline"
              >
                Login
              </button>
              <Button className="rounded-sm px-5 tracking-wider" onClick={() => setAuthOpen(true)}>
                Sign up
              </Button>
            </>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-primary/20 bg-background/95 px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className={cn(
                "font-hud rounded-sm px-3 py-2.5 text-xs font-medium transition-colors",
                isActive("/") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-primary/5 hover:text-primary",
              )}
            >
              Explore
            </Link>
            {links.map(({ to, label, badge }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "font-hud flex items-center gap-2 rounded-sm px-3 py-2.5 text-xs font-medium transition-colors",
                  isActive(to) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-primary/5 hover:text-primary",
                )}
              >
                {label}
                {badge && (
                  <span className="rounded-sm bg-brand-2 px-1.5 py-0.5 text-[9px] font-bold leading-none tracking-wider text-white">
                    {badge}
                  </span>
                )}
              </Link>
            ))}
            {!session?.user && (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setAuthOpen(true);
                }}
                className="font-hud mt-1 rounded-sm px-3 py-2.5 text-left text-xs font-medium text-muted-foreground hover:bg-primary/5 hover:text-primary"
              >
                Login
              </button>
            )}
          </nav>
        </div>
      )}

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </header>
  );
}
