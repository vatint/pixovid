import { Link } from "react-router-dom";
import { JupiterLogo } from "./JupiterLogo";

const CONTACT_EMAIL = "support@pixovid.local";

const PRODUCT_LINKS = [
  { to: "/video", label: "Video" },
  { to: "/image", label: "Image" },
  { to: "/face-swap", label: "Face Swap" },
  { to: "/user/templates", label: "Templates" },
  { to: "/user/avatar", label: "Avatar" },
  { to: "/pricing", label: "Pricing" },
  { to: "/billing", label: "Billing" },
];

const LEGAL_LINKS = [
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/refund", label: "Refund & Cancellation" },
  { to: "/terms", label: "Terms of Service" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-primary/20 bg-background/90">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="mx-auto grid max-w-[1600px] gap-10 px-4 py-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-6">
        <div>
          <Link to="/" className="flex items-center gap-2.5">
            <JupiterLogo className="h-9 w-9" />
            <span className="font-display text-[15px] font-semibold tracking-[0.18em] uppercase">
              Pixovid
            </span>
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
            Mission control for AI video. Generate cinematic clips, images, and template
            renders from deep space.
          </p>
          <p className="font-hud mt-4 text-[10px] text-primary/70">SYS.STATUS // ONLINE</p>
        </div>

        <div>
          <h3 className="font-hud text-[11px] font-semibold text-primary">Product</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {PRODUCT_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="transition-colors hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-hud text-[11px] font-semibold text-primary">Legal</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {LEGAL_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="transition-colors hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-hud text-[11px] font-semibold text-primary">Contact</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="transition-colors hover:text-primary"
              >
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary/10">
        <div className="font-hud mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-2 px-4 py-5 text-[10px] tracking-wider text-muted-foreground sm:flex-row lg:px-6">
          <span>© {new Date().getFullYear()} PIXOVID // ALL RIGHTS RESERVED</span>
          <div className="flex items-center gap-4">
            {LEGAL_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className="transition-colors hover:text-primary">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
