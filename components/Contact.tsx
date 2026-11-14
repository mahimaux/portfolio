"use client";
import { useRef, useState } from "react";
import { gsap, useGSAP, reduced } from "@/lib/gsap";
import { useReveal } from "@/lib/useReveal";
import { sfx } from "@/lib/sound";
import { brand, budgets, copy } from "@/lib/content";
import { Mascot } from "./Mascot";
import { Btn } from "./Btn";
import { Sparkle } from "./Icons";

const DESCRIBE = "What best describes you: \u201cJack/Jill of all trades, master of _______?\u201d";

const STRIPES = ["#ff4f1f", "#ff8fcf", "#ffc22e", "#c8f53c", "#2e3bff"];

function StripeArc({ className = "" }: { className?: string }) {
  return (
    <svg className={`stripe-arc pointer-events-none absolute ${className}`} viewBox="0 0 420 420" fill="none" aria-hidden>
      {STRIPES.map((col, i) => {
        const r = 380 - 52 * i;
        const d = `M0 ${420 - r} A${r} ${r} 0 0 1 ${r} 420`;
        return (
          <g key={col}>
            <path className="stripe" d={d} stroke="#121110" strokeWidth="54" />
            <path className="stripe" d={d} stroke={col} strokeWidth="48" />
          </g>
        );
      })}
    </svg>
  );
}

function Chips({ label, items, value, onChange }: { label: string; items: string[]; value: number; onChange: (i: number) => void }) {
  return (
    <fieldset className="mt-7">
      <legend className="mono text-[11px] uppercase tracking-[0.12em] opacity-70">{label}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((it, i) => (
          <button
            key={it}
            type="button"
            aria-pressed={value === i}
            onClick={() => {
              sfx.pop(1 + 0.12 * i);
              onChange(i);
            }}
            className={`rounded-full border-2 border-ink px-4 py-2 text-[14px] font-semibold transition-all duration-300 [transition-timing-function:var(--ease-back)] ${
              value === i ? "-rotate-2 bg-ink text-lime shadow-[0_3px_0_var(--tomato)]" : "hover:-translate-y-0.5 hover:shadow-[0_3px_0_var(--ink)]"
            }`}
          >
            {it}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function Contact() {
  const root = useRef<HTMLElement>(null);
  const sticker = useRef<HTMLDivElement>(null);
  useReveal(root);
  const c = copy.contact;
  const [budget, setBudget] = useState(-1);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);

  useGSAP(
    () => {
      const el = root.current!;
      if (reduced()) {
        gsap.set(el, { "--arc": 0 });
        return;
      }
      gsap.fromTo(el, { "--arc": 14 }, { "--arc": 0, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 20%", scrub: true } });
      gsap.utils.toArray<SVGSVGElement>(".stripe-arc", el).forEach((svg) =>
        gsap.fromTo(
          svg.querySelectorAll(".stripe"),
          { strokeDasharray: 700, strokeDashoffset: 700 },
          { strokeDashoffset: 0, stagger: 0.04, ease: "none", scrollTrigger: { trigger: svg, start: "top 95%", end: "bottom 50%", scrub: 0.6 } }
        )
      );
    },
    { scope: root }
  );

  useGSAP(
    () => {
      if (!sent || !sticker.current) return;
      if (reduced()) gsap.set(sticker.current, { rotate: -6 });
      else gsap.fromTo(sticker.current, { scale: 0, rotate: -40 }, { scale: 1, rotate: -6, duration: 0.9, ease: "back.out(2.6)" });
    },
    { dependencies: [sent] }
  );

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    const form = e.currentTarget;
    const f = new FormData(form);
    const name = String(f.get("name") ?? "").trim();
    const email = String(f.get("email") ?? "").trim();
    if (!name) {
      setErr("we need a name to shout back at.");
      sfx.pop(0.5);
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErr("that email looks a bit off.");
      sfx.pop(0.5);
      return;
    }
    setErr("");
    const fields = {
      Name: name,
      Email: email,
      "Company or link": String(f.get("site") ?? "").trim() || "(not given)",
      [DESCRIBE]: budget >= 0 ? `master of ${budgets[budget]}` : "(not picked)",
      "What are you building?": String(f.get("msg") ?? "").trim() || "(left blank)",
    };
    setSending(true);
    // Responses are mailed straight to Mahima through FormSubmit (no backend needed).
    // If the request can't go out (offline, or a host that blocks it), fall back to
    // the visitor's own mail app with everything pre-filled.
    let ok = false;
    try {
      const r = await fetch(`https://formsubmit.co/ajax/${brand.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...fields, _replyto: email, _subject: `Portfolio: new message from ${name}`, _template: "table", _captcha: "false" }),
      });
      const j = await r.json().catch(() => ({}));
      ok = r.ok && String(j.success) !== "false";
    } catch {
      ok = false;
    }
    setSending(false);
    if (!ok) {
      const body = Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join("\n");
      window.location.href = `mailto:${brand.email}?subject=${encodeURIComponent(`Portfolio: new message from ${name}`)}&body=${encodeURIComponent(body)}`;
    }
    sfx.chime();
    form.reset();
    setBudget(-1);
    setSent(true);
  };

  const input = "mt-1 w-full border-b-2 border-ink bg-transparent py-2 text-[19px] outline-none transition-colors focus:border-tomato";
  const lab = "mono text-[11px] uppercase tracking-[0.12em] opacity-70";
  return (
    <section id="contact" ref={root} className="arc-top relative z-10 -mt-[6vw] overflow-hidden bg-ink px-[var(--gutter)] pb-[50vw] pt-[16vw] text-paper md:pb-[8vw] md:pt-[12vw]" style={{ "--arc": 14 } as React.CSSProperties}>
      <StripeArc className="left-0 top-0 hidden w-[34vw] max-w-[460px] -scale-y-100 md:block" />
      <StripeArc className="bottom-0 right-0 w-[44vw] max-w-[520px] -scale-x-100" />

      <div className="relative text-center">
        <span data-reveal="fade" className="tag bg-lime text-forest">
          {c.tag}
        </span>
        <h2 data-reveal="lines" className="mx-auto mt-6 text-[clamp(60px,9.4vw,170px)] leading-[0.86]">
          <span className="display block">{c.h1}</span>
          <span className="serif-i block text-lime">{c.h2}</span>
        </h2>
        <p data-reveal="fade" className="mx-auto mt-8 max-w-[580px] text-[18px] leading-snug text-paper/80">
          {c.body}
        </p>
      </div>

      <div className="relative mt-16 grid items-center gap-12 lg:grid-cols-12">
        <div className="hidden flex-col items-center lg:col-span-5 lg:flex">
          <div className="relative h-[440px] w-[440px] max-w-full">
            <Mascot className="h-full w-full" />
            <span className="hand absolute right-0 top-6 rotate-[8deg] text-[28px] text-lime">{c.poke}</span>
          </div>
          <a href={`mailto:${brand.email}`} className="display mt-4 text-[clamp(30px,2.6vw,44px)] underline decoration-2 underline-offset-4">
            {brand.email}
          </a>
          <div className="mono mt-2 text-[12px] uppercase tracking-[0.1em] text-paper/60">{c.replies}</div>
        </div>

        <div data-reveal="fade" className="lg:col-span-7">
          <div className="rounded-[30px] border-[3px] border-ink bg-paper p-6 text-ink shadow-[10px_10px_0_var(--lime)] md:p-10">
            {sent ? (
              <div className="flex flex-col items-center py-10 text-center">
                <div ref={sticker} className="sent-sticker grid h-[200px] w-[200px] place-items-center rounded-full border-[3px] border-ink bg-lime text-forest shadow-[6px_6px_0_var(--ink)]">
                  <div>
                    <Sparkle size={26} className="mx-auto text-tomato" />
                    <div className="display mt-1 text-[40px] leading-[0.9]">
                      Noise
                      <br />
                      received
                    </div>
                  </div>
                </div>
                <p className="mt-8 text-[19px]">We&apos;ll be in your inbox within 24 hours.</p>
                <button type="button" onClick={() => setSent(false)} className="mt-4 text-[14px] underline underline-offset-4">
                  send another
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <div className="grid gap-6 md:grid-cols-2">
                  <label className="block">
                    <span className={lab}>Your name</span>
                    <input name="name" className={input} autoComplete="name" />
                  </label>
                  <label className="block">
                    <span className={lab}>Email</span>
                    <input name="email" type="email" className={input} autoComplete="email" />
                  </label>
                </div>
                <label className="mt-6 block">
                  <span className={lab}>Company or link</span>
                  <input name="site" className={input} placeholder="linkedin.com/in/you" />
                </label>
                <Chips label={DESCRIBE} items={budgets} value={budget} onChange={setBudget} />
                <label className="mt-7 block">
                  <span className={lab}>What are you building?</span>
                  <textarea name="msg" rows={3} className={`${input} resize-none`} />
                </label>
                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <Btn type="submit">{sending ? "Sending…" : "Send it"}</Btn>
                  {err ? <span className="text-[15px] font-semibold text-tomato">{err}</span> : <span className="hand text-[22px]">no spam. pinky promise.</span>}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
