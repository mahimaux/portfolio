import { ArrowUpRight } from "./Icons";

type Props = { services: { name: string; blurb: string }[]; prefix: string; line?: string; hoverBg?: string; hoverFg?: string; compact?: boolean };

export function ServiceList({ services, prefix, line = "var(--ink)", hoverBg = "var(--ink)", hoverFg = "var(--paper)", compact = false }: Props) {
  return (
    <ul className="svc-list" style={{ "--line": line, "--hbg": hoverBg, "--hfg": hoverFg } as React.CSSProperties}>
      {services.map((s, i) => (
        <li key={s.name} className="svc-row group relative overflow-hidden border-t-2 border-[var(--line)] last:border-b-2">
          <span className="svc-flood absolute inset-0 origin-bottom scale-y-0 bg-[var(--hbg)] transition-transform duration-500 [transition-timing-function:var(--ease-out)] group-hover:scale-y-100" />
          <div className={`relative flex items-center gap-4 py-4 transition-colors duration-300 group-hover:text-[var(--hfg)] md:gap-6 ${compact ? "md:py-4" : "md:py-5"}`}>
            <span className="mono w-12 shrink-0 text-[11px] uppercase tracking-[0.1em] opacity-60">
              {prefix}/{String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              <div className={`display ${compact ? "text-[clamp(26px,2.5vw,40px)] leading-[0.95]" : "text-[clamp(34px,3.9vw,64px)] leading-[0.9]"} transition-transform duration-500 [transition-timing-function:var(--ease-out)] group-hover:translate-x-3`}>{s.name}</div>
              <p className="mt-1.5 max-w-[38ch] text-[15px] leading-snug opacity-75">{s.blurb}</p>
            </div>
            <ArrowUpRight size={30} className="shrink-0 -translate-x-3 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
          </div>
        </li>
      ))}
    </ul>
  );
}
