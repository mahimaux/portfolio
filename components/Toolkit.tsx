"use client";
import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, reduced } from "@/lib/gsap";
import { sfx } from "@/lib/sound";
import { copy, toolkit } from "@/lib/content";
import { Plus } from "./Icons";

export function Toolkit() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(0);
  const c = copy.toolkit;

  useGSAP(
    () => {
      if (reduced()) return;
      gsap.from(".tk-bar", { xPercent: 60, rotate: 3, autoAlpha: 0, stagger: 0.09, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".tk-bars", start: "top 75%", once: true } });
      gsap.from(".tk-side-title", { yPercent: 40, autoAlpha: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 70%", once: true } });
    },
    { scope: root }
  );

  useGSAP(
    () => {
      const rm = reduced();
      gsap.utils.toArray<HTMLElement>(".tk-body", root.current).forEach((b, i) => {
        gsap.to(b, { height: i === open ? "auto" : 0, duration: rm ? 0 : 0.7, ease: "expo.out", onComplete: i === open ? () => ScrollTrigger.refresh() : undefined });
      });
      gsap.utils.toArray<HTMLElement>(".tk-plus", root.current).forEach((p, i) => {
        gsap.to(p, { rotate: i === open ? 45 : 0, duration: rm ? 0 : 0.5, ease: "back.out(2)" });
      });
    },
    { scope: root, dependencies: [open] }
  );

  return (
    <section id="toolkit" ref={root} className="relative grid bg-ink text-paper md:grid-cols-[minmax(240px,26vw)_1fr]">
      <div className="border-paper/10 md:border-r-2">
        <div className="tk-side-title flex items-center px-[var(--gutter)] pt-[12vw] md:sticky md:top-0 md:h-[100svh] md:justify-center md:p-0">
          <h2 className="display whitespace-nowrap text-[clamp(56px,7vw,120px)] md:-rotate-90">
            {c.title} <span className="text-lime">{c.titleEm}</span>
          </h2>
        </div>
      </div>
      <div className="tk-bars overflow-hidden">
        <div className="px-[var(--gutter)] py-[8vw] md:py-[10vw]">
          <span className="tag bg-paper text-ink">{c.tag}</span>
          <p className="mt-6 max-w-[560px] text-[19px] leading-snug text-paper/80">{c.body}</p>
        </div>
        {toolkit.map((t, i) => (
          <div key={t.name} className="tk-bar border-t-2 border-ink" style={{ background: t.color, color: t.fg }}>
            <button
              type="button"
              aria-expanded={open === i}
              onClick={() => {
                sfx.pop(1 + 0.1 * i);
                setOpen(open === i ? -1 : i);
              }}
              className="group flex w-full items-center gap-5 px-[var(--gutter)] py-6 text-left md:py-8"
            >
              <span className="mono text-[12px] opacity-70">{String(i + 1).padStart(2, "0")}</span>
              <span className="display flex-1 text-[clamp(38px,5vw,84px)] leading-[0.9] transition-transform duration-500 [transition-timing-function:var(--ease-out)] group-hover:translate-x-3 group-hover:-rotate-1">
                {t.name}
              </span>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-current">
                <span className="tk-plus block">
                  <Plus size={20} />
                </span>
              </span>
            </button>
            <div className="tk-body h-0 overflow-hidden">
              <div className="px-[var(--gutter)] pb-8 md:pl-[calc(var(--gutter)+52px)]">
                <p className="max-w-[640px] text-[19px] leading-snug">{t.body}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {t.tags.map((g) => (
                    <span key={g} className="rounded-full border-2 border-current px-3 py-1 text-[13px] font-semibold">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
