"use client";
import { useRef } from "react";
import { gsap, SplitText, useGSAP, reduced } from "@/lib/gsap";
import { copy } from "@/lib/content";
import { DrawnArrow, Heart, Search, Sparkle } from "./Icons";

function FeedPhone() {
  const cards = [
    { bg: "var(--tomato)", t: "40% OFF" },
    { bg: "var(--paper)" },
    { bg: "var(--blue)", t: "NEW DROP", fg: "var(--paper)" },
    { bg: "var(--paper)" },
    { bg: "var(--pink)", t: "GLOW UP" },
    { bg: "var(--sun)" },
  ];
  const all = [...cards, ...cards];
  return (
    <span className="relative inline-block h-[0.86em] w-[0.46em] shrink-0 rotate-[-6deg] overflow-hidden rounded-[0.06em] border-[5px] border-forest bg-paper align-middle" aria-hidden>
      <span className="absolute left-1/2 top-[0.02em] z-10 h-[0.03em] w-[0.12em] -translate-x-1/2 rounded-full bg-forest" />
      <span className="feed-strip flex flex-col gap-[0.02em] p-[0.025em]">
        {all.map((c, i) => (
          <span key={i} className="relative grid h-[0.3em] shrink-0 place-items-center rounded-[0.025em] border-2 border-forest" style={{ background: c.bg, color: c.fg ?? "var(--ink)" }}>
            {c.t ? (
              <span className="text-[0.07em] leading-none">{c.t}</span>
            ) : (
              <span className="flex w-3/4 flex-col gap-[0.015em]">
                <span className="h-[0.02em] w-full rounded bg-forest/25" />
                <span className="h-[0.02em] w-2/3 rounded bg-forest/25" />
              </span>
            )}
          </span>
        ))}
      </span>
    </span>
  );
}

function SearchPill({ text }: { text: string }) {
  return (
    <span className="inline-flex h-[0.42em] shrink-0 rotate-[3deg] items-center gap-[0.05em] rounded-full border-[5px] border-forest bg-paper px-[0.1em] align-middle" aria-hidden>
      <Search className="h-[0.16em] w-[0.16em] text-blue" />
      <span className="mono whitespace-nowrap text-[0.12em] normal-case tracking-normal text-ink">{text}</span>
      <span className="h-[0.16em] w-[3px] animate-pulse bg-blue" />
    </span>
  );
}

export function Manifesto() {
  const root = useRef<HTMLElement>(null);
  const c = copy.manifesto;

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const pin = q(".h-pin")[0] as HTMLElement;
      const track = q(".h-track")[0] as HTMLElement;
      const text = q(".manifesto-text")[0] as HTMLElement;
      if (reduced()) {
        gsap.set(el, { "--arc": 0 });
        return;
      }
      gsap.fromTo(el, { "--arc": 16 }, { "--arc": 0, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 25%", scrub: true } });

      const split = SplitText.create(text, { type: "words", wordsClass: "mword" });
      gsap.fromTo(split.words, { opacity: 0.14 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: text, start: "top 80%", end: "bottom 45%", scrub: true } });
      gsap.fromTo(
        ".m-underline path",
        { strokeDasharray: 600, strokeDashoffset: 600 },
        { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: text, start: "center 60%", end: "bottom 45%", scrub: true } }
      );

      const dist = () => Math.max(0, track.scrollWidth - innerWidth + 0.08 * innerWidth);
      // Scroll distance is 45% of the horizontal travel so the three checks pass quickly
      // and the projects arrive sooner for someone skimming.
      const range = { trigger: pin, start: "top top", end: () => "+=" + 0.45 * dist(), scrub: 0.6, invalidateOnRefresh: true };
      const hTween = gsap.to(track, { x: () => -dist(), ease: "none", scrollTrigger: { ...range, pin: true } });
      (q(".h-float") as HTMLElement[]).forEach((f) => {
        const sp = +f.dataset.speed!;
        gsap.to(f, {
          x: () => -(0.35 * dist()) * sp,
          y: () => gsap.utils.random(-80, 80),
          rotate: gsap.utils.random(-25, 25),
          ease: "none",
          scrollTrigger: { ...range },
        });
      });
      gsap.to(".feed-strip", { yPercent: -50, ease: "none", scrollTrigger: { ...range } });
      (q(".h-note .draw") as unknown as SVGPathElement[]).forEach((p) =>
        gsap.fromTo(
          p,
          { strokeDasharray: 240, strokeDashoffset: 240 },
          { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: p, containerAnimation: hTween, start: "left 85%", end: "left 45%", scrub: true } }
        )
      );
      return () => split.revert();
    },
    { scope: root }
  );

  return (
    <section id="manifesto" ref={root} className="manifesto arc-top paper-tex relative z-10 -mt-[6vw] bg-lime text-forest" style={{ "--arc": 16 } as React.CSSProperties}>
      <div className="px-[var(--gutter)] pb-[10vw] pt-[46vw] text-center md:pt-[16vw]">
        <span className="tag bg-forest text-lime">{c.tag}</span>
        <p className="manifesto-text display mx-auto mt-8 max-w-[15ch] text-[clamp(44px,7.4vw,128px)] leading-[0.9]">
          {c.pre} <span className="manifesto-hl rounded-[0.12em] px-[0.12em] text-lime">{c.hl}</span> {c.mid}{" "}
          <span className="relative inline-block">
            {c.end}
            <svg className="m-underline absolute -bottom-[0.12em] left-0 h-[0.22em] w-full" viewBox="0 0 300 30" preserveAspectRatio="none" aria-hidden>
              <path d="M4 20C60 6 120 8 170 14s90 10 126-4" fill="none" stroke="var(--tomato)" strokeWidth="7" strokeLinecap="round" />
            </svg>
          </span>
        </p>
        <p className="mx-auto mt-10 max-w-[560px] text-[17px] leading-snug md:text-[19px]">{c.body}</p>
      </div>

      <div className="h-pin relative h-[100svh] overflow-hidden">
        <span className="tag absolute left-[var(--gutter)] top-[var(--gutter)] z-10 bg-forest text-lime">{c.trackTag}</span>
        <div className="h-track display absolute left-0 top-1/2 flex -translate-y-1/2 items-center gap-[5vw] whitespace-nowrap pl-[8vw] text-[clamp(150px,27vw,520px)] leading-[0.8]">
          <span>{c.words[0]}</span>
          <FeedPhone />
          <span>{c.words[1]}</span>
          <SearchPill text={c.searchPill} />
          <span className="relative">
            {c.words[2]}
            <span className="h-note absolute left-[30%] top-full flex items-start gap-2 whitespace-nowrap text-forest">
              <DrawnArrow className="h-[70px] w-[120px] -scale-x-100 rotate-[200deg]" />
              <span className="hand mt-6 text-[clamp(20px,2vw,30px)] normal-case leading-tight tracking-normal">
                {c.hNote[0]}
                <br />
                {c.hNote[1]}
              </span>
            </span>
          </span>
          <span className="serif-i pr-[12vw] text-[0.34em] leading-[0.95] text-forest/80">
            {c.aside[0]}
            <br />
            {c.aside[1]}
          </span>

        </div>
        <span className="h-float left-[62%] top-[14%] grid h-[110px] w-[110px] place-items-center rounded-full border-2 border-forest bg-pink" data-speed={1.2} aria-hidden>
          <Heart size={50} className="text-tomato" />
        </span>
        <span className="h-float left-[110%] top-[70%] rounded-full border-2 border-forest bg-paper px-5 py-2 font-sans text-[22px] font-semibold normal-case tracking-normal text-ink" data-speed={1.6} aria-hidden>
          +1 clear screen
        </span>
        <span className="h-float left-[160%] top-[16%]" data-speed={0.9} aria-hidden>
          <Sparkle size={90} className="text-tomato" />
        </span>
        <span className="h-float mono left-[205%] top-[64%] rounded-md border-2 border-forest bg-sun px-3 py-1.5 text-[18px] normal-case tracking-normal text-ink" data-speed={1.3} aria-hidden>
          tickets down ↓
        </span>
      </div>
    </section>
  );
}
