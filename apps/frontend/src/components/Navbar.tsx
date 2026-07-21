import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Coins, LogOut, Menu, Sparkles, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "@/lib/auth-client";
import { useMe } from "@/lib/useMe";
import { AuthModal } from "./AuthModal";

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
    <header className="sticky top-0 z-40 border-b border-white/10 glass">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-4 px-4 lg:gap-6 lg:px-6">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2.5" onClick={() => setMobileOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_0_20px_-4px_oklch(0.92_0.21_124/0.55)]">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="hidden text-[15px] font-semibold tracking-tight sm:inline">
            Pixovid
          </span>
        </Link>

        {/* Primary nav (desktop) */}
        <nav className="hidden min-w-0 flex-1 items-center gap-1 md:flex">
          <Link
            to="/"
            className={cn(
              "shrink-0 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
              isActive("/")
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Explore
          </Link>
          {links.map(({ to, label, badge }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
                isActive(to)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="whitespace-nowrap">{label}</span>
              {badge && (
                <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold leading-none text-primary-foreground">
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
                  "flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm font-medium transition-colors hover:bg-white/[0.08]",
                  location.pathname === "/billing" && "border-primary/40 text-primary",
                )}
              >
                <Coins className="h-4 w-4 text-primary" />
                <span className="tabular-nums">{me?.credits ?? 0}</span>
                <span className="hidden text-muted-foreground sm:inline">credits</span>
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
                className="relative hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-white/[0.08] sm:flex"
              >
                <Tag className="h-3.5 w-3.5" />
                Pricing
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-2 px-1.5 py-px text-[9px] font-bold leading-none text-white">
                  30% OFF
                </span>
              </Link>
              <span className="hidden h-5 w-px bg-white/10 sm:block" />
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline"
              >
                Login
              </button>
              <Button className="rounded-full px-5" onClick={() => setAuthOpen(true)}>
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
        <div className="border-t border-white/10 bg-black/95 px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className={cn(
                "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive("/") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
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
                  "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive(to) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
                )}
              >
                {label}
                {badge && (
                  <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold leading-none text-primary-foreground">
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
                className="mt-1 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
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
