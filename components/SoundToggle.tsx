"use client";
import { useRef } from "react";
import { gsap, useGSAP, reduced } from "@/lib/gsap";
import { onEntered, useStore } from "@/lib/store";
import { setSound, sfx } from "@/lib/sound";

export function SoundToggle() {
  const { sound } = useStore();
  const ref = useRef<HTMLButtonElement>(null);
  useGSAP(() => {
    if (reduced()) return;
    gsap.set(ref.current, { scale: 0 });
    return onEntered(() => gsap.to(ref.current, { scale: 1, duration: 0.8, delay: 1.6, ease: "back.out(2.5)" }));
  });
  return (
    <button
      ref={ref}
      onClick={() => {
        setSound(!sound);
        if (!sound) setTimeout(() => sfx.pop(1.2), 50);
      }}
      aria-label={sound ? "Turn sound off" : "Turn sound on"}
      aria-pressed={sound}
      className="fixed bottom-[var(--gutter)] right-[var(--gutter)] z-[95] grid h-[52px] w-[52px] place-items-center rounded-full border-2 border-ink bg-paper text-ink shadow-[0_3px_0_var(--ink)] transition-transform hover:-translate-y-0.5"
    >
      <span className="relative flex h-[18px] items-end gap-[3px]" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <i
            key={i}
            className="eq-bar block w-[3px] rounded-full bg-ink"
            style={{
              height: sound ? "100%" : `${[6, 12, 9, 14][i]}px`,
              opacity: sound ? 1 : 0.35,
              animation: sound ? `eq 0.${7 + i}s ${0.12 * i}s ease-in-out infinite alternate` : "none",
            }}
          />
        ))}
        {!sound && <i className="absolute left-1/2 top-1/2 h-[2.5px] w-[26px] -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-tomato" />}
      </span>
      <style>{"@keyframes eq { 0% { transform: scaleY(.25); } 100% { transform: scaleY(1); } } .eq-bar { transform-origin: bottom; transition: height .3s; }"}</style>
    </button>
  );
}
