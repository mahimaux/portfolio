"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { gsap } from "@/lib/gsap";
import { sfx } from "@/lib/sound";

const Q = "(pointer: fine) and (prefers-reduced-motion: no-preference)";
const sub = (f: () => void) => {
  const m = window.matchMedia(Q);
  m.addEventListener("change", f);
  return () => m.removeEventListener("change", f);
};
const snap = () => window.matchMedia(Q).matches;

export function setCursorLabel(label: string | null) {
  window.dispatchEvent(new CustomEvent("cursor-label", { detail: label }));
}

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const blob = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const on = useSyncExternalStore(sub, snap, () => false);

  useEffect(() => {
    if (!on) return;
    document.documentElement.classList.add("has-cursor");
    return () => document.documentElement.classList.remove("has-cursor");
  }, [on]);

  useEffect(() => {
    if (!on) return;
    const d = dot.current!;
    const b = blob.current!;
    gsap.set([d, b], { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    const dx = gsap.quickTo(d, "x", { duration: 0.08, ease: "power2.out" });
    const dy = gsap.quickTo(d, "y", { duration: 0.08, ease: "power2.out" });
    const bx = gsap.quickTo(b, "x", { duration: 0.45, ease: "power3.out" });
    const by = gsap.quickTo(b, "y", { duration: 0.45, ease: "power3.out" });
    let cur: Element | null = null;
    const move = (e: PointerEvent) => {
      dx(e.clientX);
      dy(e.clientY);
      bx(e.clientX);
      by(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const el = t?.closest?.("[data-cursor], a, button, label, [role=button]") ?? null;
      if (el === cur) return;
      cur = el;
      if (!el) {
        setLabel("");
        b.dataset.state = "";
        return;
      }
      const v = el.getAttribute("data-cursor") ?? "";
      setLabel(v === "hover" ? "" : v);
      b.dataset.state = v && v !== "hover" ? "label" : "hover";
      sfx.tick();
    };
    const lab = (e: Event) => {
      const v = (e as CustomEvent<string | null>).detail;
      setLabel(v ?? "");
      b.dataset.state = v ? "label" : "";
      if (v) sfx.tick();
    };
    const down = () => gsap.to(b, { scale: 0.82, duration: 0.15 });
    const up = () => gsap.to(b, { scale: 1, duration: 0.4, ease: "back.out(3)" });
    const leave = () => gsap.to([d, b], { opacity: 0, duration: 0.2 });
    const enter = () => gsap.to([d, b], { opacity: 1, duration: 0.2 });
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("cursor-label", lab);
    document.documentElement.addEventListener("pointerleave", leave);
    document.documentElement.addEventListener("pointerenter", enter);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("cursor-label", lab);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.removeEventListener("pointerenter", enter);
    };
  }, [on]);

  if (!on) return null;
  return (
    <>
      <div ref={blob} aria-hidden className="cursor-blob pointer-events-none fixed left-0 top-0 z-[200] h-24 w-24 will-change-transform">
        <span className="cursor-ring absolute inset-0 grid place-items-center rounded-full">
          <span className="cursor-label mono">{label}</span>
        </span>
      </div>
      <div ref={dot} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[201] h-[7px] w-[7px] rounded-full bg-ink shadow-[0_0_0_2px_rgb(242_238_227_/_0.9)] will-change-transform" />
      <style>{`
        .cursor-ring { border: 4px solid var(--ink); box-shadow: 0 0 0 3px rgb(242 238 227 / .75); scale: .36; transition: scale .45s var(--ease-out), background-color .3s; }
        .cursor-blob[data-state="hover"] .cursor-ring { scale: .62; background: rgb(200 245 60 / .45); }
        .cursor-blob[data-state="label"] .cursor-ring { scale: 1; background: var(--lime); }
        .cursor-label { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: var(--ink); opacity: 0; transform: scale(.6); transition: opacity .25s, transform .35s var(--ease-back); }
        .cursor-blob[data-state="label"] .cursor-label { opacity: 1; transform: scale(1); }
      `}</style>
    </>
  );
}
