"use client";
import { useRef } from "react";
import { gsap, useGSAP, reduced } from "@/lib/gsap";
import { useReveal } from "@/lib/useReveal";
import { copy, process } from "@/lib/content";

export function Process() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  const c = copy.processCopy;

  useGSAP(
    () => {
      if (reduced()) return;
      const cards = gsap.utils.toArray<HTMLElement>(".p-card", root.current);
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          const st = { trigger: next, start: "top bottom", end: "top 18%", scrub: true };
          gsap.to(card.querySelector(".p-inner"), { scale: 0.9, rotate: i % 2 ? 1.5 : -1.5, ease: "none", scrollTrigger: st });
          gsap.to(card.querySelector(".p-shade"), { opacity: 0.3, ease: "none", scrollTrigger: st });
        });
      });
      cards.forEach((card) =>
        gsap.from(card.querySelector(".p-art img"), {
          scale: 1.12,
          autoAlpha: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 70%", once: true },
        })
      );
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section id="process" ref={root} className="relative bg-paper px-[var(--gutter)] pb-[8vw] pt-[12vw]">
      <div className="grid items-end gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <span data-reveal="fade" className="tag bg-ink text-paper">
            {c.tag}
          </span>
          <h2 data-reveal="lines" className="mt-6 text-[clamp(60px,9vw,164px)] leading-[0.86]">
            <span className="display block">{c.h1}</span>
            <span className="serif-i block text-tomato">{c.h2}</span>
          </h2>
        </div>
        <p data-reveal="fade" className="text-[18px] leading-snug lg:col-span-4">
          {c.body}
        </p>
      </div>

      <div className="mt-16 md:mt-24">
        {process.map((p, i) => (
          <div key={p.n} className="p-card relative mb-6 md:sticky md:mb-[6vh]" style={{ top: `calc(90px + ${22 * i}px)` }}>
            <div
              className="p-inner relative grid origin-top overflow-hidden rounded-[30px] border-[3px] border-ink bg-paper shadow-[0_24px_60px_-28px_rgb(18_17_16/.55)] md:min-h-[66vh] md:grid-cols-2"
              style={{ outline: `14px solid ${p.color}`, outlineOffset: -17 }}
            >
              <div className="relative p-8 md:p-12">
                <div className="display text-[clamp(80px,9vw,150px)] leading-none text-transparent [-webkit-text-stroke:2.5px_var(--ink)]">{p.n}</div>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="mono text-[11px] uppercase tracking-[0.12em] opacity-60">
                    step {i + 1} of {process.length}
                  </span>
                  <span className="mono inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-paper px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden>
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                    {p.readTime}
                  </span>
                </div>
                <h3 className="display mt-2 text-[clamp(64px,8vw,140px)] leading-[0.86]">{p.title}</h3>
                <div className="serif-i mt-1 text-[clamp(24px,2.2vw,36px)]">{p.sub}</div>
                <p className="mt-5 max-w-[460px] text-[17px] leading-snug">{p.body}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-full border-2 border-ink px-3 py-1 text-[13px] font-semibold">
                      {t}
                    </span>
                  ))}
                </div>
                {p.href ? (
                  <a
                    href={p.href}
                    className="mono mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[13px] font-bold uppercase tracking-[0.1em] text-paper transition-transform hover:scale-105"
                  >
                    Read the case study →
                  </a>
                ) : null}
              </div>
              <a
                href={p.href}
                tabIndex={-1}
                aria-hidden
                className="relative block aspect-[4/3] overflow-hidden border-t-[3px] border-ink md:aspect-auto md:min-h-[320px] md:border-l-[3px] md:border-t-0"
                style={{ background: p.color }}
              >
                <div className="p-art absolute inset-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.thumb}
                    alt={p.thumbAlt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.04]"
                  />
                </div>
              </a>
              <div className="p-shade pointer-events-none absolute inset-0 bg-ink opacity-0" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
