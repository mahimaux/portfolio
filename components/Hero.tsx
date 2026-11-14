"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, SplitText, Draggable, useGSAP, reduced, isCoarse } from "@/lib/gsap";
import { onEntered } from "@/lib/store";
import { sfx } from "@/lib/sound";
import { copy, heroTyped } from "@/lib/content";
import { Btn } from "./Btn";
import { CircleText } from "./CircleText";
import { ArrowDown, Burst, DrawnArrow, Heart, Sparkle } from "./Icons";

function TypeLoop({ words }: { words: string[] }) {
  const [text, setText] = useState("");
  useEffect(() => {
    if (reduced()) {
      setText(words[words.length - 1]);
      return;
    }
    let t: ReturnType<typeof setTimeout>;
    let wi = 0;
    let ci = 0;
    const type = () => {
      const w = words[wi];
      if (ci < w.length) {
        setText(w.slice(0, ++ci));
        t = setTimeout(type, 70 + Math.random() * 50);
      } else t = setTimeout(del, 1500);
    };
    const del = () => {
      if (ci > 0) {
        setText(words[wi].slice(0, --ci));
        t = setTimeout(del, 35);
      } else {
        wi = (wi + 1) % words.length;
        t = setTimeout(type, 280);
      }
    };
    const off = onEntered(() => {
      t = setTimeout(type, 600);
    });
    return () => {
      off();
      clearTimeout(t);
    };
  }, [words]);
  return (
    <span>
      {text}
      <span className="caret" aria-hidden />
    </span>
  );
}

function HeroTile() {
  const slides = [
    { t: "UX\nDesign", bg: "var(--blue)", fg: "var(--paper)" },
    { t: "Product\ndesign", bg: "var(--lime)", fg: "var(--forest)" },
    { t: "AX\ndesign", bg: "var(--tomato)", fg: "var(--ink)" },
  ];
  return (
    <span className="hero-tile relative inline-block h-[0.98em] w-[1.18em] shrink-0 self-center rounded-[0.1em] border-[3px] border-ink bg-blue align-middle" aria-hidden>
      <span className="absolute inset-0 overflow-hidden rounded-[0.08em]">
        {slides.map((s, i) => (
          <span
            key={i}
            className="tile-slide absolute inset-0 grid place-items-center whitespace-pre text-center text-[0.16em] font-semibold leading-[1] tracking-tight"
            style={{ background: s.bg, color: s.fg, animationDelay: `${i * 2}s` }}
          >
            {s.t}
          </span>
        ))}
      </span>
      <Heart className="beat absolute bottom-[0.06em] right-[0.06em] h-[0.16em] w-[0.16em] text-pink" />
      <span className="absolute left-1/2 top-[-0.06em] h-[0.12em] w-[0.42em] -translate-x-1/2 rotate-[-6deg] bg-[#e8dcc0]/90" />
    </span>
  );
}

function SunFace({ size = 120 }: { size?: number }) {
  const rays = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden>
      {rays.map((a) => (
        <rect key={a} x="55" y="2" width="10" height="26" rx="5" fill="var(--tomato)" stroke="var(--ink)" strokeWidth="2" transform={`rotate(${a} 60 60)`} />
      ))}
      <circle cx="60" cy="60" r="34" fill="var(--sun)" stroke="var(--ink)" strokeWidth="2.5" />
      <circle cx="49" cy="55" r="3.6" fill="var(--ink)" />
      <circle cx="71" cy="55" r="3.6" fill="var(--ink)" />
      <path d="M47 67c7 8 19 8 26 0" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

const S = ({ pos, speed, rot, children }: { pos: string; speed: number; rot: number; children: React.ReactNode }) => (
  <div className={`sticker-pos ${pos}`} data-speed={speed}>
    <div className="sticker" data-rot={rot} data-cursor="drag">
      {children}
    </div>
  </div>
);

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const c = copy.hero;

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const rm = reduced();
      const stickers = q(".sticker") as HTMLElement[];

      // Draggable stickers (also in reduced mode)
      let z = 30;
      const drags = stickers.flatMap((s) =>
        Draggable.create(s, {
          type: "x,y",
          inertia: true,
          bounds: el,
          allowContextMenu: true,
          dragClickables: true,
          minimumMovement: isCoarse() ? 6 : 2,
          onPress() {
            (s.parentElement as HTMLElement).style.zIndex = String(++z);
            gsap.to(s, { scale: 1.08, rotate: "+=4", duration: 0.25, ease: "back.out(3)" });
            s.style.filter = "drop-shadow(0 22px 22px rgb(18 17 16 / .28))";
            sfx.pop(1.1);
          },
          onRelease() {
            gsap.to(s, { scale: 1, duration: 0.5, ease: "elastic.out(1.2, 0.4)" });
            s.style.filter = "";
          },
          onThrowComplete() {
            sfx.pop(0.7);
          },
        })
      );

      if (rm) {
        stickers.forEach((s) => gsap.set(s, { rotate: +s.dataset.rot! }));
        gsap.set(".hero-tile", { rotate: -4 });
        return () => drags.forEach((d) => d.kill());
      }

      const split = SplitText.create(".hero-word", { type: "chars", mask: "chars", charsClass: "hchar" });
      gsap.set(split.chars, { yPercent: 115, rotate: 6 });
      gsap.set(".hero-tile", { scale: 0, rotate: -25 });
      stickers.forEach((s) => gsap.set(s, { scale: 0, rotate: gsap.utils.random(-50, 50) }));
      gsap.set(".hero-fade", { autoAlpha: 0, y: 26 });
      gsap.set(".hero-note", { autoAlpha: 0 });

      const off = onEntered(() => {
        gsap
          .timeline({ delay: 0.55 })
          .to(split.chars, { yPercent: 0, rotate: 0, duration: 1.15, stagger: { each: 0.028, from: "start" }, ease: "expo.out" }, 0)
          .to(".hero-tile", { scale: 1, rotate: -4, duration: 1, ease: "back.out(2)" }, 0.35)
          .to(".hero-fade", { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.07, ease: "expo.out" }, 0.55)
          .to(
            stickers,
            {
              scale: 1,
              rotate: (_i: number, t: HTMLElement) => +t.dataset.rot!,
              duration: 0.9,
              stagger: { each: 0.09, onStart: () => sfx.pop(0.9 + 0.6 * Math.random()) },
              ease: "back.out(2.4)",
            },
            0.8
          )
          .to(".hero-note", { autoAlpha: 1, duration: 0.6 }, 1.6)
          .fromTo(".hero-note .draw", { strokeDasharray: 240, strokeDashoffset: 240 }, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" }, 1.6);
      });

      // "noise." jitter
      const noiseChars = split.chars.filter((ch) => ch.closest(".noise"));
      gsap.set(noiseChars, { willChange: "transform" });
      const jitter = gsap.to(noiseChars, {
        y: () => gsap.utils.random(-5, 5),
        rotate: () => gsap.utils.random(-4, 4),
        duration: 0.09,
        ease: "steps(1)",
        repeat: -1,
        repeatRefresh: true,
        delay: 1.8,
      });
      ScrollTrigger.create({ trigger: el, start: "top bottom", end: "bottom top", onToggle: (s) => (s.isActive ? jitter.resume() : jitter.pause()) });

      // Scroll scrub
      const st = { trigger: el, start: "top top", end: "bottom top", scrub: true };
      gsap.to(".hero-line-1", { xPercent: 9, ease: "none", scrollTrigger: st });
      gsap.to(".hero-line-2", { xPercent: -11, ease: "none", scrollTrigger: st });
      gsap.to(".hero-tile", { rotate: 18, ease: "none", scrollTrigger: st });
      (q(".sticker-pos") as HTMLElement[]).forEach((p) => gsap.to(p, { y: -180 * +p.dataset.speed!, ease: "none", scrollTrigger: st }));

      ScrollTrigger.refresh();
      return () => {
        off();
        drags.forEach((d) => d.kill());
        split.revert();
      };
    },
    { scope: root }
  );

  return (
    <section id="top" ref={root} className="paper-tex relative min-h-[100svh] overflow-hidden bg-paper px-[var(--gutter)] pb-[170px] pt-[104px] md:pb-[7vw] md:pt-[118px]">
      <div className="hero-fade mono flex justify-between text-[11px] uppercase tracking-[0.1em] text-ink/70">
        <span>{c.kicker}</span>
        <span className="hidden md:inline">{c.kickerRight}</span>
      </div>
      <div className="hero-fade mono mt-6 text-[clamp(15px,1.5vw,21px)]">
        <span className="font-semibold text-tomato">hello</span> <span className="text-ink/50">{"{{ "}</span>
        <TypeLoop words={heroTyped} />
        <span className="text-ink/50">{" }}"}</span>
      </div>

      <h1 className="display mt-5 text-[clamp(36px,13vw,200px)] leading-[0.86] md:text-[clamp(60px,7.8vw,200px)]">
        <span className="sr-only">{c.srTitle}</span>
        <span aria-hidden className="hero-line-1 flex flex-wrap items-center gap-x-[0.18em]">
          <HeroTile />
          <span className="hero-word whitespace-nowrap">{c.line1[0]}</span>
          <span className="hero-word noise whitespace-nowrap">{c.line1[1]}</span>
        </span>
        <span aria-hidden className="hero-line-2 mt-[max(10px,0.08em)] flex flex-wrap justify-end gap-x-[0.18em] text-tomato">
          <span className="hero-word whitespace-nowrap">{c.line2[0]}</span>
          <span className="hero-word whitespace-nowrap">{c.line2[1]}</span>
        </span>
      </h1>

      <div className="relative mt-10 flex flex-wrap items-end justify-between gap-8">
        <div>
          <p className="hero-fade max-w-[520px] text-[clamp(16px,1.35vw,20px)] leading-snug">{c.bodyPre}</p>
          <div className="hero-fade mt-7 flex flex-wrap gap-3">
            <Btn href="#process">{c.ctaPrimary}</Btn>
            <Btn href="#content-design" variant="ghost">
              {c.ctaGhost}
            </Btn>
          </div>
        </div>
        <div className="hero-fade hidden md:block">
          <CircleText text={c.circle} size={138} bg="var(--ink)" fg="var(--lime)">
            <ArrowDown size={26} className="text-lime" />
          </CircleText>
        </div>
      </div>

      {/* Stickers */}
      <S pos="bottom-[28px] right-[6%] md:bottom-[8%] md:right-auto md:left-[30%] lg:left-[51%] xl:bottom-auto xl:left-auto xl:right-[9%] xl:top-[17%]" speed={1.4} rot={-12}>
        <div className="grid h-[118px] w-[118px] place-items-center rounded-full border-2 border-ink bg-lime p-3 text-center text-forest md:h-[164px] md:w-[164px]">
          <div className="mono text-[11px] font-semibold uppercase leading-[1.15] tracking-[0.04em] md:text-[13px]">
            Previously
            <br />
            into content
            <br />
            design
          </div>
        </div>
      </S>
      <S pos="left-[30%] top-[10.5%] hidden md:block" speed={0.8} rot={7}>
        <div className="rounded-full border-2 border-ink bg-paper px-5 py-2 text-[16px] font-semibold shadow-[0_3px_0_var(--ink)]">IBM</div>
      </S>
      <S pos="bottom-[13%] left-[36%] hidden lg:block" speed={1.1} rot={-9}>
        <div className="rounded-full border-2 border-ink bg-pink px-5 py-2 text-[16px] font-semibold shadow-[0_3px_0_var(--ink)]">Software AG</div>
      </S>
      <S pos="bottom-[19%] right-[14%] hidden lg:block" speed={0.6} rot={-6}>
        <div className="w-[200px] border-2 border-ink bg-white p-2.5 pb-3 shadow-[0_4px_0_var(--ink)]">
          <div className="relative grid aspect-square place-items-center bg-tomato p-3">
            <span className="display text-center text-[22px] leading-[1] text-ink">
              OH, AND I
              <br />
              DESIGN
              <br />
              FOR AI
            </span>
            <Sparkle size={26} className="absolute right-2 top-2 text-lime" />
          </div>
        </div>
      </S>
      <S pos="left-[47%] top-[11%] hidden lg:block" speed={1.2} rot={-14}>
        <SunFace size={120} />
      </S>
      <S pos="bottom-[14%] left-[60%] hidden xl:block" speed={1.5} rot={4}>
        <div className="sun-ticket bg-sun px-7 py-3 text-center">
          <div className="mono text-[10px] uppercase tracking-[0.14em]">certified</div>
          <div className="display text-[30px] leading-none">thumb-stopper</div>
        </div>
      </S>

      <div className="hero-note hand pointer-events-none absolute right-[20%] top-[11%] hidden rotate-[-6deg] text-[22px] leading-tight md:block">
        {c.note[0]}
        <br />
        {c.note[1]}
        <DrawnArrow className="ml-6 mt-1 h-[56px] w-[100px] -scale-y-100 rotate-[-8deg]" />
      </div>
    </section>
  );
}
