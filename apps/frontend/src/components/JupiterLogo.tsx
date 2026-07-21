import { useId } from "react";
import { cn } from "@/lib/utils";

interface JupiterLogoProps {
  className?: string;
  /** Soft outer glow (nav / hero marks). */
  glow?: boolean;
  title?: string;
}

/**
 * Brand mark: Jupiter with ring system.
 * Size via className (e.g. h-8 w-8). Gradient ids are unique per instance.
 */
export function JupiterLogo({
  className,
  glow = true,
  title = "Pixovid — Jupiter logo",
}: JupiterLogoProps) {
  const rawId = useId().replace(/:/g, "");
  const g = (name: string) => `jup-${rawId}-${name}`;

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center",
        glow && "drop-shadow-[0_0_12px_oklch(0.72_0.16_250/0.5)]",
        className,
      )}
      role="img"
      aria-label={title}
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        aria-hidden
      >
        <defs>
          <radialGradient id={g("body")} cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#f5e6c8" />
            <stop offset="35%" stopColor="#e8b86d" />
            <stop offset="70%" stopColor="#c47a3a" />
            <stop offset="100%" stopColor="#6b3a1f" />
          </radialGradient>
          <linearGradient id={g("bands")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f0d4a8" stopOpacity="0.55" />
            <stop offset="18%" stopColor="#d4924a" stopOpacity="0.45" />
            <stop offset="36%" stopColor="#f2c98a" stopOpacity="0.4" />
            <stop offset="52%" stopColor="#b86b32" stopOpacity="0.5" />
            <stop offset="68%" stopColor="#e8b060" stopOpacity="0.4" />
            <stop offset="85%" stopColor="#8a4a28" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#5c3018" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id={g("ring")} x1="0" y1="0.5" x2="1" y2="0.5">
            <stop offset="0%" stopColor="#7eb6ff" stopOpacity="0" />
            <stop offset="18%" stopColor="#9ec5ff" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#e8f0ff" stopOpacity="1" />
            <stop offset="82%" stopColor="#6aa8ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#4a7fd4" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={g("ring-dark")} x1="0" y1="0.5" x2="1" y2="0.5">
            <stop offset="0%" stopColor="#3d6aab" stopOpacity="0" />
            <stop offset="25%" stopColor="#5a8fd4" stopOpacity="0.55" />
            <stop offset="50%" stopColor="#a8c8f0" stopOpacity="0.65" />
            <stop offset="75%" stopColor="#4a7fc4" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#2a4a80" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={g("shade")} cx="30%" cy="30%" r="70%">
            <stop offset="50%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#0a1428" stopOpacity="0.4" />
          </radialGradient>
          <clipPath id={g("planet-clip")}>
            <circle cx="32" cy="30" r="16" />
          </clipPath>
        </defs>

        {/* Far ring (behind planet) */}
        <ellipse
          cx="32"
          cy="34"
          rx="30"
          ry="9"
          stroke={`url(#${g("ring-dark")})`}
          strokeWidth="2.2"
          fill="none"
          opacity="0.8"
          transform="rotate(-18 32 34)"
        />
        <ellipse
          cx="32"
          cy="34"
          rx="27"
          ry="7.5"
          stroke={`url(#${g("ring")})`}
          strokeWidth="1.1"
          fill="none"
          opacity="0.5"
          transform="rotate(-18 32 34)"
        />

        {/* Planet */}
        <circle cx="32" cy="30" r="16" fill={`url(#${g("body")})`} />
        <g clipPath={`url(#${g("planet-clip")})`}>
          <rect x="14" y="14" width="36" height="36" fill={`url(#${g("bands")})`} />
          <ellipse cx="32" cy="22" rx="16" ry="2.2" fill="#f8e8c8" opacity="0.35" />
          <ellipse cx="32" cy="27" rx="16" ry="1.8" fill="#a85a28" opacity="0.35" />
          <ellipse cx="32" cy="32" rx="16" ry="2" fill="#f0c878" opacity="0.28" />
          <ellipse cx="32" cy="37" rx="16" ry="1.6" fill="#8a4820" opacity="0.4" />
          <ellipse cx="32" cy="41" rx="14" ry="1.4" fill="#d4a060" opacity="0.3" />
          {/* Great Red Spot */}
          <ellipse
            cx="40"
            cy="34"
            rx="3.2"
            ry="2"
            fill="#c45a3a"
            opacity="0.9"
            transform="rotate(-12 40 34)"
          />
          <ellipse
            cx="40"
            cy="34"
            rx="1.8"
            ry="1"
            fill="#e87850"
            opacity="0.75"
            transform="rotate(-12 40 34)"
          />
          <ellipse cx="26" cy="24" rx="5" ry="3.5" fill="#fff8e8" opacity="0.3" />
          <circle cx="32" cy="30" r="16" fill={`url(#${g("shade")})`} />
        </g>
        <circle cx="32" cy="30" r="16" fill="none" stroke="#1a2840" strokeOpacity="0.3" strokeWidth="0.8" />

        {/* Near ring (in front of planet) */}
        <ellipse
          cx="32"
          cy="34"
          rx="30"
          ry="9"
          stroke={`url(#${g("ring")})`}
          strokeWidth="2.5"
          fill="none"
          transform="rotate(-18 32 34)"
          strokeDasharray="48 100"
          strokeDashoffset="22"
          opacity="0.98"
        />
        <ellipse
          cx="32"
          cy="34"
          rx="27"
          ry="7.5"
          stroke="#c8dcff"
          strokeWidth="0.75"
          fill="none"
          transform="rotate(-18 32 34)"
          strokeDasharray="42 100"
          strokeDashoffset="20"
          opacity="0.75"
        />

        {/* Small moon */}
        <circle cx="52" cy="22" r="2.4" fill="#6aa0e8" opacity="0.25" />
        <circle cx="52" cy="22" r="1.35" fill="#d0e4ff" />
      </svg>
    </span>
  );
}
