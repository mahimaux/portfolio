"use client";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, reduced } from "@/lib/gsap";
import { useReveal } from "@/lib/useReveal";
import { sfx } from "@/lib/sound";
import { brand, copy, metaServices } from "@/lib/content";
import { ServiceList } from "./ServiceList";
import { Heart, Sparkle } from "./Icons";

const pastels = ["#f4c9df", "#d8d4f7", "#f7e3b5", "#cfe8d6", "#f1d1c4", "#d6e4f5", "#efe0f7"];

function Post({ i }: { i: number }) {
  return (
    <div className="shrink-0 overflow-hidden rounded-2xl border border-ink/10 bg-white">
      <div className="flex items-center gap-2 p-2.5">
        <span className="h-6 w-6 rounded-full" style={{ background: pastels[(i + 3) % 7] }} />
        <span className="h-2 w-20 rounded bg-ink/15" />
      </div>
      <div className="h-[190px]" style={{ background: pastels[i % 7] }} />
      <div className="space-y-1.5 p-2.5">
        <div className="h-2 w-3/4 rounded bg-ink/15" />
        <div className="h-2 w-1/2 rounded bg-ink/10" />
      </div>
    </div>
  );
}

export function MetaMoment() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  const c = copy.meta;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const reel = q(".feed-reel")[0] as HTMLElement;
      const ad = q(".feed-ad")[0] as HTMLElement;
      const screen = q(".phone-screen")[0] as HTMLElement;
      const dot = q(".touch-dot")[0];
      const stamp = q(".thumb-stamp")[0];
      const hearts = q(".burst-heart");
      const bubbles = q(".bubble");
      const centre = () => -(ad.offsetTop - (screen.clientHeight - ad.offsetHeight) / 2);
      if (reduced()) {
        gsap.set(reel, { y: centre() });
        gsap.set(stamp, { autoAlpha: 1, scale: 1, rotate: -12 });
        gsap.set(bubbles, { autoAlpha: 1 });
        gsap.set([dot, ...hearts], { autoAlpha: 0 });
        return;
      }
      gsap.set(stamp, { autoAlpha: 0, scale: 2.4, rotate: -30 });
      gsap.set(hearts, { autoAlpha: 0 });
      gsap.set(bubbles, { autoAlpha: 0, scale: 0.6, y: 20 });
      gsap.set(dot, { autoAlpha: 0 });

      const tl = gsap.timeline({ repeat: -1, paused: true, repeatDelay: 0.2 });
      tl.set(reel, { y: 0 })
        // swipe 1
        .fromTo(dot, { y: 120, autoAlpha: 0, scale: 1 }, { y: -60, autoAlpha: 0.9, duration: 0.35, ease: "power2.in" })
        .to(dot, { autoAlpha: 0, duration: 0.1 })
        .to(reel, { y: () => 0.35 * centre(), duration: 0.6, ease: "power2.in" }, "<-0.05")
        // swipe 2
        .fromTo(dot, { y: 120, autoAlpha: 0 }, { y: -60, autoAlpha: 0.9, duration: 0.3, ease: "power2.in" })
        .to(dot, { autoAlpha: 0, duration: 0.1 })
        .to(reel, { y: () => 0.75 * centre(), duration: 0.45, ease: "none" }, "<-0.1")
        // settle
        .to(reel, { y: centre, duration: 1.4, ease: "expo.out" })
        .add(() => sfx.pop(0.6), "-=1.1")
        .to(stamp, { autoAlpha: 1, scale: 1, rotate: -12, duration: 0.5, ease: "back.out(3)" }, "-=0.9")
        .add(() => sfx.pop(1.4), "<0.1")
        .to(
          hearts,
          {
            keyframes: [
              { autoAlpha: 1, y: 0, scale: 0.4, duration: 0 },
              { y: -150, x: () => gsap.utils.random(-50, 50), scale: () => gsap.utils.random(0.8, 1.4), rotate: () => gsap.utils.random(-30, 30), duration: 1.4, ease: "power2.out" },
              { autoAlpha: 0, duration: 0.3 },
            ],
            stagger: 0.08,
          },
          "<"
        )
        .to(bubbles, { autoAlpha: 1, scale: 1, y: 0, stagger: 0.35, duration: 0.6, ease: "back.out(2.4)" }, "<0.2")
        .to({}, { duration: 1.6 })
        .to([stamp, ...bubbles], { autoAlpha: 0, duration: 0.35 })
        .to(screen, { autoAlpha: 0, duration: 0.25 }, "<")
        .set(reel, { y: 0 })
        .set(stamp, { scale: 2.4, rotate: -30 })
        .set(bubbles, { scale: 0.6, y: 20 })
        .to(screen, { autoAlpha: 1, duration: 0.25 });

      ScrollTrigger.create({ trigger: q(".phone")[0], start: "top 85%", end: "bottom top", onToggle: (s) => (s.isActive ? tl.play() : tl.pause()) });
      gsap.fromTo(".phone-wrap", { rotate: 8, y: 80 }, { rotate: -4, y: -40, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
    },
    { scope: root }
  );

  const bub = "bubble absolute z-20 whitespace-nowrap rounded-2xl border-2 border-ink px-4 py-2.5 text-[14px] font-semibold text-ink shadow-[4px_4px_0_var(--ink)]";
  return (
    <section id="meta" ref={root} className="paper-tex relative overflow-hidden bg-blue px-[var(--gutter)] pb-[12vw] pt-[12vw] text-paper [--tex-opacity:.3]">
      <div className="grid items-end gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <span data-reveal="fade" className="tag bg-paper text-blue">
            {c.tag}
          </span>
          <h2 data-reveal="lines" className="mt-6 text-[clamp(58px,8.6vw,156px)] leading-[0.86]">
            <span className="display block">{c.h1}</span>
            <span className="serif-i block text-pink">{c.h2}</span>
          </h2>
        </div>
        <p data-reveal="fade" className="text-[18px] leading-snug lg:col-span-4">
          {c.body}
        </p>
      </div>

      <div className="mt-16 grid items-center gap-16 lg:mt-24 lg:grid-cols-12">
        <div className="order-2 lg:order-1 lg:col-span-6">
          <div data-reveal="fade" className="mono mb-4 text-[11px] uppercase tracking-[0.12em] opacity-70">
            {c.label}
          </div>
          <ServiceList services={metaServices} prefix="M" line="var(--paper)" hoverBg="var(--pink)" hoverFg="var(--ink)" />
        </div>
        <div className="order-1 flex justify-center lg:order-2 lg:col-span-6">
          <div className="phone-wrap relative">
            <div className={`${bub} -left-[10%] top-[16%] bg-paper md:-left-[48%]`}>
              {c.bubbles[0][0]}
              <span className="text-tomato">{c.bubbles[0][1]}</span>
            </div>
            <div className={`${bub} -right-[10%] top-[44%] bg-pink md:-right-[46%]`}>{c.bubbles[1][0]}</div>
            <div className={`${bub} -left-[8%] bottom-[16%] bg-lime md:-left-[40%]`}>{c.bubbles[2][0]}</div>

            <div className="phone relative h-[560px] w-[272px] rounded-[46px] border-[10px] border-ink bg-ink shadow-[14px_14px_0_rgb(18_17_16/.35)] md:h-[640px] md:w-[318px]">
              <span className="absolute left-1/2 top-2 z-20 h-[22px] w-[90px] -translate-x-1/2 rounded-full bg-ink" />
              <div className="phone-screen relative h-full overflow-hidden rounded-[36px] bg-white text-ink">
                <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-white/95 px-5 pb-3 pt-9">
                  <span className="text-[17px] font-bold">HalO</span>
                  <Heart size={20} />
                </div>
                <div className="feed-reel flex flex-col gap-3 px-3 pt-[72px]">
                  {Array.from({ length: 9 }, (_, i) => (
                    <Post key={i} i={i} />
                  ))}
                  <div className="feed-ad shrink-0 overflow-hidden rounded-2xl border-2 border-ink bg-white">
                    <div className="flex items-center gap-2 p-2.5">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-tomato text-[10px] font-bold">{brand.name.slice(0, 2).toUpperCase()}</span>
                      <div className="leading-tight">
                        <div className="text-[13px] font-bold">{brand.name.toLowerCase()}.app</div>
                      </div>
                    </div>
                    <div className="relative h-[250px] overflow-hidden bg-tomato p-4">
                      <span className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-sun" />
                      <span className="absolute -bottom-10 -left-8 h-28 w-28 rounded-full bg-pink" />
                      <div className="relative">
                        <div className="mono text-[11px] uppercase">hold 2s</div>
                        <div className="display mt-2 text-[66px] leading-[0.86]">
                          SEND
                          <br />
                          SOS
                        </div>
                        <div className="mt-3 h-[3px] w-16 bg-ink" />
                      </div>
                      <Sparkle size={34} className="absolute bottom-5 right-5 text-lime" />
                    </div>
                    <div className="flex items-center justify-between bg-ink px-3 py-2.5 text-[13px] font-semibold text-paper">
                      Cancel (5s) <span>→</span>
                    </div>
                  </div>
                  {Array.from({ length: 4 }, (_, i) => (
                    <Post key={`b${i}`} i={i + 9} />
                  ))}
                </div>
                <span className="touch-dot absolute bottom-[30%] left-1/2 z-10 -ml-[28px] h-[56px] w-[56px] rounded-full border-2 border-ink/30 bg-ink/15" />
                {Array.from({ length: 8 }, (_, i) => (
                  <Heart key={i} size={30} className={`burst-heart absolute bottom-[34%] left-1/2 z-10 -ml-[15px] ${i % 2 ? "text-tomato" : "text-pink"}`} />
                ))}
              </div>
            </div>

            <div className="thumb-stamp absolute -right-[8%] top-[6%] z-20 grid h-[112px] w-[112px] place-items-center rounded-full border-[3px] border-ink bg-lime text-center text-forest shadow-[5px_5px_0_var(--ink)] md:-right-[18%] md:top-[8%] md:h-[132px] md:w-[132px]">
              <div>
                <Sparkle size={18} className="mx-auto text-tomato" />
                <div className="display mt-1 text-[22px] leading-[0.9] md:text-[26px]">
                  {c.stamp[0]}
                  <br />
                  {c.stamp[1]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
