"use client";
import { useEffect, useRef } from "react";
import { gsap, Draggable, ScrollTrigger, useGSAP, reduced } from "@/lib/gsap";
import { onEntered, store, useStore } from "@/lib/store";
import { sfx } from "@/lib/sound";
import { getLenis } from "@/lib/scroll";
import { brand, nav } from "@/lib/content";
import { Logo } from "./Logo";
import { ArrowUpRight } from "./Icons";

const setMenu = (open: boolean) => store.set({ menuOpen: open });

function Header() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>(".nav-in", root.current);
      gsap.set(items, { y: -80, autoAlpha: 0 });
      let st: ScrollTrigger | undefined;
      const off = onEntered(() => {
        gsap.to(items, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.08, delay: 0.9, ease: "expo.out" });
        const hero = document.getElementById("top");
        if (!hero) return;
        st = ScrollTrigger.create({
          trigger: hero,
          start: "bottom top+=80",
          onEnter: () => gsap.to(root.current, { y: -90, autoAlpha: 0, duration: 0.4, ease: "power2.in", overwrite: true }),
          onLeaveBack: () => gsap.to(root.current, { y: 0, autoAlpha: 1, duration: 0.5, ease: "expo.out", overwrite: true }),
        });
      });
      return () => {
        off();
        st?.kill();
      };
    },
    { scope: root }
  );
  return (
    <header ref={root} className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex items-start justify-between px-[var(--gutter)] pt-[14px]">
      <a href="#top" data-cursor="hover" className="nav-in pointer-events-auto" aria-label={`${brand.name}, back to top`}>
        <Logo />
      </a>
      <nav className="nav-in pointer-events-auto absolute left-1/2 top-[14px] hidden -translate-x-1/2 rounded-full border-2 border-ink bg-paper p-1 shadow-[0_3px_0_var(--ink)] md:flex">
        {nav.map((l) => (
          <a key={l.href} href={l.href} className="rounded-full px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-[0.06em] transition-colors duration-200 hover:bg-ink hover:text-paper">
            {l.label}
          </a>
        ))}
        <a href="./Mahima-Shastry-Resume.pdf" target="_blank" rel="noopener noreferrer" className="rounded-full px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-[0.06em] transition-colors duration-200 hover:bg-ink hover:text-paper">
          Resume
        </a>
      </nav>
      <a
        href="#contact"
        className="nav-connect nav-in pointer-events-auto mr-[58px] hidden items-center whitespace-nowrap gap-1.5 rounded-full border-2 border-ink bg-pink px-4 py-2 text-[13px] font-semibold shadow-[0_3px_0_var(--ink)] transition-transform duration-300 [transition-timing-function:var(--ease-back)] hover:-translate-y-0.5 hover:-rotate-2 sm:inline-flex md:mr-[84px]"
      >
        Let&apos;s connect <ArrowUpRight size={14} />
      </a>
    </header>
  );
}

function PullCord() {
  const wrap = useRef<HTMLDivElement>(null);
  const str = useRef<HTMLSpanElement>(null);
  const ticket = useRef<HTMLButtonElement>(null);
  useGSAP(() => {
    const rm = reduced();
    let sway: gsap.core.Tween | null = null;
    const startSway = () => {
      if (rm) return;
      sway = gsap.to(wrap.current, { rotation: 3, transformOrigin: "50% 0%", duration: 1.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
    };
    if (!rm) gsap.set(wrap.current, { y: -200 });
    const off = onEntered(() => {
      if (rm) return;
      gsap.to(wrap.current, { y: 0, duration: 1.4, delay: 1.2, ease: "elastic.out(1, 0.45)", onComplete: startSway });
    });
    let fired = false;
    const [d] = Draggable.create(ticket.current, {
      type: "y",
      bounds: { minY: 0, maxY: 150 },
      edgeResistance: 0.75,
      onPress() {
        fired = false;
        sway?.pause();
      },
      onDrag() {
        gsap.set(str.current, { scaleY: 1 + this.y / 34 });
        if (this.y > 90 && !fired) {
          fired = true;
          sfx.pop(1.3);
          setMenu(true);
        }
      },
      onRelease() {
        const spring = rm ? { duration: 0.15, ease: "power2.out" } : { duration: 1, ease: "elastic.out(1.1, 0.35)" };
        gsap.to(ticket.current, { y: 0, ...spring });
        gsap.to(str.current, { scaleY: 1, ...spring, onComplete: () => sway?.resume() });
      },
      onClick() {
        sfx.pop(1.3);
        setMenu(!store.get().menuOpen);
      },
    });
    return () => {
      off();
      d.kill();
    };
  });
  return (
    <div ref={wrap} className="fixed right-[calc(var(--gutter)+2px)] top-0 z-[120] hidden flex-col items-center md:flex" style={{ transformOrigin: "50% 0" }}>
      <span ref={str} className="block h-[34px] w-[2px] origin-top bg-ink" />
      <button
        ref={ticket}
        type="button"
        aria-label="Open menu"
        data-cursor="pull"
        className="pull-ticket relative -mt-px grid w-[62px] place-items-center border-2 border-b-0 border-ink bg-paper pb-4 pt-5 text-ink md:w-[70px]"
      >
        <span className="absolute left-1/2 top-[6px] h-[7px] w-[7px] -translate-x-1/2 rounded-full border-2 border-ink" />
        <span className="display text-[15px] leading-[0.95] md:text-[17px]">
          Pull
          <br />
          me
        </span>
      </button>
    </div>
  );
}

/** Phones: a plain hamburger replaces the pull-cord ticket. It stays on screen
    (the top nav hides after the hero) and turns into a close button. */
function Burger() {
  const { menuOpen, entered } = useStore();
  if (!entered) return null;
  const bar = "absolute left-1/2 h-[2.5px] w-[22px] -translate-x-1/2 rounded-full bg-ink transition-all duration-300 [transition-timing-function:var(--ease-out)]";
  return (
    <button
      type="button"
      aria-label={menuOpen ? "Close menu" : "Open menu"}
      aria-expanded={menuOpen}
      onClick={() => {
        sfx.pop(1.3);
        setMenu(!store.get().menuOpen);
      }}
      className="burger fixed right-[var(--gutter)] top-[14px] z-[130] h-[48px] w-[48px] rounded-full border-2 border-ink bg-paper shadow-[0_3px_0_var(--ink)] md:hidden"
    >
      <span className={`${bar} ${menuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-[15px]"}`} />
      <span className={`${bar} top-1/2 -translate-y-1/2 ${menuOpen ? "opacity-0" : ""}`} />
      <span className={`${bar} ${menuOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-[15px]"}`} />
    </button>
  );
}

function Menu() {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const { menuOpen } = useStore();

  useGSAP(
    () => {
      const el = root.current!;
      if (reduced()) {
        tl.current = gsap.timeline({ paused: true }).fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 });
        return;
      }
      gsap.set(el, { yPercent: -105 });
      tl.current = gsap
        .timeline({ paused: true })
        .set(el, { visibility: "visible" })
        .to(el, { yPercent: 0, duration: 0.9, ease: "expo.out" })
        .fromTo(".menu-link", { yPercent: 110, rotate: 4 }, { yPercent: 0, rotate: 0, duration: 0.8, stagger: 0.06, ease: "expo.out" }, 0.2)
        .fromTo(".menu-foot > *", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, stagger: 0.05 }, 0.45);
    },
    { scope: root }
  );

  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (menuOpen) {
      sfx.whoosh(0.6);
      tl.current?.timeScale(1).play();
    } else tl.current?.timeScale(1.6).reverse();
  }, [menuOpen]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && store.get().menuOpen && setMenu(false);
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, []);

  const go = (href: string) => {
    setMenu(false);
    setTimeout(() => getLenis()?.scrollTo(href, { duration: 1.6 }), 350);
  };

  const links = [{ label: "Home", href: "#top" }, ...nav, { label: "Contact", href: "#contact" }];
  return (
    <div
      ref={root}
      className="paper-tex invisible fixed inset-0 z-[110] flex flex-col justify-between bg-lime px-[var(--gutter)] pb-[var(--gutter)] pt-[110px] text-forest"
      aria-hidden={!menuOpen}
      data-lenis-prevent
    >
      <ul>
        {links.map((l, i) => (
          <li key={l.href} className="overflow-hidden border-b-2 border-forest/20">
            <button type="button" onClick={() => go(l.href)} className="menu-link group flex w-full items-center gap-5 py-1 text-left">
              <span className="mono w-8 text-[12px] opacity-60">{String(i + 1).padStart(2, "0")}</span>
              <span className="display text-[clamp(44px,min(10.5vw,11.5vh),140px)] leading-[0.95] transition-transform duration-500 [transition-timing-function:var(--ease-out)] group-hover:translate-x-6">
                {l.label}
              </span>
              <span className="serif-i ml-auto hidden translate-y-4 text-[26px] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:block">go on, then</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="menu-foot mt-8 flex flex-wrap items-end justify-between gap-5">
        <a href={`mailto:${brand.email}`} className="display text-[clamp(26px,3vw,44px)] underline decoration-2 underline-offset-4">
          {brand.email}
        </a>
        <div className="flex flex-wrap gap-2">
          {brand.socials.filter((s) => s.href && s.href !== "#").map((s) => (
            <a key={s.label} href={s.href} {...(/^https?:|\.pdf$/.test(s.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="rounded-full border-2 border-forest px-3.5 py-1.5 text-[13px] font-semibold transition-colors hover:bg-forest hover:text-lime">
              {s.label}
            </a>
          ))}
        </div>
        <button type="button" onClick={() => setMenu(false)} className="rounded-full bg-forest px-5 py-2.5 text-[13px] font-semibold text-lime">
          Close (esc)
        </button>
      </div>
    </div>
  );
}

export function Nav() {
  return (
    <>
      <Header />
      <PullCord />
      <Burger />
      <Menu />
    </>
  );
}
