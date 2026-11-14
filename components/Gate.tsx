"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, reduced } from "@/lib/gsap";
import { store } from "@/lib/store";
import { setSound, sfx } from "@/lib/sound";
import { getLenis } from "@/lib/scroll";
import { copy, gateStatus } from "@/lib/content";
import { Mascot } from "./Mascot";

export function Gate() {
  const root = useRef<HTMLDivElement>(null);
  const blobWrap = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);
  const [status, setStatus] = useState(0);
  const leaving = useRef(false);

  // ?nogate skips the loader entirely. So does arriving with a section hash
  // (e.g. from a case study's nav): the visitor lands straight on that section.
  useEffect(() => {
    // A refresh always starts at the hero. The browser would otherwise restore the old
    // scroll position, or follow a #section left in the URL by an in-page link.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const isReload = nav?.type === "reload";
    if (isReload && location.hash) history.replaceState(null, "", location.pathname + location.search);
    const hash = isReload ? "" : location.hash;
    const target = hash.length > 1 ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    if (!target) {
      window.scrollTo(0, 0);
      const toTop = () => {
        window.scrollTo(0, 0);
        getLenis()?.scrollTo(0, { immediate: true, force: true });
      };
      window.addEventListener("load", () => setTimeout(toTop, 60), { once: true });
    }
    // A visitor who already came through the gate this session (e.g. back from a
    // case study) goes straight to the page instead of waiting again.
    let seen = false;
    try {
      seen = sessionStorage.getItem("ms-entered") === "1";
    } catch {}
    if (target || seen || new URLSearchParams(location.search).has("nogate")) {
      document.documentElement.classList.remove("is-locked");
      store.set({ entered: true });
      setGone(true);
    }
    if (!target) return;
    const go = () => {
      ScrollTrigger.refresh();
      const l = getLenis();
      if (l) l.scrollTo(target, { immediate: true, force: true });
      else target.scrollIntoView();
    };
    const t1 = setTimeout(go, 80);
    const t2 = setTimeout(go, 700); // again once pins and late layout have settled
    const onLoad = () => setTimeout(go, 120);
    window.addEventListener("load", onLoad, { once: true });
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  useEffect(() => {
    if (gone) return;
    const id = setInterval(() => setStatus((s) => (s + 1) % gateStatus.length), 560);
    return () => clearInterval(id);
  }, [gone]);

  useGSAP(
    () => {
      if (gone) return;
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const count = q(".gate-count")[0] as HTMLElement;
      const rm = reduced();
      const counter = { v: 0 };
      const counted = new Promise<void>((res) => {
        gsap.to(counter, {
          v: 100,
          duration: rm ? 0.4 : 1.2,
          ease: "power2.inOut",
          onUpdate: () => {
            count.textContent = String(Math.round(counter.v)).padStart(3, "0");
          },
          onComplete: () => res(),
        });
      });
      Promise.all([document.fonts.ready, counted]).then(() => {
        if (leaving.current) return;
        if (rm) {
          gsap.set(".gate-status", { autoAlpha: 0 });
          gsap.set(".gate-choice > *", { autoAlpha: 1 });
          return;
        }
        gsap
          .timeline()
          .to(".gate-status", { autoAlpha: 0, y: -10, duration: 0.3 })
          .fromTo(".gate-choice > *", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06, ease: "expo.out" }, "-=0.05");
      });
    },
    { scope: root, dependencies: [gone] }
  );

  const enter = (withSound: boolean) => {
    if (leaving.current) return;
    leaving.current = true;
    try {
      sessionStorage.setItem("ms-entered", "1");
    } catch {}
    setSound(withSound);
    sfx.chime();
    sfx.whoosh(1.1);
    const el = root.current!;
    const b = blobWrap.current!.getBoundingClientRect();
    const cx = b.left + b.width / 2;
    const cy = b.top + b.height / 2;
    el.style.setProperty("--cx", `${cx}px`);
    el.style.setProperty("--cy", `${cy}px`);
    const R = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy)) + 40;
    document.documentElement.classList.remove("is-locked");
    window.scrollTo(0, 0);
    getLenis()?.scrollTo(0, { immediate: true });
    const finish = () => {
      setGone(true);
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    if (reduced()) {
      store.set({ entered: true });
      gsap.to(el, { autoAlpha: 0, duration: 0.35, ease: "none", onComplete: finish });
      return;
    }
    const q = gsap.utils.selector(el);
    const hole = { r: 0 };
    gsap
      .timeline({ onComplete: finish })
      .to(q(".gate-choice, .gate-quiet, .gate-corner, .gate-count"), { autoAlpha: 0, y: -14, duration: 0.35, stagger: 0.02, ease: "power2.in" }, 0)
      .to(blobWrap.current, { scale: 0, duration: 0.55, ease: "back.in(2.2)" }, 0)
      .add(() => store.set({ entered: true }), 0.5)
      .to(hole, { r: R, duration: 0.95, ease: "expo.inOut", onUpdate: () => el.style.setProperty("--r", `${hole.r}px`) }, 0.42);
  };

  // Escape skips the welcome screen from the very first frame.
  useEffect(() => {
    if (gone) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") enter(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gone]);

  if (gone) return null;

  const corner = "gate-corner mono absolute text-[11px] uppercase tracking-[0.14em] text-paper/60";
  return (
    <div ref={root} className="gate grid-bg fixed inset-0 z-[150] overflow-hidden bg-ink text-paper" role="dialog" aria-label="Welcome">
      <div className={`${corner} left-[var(--gutter)] top-[18px]`}>{copy.gate.corner}</div>
      <div className={`${corner} right-[var(--gutter)] top-[18px] text-right`}>
        Open to new
        <br />
        opportunities
      </div>
      <div className={`${corner} bottom-[22px] right-[var(--gutter)] hidden text-right sm:block`}>
        {copy.gate.headphones[0]}
        <br />
        {copy.gate.headphones[1]}
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center px-[var(--gutter)] text-center">
        <div ref={blobWrap} className="h-[170px] w-[170px] md:h-[210px] md:w-[210px]">
          <Mascot className="h-full w-full" />
        </div>
        <div className="relative mt-4 flex min-h-[150px] w-full flex-col items-center">
          <p className="gate-status mono absolute top-0 text-[13px] text-paper/70" aria-live="polite">
            {gateStatus[status]}
          </p>
          <div className="gate-choice flex flex-col items-center gap-5">
            <p className="invisible text-[17px] leading-snug md:text-[19px]">
              {copy.gate.lead}
              <br />
              <span className="serif-i text-[1.35em] text-lime">{copy.gate.leadEm}</span>
            </p>
            <button
              type="button"
              data-cursor="hover"
              onClick={() => enter(true)}
              className="invisible inline-flex items-center gap-3 rounded-full bg-paper px-6 py-3.5 text-[15px] font-semibold text-ink transition-transform duration-300 hover:scale-105"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tomato opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-tomato" />
              </span>
              {copy.gate.enterSound}
            </button>
          </div>
        </div>
      </div>

      <button type="button" onClick={() => enter(false)} className="gate-quiet absolute bottom-[26px] left-1/2 -translate-x-1/2 text-[13px] text-paper/70 underline underline-offset-4 hover:text-paper">
        {copy.gate.enterQuiet}
      </button>
      <div className="gate-count display absolute bottom-[10px] left-[var(--gutter)] text-[clamp(56px,10vw,150px)] leading-none text-paper">000</div>
    </div>
  );
}
