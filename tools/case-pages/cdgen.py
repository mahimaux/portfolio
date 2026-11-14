"""Turn the dumped Framer case-study blocks into static pages in the portfolio's
design system. Text is copied through untouched (inline bold/italic/code kept)."""
import json, re, sys, os, shutil, html as H

HERE = os.path.dirname(os.path.abspath(__file__))
S = HERE
OUT = os.path.normpath(os.path.join(HERE, '..', '..', 'public', 'cases'))
PAGES = [
    dict(src='d1', slug='cd-accessibility-system', short='Accessibility system', color='var(--lime)',
         card='Building an accessibility and inclusive content system'),
    dict(src='d2', slug='cd-docs-restructure', short='Docs restructure', color='var(--pink)',
         card='Rebuilding information architecture for scannability'),
    dict(src='d3', slug='cd-onboarding-comic', short='Onboarding comic', color='var(--sun)',
         card='Explaining an invisible product with a 15-panel comic', nometa=True),
]

def txt(h): return re.sub(r'<[^>]+>', '', h).replace('&amp;', '&').strip()
def is_br(e): return e['t'] != 'img' and txt(e['html']) == ''
def px(e): return float(e['fs'].replace('px', ''))

def parse(name):
    d = json.load(open(f'{S}/framer/{name}.json'))
    # cut footer: the "Get in touch" eyebrow that precedes OPEN TO NEW OPPORTUNITIES
    end = next(i for i, e in enumerate(d) if e['t'] != 'img' and txt(e['html']) == 'OPEN TO NEW OPPORTUNITIES')
    d = d[:end - 1]
    h1i = next(i for i, e in enumerate(d) if e['t'] == 'h1')
    h1 = d[h1i]
    eyebrow = next((txt(e['html']) for e in d[:h1i] if e['t'] == 'p' and e['x'] == 60 and e['y'] > 400), '')
    rest = d[h1i + 1:]
    first_h2 = min(e['y'] for e in rest if e['t'] == 'h2')
    metas = [e for e in rest if e['y'] < first_h2 - 60 and e['t'] == 'p']
    labels = [e for e in metas if px(e) == 12]
    meta = []
    for l in labels:
        v = next((e for e in metas if px(e) == 16 and e['x'] == l['x']), None)
        meta.append((txt(l['html']), v['html'].strip() if v else ''))
    body = [e for e in rest if e['y'] >= first_h2 - 60 and not is_br(e)]
    # drop <li> wrappers that only repeat a nested heading
    keep = []
    for i, e in enumerate(body):
        if e['t'] == 'li' and i + 1 < len(body) and body[i + 1]['t'] == 'h6' and txt(body[i + 1]['html']) == txt(e['html']):
            continue
        keep.append(e)
    body = keep
    for e in body:
        if e['t'] != 'img' and e.get('href') and px(e) == 14: e['k'] = 'button'
        elif e['x'] == 60: e['k'] = 'eyebrow'
        elif e['t'] == 'h2': e['k'] = 'h2'
        elif e['t'] == 'img': e['k'] = 'img'
        elif e['t'] != 'img' and px(e) == 12 and 418 <= e['x'] <= 426: e['k'] = 'label'
        elif 418 <= e['x'] <= 445 and e['w'] >= 930: e['k'] = 'full'
        else: e['k'] = 'cell'
    body.sort(key=lambda e: (e['y'], e['x']))
    h2s = [e for e in body if e['k'] == 'h2']
    sections = []
    for i, h in enumerate(h2s):
        y0 = h['y'] - 5; y1 = h2s[i + 1]['y'] - 5 if i + 1 < len(h2s) else 10 ** 9
        eb = next((txt(e['html']) for e in body if e['k'] == 'eyebrow' and abs(e['y'] - h['y']) < 110), '')
        items = [e for e in body if y0 <= e['y'] < y1 and e['k'] not in ('eyebrow', 'h2')]
        # "Result" label that sits just above the next heading belongs to it
        sections.append(dict(h=h['html'].strip(), eyebrow=eb, items=items))
    for i, s in enumerate(sections[:-1]):
        if s['items'] and s['items'][-1]['k'] == 'label' and s['items'][-1]['w'] < 200:
            sections[i + 1]['pre'] = txt(s['items'].pop()['html'])
    return dict(title=h1['html'].strip(), eyebrow=eyebrow, meta=meta, sections=sections)

def cols_of(cells):
    xs = sorted(set(e['x'] for e in cells)); cl = []
    for x in xs:
        if cl and x - cl[-1][-1] <= 30: cl[-1].append(x)
        else: cl.append([x])
    return cl
def col_idx(cl, x): return next(i for i, c in enumerate(cl) if x in c)

P = 'margin:0;max-width:68ch;font-size:17px;line-height:1.6'

def render_grid(cells):
    cl = cols_of(cells)
    gray = any('153, 153' in (e.get('bg') or '') for e in cells)
    rows = {}
    for e in cells:
        k = next((y for y in rows if abs(y - e['y']) <= 6), e['y']); rows.setdefault(k, []).append(e)
    has_h6 = any(e['t'] == 'h6' for e in cells)
    if gray or (not has_h6 and len(cl) == 2):
        o = ['<div class="rv tbl">']
        for y in sorted(rows):
            r = sorted(rows[y], key=lambda e: e['x'])
            head = gray and any('153, 153' in (e.get('bg') or '') for e in r)
            if not r[0].get('_cont') and col_idx(cl, r[0]['x']) > 0 and len(r) == 1:
                # continuation paragraph in the right column
                o[-1] = o[-1].replace('</span></div>', f'<br><br>{r[0]["html"].strip()}</span></div>')
                continue
            c = ''.join(f'<span class="{"th mono lbl" if head else ("td k" if i == 0 else "td")}">{e["html"].strip()}</span>' for i, e in enumerate(r))
            o.append(f'<div class="tr{" head" if head else ""}{" defs" if not gray else ""}">{c}</div>')
        o.append('</div>')
        return '\n'.join(o)
    # cards
    cards = []
    for ci, c in enumerate(cl):
        col = sorted([e for e in cells if e['x'] in c], key=lambda e: e['y'])
        cur = None
        for e in col:
            if e['t'] == 'h6' or cur is None:
                cur = dict(y=e['y'], x=ci, h=e['html'].strip() if e['t'] == 'h6' else '', p=[]); cards.append(cur)
                if e['t'] != 'h6': cur['p'].append(e['html'].strip())
            else: cur['p'].append(e['html'].strip())
    cards.sort(key=lambda c: (round(c['y'] / 40), c['x']))
    stat = all(len(txt(c['h'])) <= 8 for c in cards)
    o = [f'<div class="cards" style="--n:{len(cl)}">']
    for c in cards:
        hh = (f'<span class="display" style="font-size:clamp(44px,5vw,72px);line-height:.86;color:var(--tomato)">{c["h"]}</span>' if stat
              else f'<span class="display" style="font-size:22px;line-height:1.02">{c["h"]}</span>') if c['h'] else ''
        ps = ''.join(f'<span style="font-size:15.5px;line-height:1.5">{p}</span>' for p in c['p'])
        o.append(f'<div class="rv hard card">{hh}{ps}</div>')
    o.append('</div>')
    return '\n'.join(o)

def render_items(items, imgmap):
    o = []; i = 0; n = len(items)
    while i < n:
        e = items[i]; k = e['k']
        if k == 'cell':
            j = i
            while j < n and items[j]['k'] == 'cell': j += 1
            o.append(render_grid(items[i:j])); i = j; continue
        if k == 'button':
            href = e['href']
            o.append(f'<div class="rv"><a class="btn pdf-btn" href="{H.escape(href)}" target="_blank" rel="noopener" style="--btn-bg:var(--lime)"><span class="btn-arrow" style="background:var(--paper);color:var(--ink);border-right:2px solid var(--ink)"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"></path><path d="M8 7h9v9"></path></svg></span><span class="btn-label" style="padding:0 22px 0 16px;color:var(--ink)">{e["html"].strip()}</span></a></div>')
            i += 1
            while i < n and items[i]['k'] == 'button' and items[i]['href'] == href: i += 1
            continue
        if k == 'img':
            cap = ''
            if i + 1 < n and items[i + 1]['k'] in ('label', 'full') and items[i + 1]['t'] == 'p' and px(items[i + 1]) == 12:
                cap = items[i + 1]['html'].strip(); i += 1
            src = imgmap[e['src']]
            o.append(f'<figure class="rv fig"><img src="{src}" alt="{H.escape(txt(cap))}" loading="lazy" width="{e["nw"]}" height="{e["nh"]}">' + (f'<figcaption class="mono lbl">{cap}</figcaption>' if cap else '') + '</figure>')
            i += 1; continue
        if e['t'] == 'li':
            j = i; lis = []
            while j < n and items[j]['t'] == 'li' and items[j]['k'] != 'cell': lis.append(items[j]['html'].strip()); j += 1
            o.append('<ul class="dots">' + ''.join(f'<li class="rv"><span class="dot"></span><span>{l}</span></li>' for l in lis) + '</ul>')
            i = j; continue
        hh = e['html'].strip(); f = px(e)
        if k == 'label': o.append(f'<div class="rv mono lbl sub">{hh}</div>')
        elif f >= 30: o.append(f'<h3 class="display rv" style="margin:14px 0 0;font-size:clamp(26px,3vw,40px);line-height:1.04">{hh}</h3>')
        elif e['t'] == 'h5': o.append(f'<h4 class="display rv" style="margin:14px 0 0;font-size:22px;line-height:1">{hh}</h4>')
        elif f <= 13:
            if o and o[-1].startswith('<p class="rv note">'): o[-1] = o[-1][:-4] + '<br><br>' + hh + '</p>'
            else: o.append(f'<p class="rv note">{hh}</p>')
        elif e['x'] > 430: o.append(f'<p class="serif-i rv" style="margin:6px 0;font-size:clamp(22px,2.4vw,30px);line-height:1.22;max-width:32ch;padding-left:22px;border-left:4px solid var(--tomato)">{hh}</p>')
        else: o.append(f'<p class="rv" style="{P}">{hh}</p>')
        i += 1
    return '\n'.join(o)

CSS = """
body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--font-sans);overflow-x:clip;text-wrap:pretty}
a{color:inherit;text-decoration:none}
::selection{background:var(--lime);color:var(--ink)}
.rv{opacity:0;transform:translateY(26px);transition:opacity .7s var(--ease-out),transform .7s var(--ease-out)}
.rv.in{opacity:1;transform:none}
.hard{border:3px solid var(--ink);box-shadow:0 6px 0 var(--ink)}
.mono{font-size:inherit}
.lbl{font-size:11px !important;text-transform:uppercase;letter-spacing:.12em}
.sub{margin-top:14px;color:var(--tomato);font-weight:700}
.body p a,.td a{border-bottom:2px solid var(--ink)}
.body p a:hover{background:var(--lime)}
.body code{font-family:var(--font-mono,ui-monospace,monospace);font-size:.9em;background:var(--paper-2);border:1.5px solid var(--ink);border-radius:6px;padding:1px 6px}
.tbl{display:flex;flex-direction:column;border:3px solid var(--ink);border-radius:14px;overflow:hidden;background:var(--paper);box-shadow:0 6px 0 var(--ink)}
.tr{display:grid;grid-template-columns:minmax(0,2fr) minmax(0,3fr);border-bottom:2px solid rgb(18 17 16 / .18)}
.tr:last-child{border-bottom:0}
.tr.head{background:var(--ink);color:var(--lime);border-bottom:0}
.tr.defs{grid-template-columns:minmax(0,1fr) minmax(0,3fr)}
.td,.th{padding:12px 16px;font-size:15.5px;line-height:1.45;min-width:0;overflow-wrap:anywhere}
.th{padding:11px 16px}
.th strong{font-weight:700}
.td.k{border-right:2px solid rgb(18 17 16 / .18);background:var(--paper-2)}
.cards{display:grid;grid-template-columns:repeat(var(--n),minmax(0,1fr));gap:18px}
.card{background:var(--paper);padding:20px 22px;display:flex;flex-direction:column;gap:9px;border-radius:14px}
.fig{margin:8px 0;display:flex;flex-direction:column;gap:12px}
.fig img{display:block;width:100%;height:auto;border:3px solid var(--ink);border-radius:14px;box-shadow:0 6px 0 var(--ink);background:#fff}
.fig figcaption{opacity:.75;line-height:1.6}
.dots{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:12px;max-width:70ch}
.dots li{display:grid;grid-template-columns:28px 1fr;gap:10px;font-size:16.5px;line-height:1.55}
.dot{display:inline-block;width:14px;height:14px;margin-top:6px;background:var(--lime);border:2px solid var(--ink);border-radius:999px}
.note{margin:4px 0 0;background:var(--pink);border:3px solid var(--ink);border-radius:14px;padding:18px 20px;font-size:15px;line-height:1.5;max-width:70ch;box-shadow:0 5px 0 var(--ink)}
h4 + .note{margin-top:0}
@media (prefers-reduced-motion:reduce){.rv{opacity:1;transform:none;transition:none}}
@media (max-width:899px){.sec-head{position:static !important;top:auto !important}h1.display{word-break:break-word}.cards{grid-template-columns:repeat(min(var(--n),2),minmax(0,1fr))}}
@media (max-width:599px){.cards{grid-template-columns:1fr}.tr,.tr.defs{grid-template-columns:1fr}.td.k{border-right:0;border-bottom:2px dashed rgb(18 17 16 / .18)}.tr.head .th:first-child{border-bottom:0}}
@media (max-width:479px){.nav-all{display:none}}
.pdf-btn{max-width:100%;height:auto;min-height:52px}.pdf-btn .btn-label{white-space:normal;line-height:1.25;padding:10px 18px 10px 14px !important}
"""

def page(pg, data, nxt, imgmap):
    meta = ''.join(f'<dt class="mono lbl" style="padding-top:16px;opacity:.78">{H.escape(k)}</dt><dd style="margin:4px 0 0;font-size:15px;line-height:1.4">{v}</dd>' for k, v in ([] if pg.get('nometa') else data['meta']) if v)
    secs = []
    for s in data['sections']:
        eb = s['eyebrow']
        pre = f'<div class="mono lbl" style="opacity:.6;margin-bottom:10px">{H.escape(s["pre"])}</div>' if s.get('pre') else ''
        secs.append(f'''<section style="padding:0 var(--gutter) clamp(48px,6vw,88px)">
  <div style="max-width:1280px;margin:0 auto;display:flex;flex-wrap:wrap;gap:24px 48px;align-items:flex-start">
    <div class="sec-head" style="flex:1 1 240px;min-width:0;position:sticky;top:96px">
      {pre}<div class="mono lbl" style="color:var(--tomato);margin-bottom:12px">{H.escape(eb)}</div>
      <h2 class="display" style="margin:0;font-size:clamp(30px,4vw,58px);line-height:1">{s["h"]}</h2>
    </div>
    <div class="body" style="flex:2.4 1 480px;min-width:0;display:flex;flex-direction:column;gap:18px;padding-top:6px">
{render_items(s["items"], imgmap)}
    </div>
  </div>
</section>''')
    metabox = f'<dl class="rv" style="flex:1 1 280px;max-width:420px;min-width:0;margin:0;background:{pg["color"]};border:3px solid var(--ink);border-radius:14px;box-shadow:0 6px 0 var(--ink);padding:8px 22px 18px">{meta}</dl>' if meta else ''
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{H.escape(pg["short"])} · Content design · Mahima Shastry</title>
<link rel="stylesheet" href="site.css">
<script src="nav-hide.js" defer></script>
<style>{CSS}</style>
</head>
<body>
<div class="grain" aria-hidden="true"></div>
<div id="bar" style="position:fixed;top:0;left:0;height:5px;background:var(--lime);border-bottom:2px solid var(--ink);z-index:120;width:0" aria-hidden="true"></div>
<header style="position:sticky;top:0;z-index:100;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;padding:14px var(--gutter);background:var(--paper);border-bottom:3px solid var(--ink)">
  <a class="mono" href="../index.html#top" style="font-size:11px;text-transform:uppercase;letter-spacing:.14em;display:inline-flex;align-items:center;gap:8px;white-space:nowrap">
    <span style="display:inline-block;width:9px;height:9px;background:var(--tomato);border:2px solid var(--ink);border-radius:999px"></span>Mahima Shastry
  </a>
  <nav style="display:flex;gap:14px;align-items:center;flex-wrap:wrap">
    <a class="mono nav-all" href="../index.html#content-design-cases" style="font-size:11px;text-transform:uppercase;letter-spacing:.14em;white-space:nowrap">All work</a>
    <a class="btn" href="../index.html#contact" style="--btn-bg:var(--lime);height:40px;box-shadow:0 3px 0 var(--ink)">
      <span class="btn-label mono" style="font-size:11px;text-transform:uppercase;letter-spacing:.12em;padding:0 16px">Say hi</span>
    </a>
  </nav>
</header>
<main class="paper-tex" style="position:relative">
  <section style="padding:clamp(48px,7vw,104px) var(--gutter) clamp(48px,6vw,88px);max-width:1280px;margin:0 auto">
    <div class="mono rv in" style="font-size:11px;text-transform:uppercase;letter-spacing:.14em;opacity:.65;margin-bottom:18px">{H.escape(data["eyebrow"])}</div>
    <div style="display:flex;flex-wrap:wrap;gap:36px 48px;align-items:flex-end">
      <h1 class="display" style="flex:3 1 520px;min-width:0;margin:0;font-size:clamp(40px,6.6vw,104px);line-height:.98">{data["title"]}</h1>
      {metabox}
    </div>
  </section>
{chr(10).join(secs)}
  <section class="arc-top" style="--arc:12;background:var(--ink);color:var(--paper);padding:clamp(110px,13vw,190px) var(--gutter) clamp(40px,5vw,64px)">
    <div style="max-width:1280px;margin:0 auto;display:flex;flex-direction:column;gap:26px">
      <span class="mono" style="font-size:11px;text-transform:uppercase;letter-spacing:.14em;color:var(--lime)">Next up</span>
      <a class="display" href="{nxt["slug"]}.html" style="display:block;margin:0;font-size:clamp(36px,6.4vw,96px);line-height:.98;max-width:18ch">{H.escape(nxt["card"])}</a>
      <div style="display:flex;flex-wrap:wrap;gap:14px;margin-top:8px">
        <a class="btn" href="{nxt["slug"]}.html" style="--btn-bg:var(--lime)">
          <span class="btn-arrow" style="background:var(--paper);color:var(--ink);border-right:2px solid var(--ink)">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </span>
          <span class="btn-label" style="padding:0 22px 0 16px;color:var(--ink)">Read it</span>
        </a>
        <a class="btn" href="../index.html#content-design-cases" style="--btn-bg:transparent;--btn-fg:var(--paper);border-color:var(--paper);box-shadow:0 4px 0 var(--paper)">
          <span class="btn-label" style="padding:0 22px">All content design work</span>
        </a>
      </div>
    </div>
  </section>
</main>
<script>
(function(){{var bar=document.getElementById('bar');
function s(){{var h=document.documentElement;var m=h.scrollHeight-innerHeight;bar.style.width=(m>0?Math.min(100,scrollY/m*100):0)+'%'}}
addEventListener('scroll',s,{{passive:true}});s();
var els=document.querySelectorAll('.rv');
if(!('IntersectionObserver' in window)){{els.forEach(function(e){{e.classList.add('in')}});return}}
var io=new IntersectionObserver(function(en){{en.forEach(function(e){{if(e.isIntersecting){{e.target.classList.add('in');io.unobserve(e.target)}}}})}},{{rootMargin:'0px 0px -6% 0px'}});
els.forEach(function(e){{io.observe(e)}});}})();
</script>
</body>
</html>
'''

def main():
    os.makedirs(f'{OUT}/cd', exist_ok=True)
    for i, pg in enumerate(PAGES):
        raw = json.load(open(f'{S}/framer/{pg["src"]}.json'))
        imgmap = {}
        for e in raw:
            if e['t'] == 'img':
                name = re.sub(r'\?.*', '', e['src']).split('/')[-1]
                if os.path.exists(f'{S}/framer/img/{name}'):
                    shutil.copy(f'{S}/framer/img/{name}', f'{OUT}/cd/{name}'); imgmap[e['src']] = f'cd/{name}'
        data = parse(pg['src'])
        open(f'{OUT}/{pg["slug"]}.html', 'w', encoding='utf-8').write(page(pg, data, PAGES[(i + 1) % len(PAGES)], imgmap))
        print(pg['slug'], data['eyebrow'], '|', txt(data['title'])[:60], '|', data['meta'], [(s['eyebrow'], txt(s['h']), len(s['items'])) for s in data['sections']])
main()
