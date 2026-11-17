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
      // Opening OR closing a row changes the page height, so every pin below
      // (the Playground spiral) must re-measure once the rows settle. Refreshing
      // only on open left stale pin positions after a close, which made the
      // spiral scroll past the top and then jump into place.
      const tl = gsap.timeline({ onComplete: () => ScrollTrigger.refresh() });
      gsap.utils.toArray<HTMLElement>(".tk-body", root.current).forEach((b, i) => {
        tl.to(b, { height: i === open ? "auto" : 0, duration: rm ? 0 : 0.7, ease: "expo.out" }, 0);
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
        <div className="tk-side-title flex items-center px-[var(--gutter)] pt-[clamp(56px,10vw,96px)] md:sticky md:top-0 md:h-[100svh] md:justify-center md:overflow-hidden md:p-0">
          {/* Rotated, the title's length runs along the viewport height, so its
              size is capped by svh as well as vw to keep it inside the column. */}
          <h2 className="display text-[clamp(48px,13vw,72px)] md:whitespace-nowrap md:text-[clamp(48px,min(7vw,10.5svh),120px)] md:-rotate-90">
            {c.title} <span className="text-lime">{c.titleEm}</span>
          </h2>
        </div>
      </div>
      <div className="tk-bars overflow-hidden border-b-[6px] border-ink">
        <div className="px-[var(--gutter)] py-[clamp(40px,6vw,96px)]">
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
              <span className="display flex-1 text-[clamp(38px,5vw,84px)] leading-[1.05] transition-transform duration-500 [transition-timing-function:var(--ease-out)] group-hover:translate-x-3 group-hover:-rotate-1">
                {t.name}
              </span>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-current">
                <span className="tk-plus block">
                  <Plus size={20} />
                </span>
              </span>
            </button>
            <div className="tk-body h-0 overflow-hidden">
              <div className="grid gap-7 px-[var(--gutter)] pb-10 md:pl-[calc(var(--gutter)+52px)]">
                {t.areas.map((a) => (
                  <div key={a.label}>
                    <h3 className="mono text-[12px] uppercase tracking-[0.08em] opacity-75">{a.label}</h3>
                    <ul className="mt-3 flex max-w-[920px] flex-wrap gap-2" aria-label={`${a.label} skills`}>
                      {a.tags.map((g) => (
                        <li key={g} className="max-w-full rounded-full border-2 border-current px-3 py-1 text-[13px] font-semibold leading-snug">
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div>
                  <h3 className="mono text-[12px] uppercase tracking-[0.08em] opacity-75">Tools</h3>
                  <ul className="mt-3 flex max-w-[920px] flex-wrap gap-2" aria-label={`${t.name} tools`}>
                    {t.tools.map((g) => (
                      <li
                        key={g}
                        className="max-w-full rounded-full border-2 px-3 py-1 text-[13px] font-semibold leading-snug"
                        style={{ background: t.fg, color: t.color, borderColor: t.fg }}
                      >
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
