"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { scrollState, setLenis } from "@/lib/scroll";
import { store } from "@/lib/store";

export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.125, wheelMultiplier: 1, autoRaf: false, anchors: { offset: 0 } });
    setLenis(lenis);
    const off = lenis.on("scroll", (e: Lenis) => {
      scrollState.velocity = e.velocity;
      scrollState.progress = e.progress;
      ScrollTrigger.update();
    });
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    const sync = () => {
      const { entered, menuOpen } = store.get();
      if (!entered || menuOpen) lenis.stop();
      else lenis.start();
    };
    sync();
    const unsub = store.subscribe(sync);
    return () => {
      unsub();
      off();
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);
  return null;
}
