"use client";
import { useRef, useState } from "react";
import { useReveal } from "@/lib/useReveal";
import { sfx } from "@/lib/sound";
import { copy, googleServices, cdStats, cdDecisions } from "@/lib/content";
import { ServiceList } from "./ServiceList";

function SelectionFrame({ label, children }: { label: string; children: React.ReactNode }) {
  const h = "absolute h-[11px] w-[11px] border-2 border-[var(--sel)] bg-white";
  return (
    <div className="relative" style={{ "--sel": "var(--blue)" } as React.CSSProperties}>
      <div className="pointer-events-none absolute -inset-[10px] border-[1.5px] border-[var(--sel)]">
        <span className={`${h} -left-[6px] -top-[6px]`} />
        <span className={`${h} -right-[6px] -top-[6px]`} />
        <span className={`${h} -bottom-[6px] -left-[6px]`} />
        <span className={`${h} -bottom-[6px] -right-[6px]`} />
        <span className="mono absolute -top-[26px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[var(--sel)] px-2 py-0.5 text-[10px] text-white">{label}</span>
      </div>
      {children}
    </div>
  );
}

/** (04) Content design: the gist of the IBM and Software AG years. */
export function GoogleMoment() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  const c = copy.google;
  const [tab, setTab] = useState(0);
  const d = cdDecisions[tab];

  return (
    <section id="content-design" ref={root} className="relative bg-paper px-[var(--gutter)] pb-[11vw] pt-[12vw]">
      <div className="grid items-end gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <span data-reveal="fade" className="tag bg-blue text-paper">
            {c.tag}
          </span>
          <h2 data-reveal="lines" className="mt-6 text-[clamp(50px,7.4vw,136px)] leading-[0.86]">
            <span className="display block">{c.h1}</span>
            <span className="serif-i block text-blue">{c.h2}</span>
          </h2>
        </div>
        <p data-reveal="fade" className="text-[17px] leading-snug lg:col-span-5">
          {c.body}
        </p>
      </div>

      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
        {cdStats.map((s) => (
          <li
            key={s.unit}
            data-reveal="fade"
            className="rounded-[22px] border-2 border-ink p-5 shadow-[6px_6px_0_var(--ink)] md:p-6"
            style={{ background: s.bg, color: s.fg }}
          >
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="display text-[clamp(52px,5.4vw,88px)] leading-[0.9]">{s.value}</span>
              <span className="mono text-[11px] uppercase tracking-[0.12em]">{s.unit}</span>
            </div>
            <p className="mt-3 text-[15px] leading-snug">{s.text}</p>
          </li>
        ))}
      </ul>

      <div className="mt-16 grid gap-14 lg:mt-24 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7" data-reveal="fade">
          <div className="pt-6 lg:sticky lg:top-28">
            <SelectionFrame label={c.frame}>
              <div className="relative overflow-hidden rounded-[22px] border-2 border-ink bg-white p-4 shadow-[8px_8px_0_var(--ink)] md:p-7">
                <div role="tablist" aria-label="Language decisions" className="flex flex-wrap gap-2">
                  {cdDecisions.map((x, i) => (
                    <button
                      key={x.tab}
                      role="tab"
                      aria-selected={i === tab}
                      onClick={() => {
                        setTab(i);
                        sfx.ding?.();
                      }}
                      className={`mono rounded-full border-2 border-ink px-4 py-2 text-[11px] uppercase tracking-[0.1em] transition-colors ${
                        i === tab ? "bg-blue text-paper" : "bg-transparent hover:bg-ink/5"
                      }`}
                    >
                      {x.tab}
                    </button>
                  ))}
                </div>
                <div className="mono mt-5 border-b border-ink/10 pb-2 text-[11px] uppercase tracking-[0.1em] text-ink/60">
                  {d.tab} · {d.where}
                </div>
                <div key={tab} role="tabpanel" className="cd-panel mt-5 grid gap-4">
                  <div className="rounded-xl border-2 border-ink/15 px-4 py-3">
                    <div className="mono text-[10px] uppercase tracking-[0.14em] text-tomato">Before</div>
                    <p className="mt-1.5 text-[17px] leading-snug text-ink/60 line-through decoration-tomato/60 md:text-[19px]">{d.before}</p>
                  </div>
                  <div className="rounded-xl border-2 border-ink bg-lime px-4 py-3 text-forest shadow-[4px_4px_0_var(--ink)]">
                    <div className="mono text-[10px] uppercase tracking-[0.14em]">After</div>
                    <p className="mt-1.5 text-[17px] font-medium leading-snug md:text-[19px]">{d.after}</p>
                  </div>
                  <div className="px-1">
                    <div className="mono text-[10px] uppercase tracking-[0.14em] text-ink/60">Why it mattered</div>
                    <p className="mt-1.5 text-[15px] leading-snug text-ink/80">{d.why}</p>
                  </div>
                </div>
              </div>
            </SelectionFrame>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div data-reveal="fade" className="mono mb-4 text-[11px] uppercase tracking-[0.12em] opacity-70">
            {c.label}
          </div>
          <ServiceList services={googleServices} prefix="CD" hoverBg="var(--blue)" hoverFg="var(--paper)" compact />
        </div>
      </div>
    </section>
  );
}
