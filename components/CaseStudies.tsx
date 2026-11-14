"use client";
import { useRef } from "react";
import { gsap, useGSAP, reduced } from "@/lib/gsap";
import { useReveal } from "@/lib/useReveal";
import { copy, cdCases } from "@/lib/content";
import { ArrowUpRight } from "./Icons";

const squiggles: [string, string, number, boolean][] = [
  ["6%", "9%", 20, false],
  ["90%", "7%", -30, false],
  ["3%", "88%", -10, true],
  ["94%", "80%", 40, true],
  ["56%", "5%", 70, true],
  ["96%", "44%", 10, true],
];

/** (05) Content design case studies: three cards, each opening its own page. */
export function CaseStudies() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  const c = copy.quote;

  useGSAP(
    () => {
      if (reduced()) return;
      gsap.utils.toArray<HTMLElement>(".squig", root.current).forEach((s) =>
        gsap.to(s, {
          rotate: "+=" + gsap.utils.random(-40, 40),
          y: gsap.utils.random(-60, 60),
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        })
      );
    },
    { scope: root }
  );

  return (
    <section id="content-design-cases" ref={root} className="paper-tex relative overflow-hidden bg-pink px-[var(--gutter)] py-[14vw] [--tex-opacity:.35] md:py-[10vw]">
      {squiggles.map(([x, y, r, md], i) => (
        <svg
          key={i}
          className={`squig absolute h-10 w-10 text-tomato ${md ? "hidden md:block" : ""}`}
          style={{ left: x, top: y, rotate: `${r}deg` }}
          viewBox="0 0 36 30"
          fill="none"
          aria-hidden
        >
          <path d="M6 22c4-8 8 8 12 0s8 8 12 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ))}
      <div className="relative grid items-end gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <span data-reveal="fade" className="tag bg-ink text-pink">
            {c.tag}
          </span>
          <h2 data-reveal="lines" className="mt-6 text-[clamp(50px,7.4vw,136px)] leading-[0.86]">
            <span className="display block">{c.h1}</span>
            <span className="serif-i block">{c.h2}</span>
          </h2>
        </div>
        <p data-reveal="fade" className="text-[18px] leading-snug lg:col-span-4">
          {c.body}
        </p>
      </div>

      <ol className="relative mt-14 grid gap-6 lg:mt-20 lg:grid-cols-3">
        {cdCases.map((k, i) => (
          <li key={k.href} data-reveal="fade" className="flex">
            <a
              href={k.href}
              className="group flex w-full flex-col overflow-hidden rounded-[22px] border-2 border-ink bg-paper shadow-[8px_8px_0_var(--ink)] transition-transform duration-300 [transition-timing-function:var(--ease-out)] hover:-translate-x-[3px] hover:-translate-y-[3px]"
            >
              <div className="flex items-center justify-between border-b-2 border-ink px-5 py-4" style={{ background: k.bg, color: k.fg }}>
                <span className="display text-[44px] leading-none">{String(i + 1).padStart(2, "0")}</span>
                <span className="mono max-w-[70%] text-right text-[10px] uppercase leading-snug tracking-[0.12em]">{k.kicker}</span>
              </div>
              <div className="flex flex-1 flex-col p-5 md:p-6">
                <h3 className="display text-[clamp(26px,2.2vw,36px)] leading-[0.98]">{k.title}</h3>
                <p className="mt-4 text-[15px] leading-snug opacity-80">{k.desc}</p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-7">
                  <span className="inline-flex items-center gap-2 border-b-2 border-ink pb-0.5 text-[15px] font-bold">
                    {c.cta}
                    <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                  {k.pdf ? <span className="tag bg-ink text-paper">{k.pdf}</span> : null}
                </div>
              </div>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
