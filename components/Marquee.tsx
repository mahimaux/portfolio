"use client";
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, reduced } from "@/lib/gsap";
import { scrollState } from "@/lib/scroll";

export function Marquee({ children, duration = 30, reverse = false, className = "" }: { children: ReactNode; duration?: number; reverse?: boolean; className?: string }) {
  const track = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (reduced()) return;
    const el = track.current!;
    const tw = gsap.fromTo(el, { xPercent: reverse ? -50 : 0 }, { xPercent: reverse ? 0 : -50, duration, ease: "none", repeat: -1 });
    let ts = 1;
    const tick = () => {
      const v = scrollState.velocity;
      const target = (v < -0.5 ? -1 : 1) * (1 + Math.min(0.12 * Math.abs(v), 5));
      ts += (target - ts) * 0.08;
      tw.timeScale(ts);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        tw.resume();
        gsap.ticker.add(tick);
      } else {
        tw.pause();
        gsap.ticker.remove(tick);
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      gsap.ticker.remove(tick);
    };
  });
  return (
    <div className={`overflow-hidden ${className}`}>
      <div ref={track} className="flex w-max will-change-transform">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
