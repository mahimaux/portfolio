"""Build the five UX case-study pages from the transcribed doc sources in uxsrc/*.txt.
Text is used verbatim from the docs; layout uses the portfolio design system."""
import re, json, math, html as H, os

HERE = os.path.dirname(os.path.abspath(__file__))
S = HERE
OUT = os.path.normpath(os.path.join(HERE, '..', '..', 'public', 'cases'))
ORDER = ['halo', 'reframe', 'steer', 'atlas', 'lineage']
WPM = 220

src = open(f'{S}/cdgen.py', encoding='utf-8').read()
BASE_CSS = re.search(r'CSS = """(.*?)"""', src, re.S).group(1)

EXTRA_CSS = """
.small{margin:0;max-width:70ch;font-size:13.5px;line-height:1.6;opacity:.72}
.callout{margin:4px 0 0;background:var(--pink);border:3px solid var(--ink);border-radius:14px;padding:18px 20px;max-width:72ch;box-shadow:0 5px 0 var(--ink);display:flex;flex-direction:column;gap:8px}
.callout p{margin:0;font-size:15.5px;line-height:1.55}
.callout .lbl{color:var(--ink);opacity:.8;font-weight:700}
.hmw{margin:6px 0;display:flex;flex-direction:column;gap:10px;padding-left:22px;border-left:4px solid var(--tomato)}
.hmw .q{margin:0;font-size:clamp(22px,2.4vw,30px);line-height:1.22;max-width:34ch}
.tr.n3{grid-template-columns:repeat(3,minmax(0,1fr))}
.tr.n3 .td + .td,.tr.n2 .td + .td{border-left:2px solid rgb(18 17 16 / .12)}
.tr.n3 .td.k{border-right:0}
.tr.head .th{font-size:11px;text-transform:uppercase;letter-spacing:.12em;font-family:var(--font-mono,ui-monospace,monospace)}
.td strong{font-weight:700}
.cards .card .lbl{color:var(--tomato);font-weight:700}
.card p{margin:0;font-size:15.5px;line-height:1.5}
.card h4{margin:0;font-size:22px;line-height:1.08}
.person{display:grid;grid-template-columns:120px 1fr;gap:20px;align-items:start}
.person img{width:120px;height:auto;border:3px solid var(--ink);border-radius:12px;display:block;filter:grayscale(1)}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,150px),1fr));gap:16px}
.stat{background:var(--forest);color:var(--paper);border:3px solid var(--ink);border-radius:14px;padding:16px 18px;display:flex;flex-direction:column;gap:8px;box-shadow:0 6px 0 var(--ink)}
.stat .display{font-size:clamp(38px,4.4vw,60px);line-height:.95;color:var(--lime)}
.stat span:last-child{font-size:14px;line-height:1.4;opacity:.9}
.figrow{display:grid;grid-template-columns:repeat(var(--n),minmax(0,1fr));gap:18px;align-items:start}
.figrow .fig{margin:0}
.fig figcaption{font-size:14px;line-height:1.5;opacity:.8}
.phones{display:grid;grid-template-columns:repeat(var(--n),minmax(0,1fr));gap:16px 14px;align-items:start}
.phones .fig img{border-radius:18px;background:#111}
.phones .fig figcaption{font-size:13px}
.flow{display:flex;flex-direction:column;gap:0;max-width:640px}
.flow .step{display:grid;grid-template-columns:44px 1fr;gap:14px;align-items:start}
.flow .num{width:44px;height:44px;border:3px solid var(--ink);border-radius:999px;background:var(--lime);display:grid;place-items:center;font-weight:700;font-size:15px}
.flow .step{position:relative}
.flow .num{position:relative;z-index:1}
.flow .step:not(:last-child)::before{content:"";position:absolute;left:20.5px;top:42px;bottom:-2px;width:3px;background:var(--ink)}
.flow .txt{padding:6px 0 22px;display:flex;flex-direction:column;gap:4px}
.flow .txt b{font-size:18px;line-height:1.2}
.flow .txt span{font-size:15px;line-height:1.5;opacity:.85}
.flow .step:last-child .txt{padding-bottom:0}
.dots.ol .dot{width:26px;height:26px;margin-top:0;display:grid;place-items:center;font-size:12px;font-weight:700}
.swatches{display:flex;flex-wrap:wrap;gap:12px}
.sw{display:flex;flex-direction:column;gap:6px;width:110px}
.sw i{display:block;height:56px;border:3px solid var(--ink);border-radius:10px}
.hero-fig{margin:0;border:3px solid var(--ink);border-radius:20px;overflow:hidden;box-shadow:0 8px 0 var(--ink)}
.hero-fig img{display:block;width:100%;height:auto}
.proto-btn{align-self:flex-start;margin-top:4px}
.proto-btn .btn-label{padding:0 22px 0 16px;color:var(--ink)}
.vdlg{position:fixed;inset:0;margin:auto;height:fit-content;width:min(1100px,94vw);max-height:92vh;padding:0;border:3px solid var(--ink);border-radius:18px;background:var(--ink);color:var(--paper);box-shadow:0 8px 0 var(--ink);overflow:hidden}
.vdlg::backdrop{background:rgb(18 17 16 / .78)}
.vdlg .vbar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 12px 10px 18px}
.vdlg .vbar span{font-size:11px;text-transform:uppercase;letter-spacing:.14em;color:var(--lime)}
.vdlg .vx{width:40px;height:40px;border-radius:999px;border:2px solid var(--paper);background:transparent;color:var(--paper);font-size:20px;line-height:1;cursor:pointer;display:grid;place-items:center}
.vdlg .vx:focus-visible{outline:3px solid var(--lime);outline-offset:2px}
.vdlg video{display:block;width:100%;height:auto;max-height:calc(92vh - 64px);background:#000}
.diag .sc{overflow-x:auto}
@media (max-width:599px){.diag.wide img{width:640px;max-width:none}}
.tbl.gaps{border-style:dashed;box-shadow:none;background:transparent}
.tbl.gaps .tr{border-top-style:dashed}
.tbl.gaps .td.k{background:transparent}
.readtime{display:inline-flex;align-items:center;gap:8px;border:2px solid var(--ink);border-radius:999px;padding:6px 14px;background:var(--lime);font-size:11px;text-transform:uppercase;letter-spacing:.12em;font-weight:700}
@media (max-width:899px){.figrow{grid-template-columns:repeat(min(var(--n),2),minmax(0,1fr))}.phones{grid-template-columns:repeat(min(var(--n),3),minmax(0,1fr))}}
@media (max-width:599px){.figrow{grid-template-columns:1fr}.phones{grid-template-columns:repeat(2,minmax(0,1fr))}.tr.n3{grid-template-columns:1fr}.tr.n3 .td + .td{border-left:0;border-top:2px dashed rgb(18 17 16 / .15)}.tr.n3.head .th + .th{display:none}.person{grid-template-columns:1fr}.person img{width:110px}}
"""


def inl(t):
    t = H.escape(t, quote=False)
    t = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', t)
    t = re.sub(r'(?<![\w])_(.+?)_(?![\w])', r'<em>\1</em>', t)
    return t


def plain(t):
    return re.sub(r'\*\*|(?<![\w])_|_(?![\w])', '', t)


def parse(slug):
    head, secs, cur = {'meta': [], 'intro': [], 'intro_small': []}, [], None
    for raw in open(f'{S}/uxsrc/{slug}.txt', encoding='utf-8'):
        line = raw.rstrip('\n')
        if not line.strip():
            continue
        if line.startswith('# '):
            eb, h = [x.strip() for x in line[2:].split('||')]
            cur = {'eb': eb, 'h': h, 'blocks': []}
            secs.append(cur)
            continue
        k, _, v = line.partition(':')
        v = v.strip()
        if cur is None:
            if k == 'meta':
                head['meta'].append([x.strip() for x in v.split('|', 1)])
            elif k in ('intro', 'intro_small'):
                head[k].append(v)
            else:
                head[k] = v
        else:
            cur['blocks'].append((k, v))
    return head, secs


def img(slug, n):
    return f'ux/{slug}/{n}.webp'


def dims(slug, n):
    from PIL import Image
    return Image.open(f'{OUT}/ux/{slug}/{n}.webp').size


def fig(slug, item, cls='fig'):
    n, _, cap = item.partition('|')
    n, cap = n.strip(), cap.strip()
    w, h = dims(slug, n)
    alt = H.escape(plain(cap) or 'Prototype screen', quote=True)
    c = f'<figcaption>{inl(cap)}</figcaption>' if cap else ''
    return f'<figure class="rv {cls}"><img src="{img(slug, n)}" alt="{alt}" loading="lazy" width="{w}" height="{h}">{c}</figure>'


def card_html(v):
    parts = [p.strip() for p in v.split('::')]
    title = parts[0]
    lbl = ''
    if '//' in title:
        lbl, title = [x.strip() for x in title.split('//', 1)]
    o = ''
    if lbl:
        o += f'<span class="mono lbl">{inl(lbl)}</span>'
    if title:
        o += f'<h4 class="display">{inl(title)}</h4>'
    o += ''.join(f'<p>{inl(p)}</p>' for p in parts[1:])
    return o


def render(slug, blocks):
    o, i, n = [], 0, len(blocks)
    P = 'margin:0;max-width:68ch;font-size:17px;line-height:1.6'

    def run(kind):
        nonlocal i
        j = i
        while j < n and blocks[j][0] == kind:
            j += 1
        r = [b[1] for b in blocks[i:j]]
        i = j
        return r

    while i < n:
        k, v = blocks[i]
        if k == 'p':
            o.append(f'<p class="rv" style="{P}">{inl(v)}</p>'); i += 1
        elif k == 'h':
            o.append(f'<h3 class="display rv" style="margin:14px 0 0;font-size:clamp(22px,2.4vw,30px);line-height:1.1">{inl(v)}</h3>'); i += 1
        elif k == 'label':
            o.append(f'<div class="rv mono lbl sub">{inl(v)}</div>'); i += 1
        elif k == 'small':
            o.append(f'<p class="rv small">{inl(v)}</p>'); i += 1
        elif k == 'note':
            l, _, t = v.partition('::')
            l, t = l.strip(), t.strip()
            o.append('<div class="rv callout">' + (f'<span class="mono lbl">{inl(l)}</span>' if l else '') + f'<p>{inl(t)}</p></div>'); i += 1
        elif k == 'quote':
            l, _, t = v.partition('::')
            l, t = l.strip(), t.strip()
            o.append('<div class="rv hmw">' + (f'<span class="mono lbl" style="color:var(--tomato);font-weight:700">{inl(l)}</span>' if l else '') + f'<p class="serif-i q">{inl(t)}</p></div>'); i += 1
        elif k in ('rows', 'gaps'):
            gap = k == 'gaps'
            rows = run(k)
            body = ''.join('<div class="tr defs"><span class="td k">{}</span><span class="td">{}</span></div>'.format(*[inl(x.strip()) for x in r.split('|', 1)]) for r in rows)
            o.append(f'<div class="rv tbl{" gaps" if gap else ""}">{body}</div>')
        elif k == 'table':
            hd = [x.strip() for x in v.split('|')]; i += 1
            rows = run('tr')
            nc = len(hd)
            cls = 'n3' if nc >= 3 else 'n2'
            st = f' style="grid-template-columns:repeat({nc},minmax(0,1fr))"' if nc > 3 else ''
            h = f'<div class="tr head {cls}"{st}>' + ''.join(f'<span class="th">{inl(x)}</span>' for x in hd) + '</div>'
            b = ''.join(f'<div class="tr {cls}"{st}>' + ''.join(f'<span class="td{" k" if ci == 0 else ""}">{inl(c.strip())}</span>' for ci, c in enumerate(r.split('|'))) + '</div>' for r in rows)
            o.append(f'<div class="rv tbl">{h}{b}</div>')
        elif k == 'card':
            cs = run('card')
            o.append(f'<div class="cards" style="--n:{2 if len(cs) == 4 else min(len(cs), 3)}">' + ''.join(f'<div class="rv hard card">{card_html(c)}</div>' for c in cs) + '</div>')
        elif k == 'person':
            ps = run('person')
            for p in ps:
                num, _, rest = p.partition('|')
                num = num.strip(); w, h = dims(slug, num)
                o.append(f'<div class="rv hard card person"><img src="{img(slug, num)}" alt="" loading="lazy" width="{w}" height="{h}"><div style="display:flex;flex-direction:column;gap:9px">{card_html(rest.strip())}</div></div>')
        elif k == 'stat':
            ss = run('stat')
            o.append('<div class="stats">' + ''.join('<div class="rv stat"><span class="display">{}</span><span>{}</span></div>'.format(*[inl(x.strip()) for x in s.split('|', 1)]) for s in ss) + '</div>')
        elif k in ('figs', 'figs3'):
            items = [x for x in v.split(';;')]
            i += 1
            if len(items) == 1:
                o.append(fig(slug, items[0]))
            else:
                o.append(f'<div class="figrow" style="--n:{len(items)}">' + ''.join(fig(slug, x) for x in items) + '</div>')
        elif k.startswith('phones'):
            items = v.split(';;')
            cols = int(k[6:] or 3)
            i += 1
            o.append(f'<div class="phones" style="--n:{cols}">' + ''.join(fig(slug, x) for x in items) + '</div>')
        elif k == 'flow':
            fs = run('flow')
            o.append('<div class="rv flow">' + ''.join('<div class="step"><span class="num mono">{:02d}</span><div class="txt"><b>{}</b><span>{}</span></div></div>'.format(ix + 1, *[inl(x.strip()) for x in f.split('|', 1)]) for ix, f in enumerate(fs)) + '</div>')
        elif k in ('list', 'ol'):
            ls = run(k)
            if k == 'ol':
                o.append('<ul class="dots ol">' + ''.join(f'<li class="rv"><span class="dot mono">{ix + 1}</span><span>{inl(l)}</span></li>' for ix, l in enumerate(ls)) + '</ul>')
            else:
                o.append('<ul class="dots">' + ''.join(f'<li class="rv"><span class="dot"></span><span>{inl(l)}</span></li>' for l in ls) + '</ul>')
        elif k == 'swatch':
            items = [x.split('|') for x in v.split(';;')]
            o.append('<div class="rv swatches">' + ''.join(f'<div class="sw"><i style="background:{c.strip()}"></i><span class="mono lbl">{inl(t.strip())}</span></div>' for c, t in items) + '</div>'); i += 1
        elif k == 'diagram':
            dn, _, alt = v.partition('|')
            dn, alt = dn.strip(), alt.strip()
            w, h = dims(slug, dn)
            wide = w > 1600
            from PIL import Image
            bg = '#%02x%02x%02x' % Image.open(f'{OUT}/ux/{slug}/{dn}.webp').convert('RGB').getpixel((2, 2))
            o.append(f'<figure class="rv hero-fig diag{" wide" if wide else ""}" style="background:{bg};max-width:{max(w // 2, 560)}px"><div class="sc" tabindex="0" role="group" aria-label="Diagram, scroll sideways on small screens"><img src="{img(slug, dn)}" alt="{H.escape(alt, quote=True)}" loading="lazy" width="{w}" height="{h}"></div></figure>'); i += 1
        elif k == 'video':
            vn, _, cap = v.partition('|')
            vn, cap = vn.strip(), cap.strip()
            w, h = dims(slug, vn)
            o.append(f'<figure class="rv hero-fig" style="background:#1c1d21"><video src="ux/{slug}/{vn}.mp4" poster="{img(slug, vn)}" width="{w}" height="{h}" autoplay muted loop playsinline preload="metadata" aria-label="{H.escape(plain(cap), quote=True)}" style="display:block;width:100%;height:auto"></video></figure>'); i += 1
        else:
            raise SystemExit(f'unknown block {k} in {slug}')
    return '\n'.join(o)


def words(head, secs):
    t = [head.get('name', ''), head.get('title', ''), head.get('lede', ''), head.get('kicker', '')] + [a + ' ' + b for a, b in head['meta']] + head['intro'] + head['intro_small']
    for s in secs:
        t += [s['eb'], s['h']]
        for k, v in s['blocks']:
            if k in ('figs', 'figs3') or k.startswith('phones'):
                v = ' '.join(x.partition('|')[2] for x in v.split(';;'))
            elif k == 'person':
                v = v.partition('|')[2]
            elif k == 'swatch':
                v = ' '.join(x.partition('|')[2] for x in v.split(';;'))
            t.append(re.sub(r'[|:/;]+', ' ', plain(v)))
    return len(' '.join(t).split())


def page(slug, head, secs, nxt, nhead, mins):
    def mv(v):
        a, _, b = v.partition(';;')
        return inl(a.strip()) + (f'<span style="display:block;margin-top:2px;font-size:13.5px;opacity:.75">{inl(b.strip())}</span>' if b else '')
    meta = ''.join(f'<dt class="mono lbl" style="padding-top:16px;opacity:.78">{inl(k)}</dt><dd style="margin:4px 0 0;font-size:15px;line-height:1.4">{mv(v)}</dd>' for k, v in head['meta'])
    tags = ''
    if head.get('tags'):
        tags = '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:22px">' + ''.join(f'<span class="tag" style="background:var(--paper-2);border:2px solid var(--ink)">{inl(t.strip())}</span>' for t in head['tags'].split('|')) + '</div>'
    intro = ''.join(f'<p class="rv" style="margin:0;max-width:62ch;font-size:17px;line-height:1.6">{inl(p)}</p>' for p in head['intro']) + ''.join(f'<p class="rv small">{inl(p)}</p>' for p in head['intro_small'])
    proto = dlg = js = ''
    if head.get('proto'):
        kind, _, href = [x.strip() for x in head['proto'].partition('|')]
        play = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"></path></svg>'
        ext = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"></path><path d="M8 7h9v9"></path></svg>'
        box = '<span class="btn-arrow" style="background:var(--paper);color:var(--ink);border-right:2px solid var(--ink)">{}</span>'
        if kind == 'video':
            proto = f'<a class="btn proto-btn rv" id="proto" href="{H.escape(href, quote=True)}" style="--btn-bg:var(--lime)" aria-haspopup="dialog">{box.format(play)}<span class="btn-label">View tutorial/prototype</span></a>'
            dlg = f'<dialog class="vdlg" id="vdlg" aria-label="{H.escape(head["name"], quote=True)} tutorial video"><div class="vbar"><span class="mono">{inl(head["name"])} · tutorial</span><button class="vx" type="button" id="vx" aria-label="Close video">&times;</button></div><video controls playsinline preload="none" poster="{H.escape(href[:-4], quote=True)}-p.jpg" src="{H.escape(href, quote=True)}"></video></dialog>'
            js = "(function(){var b=document.getElementById('proto'),d=document.getElementById('vdlg');if(!b||!d||!d.showModal)return;var v=d.querySelector('video');b.addEventListener('click',function(e){e.preventDefault();d.showModal();v.play().catch(function(){});});document.getElementById('vx').addEventListener('click',function(){d.close()});d.addEventListener('click',function(e){if(e.target===d)d.close()});d.addEventListener('close',function(){v.pause()});})();"
        else:
            proto = f'<a class="btn proto-btn rv" href="{H.escape(href, quote=True)}" target="_blank" rel="noopener" style="--btn-bg:var(--lime)">{box.format(ext)}<span class="btn-label">View tutorial/prototype<span class="sr-only"> (opens in a new tab)</span></span></a>'
    hero = ''
    if head.get('hero'):
        n, _, cap = head['hero'].partition('|')
        n, cap = n.strip(), cap.strip(); w, h = dims(slug, n)
        bg = head.get('herobg', 'var(--paper-2)')
        hero = f'<figure class="rv hero-fig" style="background:{bg};margin-top:44px"><img src="{img(slug, n)}" alt="{H.escape(plain(cap) or head["name"] + " prototype", quote=True)}" width="{w}" height="{h}" fetchpriority="high"></figure>' + (f'<p class="small" style="margin-top:12px">{inl(cap)}</p>' if cap else '')
    body = []
    for s in secs:
        body.append(f'''<section style="padding:0 var(--gutter) clamp(48px,6vw,88px)">
  <div style="max-width:1280px;margin:0 auto;display:flex;flex-wrap:wrap;gap:24px 48px;align-items:flex-start">
    <div class="sec-head" style="flex:1 1 240px;min-width:0;position:sticky;top:96px">
      <div class="mono lbl" style="color:var(--tomato);margin-bottom:12px">{inl(s["eb"])}</div>
      <h2 class="display" style="margin:0;font-size:clamp(30px,4vw,58px);line-height:1">{inl(s["h"])}</h2>
    </div>
    <div class="body" style="flex:2.4 1 480px;min-width:0;display:flex;flex-direction:column;gap:18px;padding-top:6px">
{render(slug, s["blocks"])}
    </div>
  </div>
</section>''')
    arrow = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>'
    return f'''<!DOCTYPE html>
<html lang="en" data-case="{slug}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{H.escape(head["name"])} · Mahima Shastry</title>
<meta name="description" content="{H.escape(head["lede"], quote=True)}">
<link rel="stylesheet" href="site.css">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<script src="nav-hide.js" defer></script>
<script src="case-enhance.js" defer></script>
<style>{BASE_CSS}{EXTRA_CSS}</style>
</head>
<body>
<div class="grain" aria-hidden="true"></div>
<div id="bar" style="position:fixed;top:0;left:0;height:5px;background:var(--lime);border-bottom:2px solid var(--ink);z-index:120;width:0" aria-hidden="true"></div>
<header style="position:sticky;top:0;z-index:100;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;padding:14px var(--gutter);background:var(--paper);border-bottom:3px solid var(--ink)">
  <a class="mono" href="../index.html#top" style="font-size:11px;text-transform:uppercase;letter-spacing:.14em;display:inline-flex;align-items:center;gap:8px;white-space:nowrap">
    <span style="display:inline-block;width:9px;height:9px;background:var(--tomato);border:2px solid var(--ink);border-radius:999px"></span>Mahima Shastry
  </a>
  <nav style="display:flex;gap:14px;align-items:center;flex-wrap:wrap">
    <a class="mono nav-all" href="../index.html#process" style="font-size:11px;text-transform:uppercase;letter-spacing:.14em;white-space:nowrap">All work</a>
    <a class="btn" href="../index.html#contact" style="--btn-bg:var(--lime);height:40px;box-shadow:0 3px 0 var(--ink)">
      <span class="btn-label mono" style="font-size:11px;text-transform:uppercase;letter-spacing:.12em;padding:0 16px">Say hi</span>
    </a>
  </nav>
</header>
<main class="paper-tex" style="position:relative">
  <section style="padding:clamp(48px,7vw,104px) var(--gutter) clamp(48px,6vw,88px);max-width:1280px;margin:0 auto">
    <div style="display:flex;flex-wrap:wrap;align-items:center;gap:12px 18px;margin-bottom:18px">
      <span class="mono rv in" style="font-size:11px;text-transform:uppercase;letter-spacing:.14em;opacity:.65">{inl(head["kicker"])}</span>
      <span class="mono readtime">{mins} min read</span>
    </div>
    <h1 class="display" style="margin:0 0 10px;font-size:clamp(68px,15vw,210px);line-height:.82">{inl(head["name"])}</h1>
    <div style="display:flex;flex-wrap:wrap;gap:36px 48px;align-items:flex-start;margin-top:18px">
      <div style="flex:3 1 480px;min-width:0;display:flex;flex-direction:column;gap:20px">
        <h2 class="display" style="margin:0;font-size:clamp(28px,4vw,56px);line-height:1;max-width:20ch">{inl(head["title"])}</h2>
        <p class="rv" style="margin:0;max-width:60ch;font-size:clamp(18px,2vw,24px);line-height:1.4;letter-spacing:-.015em">{inl(head["lede"])}</p>
        {proto}
        {intro}
        {tags}
      </div>
      <dl class="rv" style="flex:1 1 280px;max-width:420px;min-width:0;margin:0;background:var(--sun);border:3px solid var(--ink);border-radius:14px;box-shadow:0 6px 0 var(--ink);padding:8px 22px 18px">{meta}</dl>
    </div>
    {hero}
  </section>
{chr(10).join(body)}
  <section class="arc-top" style="--arc:12;background:var(--ink);color:var(--paper);padding:clamp(110px,13vw,190px) var(--gutter) clamp(40px,5vw,64px)">
    <div style="max-width:1280px;margin:0 auto;display:flex;flex-direction:column;gap:26px">
      <span class="mono" style="font-size:11px;text-transform:uppercase;letter-spacing:.14em;color:var(--lime)">Next up</span>
      <a class="display" href="{nxt}.dc.html" style="display:block;margin:0;font-size:clamp(40px,8vw,120px);line-height:.9;max-width:16ch">{inl(nhead["name"])}</a>
      <p style="margin:0;max-width:52ch;font-size:17px;line-height:1.5;opacity:.78">{inl(nhead["title"])}</p>
      <div style="display:flex;flex-wrap:wrap;gap:14px;margin-top:8px">
        <a class="btn" href="{nxt}.dc.html" style="--btn-bg:var(--lime)">
          <span class="btn-arrow" style="background:var(--paper);color:var(--ink);border-right:2px solid var(--ink)">{arrow}</span>
          <span class="btn-label" style="padding:0 22px 0 16px;color:var(--ink)">Read it</span>
        </a>
        <a class="btn" href="../index.html#process" style="--btn-bg:transparent;--btn-fg:var(--paper);border-color:var(--paper);box-shadow:0 4px 0 var(--paper)">
          <span class="btn-label" style="padding:0 22px">All five projects</span>
        </a>
      </div>
    </div>
  </section>
</main>
{dlg}
<script>{js}
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
    data = {s: parse(s) for s in ORDER}
    meta = {}
    for ix, s in enumerate(ORDER):
        head, secs = data[s]
        w = words(head, secs)
        mins = max(1, math.ceil(w / WPM))
        nxt = ORDER[(ix + 1) % len(ORDER)]
        open(f'{OUT}/{s}.dc.html', 'w', encoding='utf-8').write(page(s, head, secs, nxt, data[nxt][0], mins))
        meta[s] = dict(words=w, mins=mins, title=head['title'], lede=head['lede'])
        print(s, w, 'words', mins, 'min')
    json.dump(meta, open(f'{S}/uxsrc/meta.json', 'w'), indent=1, ensure_ascii=False)


main()
