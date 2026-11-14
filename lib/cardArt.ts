"use client";
import type { Case } from "./content";
import type { Frame } from "./playground";
import { categoryStyle } from "./playground";

// Canvas2D art for the helix cards. 1024×720, one template per case type.
export const CW = 1024;
export const CH = 720;
const INK = "#121110";
const D = (s: number) => `400 ${s}px Anton, Impact, sans-serif`;
const MONO = (s: number, w = 500) => `${w} ${s}px "Geist Mono", ui-monospace, monospace`;
const SANS = (s: number, w = 600) => `${w} ${s}px "Inter Tight", system-ui, sans-serif`;
const SERIF = (s: number) => `italic 400 ${s}px "Instrument Serif", Georgia, serif`;

type C = CanvasRenderingContext2D;

function rr(c: C, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
}
function outline(c: C) {
  c.lineWidth = 5;
  c.strokeStyle = INK;
  c.stroke();
}
function star(c: C, x: number, y: number, r: number, pts = 8, inner = 0.5) {
  c.beginPath();
  for (let i = 0; i < pts * 2; i++) {
    const a = (i / (pts * 2)) * Math.PI * 2 - Math.PI / 2;
    const rad = i % 2 ? r * inner : r;
    c.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad);
  }
  c.closePath();
}
function lines(c: C, text: string, x: number, y: number, lh: number) {
  text.split("\n").forEach((l, i) => c.fillText(l, x, y + i * lh));
}
function grain(c: C) {
  c.save();
  c.globalAlpha = 0.05;
  for (let i = 0; i < 2200; i++) {
    c.fillStyle = i % 2 ? "#000" : "#fff";
    c.fillRect(Math.random() * CW, Math.random() * CH, 2, 2);
  }
  c.restore();
}
function bigResult(c: C, k: Case, x: number, y: number, max: number) {
  let s = max;
  c.font = D(s);
  while (c.measureText(k.result).width > CW - x - 44 && s > 40) {
    s -= 6;
    c.font = D(s);
  }
  c.fillStyle = k.fg;
  c.textAlign = "left";
  c.textBaseline = "alphabetic";
  c.fillText(k.result, x, y);
  c.font = MONO(26);
  c.fillText(k.metric.toUpperCase(), x, y + 46);
}
function shopBar(c: C, x: number, y: number, w: number, label = "Shop now →") {
  rr(c, x, y, w, 52, 12);
  c.fillStyle = INK;
  c.fill();
  c.fillStyle = "#f2eee3";
  c.font = SANS(22);
  c.textBaseline = "middle";
  c.fillText(label, x + 20, y + 27);
}

function feed(c: C, k: Case) {
  c.beginPath();
  c.arc(860, 120, 210, 0, Math.PI * 2);
  c.fillStyle = k.accent;
  c.fill();
  outline(c);
  c.save();
  c.translate(90, 70);
  c.rotate(-0.05);
  rr(c, 0, 0, 400, 560, 30);
  c.fillStyle = "#fff";
  c.fill();
  outline(c);
  c.beginPath();
  c.arc(44, 42, 18, 0, Math.PI * 2);
  c.fillStyle = k.bg;
  c.fill();
  c.fillStyle = INK;
  c.font = SANS(20, 700);
  c.textBaseline = "alphabetic";
  c.fillText(k.brand.toLowerCase().replace(/\s/g, ""), 72, 40);
  c.font = SANS(15, 500);
  c.fillStyle = "#666";
  c.fillText("Sponsored", 72, 60);
  rr(c, 20, 80, 360, 360, 16);
  c.fillStyle = k.accent;
  c.fill();
  c.fillStyle = INK;
  c.font = D(92);
  c.textAlign = "center";
  const hl = k.headline.split("\n");
  hl.forEach((l, i) => c.fillText(l, 200, 260 - ((hl.length - 1) * 84) / 2 + i * 84 + 30));
  c.textAlign = "left";
  star(c, 330, 130, 34);
  c.fillStyle = k.bg;
  c.fill();
  c.lineWidth = 3;
  c.stroke();
  shopBar(c, 20, 470, 360);
  c.restore();
  bigResult(c, k, 560, 400, 190);
}

function search(c: C, k: Case) {
  rr(c, 60, 60, 904, 84, 42);
  c.fillStyle = "#fff";
  c.fill();
  outline(c);
  c.beginPath();
  c.arc(118, 98, 16, 0, Math.PI * 2);
  c.lineWidth = 6;
  c.strokeStyle = k.accent;
  c.stroke();
  c.beginPath();
  c.moveTo(130, 110);
  c.lineTo(144, 124);
  c.stroke();
  c.fillStyle = INK;
  c.font = MONO(30);
  c.textBaseline = "middle";
  c.fillText(`best ${k.sector.toLowerCase()} near me`, 168, 104);
  // highlight ring
  const ring = k.bg === "#c8f53c" ? "#2e3bff" : "#c8f53c";
  rr(c, 50, 190, 640, 350, 26);
  c.lineWidth = 10;
  c.strokeStyle = ring;
  c.stroke();
  rr(c, 60, 200, 620, 330, 20);
  c.fillStyle = "#fff";
  c.fill();
  outline(c);
  c.textBaseline = "alphabetic";
  c.fillStyle = INK;
  c.font = SANS(20, 800);
  c.fillText("Sponsored", 92, 248);
  c.font = SANS(20, 400);
  c.fillStyle = "#4d5156";
  c.fillText(`https://${k.brand.toLowerCase().replace(/[^a-z]/g, "")}.in`, 92, 280);
  c.fillStyle = "#1a0dab";
  c.font = SANS(32, 500);
  let t = `${k.brand} | ${k.headline.replace(/\n/g, " ")}`;
  if (t.length > 30) t = t.slice(0, 29) + "…";
  c.fillText(t, 92, 330);
  c.fillStyle = "#d9d6cf";
  [[92, 370, 520], [92, 404, 470], [92, 438, 380]].forEach(([x, y, w]) => {
    rr(c, x, y, w, 16, 8);
    c.fill();
  });
  // pointer
  c.save();
  c.translate(560, 310);
  c.beginPath();
  c.moveTo(0, 0);
  c.lineTo(46, 28);
  c.lineTo(24, 33);
  c.lineTo(14, 54);
  c.closePath();
  c.fillStyle = INK;
  c.fill();
  c.lineWidth = 4;
  c.strokeStyle = "#fff";
  c.stroke();
  c.restore();
  bigResult(c, k, 718, 420, 140);
}

function reel(c: C, k: Case) {
  c.save();
  c.translate(110, 60);
  c.rotate(0.04);
  rr(c, 0, 0, 330, 590, 40);
  c.fillStyle = INK;
  c.fill();
  outline(c);
  const g = c.createLinearGradient(0, 14, 0, 576);
  g.addColorStop(0, k.accent);
  g.addColorStop(1, k.bg === INK ? "#ff4f1f" : "#ffffff");
  rr(c, 14, 14, 302, 562, 30);
  c.fillStyle = g;
  c.fill();
  for (let i = 0; i < 4; i++) {
    rr(c, 30 + i * 68, 34, 60, 6, 3);
    c.fillStyle = i === 0 ? INK : "rgba(18,17,16,.3)";
    c.fill();
  }
  c.fillStyle = INK;
  c.font = D(74);
  c.textAlign = "center";
  c.textBaseline = "alphabetic";
  const hl = k.headline.split("\n");
  hl.forEach((l, i) => c.fillText(l, 165, 300 - ((hl.length - 1) * 68) / 2 + i * 68));
  rr(c, 70, 490, 190, 54, 27);
  c.fillStyle = "#fff";
  c.fill();
  c.lineWidth = 3;
  c.stroke();
  c.fillStyle = INK;
  c.font = SANS(22, 700);
  c.textBaseline = "middle";
  c.fillText("Learn more", 165, 518);
  c.textAlign = "left";
  c.restore();
  star(c, 520, 130, 60);
  c.fillStyle = k.accent;
  c.fill();
  outline(c);
  bigResult(c, k, 540, 420, 190);
}

function poster(c: C, k: Case) {
  const hl = k.headline.split("\n");
  let s = 300;
  const fit = () => {
    c.font = D(s);
    const w = Math.max(...hl.map((l) => c.measureText(l).width));
    return w <= 580 && hl.length * s * 0.86 <= 560;
  };
  while (!fit() && s > 40) s -= 6;
  c.fillStyle = k.fg;
  c.textBaseline = "alphabetic";
  hl.forEach((l, i) => c.fillText(l, 52, 60 + s * 0.8 + i * s * 0.86));
  c.save();
  c.translate(800, 300);
  c.rotate(-0.2);
  c.beginPath();
  c.arc(0, 0, 150, 0, Math.PI * 2);
  c.fillStyle = k.accent;
  c.fill();
  outline(c);
  c.fillStyle = INK;
  c.textAlign = "center";
  let rs = 110;
  c.font = D(rs);
  while (c.measureText(k.result).width > 250) c.font = D((rs -= 6));
  c.fillText(k.result, 0, 26);
  c.font = MONO(22);
  c.fillText(k.metric.toUpperCase().slice(0, 18), 0, 70);
  c.restore();
}

function carousel(c: C, k: Case) {
  const cards = [
    { bg: k.accent, name: "Rajma bowl", price: "₹180", r: -0.12, x: 70, y: 110 },
    { bg: "#ffffff", name: "Thali", price: "₹240", r: 0.02, x: 250, y: 80 },
    { bg: "#2e3bff", name: "Paratha box", price: "₹160", r: 0.14, x: 430, y: 120 },
  ];
  cards.forEach((d) => {
    c.save();
    c.translate(d.x + 120, d.y + 160);
    c.rotate(d.r);
    rr(c, -120, -160, 240, 320, 22);
    c.fillStyle = d.bg;
    c.fill();
    outline(c);
    rr(c, -96, -136, 192, 170, 14);
    c.fillStyle = "rgba(255,255,255,.55)";
    c.fill();
    c.fillStyle = d.bg === "#2e3bff" ? "#f2eee3" : INK;
    c.font = SANS(24, 700);
    c.textBaseline = "alphabetic";
    c.fillText(d.name, -96, 76);
    c.font = MONO(22);
    c.fillText(d.price, -96, 112);
    c.restore();
  });
  c.fillStyle = k.fg;
  c.font = SERIF(58);
  lines(c, k.headline, 60, 560, 56);
  bigResult(c, k, 670, 400, 170);
}

function shopping(c: C, k: Case) {
  c.fillStyle = k.fg;
  c.font = MONO(22);
  c.textBaseline = "alphabetic";
  c.fillText("SPONSORED · SHOPPING", 60, 80);
  const items = [
    { col: "#ff8fcf", n: "Cloud duvet", p: "₹4,299" },
    { col: "#c8f53c", n: "Linen set", p: "₹2,890" },
    { col: "#ffc22e", n: "Waffle throw", p: "₹1,650" },
    { col: "#2e3bff", n: "Pillow pair", p: "₹1,199" },
  ];
  items.forEach((it, i) => {
    const x = 60 + (i % 2) * 230;
    const y = 110 + Math.floor(i / 2) * 230;
    rr(c, x, y, 210, 210, 16);
    c.fillStyle = "#fff";
    c.fill();
    outline(c);
    rr(c, x + 14, y + 14, 182, 120, 10);
    c.fillStyle = it.col;
    c.fill();
    c.fillStyle = INK;
    c.font = SANS(20, 600);
    c.fillText(it.n, x + 16, y + 166);
    c.font = MONO(20, 700);
    c.fillText(it.p, x + 16, y + 194);
  });
  c.fillStyle = k.fg;
  c.font = SERIF(70);
  c.fillText(k.headline, 60, 620);
  bigResult(c, k, 560, 440, 190);
}

function video(c: C, k: Case) {
  const x = 60;
  const y = 90;
  rr(c, x, y, 540, 338, 20);
  c.fillStyle = k.bg === INK ? "#2e3bff" : INK;
  c.fill();
  outline(c);
  c.fillStyle = "#f2eee3";
  c.font = D(64);
  c.textBaseline = "alphabetic";
  lines(c, k.headline, x + 34, y + 90, 60);
  c.beginPath();
  c.arc(x + 450, y + 240, 44, 0, Math.PI * 2);
  c.fillStyle = k.accent;
  c.fill();
  c.lineWidth = 4;
  c.strokeStyle = INK;
  c.stroke();
  c.beginPath();
  c.moveTo(x + 436, y + 220);
  c.lineTo(x + 470, y + 240);
  c.lineTo(x + 436, y + 260);
  c.closePath();
  c.fillStyle = INK;
  c.fill();
  rr(c, x, y + 360, 540, 12, 6);
  c.fillStyle = "rgba(127,127,127,.35)";
  c.fill();
  rr(c, x, y + 360, 340, 12, 6);
  c.fillStyle = k.accent;
  c.fill();
  c.fillStyle = k.fg;
  c.font = MONO(22);
  c.fillText(`Ad · 0:15 · ${k.brand}`, x, y + 410);
  bigResult(c, k, 640, 400, 160);
}

const T = { feed, search, reel, poster, carousel, shopping, video };

export function drawCard(k: Case): HTMLCanvasElement {
  const cv = document.createElement("canvas");
  cv.width = CW;
  cv.height = CH;
  const c = cv.getContext("2d")!;
  c.fillStyle = k.bg;
  c.fillRect(0, 0, CW, CH);
  grain(c);
  c.save();
  T[k.template](c, k);
  c.restore();
  c.fillStyle = k.fg;
  c.textAlign = "left";
  c.textBaseline = "alphabetic";
  c.font = D(58);
  c.fillText(k.brand.toUpperCase(), 48, 670);
  c.textAlign = "right";
  c.font = MONO(22);
  c.fillText(`${k.sector} · ${k.platform}`.toUpperCase(), 976, 662);
  c.textAlign = "left";
  return cv;
}

export async function cardFontsReady() {
  try {
    await Promise.all([
      document.fonts.load(D(58)),
      document.fonts.load(MONO(22)),
      document.fonts.load(SANS(22)),
      document.fonts.load(SERIF(58)),
    ]);
  } catch {}
  await document.fonts.ready;
}

// ── Playground frames: portrait 4:5, photo on top, caption + category below ──
export const FW = 800;
export const FH = 1000;

function loadImg(src: string) {
  return new Promise<HTMLImageElement | null>((res) => {
    const im = new Image();
    im.decoding = "async";
    im.onload = () => res(im);
    im.onerror = () => res(null);
    im.src = src;
  });
}

export async function drawFrame(f: Frame, i: number, n: number): Promise<HTMLCanvasElement> {
  const im = await loadImg(f.thumb);
  const cv = document.createElement("canvas");
  cv.width = FW;
  cv.height = FH;
  const c = cv.getContext("2d")!;
  const { bg, fg } = categoryStyle[f.category];
  c.fillStyle = bg;
  c.fillRect(0, 0, FW, FH);

  // photo window
  const x = 36, y = 36, w = FW - 72, h = 744;
  c.save();
  rr(c, x, y, w, h, 26);
  c.fillStyle = INK;
  c.fill();
  c.clip();
  if (im) {
    const s = Math.max(w / im.width, h / im.height);
    const dw = im.width * s, dh = im.height * s;
    c.drawImage(im, x + (w - dw) / 2, y + (h - dh) * 0.45, dw, dh);
  }
  c.restore();
  rr(c, x, y, w, h, 26);
  outline(c);

  if (f.kind === "video") {
    const cx = x + w - 74, cy = y + 74;
    c.beginPath();
    c.arc(cx, cy, 46, 0, Math.PI * 2);
    c.fillStyle = "#ff4f1f";
    c.fill();
    outline(c);
    c.beginPath();
    c.moveTo(cx - 13, cy - 21);
    c.lineTo(cx + 22, cy);
    c.lineTo(cx - 13, cy + 21);
    c.closePath();
    c.fillStyle = "#f2eee3";
    c.fill();
  }

  // caption (two words, auto-fit)
  let s = 104;
  c.font = D(s);
  while (c.measureText(f.caption.toUpperCase()).width > FW - 160 && s > 50) {
    s -= 4;
    c.font = D(s);
  }
  c.fillStyle = fg;
  c.textAlign = "left";
  c.textBaseline = "alphabetic";
  c.fillText(f.caption.toUpperCase(), 44, 890);

  // category pill + counter
  const label = (f.kind === "video" ? `${f.category} · video` : f.category).toUpperCase();
  c.font = MONO(24, 700);
  const lw = c.measureText(label).width + 40;
  rr(c, 44, 918, lw, 48, 24);
  c.fillStyle = INK;
  c.fill();
  c.fillStyle = bg;
  c.textBaseline = "middle";
  c.fillText(label, 64, 943);
  c.fillStyle = fg;
  c.textAlign = "right";
  c.font = MONO(24, 500);
  c.fillText(`${String(i + 1).padStart(2, "0")}/${String(n).padStart(2, "0")}`, FW - 44, 943);
  c.textAlign = "left";
  c.textBaseline = "alphabetic";
  star(c, FW - 66, 852, 22);
  c.fillStyle = fg;
  c.fill();
  return cv;
}
