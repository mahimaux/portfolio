"use client";
import { useId, type ReactNode } from "react";

type Props = { text: string; size?: number; bg?: string; fg?: string; children?: ReactNode; className?: string; speed?: number };

export function CircleText({ text, size = 132, bg = "var(--ink)", fg = "var(--paper)", children, className = "", speed = 14 }: Props) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <div className={`relative grid place-items-center rounded-full ${className}`} style={{ width: size, height: size, background: bg, color: fg }}>
      <svg viewBox="0 0 100 100" className="motion-safe-spin absolute inset-0 h-full w-full" style={{ animation: `spin ${speed}s linear infinite` }} aria-hidden>
        <defs>
          <path id={`c-${id}`} d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text fontSize="9.4" fill="currentColor" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.18em" }}>
          <textPath href={`#c-${id}`}>{text}</textPath>
        </text>
      </svg>
      <div className="relative">{children}</div>
    </div>
  );
}
