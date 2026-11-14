"use client";
import { useRef } from "react";
import { gsap, useGSAP, reduced } from "@/lib/gsap";
import { useReveal } from "@/lib/useReveal";
import { getLenis } from "@/lib/scroll";
import { copy, faqs } from "@/lib/content";

export function Faq() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  useGSAP(
    () => {
      if (reduced()) return;
      gsap.utils.toArray<HTMLElement>(".faq-item", root.current).forEach((it, i) =>
        gsap.from(it, { y: 60, autoAlpha: 0, duration: 1, ease: "expo.out", delay: (i % 2) * 0.1, scrollTrigger: { trigger: it, start: "top 90%", once: true } })
      );
    },
    { scope: root }
  );

  return (
    <section id="faq" ref={root} className="relative bg-paper px-[var(--gutter)] pb-[10vw] pt-[8vw]">
      {(copy.faq.tag || copy.faq.title) && (
        <div className="mb-16 text-center">
          {copy.faq.tag && <span className="tag bg-tomato text-ink">{copy.faq.tag}</span>}
          {copy.faq.title && (
            <h2 data-reveal="lines" className="display mx-auto mt-6 text-[clamp(64px,12vw,220px)] leading-[0.84] text-tomato">
              {copy.faq.title}
            </h2>
          )}
        </div>
      )}
      <div className="mx-auto grid max-w-[1300px] gap-x-12 md:grid-cols-2">
        {faqs.map((f, i) => (
          <div key={f.q} className="faq-item border-t-2 border-ink py-7 md:py-9">
            <div className="mono text-[12px] text-tomato">{String(i + 1).padStart(2, "0")}</div>
            <h3 className="display mt-3 text-[clamp(28px,2.7vw,44px)] leading-[0.95]">{f.q}</h3>
            <p className="mt-3 text-[18px] leading-snug">{f.a}</p>
          </div>
        ))}
      </div>
      <div className="mt-14 text-center">
        <button
          type="button"
          onClick={() => {
            const l = getLenis();
            if (l) l.scrollTo(0, { duration: 2.4 });
            else scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="group mono text-[13px] uppercase tracking-[0.12em] text-tomato"
        >
          [ <span className="inline-block transition-transform duration-300 group-hover:-translate-y-1">{copy.faq.top}</span> ]
        </button>
      </div>
    </section>
  );
}
