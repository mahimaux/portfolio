"use client";
import type Lenis from "lenis";

export const scrollState = { velocity: 0, progress: 0 };
let lenis: Lenis | null = null;
export const getLenis = () => lenis;
export const setLenis = (l: Lenis | null) => {
  lenis = l;
};
