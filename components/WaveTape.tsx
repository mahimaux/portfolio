"use client";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { gsap, reduced } from "@/lib/gsap";
import { scrollState } from "@/lib/scroll";
import { tapeWords } from "@/lib/content";

type Props = {
  words: string[];
  bg: string;
  fg: string;
  thickness?: number;
  amplitude?: number;
  wavelength?: number;
  speed?: number;
  direction?: number;
  phase?: number;
  separator?: string;
  className?: string;
  style?: React.CSSProperties;
};

function wavePath(W: number, M: number, amplitude: number, wavelength: number, phase: number) {
  const L = Math.max(380, W * wavelength);
  const h = L / 2;
  let x = -0.6 * L;
  const end = W + 0.6 * L;
  let up = phase % 2 === 0;
  let d = `M${x.toFixed(1)},${M}`;
  while (x < end) {
    const yp = up ? M - amplitude : M + amplitude;
    d += ` C${(x + 0.36 * h).toFixed(1)},${yp} ${(x + 0.64 * h).toFixed(1)},${yp} ${(x + h).toFixed(1)},${M}`;
    x += h;
    up = !up;
  }
  return d;
}

export function WaveTape({
  words,
  bg,
  fg,
  thickness = 92,
  amplitude = 70,
  wavelength = 0.9,
  speed = 1.1,
  direction = 1,
  phase = 0,
  separator = "  ✺  ",
  className = "",
  style,
}: Props) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const box = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const measure = useRef<SVGTextElement>(null);
  const tp = useRef<SVGTextPathElement>(null);
  const [W, setW] = useState(1280);
  const [reps, setReps] = useState(6);
  const Lt = useRef(1000);
  const offset = useRef(0);

  const H = thickness + 2 * amplitude + 16;
  const M = H / 2;
  const fs = Math.round(0.56 * thickness);
  const unit = words.join(separator) + separator;
  const d = wavePath(W, M, amplitude, wavelength, phase);

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setW(Math.max(320, Math.round(e.contentRect.width))));
    ro.observe(box.current!);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    const lt = measure.current!.getComputedTextLength() || 1000;
    Lt.current = lt;
    const pl = pathRef.current!.getTotalLength();
    setReps(Math.ceil(pl / lt) + 1);
    offset.current = -0.5 * lt;
    tp.current!.setAttribute("startOffset", String(offset.current));
  }, [W, unit, fs]);

  // fonts can change the measured length after first paint
  useEffect(() => {
    document.fonts?.ready.then(() => {
      if (!measure.current) return;
      Lt.current = measure.current.getComputedTextLength() || Lt.current;
      setReps(Math.ceil(pathRef.current!.getTotalLength() / Lt.current) + 1);
    });
  }, []);

  useEffect(() => {
    if (reduced()) return;
    const tick = (_t: number, dt: number) => {
      const v = scrollState.velocity;
      const mult = 1 + Math.min(0.09 * Math.abs(v), 6);
      const dir = v < -0.5 ? -direction : direction;
      let o = offset.current - speed * mult * dir * (Math.min(dt, 50) / 16.67);
      const lt = Lt.current;
      while (o <= -lt) o += lt;
      while (o > 0) o -= lt;
      offset.current = o;
      tp.current?.setAttribute("startOffset", o.toFixed(2));
    };
    let on = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !on) {
          gsap.ticker.add(tick);
          on = true;
        } else if (!e.isIntersecting && on) {
          gsap.ticker.remove(tick);
          on = false;
        }
      },
      { rootMargin: "120px" }
    );
    io.observe(box.current!);
    return () => {
      io.disconnect();
      gsap.ticker.remove(tick);
    };
  }, [speed, direction]);

  const textStyle: React.CSSProperties = { fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: "0.01em" };
  return (
    <div ref={box} className={`pointer-events-none relative w-full ${className}`} style={{ height: H, ...style }} aria-hidden>
      <svg className="absolute inset-0 overflow-visible" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <path ref={pathRef} id={`wp-${id}`} d={d} fill="none" />
        </defs>
        <use href={`#wp-${id}`} stroke="#121110" strokeWidth={thickness + 5} fill="none" />
        <use href={`#wp-${id}`} style={{ stroke: bg }} strokeWidth={thickness} fill="none" />
        <text ref={measure} fontSize={fs} style={{ ...textStyle, visibility: "hidden" }} x={-9999} y={-9999}>
          {unit}
        </text>
      </svg>
      <svg className="absolute inset-0 overflow-visible" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <text fontSize={fs} dominantBaseline="central" style={{ ...textStyle, fill: fg }}>
          <textPath ref={tp} href={`#wp-${id}`}>
            {unit.repeat(reps)}
          </textPath>
        </text>
      </svg>
    </div>
  );
}

export function TapeCross() {
  return (
    <div className="relative z-30 h-0">
      <WaveTape
        words={tapeWords}
        bg="var(--tomato)"
        fg="var(--ink)"
        amplitude={46}
        thickness={72}
        direction={-1}
        speed={0.9}
        phase={1}
        className="absolute left-0 top-0 -translate-y-[62%]"
        style={{ rotate: "-3deg" }}
      />
      <WaveTape
        words={tapeWords}
        bg="var(--lime)"
        fg="var(--forest)"
        amplitude={58}
        thickness={86}
        speed={1.2}
        className="absolute left-0 top-0 -translate-y-[40%]"
        style={{ rotate: "2deg" }}
      />
    </div>
  );
}
