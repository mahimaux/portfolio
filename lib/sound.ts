"use client";
import { store } from "./store";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let pad: { gain: GainNode; stop: () => void } | null = null;
let noiseBuf: AudioBuffer | null = null;
let lastTick = 0;

function ac() {
  if (!ctx) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    ctx = new C();
    master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

const live = () => store.get().sound && ac() && master;

function startPad() {
  const c = ac();
  if (!c || !master || pad) return;
  const g = c.createGain();
  g.gain.value = 0;
  g.gain.linearRampToValueAtTime(0.05, c.currentTime + 3);
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 520;
  lp.Q.value = 0.6;
  const lfo = c.createOscillator();
  const depth = c.createGain();
  lfo.frequency.value = 0.07;
  depth.gain.value = 260;
  lfo.connect(depth).connect(lp.frequency);
  const oscs = [110, 164.81, 277.18, 110.6].map((f, i) => {
    const o = c.createOscillator();
    o.type = i === 3 ? "triangle" : "sine";
    o.frequency.value = f;
    o.connect(lp);
    o.start();
    return o;
  });
  lp.connect(g).connect(master);
  lfo.start();
  pad = {
    gain: g,
    stop() {
      const t = c.currentTime;
      g.gain.cancelScheduledValues(t);
      g.gain.setValueAtTime(g.gain.value, t);
      g.gain.linearRampToValueAtTime(0, t + 0.6);
      setTimeout(() => {
        oscs.forEach((o) => o.stop());
        lfo.stop();
      }, 700);
    },
  };
}

export function setSound(on: boolean) {
  store.set({ sound: on });
  if (on) {
    ac();
    startPad();
  } else {
    pad?.stop();
    pad = null;
  }
}

export const sfx = {
  tick() {
    if (!live() || !ctx || !master) return;
    const t = ctx.currentTime;
    if (t - lastTick < 0.045) return;
    lastTick = t;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(2100, t);
    o.frequency.exponentialRampToValueAtTime(1300, t + 0.04);
    g.gain.setValueAtTime(1e-4, t);
    g.gain.exponentialRampToValueAtTime(0.05, t + 0.005);
    g.gain.exponentialRampToValueAtTime(1e-4, t + 0.06);
    o.connect(g).connect(master);
    o.start(t);
    o.stop(t + 0.08);
  },
  pop(k = 1) {
    if (!live() || !ctx || !master) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(620 * k, t);
    o.frequency.exponentialRampToValueAtTime(170 * k, t + 0.14);
    g.gain.setValueAtTime(1e-4, t);
    g.gain.exponentialRampToValueAtTime(0.22, t + 0.008);
    g.gain.exponentialRampToValueAtTime(1e-4, t + 0.18);
    o.connect(g).connect(master);
    o.start(t);
    o.stop(t + 0.2);
  },
  whoosh(d = 0.55) {
    if (!live() || !ctx || !master) return;
    const t = ctx.currentTime;
    if (!noiseBuf) {
      const len = 0.6 * ctx.sampleRate;
      noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
      const ch = noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) ch[i] = 2 * Math.random() - 1;
    }
    const src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 1.4;
    bp.frequency.setValueAtTime(320, t);
    bp.frequency.exponentialRampToValueAtTime(2600, t + 0.7 * d);
    const g = ctx.createGain();
    g.gain.setValueAtTime(1e-4, t);
    g.gain.exponentialRampToValueAtTime(0.18, t + 0.35 * d);
    g.gain.exponentialRampToValueAtTime(1e-4, t + d);
    src.connect(bp).connect(g).connect(master);
    src.start(t);
    src.stop(t + d + 0.05);
  },
  chime() {
    if (!live() || !ctx || !master) return;
    const t0 = ctx.currentTime;
    [880, 1318.5, 1760].forEach((f, i) => {
      const o = ctx!.createOscillator();
      const g = ctx!.createGain();
      o.type = "sine";
      o.frequency.value = f;
      const t = t0 + 0.09 * i;
      g.gain.setValueAtTime(1e-4, t);
      g.gain.exponentialRampToValueAtTime(0.11 / (i + 1), t + 0.01);
      g.gain.exponentialRampToValueAtTime(1e-4, t + 1.4);
      o.connect(g).connect(master!);
      o.start(t);
      o.stop(t + 1.5);
    });
  },
  ding() {
    if (!live() || !ctx || !master) return;
    const t0 = ctx.currentTime;
    [2637, 3520].forEach((f, i) => {
      const o = ctx!.createOscillator();
      const g = ctx!.createGain();
      o.type = "sine";
      o.frequency.value = f;
      const t = t0 + 0.06 * i;
      g.gain.setValueAtTime(1e-4, t);
      g.gain.exponentialRampToValueAtTime(0.06, t + 0.004);
      g.gain.exponentialRampToValueAtTime(1e-4, t + 0.5);
      o.connect(g).connect(master!);
      o.start(t);
      o.stop(t + 0.55);
    });
  },
};
