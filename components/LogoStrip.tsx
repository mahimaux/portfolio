import { copy, logos } from "@/lib/content";
import { Marquee } from "./Marquee";
import { Sparkle } from "./Icons";

// Six type treatments cycle across the names to fake logotypes.
const looks = [
  "display text-[38px] tracking-[0.01em]",
  "serif-i text-[40px] lowercase",
  "mono text-[26px] font-medium uppercase tracking-[0.22em]",
  "text-[34px] font-extrabold tracking-[-0.05em]",
  "hand text-[40px] font-semibold",
  "display text-[36px] tracking-[-0.03em] [transform:scaleX(.82)]",
];

export function LogoStrip() {
  return (
    <div className="relative z-20 -mt-[3vw] -mb-[3vw]">
      <div className="paper-tex relative flex h-[80px] -rotate-2 items-center border-y-2 border-ink bg-sun/90 [--tex-opacity:.3]" style={{ width: "104vw", marginLeft: "-2vw" }}>
        <span className="mono hidden shrink-0 border-r-2 border-ink px-[var(--gutter)] text-[11px] uppercase tracking-[0.12em] sm:block">{copy.logosLabel}</span>
        <Marquee duration={30} className="flex-1">
          {logos.map((l, i) => (
            <span key={l} className="flex items-center">
              <span className={`whitespace-nowrap px-7 leading-none text-ink ${looks[i % looks.length]}`}>{l}</span>
              <Sparkle size={18} className="text-tomato" />
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
