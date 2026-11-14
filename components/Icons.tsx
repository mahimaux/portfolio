type P = { className?: string; size?: number };

export const ArrowDown = ({ className, size = 18 }: P) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 4v15m0 0-6.5-6.5M12 19l6.5-6.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square" />
  </svg>
);
export const ArrowRight = ({ className, size = 18 }: P) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M4 12h15m0 0-6.5-6.5M19 12l-6.5 6.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square" />
  </svg>
);
export const ArrowUpRight = ({ className, size = 18 }: P) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M6 18 18 6m0 0H8m10 0v10" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square" />
  </svg>
);
export const Plus = ({ className, size = 18 }: P) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square" />
  </svg>
);
export const Search = ({ className, size = 18 }: P) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="2.4" />
    <path d="m15.5 15.5 5 5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
  </svg>
);
// Own heart shape: two arcs + point.
export const Heart = ({ className, size = 18 }: P) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <path fill="currentColor" d="M12 20.5 4.2 13A5 5 0 0 1 12 6.6 5 5 0 0 1 19.8 13Z" />
  </svg>
);
// 4-point sparkle
export const Sparkle = ({ className, size = 18 }: P) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <path fill="currentColor" d="M12 0Q13 10 24 12 13 14 12 24 11 14 0 12 11 10 12 0Z" />
  </svg>
);
// 16-point starburst
export const Burst = ({ className, size = 18 }: P) => {
  const pts: string[] = [];
  for (let i = 0; i < 32; i++) {
    const a = (i / 32) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 ? 9.4 : 12;
    pts.push(`${(12 + Math.cos(a) * r).toFixed(2)},${(12 + Math.sin(a) * r).toFixed(2)}`);
  }
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <polygon fill="currentColor" points={pts.join(" ")} />
    </svg>
  );
};
export const Waves = ({ className, size = 18 }: P) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M5 8.5c1.4 1.9 1.4 5.1 0 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M10 5.5c2.8 3.6 2.8 9.4 0 13" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M15 2.5c4.2 5.4 4.2 13.6 0 19" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);
// Hand-drawn arrow; both paths get .draw for stroke animations.
export const DrawnArrow = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 160 90" fill="none" aria-hidden>
    <path className="draw" d="M4 10c34-6 70 2 96 22s36 40 44 52" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    <path className="draw" d="M128 70l16 15 4-21" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const Play = ({ className, size = 18 }: P) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <path d="M7 4.5v15L19.5 12 7 4.5Z" fill="currentColor" />
  </svg>
);
