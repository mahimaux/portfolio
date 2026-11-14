"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, reduced } from "@/lib/gsap";
import { sfx } from "@/lib/sound";
import { getLenis } from "@/lib/scroll";
import { copy } from "@/lib/content";
import { frames, categoryStyle } from "@/lib/playground";
import { cardFontsReady, drawFrame } from "@/lib/cardArt";
import { Helix } from "@/lib/helix";
import { setCursorLabel } from "./Cursor";
import { CircleText } from "./CircleText";
import { ArrowRight, Play, Plus, Sparkle } from "./Icons";

const N = frames.length;
const pad2 = (n: number) => String(n).padStart(2, "0");

function ArcZone() {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  useGSAP(
    () => {
      const cv = canvas.current!;
      const ctx = cv.getContext("2d")!;
      const st = { s: reduced() ? 1.35 : 0.05 };
      const cols = ["#ff4f1f", "#ffc22e", "#c8f53c", "#ff8fcf", "#f2eee3"];
      const size = () => {
        const dpr = Math.min(devicePixelRatio, 1.5);
        cv.width = cv.clientWidth * dpr;
        cv.height = cv.clientHeight * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        draw();
      };
      const draw = () => {
        const w = cv.clientWidth;
        const h = cv.clientHeight;
        const unit = Math.max(w, h) / 100;
        ctx.clearRect(0, 0, w, h);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#121110";
        const circ = (r: number, c: string) => {
          ctx.beginPath();
          ctx.arc(w / 2, h, r, 0, Math.PI * 2);
          ctx.fillStyle = c;
          ctx.fill();
          ctx.stroke();
        };
        cols.forEach((c, i) => circ(((130 - 14 * i) / 2) * unit * st.s, c));
        circ(30 * unit * st.s, "#121110");
      };
      size();
      addEventListener("resize", size);
      if (reduced()) return () => removeEventListener("resize", size);
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } })
        .fromTo(st, { s: 0.05 }, { s: 4.2, duration: 1, ease: "power2.in", onUpdate: draw }, 0)
        .fromTo(".dive-text", { scale: 0.7, yPercent: 30 }, { scale: 1.6, yPercent: -10, duration: 1, ease: "power1.in" }, 0)
        .to(".dive-text", { autoAlpha: 0, ease: "none", duration: 0.15 }, 0.62);
      return () => removeEventListener("resize", size);
    },
    { scope: root }
  );
  return (
    <div ref={root} className="arc-zone relative h-[150vh] bg-blue motion-reduce:h-[100svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <canvas ref={canvas} className="arc-canvas absolute inset-0 h-full w-full" />
        <div className="dive-text absolute inset-0 grid place-items-center text-center text-paper">
          <div>
            <div className="display text-[clamp(90px,19vw,340px)]">{copy.work.dive}</div>
            <div className="serif-i mt-2 text-[clamp(22px,2.6vw,42px)]">{copy.work.diveSub}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Lightbox({ index, onClose, onStep }: { index: number | null; onClose: () => void; onStep: (d: number) => void }) {
  const back = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState<number | null>(null);
  const open = index !== null;

  useEffect(() => {
    if (index !== null) setShown(index);
  }, [index]);

  useEffect(() => {
    const b = back.current!;
    const x = box.current!;
    const k = card.current;
    const rm = reduced();
    if (open) {
      lastFocus.current = document.activeElement as HTMLElement;
      getLenis()?.stop();
      sfx.whoosh(0.6);
      gsap.set([b, x], { visibility: "visible" });
      gsap.to(b, { autoAlpha: 1, duration: rm ? 0.2 : 0.35 });
      gsap.to(x, { autoAlpha: 1, duration: 0.2 });
      if (!rm && k) gsap.fromTo(k, { scale: 0.86, rotate: -3, y: 40 }, { scale: 1, rotate: 0, y: 0, duration: 0.7, ease: "back.out(1.6)" });
      requestAnimationFrame(() => closeBtn.current?.focus({ preventScroll: true }));
    } else if (shown !== null) {
      getLenis()?.start();
      gsap.to(b, { autoAlpha: 0, duration: 0.25 });
      gsap.to(x, {
        autoAlpha: 0,
        duration: 0.25,
        onComplete: () => {
          setShown(null);
          lastFocus.current?.focus({ preventScroll: true });
        },
      });
      if (!rm && k) gsap.to(k, { scale: 0.94, y: 20, duration: 0.25, ease: "power2.in" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onStep(1);
      else if (e.key === "ArrowLeft") onStep(-1);
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [open, onClose, onStep]);

  const f = shown !== null ? frames[shown] : null;
  const st = f ? categoryStyle[f.category] : null;
  const nav = "grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-ink transition-transform duration-300 [transition-timing-function:var(--ease-back)] hover:-translate-y-0.5 hover:shadow-[0_3px_0_var(--ink)]";
  return (
    <>
      <div ref={back} onClick={onClose} className="grid-bg invisible fixed inset-0 z-[130] bg-ink/90 opacity-0" aria-hidden />
      <div
        ref={box}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        aria-label={f ? `${f.caption}, ${f.category}` : "Playground"}
        data-lenis-prevent
        onClick={(e) => e.target === e.currentTarget && onClose()}
        className="invisible fixed inset-0 z-[140] flex items-center justify-center p-3 opacity-0 md:p-8"
      >
        {f && st && (
          <figure
            ref={card}
            className="flex max-h-full w-auto max-w-[min(1180px,100%)] flex-col rounded-[30px] border-[3px] border-ink bg-paper p-3 text-ink md:p-4"
            style={{ boxShadow: `10px 10px 0 ${st.bg}` }}
          >
            <div className="relative grid min-h-0 flex-1 place-items-center overflow-hidden rounded-[20px] border-2 border-ink bg-ink">
              {f.kind === "video" ? (
                <video
                  key={f.src}
                  src={f.src}
                  poster={f.poster}
                  controls
                  autoPlay
                  playsInline
                  loop
                  className="block max-h-[calc(100svh-190px)] w-auto max-w-full object-contain md:max-h-[calc(100svh-210px)]"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={f.src} src={f.src} alt={`${f.caption}, ${f.category.toLowerCase()}`} className="block max-h-[calc(100svh-190px)] w-auto max-w-full object-contain md:max-h-[calc(100svh-210px)]" />
              )}
            </div>
            <figcaption className="flex flex-wrap items-center gap-x-4 gap-y-2 px-2 pb-1 pt-4">
              <span className="display text-[clamp(30px,3.4vw,52px)] leading-none">{f.caption}</span>
              <span className="tag" style={{ background: st.bg, color: st.fg }}>
                {f.category}
              </span>
              <span className="mono text-[12px] uppercase tracking-[0.1em] opacity-60">
                {pad2(shown! + 1)} / {pad2(N)}
              </span>
              <span className="ml-auto flex items-center gap-2">
                <button type="button" aria-label="Previous" onClick={() => onStep(-1)} className={nav}>
                  <ArrowRight size={18} className="rotate-180" />
                </button>
                <button type="button" aria-label="Next" onClick={() => onStep(1)} className={nav}>
                  <ArrowRight size={18} />
                </button>
                <button
                  ref={closeBtn}
                  type="button"
                  onClick={onClose}
                  className="rounded-full border-2 border-ink bg-ink px-4 py-2 text-[13px] font-semibold text-paper transition-colors hover:bg-tomato hover:text-ink"
                >
                  Close
                </button>
              </span>
            </figcaption>
          </figure>
        )}
      </div>
    </>
  );
}

export function WorkHelix() {
  const stage = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const countEl = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [rm, setRm] = useState(false);
  const [front, setFront] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const progress = useRef(0);

  useEffect(() => setRm(reduced()), []);

  // Frame canvases → Helix
  useEffect(() => {
    let helix: Helix | null = null;
    let alive = true;
    let io: IntersectionObserver | null = null;
    let tick: ((t: number, dt: number) => void) | null = null;
    const host = layer.current;
    const onMove = (e: PointerEvent) => {
      const r = host!.getBoundingClientRect();
      helix?.setPointer(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
    };
    const onLeave = () => {
      helix?.setPointer(9, 9);
      setCursorLabel(null);
    };
    const onClick = () => {
      const i = helix?.pick() ?? -1;
      if (i >= 0) {
        sfx.pop();
        setOpen(i % N);
      }
    };
    const onResize = () => helix?.resize();

    if (reduced() || !host) return;
    cardFontsReady()
      .then(() => Promise.all(frames.map((f, i) => drawFrame(f, i, N))))
      .then((canvases) => {
        if (!alive) return;
        helix = new Helix(host, canvases, {
          desktop: { perTurn: 8, radius: 3.1, pitch: 0.56, cardWidth: 1.9 },
          mobile: { perTurn: 7, radius: 2.5, pitch: 0.6, cardWidth: 1.7 },
        });
        helix.onFront = (i) => {
          setFront(i);
          if (countEl.current) countEl.current.textContent = pad2(i + 1);
          sfx.tick();
        };
        helix.onHover = (i) => setCursorLabel(i >= 0 ? (frames[i].kind === "video" ? "play" : "view") : null);
        tick = (_t, dt) => {
          helix!.progress = progress.current;
          helix!.render(dt);
        };
        let on = false;
        io = new IntersectionObserver(([e]) => {
          if (e.isIntersecting && !on) gsap.ticker.add(tick!);
          else if (!e.isIntersecting && on) gsap.ticker.remove(tick!);
          on = e.isIntersecting;
        });
        io.observe(host);
        host.addEventListener("pointermove", onMove);
        host.addEventListener("pointerleave", onLeave);
        host.addEventListener("click", onClick);
        addEventListener("resize", onResize);
      });
    return () => {
      alive = false;
      io?.disconnect();
      if (tick) gsap.ticker.remove(tick);
      host?.removeEventListener("pointermove", onMove);
      host?.removeEventListener("pointerleave", onLeave);
      host?.removeEventListener("click", onClick);
      removeEventListener("resize", onResize);
      helix?.dispose();
    };
  }, []);

  useGSAP(
    () => {
      if (reduced()) return;
      const el = stage.current!;
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: () => "+=" + 0.42 * N * innerHeight,
        pin: true,
        invalidateOnRefresh: true,
        onUpdate: (s) => {
          const p = s.progress;
          progress.current = p;
          if (bar.current) bar.current.style.transform = `scaleX(${p})`;
        },
      });
      gsap.from(el.querySelectorAll(".stage-in"), { y: 40, autoAlpha: 0, stagger: 0.08, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 60%", once: true } });
    },
    { scope: stage }
  );

  const step = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + N) % N)), []);
  const close = useCallback(() => setOpen(null), []);

  const c = copy.work;
  const k = frames[front];
  const ks = categoryStyle[k.category];
  return (
    <>
      <ArcZone />
      <div id="work">
        {rm ? (
          <div className="grid-bg bg-ink px-[var(--gutter)] py-[12vw] text-paper">
            <span className="tag bg-lime text-forest">{c.tag}</span>
            <h2 className="mt-5 text-[clamp(44px,6vw,100px)] leading-[0.9]">
              <span className="display block">{c.h1}</span>
              <span className="serif-i block text-lime">{c.h2}</span>
            </h2>
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4">
              {frames.map((f, i) => {
                const s = categoryStyle[f.category];
                return (
                  <button key={f.slug} type="button" onClick={() => setOpen(i)} className="rounded-[22px] border-[3px] border-ink p-2.5 text-left" style={{ background: s.bg, color: s.fg }}>
                    <span className="relative block overflow-hidden rounded-[14px] border-2 border-ink">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={f.thumb} alt="" loading="lazy" className="aspect-[4/5] w-full object-cover" />
                      {f.kind === "video" && (
                        <span className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full border-2 border-ink bg-tomato text-paper">
                          <Play size={14} />
                        </span>
                      )}
                    </span>
                    <span className="display mt-3 block text-[clamp(20px,2.2vw,30px)] uppercase leading-none">{f.caption}</span>
                    <span className="mono mt-2 inline-block rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color: s.bg }}>
                      {f.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div ref={stage} className="stage grid-bg relative h-[100svh] overflow-hidden bg-ink text-paper">
            <div ref={layer} className="absolute inset-0" />
            <div
              className="pointer-events-none absolute inset-0 z-[5]"
              style={{ background: "radial-gradient(ellipse 64% 58% at 0% 0%, rgb(18 17 16 / .97) 0%, rgb(18 17 16 / .9) 48%, transparent 100%)" }}
            />
            <div className="pointer-events-none absolute left-[var(--gutter)] top-[96px] z-10">
              <span className="stage-in tag bg-lime text-forest">{c.tag}</span>
              <h2 className="stage-in mt-5 text-[clamp(44px,6vw,100px)] leading-[0.9] [text-shadow:0_2px_28px_rgb(18_17_16/.85)]">
                <span className="display block">{c.h1}</span>
                <span className="serif-i block text-lime">{c.h2}</span>
              </h2>
              <div className="stage-in mt-5 hidden flex-wrap gap-2 md:flex">
                {(Object.keys(categoryStyle) as (keyof typeof categoryStyle)[]).map((cat) => (
                  <span key={cat} className="mono rounded-full border-2 border-ink px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em]" style={{ background: categoryStyle[cat].bg, color: categoryStyle[cat].fg }}>
                    {cat}
                  </span>
                ))}
              </div>
            </div>
            <div className="absolute bottom-[var(--gutter)] left-1/2 z-10 -translate-x-1/2">
              <button
                type="button"
                onClick={() => {
                  sfx.pop();
                  setOpen(front);
                }}
                className="stage-in flex items-center gap-3 whitespace-nowrap rounded-full bg-paper py-2 pl-2 pr-4 text-ink shadow-[0_8px_30px_rgb(0_0_0/.35)] transition-transform duration-300 hover:scale-105"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={k.thumb} alt="" className="h-[50px] w-[40px] rounded-lg border-2 border-ink object-cover" />
                <span className="text-left leading-tight">
                  <span className="block text-[15px] font-bold">{k.caption}</span>
                  <span className="mono mt-0.5 inline-block rounded-full px-2 py-[1px] text-[10px] font-bold uppercase tracking-[0.06em]" style={{ background: ks.bg, color: ks.fg }}>
                    {k.category}
                  </span>
                </span>
                <span className="ml-2 grid h-8 w-8 place-items-center rounded-full bg-ink text-paper">{k.kind === "video" ? <Play size={12} /> : <Plus size={14} />}</span>
              </button>
            </div>
            <div className="stage-in mono absolute bottom-[calc(var(--gutter)+10px)] left-[var(--gutter)] z-10 hidden text-[12px] md:block">
              <div>
                <b ref={countEl}>01</b> / {pad2(N)} · scroll to spin
              </div>
              <span className="mt-2 block h-[2px] w-[160px] bg-paper/20">
                <span ref={bar} className="block h-full w-full origin-left scale-x-0 bg-lime" />
              </span>
            </div>
            <div className="stage-in absolute bottom-[calc(var(--gutter)+72px)] right-[var(--gutter)] z-10 hidden md:block">
              <CircleText text={c.circle} size={118} bg="var(--lime)" fg="var(--forest)">
                <Sparkle size={26} className="text-tomato" />
              </CircleText>
            </div>
          </div>
        )}
      </div>
      <Lightbox index={open} onClose={close} onStep={step} />
    </>
  );
}
