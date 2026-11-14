# Mahima Shastry · Portfolio

UX design portfolio: agent experience, AI explainability, accessibility and content design.

Built with Next.js 16 (static export), React 19, Tailwind CSS 4, GSAP (ScrollTrigger, SplitText, Draggable) and Lenis.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
```

- Add `?nogate` to the URL to skip the loader while developing.
- `npm run textures` regenerates `public/textures/crumple.png` and `grain.png`.

## Deploy

`npm run build` writes a fully static site to `out/`. Upload that folder to any static host (Vercel, Netlify, GitHub Pages, Cloudflare Pages). On Vercel or Netlify, set the build command to `npm run build` and the output directory to `out`.

The contact form posts to FormSubmit (`formsubmit.co`) at the address in `lib/content.ts`. The first real submission sends an activation email to that inbox. Click it once and later submissions arrive as normal.

## Where things live

| What | Where |
|---|---|
| All home-page copy (sections, cards, stats, receipt, footer) | `lib/content.ts` |
| Playground frames | `lib/playground.ts`, assets in `public/playground/` |
| Home-page sections | `components/` (order set in `app/page.tsx`) |
| Selected UX work card thumbnails | `public/work/` |
| Case-study pages (static HTML) | `public/cases/` |
| Phone and tablet responsive fixes | `public/rwd.css` |

### Case-study pages

The five UX case studies (`public/cases/{halo,reframe,steer,atlas,lineage}.dc.html`) are generated from the text files in `tools/case-pages/uxsrc/`. Their screenshots are in `public/cases/ux/<case>/`. To change a case study, edit its `.txt` file and run:

```bash
python3 tools/case-pages/uxgen.py
```

This rebuilds all five pages and recalculates the reading times (at 220 words a minute). After a rebuild, update each card's `readTime` in `lib/content.ts` to match. The script needs Pillow (`pip install pillow`).

The three content-design case studies (`public/cases/cd-*.html`) are committed as finished HTML, with their images in `public/cases/cd/`.
