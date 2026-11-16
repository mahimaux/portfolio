"use client";
import { useRef } from "react";
import { gsap, SplitText, useGSAP, reduced } from "@/lib/gsap";
import { getLenis } from "@/lib/scroll";
import { brand, copy, nav } from "@/lib/content";
import { Logo } from "./Logo";

export function Footer() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (reduced()) return;
      const mark = root.current!.querySelector(".wordmark")!;
      const split = SplitText.create(mark, { type: "chars", mask: "chars", charsClass: "wchar" });
      gsap.from(split.chars, { yPercent: 125, stagger: 0.06, ease: "power2.out", scrollTrigger: { trigger: mark, start: "top bottom", end: "bottom bottom", scrub: 0.6 } });
      return () => split.revert();
    },
    { scope: root }
  );
  const h = "mono mb-4 text-[11px] uppercase tracking-[0.12em] text-paper/45";
  const top = () => getLenis()?.scrollTo(0, { duration: 2.4 });
  return (
    <footer ref={root} className="overflow-hidden border-t-2 border-paper/15 bg-ink px-[var(--gutter)] pb-24 pt-14 text-paper md:pb-6">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo />
          <p className="mt-5 max-w-[340px] text-[15px] leading-snug text-paper/70">{copy.footer.about}</p>
        </div>
        <div className="md:col-span-2 md:col-start-9">
          <div className={h}>Sitemap</div>
          <ul className="space-y-1.5 text-[15px]">
            {nav.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="hover:text-lime">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2">
          <div className={h}>Socials</div>
          <ul className="space-y-1.5 text-[15px]">
            {brand.socials.filter((s) => s.href && s.href !== "#").map((s) => (
              <li key={s.label}>
                <a href={s.href} {...(/^https?:|\.pdf$/.test(s.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="hover:text-lime">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="wordmark display mt-14 whitespace-nowrap text-center text-[25.8vw] leading-[0.76] text-lime" aria-hidden>
        {brand.name}
      </div>
      <div className="mono mt-8 flex flex-wrap items-center justify-between gap-4 text-[11px] uppercase tracking-[0.1em] text-paper/60">
        <span>{copy.footer.legal}</span>
        <span className="flex gap-5">
          <button type="button" onClick={top} className="uppercase hover:text-paper">
            Back to top ↑
          </button>
        </span>
      </div>
    </footer>
  );
}
