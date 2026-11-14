"use client";
import { useEffect, useId, useRef, useState } from "react";
import { gsap, reduced } from "@/lib/gsap";
import { sfx } from "@/lib/sound";

// Felt-doll mascot drawn in layers so the head, eyes and mouth can move on
// their own. Eyes follow the cursor with a small head turn; a poke closes the
// eyes into happy arcs and opens a wide smile, like she's been tickled.

type Props = { className?: string; interactive?: boolean };

const C = {
  hair: "#203c6e",
  hairDark: "#14284d",
  hairHi: "#3a5f9c",
  skin: "#fbdccb",
  skinEdge: "#f0bfa6",
  cheek: "#f5a0b0",
  eye: "#2a1913",
  iris: "#6b3b24",
  shirt: "#f6c630",
  shirtDark: "#e2aa16",
  pink: "#ee6f9f",
  pinkDark: "#d9568a",
  clip: "#f07fa6",
  shoe: "#f4bd2a",
  sock: "#fbf6ee",
  mouth: "#4a1a1c",
  tongue: "#f07a88",
};

export function Mascot({ className = "", interactive = true }: Props) {
  const raw = useId().replace(/:/g, "");
  const id = (s: string) => `${raw}-${s}`;
  const host = useRef<HTMLDivElement>(null);
  const fig = useRef<SVGGElement>(null);
  const squish = useRef<SVGGElement>(null);
  const head = useRef<SVGGElement>(null);
  const face = useRef<SVGGElement>(null);
  const bangs = useRef<SVGGElement>(null);
  const eyes = useRef<SVGGElement>(null);
  const pupils = useRef<SVGGElement>(null);
  const earL = useRef<SVGCircleElement>(null);
  const earR = useRef<SVGCircleElement>(null);
  const cheeks = useRef<SVGGElement>(null);
  const [tickled, setTickled] = useState(false);
  const tickleT = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = host.current!;
    const rm = reduced();
    const m = { x: 0, y: 0 };
    const s = { x: 0, y: 0 };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.38;
      m.x = gsap.utils.clamp(-1, 1, (e.clientX - cx) / (innerWidth / 2.2));
      m.y = gsap.utils.clamp(-1, 1, (e.clientY - cy) / (innerHeight / 2.2));
    };
    addEventListener("pointermove", move, { passive: true });

    let blinkT: ReturnType<typeof setTimeout>;
    const blink = () => {
      if (eyes.current) gsap.to(eyes.current, { scaleY: 0.08, duration: 0.07, yoyo: true, repeat: 1, ease: "power1.inOut", transformOrigin: "50% 60%" });
      blinkT = setTimeout(blink, 2400 + 3200 * Math.random());
    };
    blinkT = setTimeout(blink, 1600);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);

    const t0 = performance.now();
    const tick = () => {
      if (!visible) return;
      const t = (performance.now() - t0) / 1000;
      const k = rm ? 1 : 0.08;
      s.x += (m.x - s.x) * k;
      s.y += (m.y - s.y) * k;
      const bob = rm ? 0 : Math.sin(t * 1.3) * 4;
      fig.current?.setAttribute("transform", `translate(0 ${bob.toFixed(2)})`);
      head.current?.setAttribute("transform", `translate(${(s.x * 5).toFixed(2)} ${(s.y * 3).toFixed(2)}) rotate(${(s.x * 6 + (rm ? 0 : Math.sin(t * 0.9) * 1.2)).toFixed(2)} 200 228)`);
      face.current?.setAttribute("transform", `translate(${(s.x * 9).toFixed(2)} ${(s.y * 6).toFixed(2)})`);
      bangs.current?.setAttribute("transform", `translate(${(s.x * 5).toFixed(2)} ${(s.y * 2.5).toFixed(2)})`);
      pupils.current?.setAttribute("transform", `translate(${(s.x * 5).toFixed(2)} ${(s.y * 5).toFixed(2)})`);
      earL.current?.setAttribute("transform", `translate(${(-s.x * 3 + Math.max(0, s.x) * -3).toFixed(2)} 0)`);
      earR.current?.setAttribute("transform", `translate(${(-s.x * 3 + Math.min(0, s.x) * -3).toFixed(2)} 0)`);
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      clearTimeout(blinkT);
      io.disconnect();
      removeEventListener("pointermove", move);
    };
  }, []);

  const poke = () => {
    if (!interactive) return;
    sfx.pop(0.9 + 0.5 * Math.random());
    setTickled(true);
    if (tickleT.current) clearTimeout(tickleT.current);
    tickleT.current = setTimeout(() => setTickled(false), 1300);
    if (reduced()) return;
    const sq = squish.current!;
    gsap.killTweensOf(sq);
    gsap.fromTo(sq, { scaleX: 1.08, scaleY: 0.9 }, { scaleX: 1, scaleY: 1, duration: 1, ease: "elastic.out(1.1, 0.32)", transformOrigin: "50% 96%" });
    gsap.fromTo(sq, { rotation: 0 }, { keyframes: [{ rotation: -4 }, { rotation: 4 }, { rotation: -3 }, { rotation: 2 }, { rotation: 0 }], duration: 0.7, ease: "sine.inOut", transformOrigin: "50% 96%" });
    if (cheeks.current) gsap.fromTo(cheeks.current, { scale: 1.25 }, { scale: 1, duration: 1.2, ease: "power2.out", transformOrigin: "50% 50%" });
  };

  useEffect(() => () => {
    if (tickleT.current) clearTimeout(tickleT.current);
  }, []);

  return (
    <div
      ref={host}
      className={className}
      data-cursor={interactive ? "poke" : undefined}
      onPointerDown={poke}
      role={interactive ? "button" : undefined}
      aria-label={interactive ? "Poke the mascot" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), poke())}
      style={{ touchAction: "manipulation" }}
    >
      <svg viewBox="0 0 400 400" className="h-full w-full overflow-visible" aria-hidden>
        <defs>
          <radialGradient id={id("skin")} cx="45%" cy="38%" r="70%">
            <stop offset="0" stopColor="#fff0e6" />
            <stop offset="0.6" stopColor={C.skin} />
            <stop offset="1" stopColor={C.skinEdge} />
          </radialGradient>
          <radialGradient id={id("hair")} cx="38%" cy="25%" r="85%">
            <stop offset="0" stopColor="#2f5390" />
            <stop offset="0.55" stopColor={C.hair} />
            <stop offset="1" stopColor={C.hairDark} />
          </radialGradient>
          <linearGradient id={id("shirt")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fbd654" />
            <stop offset="1" stopColor={C.shirtDark} />
          </linearGradient>
          <linearGradient id={id("pink")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.pink} />
            <stop offset="1" stopColor={C.pinkDark} />
          </linearGradient>
          <radialGradient id={id("eye")} cx="50%" cy="70%" r="65%">
            <stop offset="0" stopColor={C.iris} />
            <stop offset="0.75" stopColor={C.eye} />
          </radialGradient>
          <clipPath id={id("mouthClip")}>
            <path d="M176 194 Q200 190 224 194 Q222 228 200 230 Q178 228 176 194 Z" />
          </clipPath>
          <filter id={id("felt")} x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G" result="d" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.45 0.22" result="specks" />
            <feComposite in="specks" in2="d" operator="in" result="sm" />
            <feMerge>
              <feMergeNode in="d" />
              <feMergeNode in="sm" />
            </feMerge>
          </filter>
        </defs>

        <ellipse cx="200" cy="386" rx="66" ry="7" fill="#000" opacity="0.22" />
        <g ref={fig}>
          <g ref={squish} filter={`url(#${id("felt")})`}>
            {/* back hair */}
            <g>
              <path
                fill={`url(#${id("hair")})`}
                d="M86 150 C80 40 320 40 314 150 C318 200 324 250 326 296 C314 310 300 304 292 294 C282 308 266 306 258 294 L250 236 L150 236 L142 294 C134 306 118 308 108 294 C100 304 86 310 74 296 C76 250 82 200 86 150 Z"
              />
              <path d="M110 250 L112 296 M290 250 L288 296" stroke={C.hairDark} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
            </g>

            {/* legs, socks, shoes */}
            <rect x="166" y="326" width="22" height="30" rx="8" fill={C.skin} />
            <rect x="212" y="326" width="22" height="30" rx="8" fill={C.skin} />
            <rect x="164" y="344" width="26" height="16" rx="5" fill={C.sock} />
            <rect x="210" y="344" width="26" height="16" rx="5" fill={C.sock} />
            <rect x="164" y="349" width="26" height="3" fill={C.pink} opacity="0.8" />
            <rect x="210" y="349" width="26" height="3" fill={C.pink} opacity="0.8" />
            <ellipse cx="174" cy="368" rx="22" ry="11" fill={C.shoe} />
            <ellipse cx="226" cy="368" rx="22" ry="11" fill={C.shoe} />
            <path d="M154 372 Q174 378 194 372 M206 372 Q226 378 246 372" stroke="#c99212" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* shorts */}
            <path d="M152 286 L248 286 L254 330 Q230 336 206 332 L200 316 L194 332 Q170 336 146 330 Z" fill={`url(#${id("pink")})`} />

            {/* arms */}
            <rect x="124" y="252" width="20" height="58" rx="10" fill={C.skin} transform="rotate(8 134 256)" />
            <rect x="256" y="252" width="20" height="58" rx="10" fill={C.skin} transform="rotate(-8 266 256)" />

            {/* shirt */}
            <path
              d="M156 236 Q200 226 244 236 L276 254 Q284 266 272 276 L252 268 L254 296 Q200 306 146 296 L148 268 L128 276 Q116 266 124 254 Z"
              fill={`url(#${id("shirt")})`}
            />
            <path d="M186 234 Q200 244 214 234" stroke={C.pink} strokeWidth="6" fill="none" strokeLinecap="round" />

            {/* head */}
            <g ref={head}>
              <circle ref={earL} cx="100" cy="168" r="18" fill={C.skin} />
              <circle ref={earR} cx="300" cy="168" r="18" fill={C.skin} />
              <circle cx="100" cy="168" r="8" fill={C.skinEdge} opacity="0.6" />
              <circle cx="300" cy="168" r="8" fill={C.skinEdge} opacity="0.6" />
              <ellipse cx="200" cy="158" rx="94" ry="84" fill={`url(#${id("skin")})`} />

              <g ref={face}>
                <g ref={cheeks}>
                  <ellipse cx="140" cy="196" rx="19" ry="12" fill={C.cheek} opacity={tickled ? 0.95 : 0.7} />
                  <ellipse cx="260" cy="196" rx="19" ry="12" fill={C.cheek} opacity={tickled ? 0.95 : 0.7} />
                </g>

                {/* eyes */}
                {!tickled ? (
                  <g ref={eyes}>
                    <g ref={pupils}>
                      <ellipse cx="164" cy="168" rx="17" ry="21" fill={`url(#${id("eye")})`} />
                      <ellipse cx="236" cy="168" rx="17" ry="21" fill={`url(#${id("eye")})`} />
                      <circle cx="158" cy="160" r="6" fill="#fff" />
                      <circle cx="230" cy="160" r="6" fill="#fff" />
                      <circle cx="170" cy="176" r="2.6" fill="#fff" opacity="0.9" />
                      <circle cx="242" cy="176" r="2.6" fill="#fff" opacity="0.9" />
                    </g>
                    <path d="M146 162 Q148 146 164 145 Q178 145 183 156" stroke={C.eye} strokeWidth="3.5" fill="none" strokeLinecap="round" />
                    <path d="M217 156 Q222 145 236 145 Q252 146 254 162" stroke={C.eye} strokeWidth="3.5" fill="none" strokeLinecap="round" />
                    <path d="M148 154 Q142 151 139 146" stroke={C.eye} strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M252 154 Q258 151 261 146" stroke={C.eye} strokeWidth="3" fill="none" strokeLinecap="round" />
                  </g>
                ) : (
                  <g>
                    <path d="M148 172 Q164 154 180 172" stroke={C.eye} strokeWidth="5" fill="none" strokeLinecap="round" />
                    <path d="M220 172 Q236 154 252 172" stroke={C.eye} strokeWidth="5" fill="none" strokeLinecap="round" />
                    <path d="M149 168 Q143 164 140 158" stroke={C.eye} strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M251 168 Q257 164 260 158" stroke={C.eye} strokeWidth="3" fill="none" strokeLinecap="round" />
                  </g>
                )}

                <ellipse cx="200" cy="186" rx="2.4" ry="1.8" fill="#e3a08e" />

                {/* mouth */}
                {!tickled ? (
                  <path d="M189 199 Q200 208 211 199" stroke={C.eye} strokeWidth="3.2" fill="none" strokeLinecap="round" />
                ) : (
                  <g>
                    <path d="M176 194 Q200 190 224 194 Q222 228 200 230 Q178 228 176 194 Z" fill={C.mouth} />
                    <g clipPath={`url(#${id("mouthClip")})`}>
                      <ellipse cx="200" cy="228" rx="17" ry="10" fill={C.tongue} />
                      <path d="M176 192 L224 192 L222 200 Q200 203 178 200 Z" fill="#fff" />
                    </g>
                  </g>
                )}
              </g>

              {/* front hair: dome, blunt fringe, side locks */}
              <g ref={bangs}>
                <path
                  fill={`url(#${id("hair")})`}
                  d="M100 156 C92 48 308 48 300 156 L292 156 C292 138 290 126 284 118 Q262 124 246 120 L240 112 L234 120 Q214 124 204 120 L198 110 L192 120 Q172 124 158 120 L152 112 L146 120 Q130 122 116 118 C110 128 108 140 108 156 Z"
                />
                <path d="M100 150 C96 190 100 216 108 240 L124 236 C116 210 112 186 112 150 Z" fill={C.hair} />
                <path d="M300 150 C304 190 300 216 292 240 L276 236 C284 210 288 186 288 150 Z" fill={C.hair} />
                <ellipse cx="152" cy="90" rx="18" ry="11" fill={C.hairHi} opacity="0.4" transform="rotate(-20 152 90)" />
                <g transform="rotate(-32 270 90)">
                  <rect x="252" y="78" width="38" height="22" rx="10" fill={C.clip} />
                  <path d="M262 84 L262 94 M272 84 L272 94 M282 84 L282 94" stroke="#d6537f" strokeWidth="2.5" strokeLinecap="round" />
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
