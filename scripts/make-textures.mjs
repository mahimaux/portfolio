// Generates the two raster textures the CSS expects:
//   public/textures/crumple.png  512x512 tileable crumpled-paper relief (RGBA, light + shadow only)
//   public/textures/grain.png    192x192 tileable film grain
import { PNG } from "pngjs";
import { writeFileSync, mkdirSync } from "node:fs";

mkdirSync("public/textures", { recursive: true });

let seed = 1337;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);

// Periodic value noise so the tile wraps seamlessly.
function makeNoise(period) {
  const g = Array.from({ length: period * period }, rand);
  const at = (x, y) => g[((y % period) + period) % period * period + (((x % period) + period) % period)];
  const s = (t) => t * t * (3 - 2 * t);
  return (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y), xf = s(x - xi), yf = s(y - yi);
    const a = at(xi, yi), b = at(xi + 1, yi), c = at(xi, yi + 1), d = at(xi + 1, yi + 1);
    return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
  };
}

function crumple(size) {
  const octaves = [
    { p: 6, w: 1.0, ridge: true },
    { p: 12, w: 0.55, ridge: true },
    { p: 24, w: 0.28, ridge: false },
    { p: 48, w: 0.14, ridge: false },
  ].map((o) => ({ ...o, n: makeNoise(o.p) }));
  const h = new Float32Array(size * size);
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      let v = 0;
      for (const o of octaves) {
        let n = o.n((x / size) * o.p, (y / size) * o.p);
        if (o.ridge) n = 1 - Math.abs(n * 2 - 1); // sharp creases
        v += n * o.w;
      }
      h[y * size + x] = v;
    }
  const png = new PNG({ width: size, height: size });
  const H = (x, y) => h[((y + size) % size) * size + ((x + size) % size)];
  // light from top-left
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const dx = H(x + 1, y) - H(x - 1, y);
      const dy = H(x, y + 1) - H(x, y - 1);
      let s = -(dx * 0.7 + dy * 0.7) * 9; // shading
      s = Math.max(-1, Math.min(1, s));
      const i = (y * size + x) * 4;
      if (s >= 0) {
        png.data[i] = png.data[i + 1] = png.data[i + 2] = 255;
        png.data[i + 3] = Math.round(s * 150);
      } else {
        png.data[i] = png.data[i + 1] = png.data[i + 2] = 20;
        png.data[i + 3] = Math.round(-s * 110);
      }
    }
  return png;
}

function grain(size) {
  const png = new PNG({ width: size, height: size });
  for (let i = 0; i < size * size; i++) {
    const v = rand() > 0.5 ? 255 : 0;
    png.data[i * 4] = png.data[i * 4 + 1] = png.data[i * 4 + 2] = v;
    png.data[i * 4 + 3] = Math.round(rand() * 255);
  }
  return png;
}

writeFileSync("public/textures/crumple.png", PNG.sync.write(crumple(512)));
writeFileSync("public/textures/grain.png", PNG.sync.write(grain(192)));
console.log("textures written");
