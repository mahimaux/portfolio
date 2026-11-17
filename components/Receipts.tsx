"use client";
import { useRef } from "react";
import { gsap, useGSAP, reduced } from "@/lib/gsap";
import { useReveal } from "@/lib/useReveal";
import { sfx } from "@/lib/sound";
import { aboutReceipt, copy, stats, type Stat } from "@/lib/content";

const fmt = (s: Stat, v: number) => (s.decimals ? v.toFixed(s.decimals) : Math.round(v).toLocaleString("en-IN"));

function Row({ l, r, bold }: { l: string; r: string; bold?: boolean }) {
  return (
    <div className={`flex items-end gap-2 ${bold ? "font-bold" : ""}`}>
      <span className={bold ? "shrink-0" : "min-w-0"}>{l}</span>
      <span className="mb-[0.45em] min-w-[16px] flex-1 border-b-2 border-dotted border-ink/35" />
      <span className={`${bold ? "min-w-0" : "shrink-0"} max-w-[72%] text-right`}>{r}</span>
    </div>
  );
}

export function Receipts() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  const c = copy.receipts;

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const counts = q(".count") as HTMLElement[];
      if (reduced()) {
        gsap.set(el, { "--arc": 0 });
        counts.forEach((n, i) => (n.textContent = fmt(stats[i], stats[i].value)));
        return;
      }
      gsap.fromTo(el, { "--arc": 14 }, { "--arc": 0, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 20%", scrub: true } });
      counts.forEach((n, i) => {
        const s = stats[i];
        const o = { v: 0 };
        n.textContent = fmt(s, 0);
        gsap.to(o, {
          v: s.value,
          duration: 2.2,
          ease: "power3.out",
          delay: 0.12 * i,
          onUpdate: () => (n.textContent = fmt(s, o.v)),
          onComplete: () => sfx.ding(),
          scrollTrigger: { trigger: n, start: "top 88%", once: true },
        });
      });
      gsap.fromTo(".receipt", { yPercent: -100 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: ".receipt-wrap", start: "top 95%", end: "top 50%", scrub: 0.5 } });
      gsap.fromTo(".receipt-wrap", { rotate: 5 }, { rotate: -3, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    },
    { scope: root }
  );

  // The section uses overflow-clip, not overflow-hidden: a hidden-overflow
  // ancestor becomes the sticky container and the receipt stops sticking,
  // so it used to scroll away before the reader got to it.
  const bars = Array.from({ length: 46 }, (_, i) => [1, 2, 3, 1, 4, 2, 1, 3][i % 8]);
  return (
    <section id="receipts" ref={root} className="arc-top paper-tex relative z-10 -mt-[6vw] overflow-clip bg-tomato px-[var(--gutter)] pb-[10vw] pt-[14vw] text-ink [--tex-opacity:.5]" style={{ "--arc": 14 } as React.CSSProperties}>
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <span data-reveal="fade" className="tag bg-ink text-tomato">
            {c.tag}
          </span>
          <h2 data-reveal="lines" className="mt-6 text-[clamp(64px,10vw,180px)] leading-[0.84]">
            <span className="display block">{c.h1}</span>
            <span className="serif-i block text-paper">{c.h2}</span>
          </h2>
          <p data-reveal="fade" className="mt-8 max-w-[620px] text-[18px] leading-snug">
            {c.body}
          </p>
          <dl className="mt-12 grid grid-cols-2 gap-x-8">
            {stats.map((s, i) => (
              <div key={s.label} className={`border-t-2 border-ink py-5 ${i === stats.length - 1 && stats.length % 2 ? "col-span-2" : ""}`}>
                <dt className="mono text-[11px] uppercase tracking-[0.12em]">{s.label}</dt>
                <dd className="display mt-2 text-[clamp(52px,6.4vw,112px)] leading-[0.9]">
                  {s.prefix}
                  <span className="count">{fmt(s, s.value)}</span>
                  {s.suffix ?? ""}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="receipt-wrap flex justify-center lg:col-span-5 lg:justify-end">
          <div className="sticky top-[14vh] self-start">
            <div className="mx-[-5%] h-6 w-[110%] rounded-full bg-ink" />
            <div className="-mx-8 -mb-16 -mt-3 overflow-hidden px-8 pb-16">
              <div className="receipt mono relative w-[min(520px,86vw)] bg-[#fbf9f3] px-5 pb-10 pt-8 text-[12px] sm:px-7 sm:text-[13px] leading-[1.75] text-ink shadow-[0_30px_60px_-20px_rgb(18_17_16/.5)]">
                <div className="text-center text-[14px] font-bold uppercase tracking-[0.22em]">{aboutReceipt.title}</div>
                <div className="my-4 border-t-2 border-dashed border-ink/40" />
                {aboutReceipt.items.map(([l, r]) => (
                  <Row key={l} l={l.toUpperCase()} r={r} />
                ))}
                <div className="my-4 border-t-2 border-dashed border-ink/40" />
                <Row l={aboutReceipt.total[0].toUpperCase()} r={aboutReceipt.total[1].toUpperCase()} bold />
                <div className="mt-6 flex h-12 items-stretch justify-center gap-[2px]">
                  {bars.map((w, i) => (
                    <span key={i} className="bg-ink" style={{ width: w }} />
                  ))}
                </div>
                <div className="hand mt-3 text-center text-[24px] leading-[1.15]">{aboutReceipt.note}</div>
                <div className="receipt-teeth absolute inset-x-0 -bottom-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
