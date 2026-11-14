"use client";
import type { RefObject } from "react";
import { gsap, SplitText, useGSAP, reduced } from "./gsap";

/** data-reveal="lines" | "fade" | "pop" inside scope. */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      if (reduced()) return;
      const q = gsap.utils.selector(scope);
      q('[data-reveal="lines"]').forEach((el: HTMLElement) => {
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "rline",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 145,
              rotate: 2.5,
              transformOrigin: "0% 100%",
              duration: 1.15,
              stagger: 0.09,
              ease: "expo.out",
              scrollTrigger: { trigger: el, start: "top 86%", once: true },
            }),
        });
      });
      q('[data-reveal="fade"]').forEach((el: HTMLElement) => {
        gsap.from(el, {
          y: 44,
          autoAlpha: 0,
          duration: 1.1,
          ease: "expo.out",
          delay: Number(el.dataset.delay ?? 0),
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });
      q('[data-reveal="pop"]').forEach((el: HTMLElement) => {
        gsap.from(el, {
          scale: 0.4,
          rotate: gsap.utils.random(-30, 30),
          autoAlpha: 0,
          duration: 1,
          ease: "back.out(2.2)",
          delay: Number(el.dataset.delay ?? 0),
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });
    },
    { scope }
  );
}
