"use client";
import type { ReactNode } from "react";
import { ArrowRight } from "./Icons";
import { sfx } from "@/lib/sound";

type Props = {
  href?: string;
  children: ReactNode;
  variant?: "solid" | "ghost";
  bg?: string;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
};

export function Btn({ href, children, variant = "solid", bg, className = "", type = "button", onClick }: Props) {
  const cls = `btn ${variant === "ghost" ? "btn--ghost" : ""} ${className}`;
  const style = bg ? ({ "--btn-bg": bg } as React.CSSProperties) : undefined;
  const inner = (
    <>
      <span className="btn-arrow">
        <ArrowRight size={18} />
      </span>
      <span className="btn-label">{children}</span>
    </>
  );
  const click = () => {
    sfx.pop();
    onClick?.();
  };
  return href ? (
    <a href={href} className={cls} style={style} onClick={click}>
      {inner}
    </a>
  ) : (
    <button type={type} className={cls} style={style} onClick={click}>
      {inner}
    </button>
  );
}
