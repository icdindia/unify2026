"""Build components/bundle.css, per-component preview.html + README.md from the ODS Storybook crawl.

Inputs (source/):
  foundations-raw.css   global foundation CSS
  css.json              {filename: cssText} for every ODS component stylesheet seen
  crawl/NNN.json        per component: docs text, code, story markup
  args/NNN.json         per component: props table rows (optional)
Outputs (project/components/):
  bundle.css, <Comp>/preview.html, <Comp>/README.md
"""
import json, os, re, glob, html as H

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'source')
OUT = os.path.join(ROOT, 'project', 'components')
os.makedirs(OUT, exist_ok=True)

# ---------------- bundle.css ----------------
found = open(os.path.join(SRC, 'foundations-raw.css')).read()


def top_rules(text):
    rules, d, cur = [], 0, ''
    for ch in text:
        cur += ch
        if ch == '{':
            d += 1
        elif ch == '}':
            d -= 1
            if d == 0:
                rules.append(cur.strip()); cur = ''
    return rules


keep = []
for r in top_rules(found):
    head = r.split('{', 1)[0].strip()
    if head.startswith(':root, [data-scheme="neutral"]'):
        # neutral colours come from tokens.css per theme; keep only the scoped reset
        keep.append(r.replace(':root, [data-scheme="neutral"]', '[data-scheme="neutral"]', 1))
    elif head.startswith('@font-face'):
        continue  # fonts come from tokens.json (variable TeleNeo)
    elif head in (':root', '[data-mode="light"]') and 'color-scheme' in r:
        continue
    elif head.startswith('@media (prefers-color-scheme'):
        continue
    else:
        keep.append(r)

css_files = json.load(open(os.path.join(SRC, 'css.json')))
first = [k for k in css_files if re.match(r'ODS(Column|Row|Box|Icon)-', k)]
order = first + sorted(k for k in css_files if k not in first)
comp_css = '\n\n'.join('/* %s */\n%s' % (re.sub(r'-[A-Za-z0-9_]{8}\.css$', '', k), css_files[k]) for k in order)
comp_css = re.sub(r'url\((["\']?)\.?/?assets/', r'url(\1https://ods.trap.ng.telekom.net/assets/', comp_css)

bundle = """/* DT Design System — component stylesheet.
   Built from the ODS Storybook (ods.trap.ng.telekom.net). Load after tokens.css.
   Neutral-scheme colours are theme tokens (tokens.css); every other [data-scheme] below uses light-dark(),
   so the theme switch is color-scheme: light | dark. */
:root, [data-theme="light"] { color-scheme: light; }
[data-theme="dark"], [data-mode="dark"] { color-scheme: dark; }
[data-mode="light"] { color-scheme: light; }
body { font-family: var(--font-sans, "TeleNeo Var", TeleNeoWeb, sans-serif); color: var(--colours-basic-text); background: var(--colours-basic-background); }

/* ---------- Foundations (non-colour variables, grid, colour schemes) ---------- */
""" + '\n\n'.join(keep) + """

/* ---------- Components ---------- */
""" + comp_css + '\n'
assert '</style' not in bundle.lower()
open(os.path.join(OUT, 'bundle.css'), 'w').write(bundle)
print('bundle.css', len(bundle) // 1024, 'KB,', len(css_files), 'component stylesheets')

# ---------------- groups ----------------
GROUP = {
    'Actions': ['Button', 'Floating Action Button', 'IconButtonXSmall', 'Link', 'InlineTrigger', 'Segmented Button', 'SkipLink'],
    'Inputs': ['Checkbox', 'Radio', 'Switch', 'Text Field', 'Text Area', 'Combobox', 'Dropdown Select', 'Date Picker', 'Time Picker',
               'Code Input', 'Input Stepper', 'Slider', 'Search', 'Inline Search', 'Upload', 'Rating Stars', 'Chips'],
    'Feedback': ['Alerts & Notifications', 'Loading Bar', 'Loading Spinner', 'Progress Bar', 'Skeleton', 'Tooltip', 'Popover',
                 'Support Message', 'Badge', 'Tag', 'Tags', 'Dim'],
    'Navigation': ['Breadcrumb', 'Global Header', 'Profile Menu', 'Side Navigation', 'Tabs', 'Pagination', 'Footer', 'Flyout Menu',
                   'Carousel Navigation', 'Carousel Timer', 'Progress Stepper', 'HeaderPreferredActions', 'HeaderTitle'],
    'Containers': ['Accordion', 'Card', 'Card (New)', 'Dialog', 'Nonmodal Dialog', 'Sheet', 'Box', 'Grid', 'Divider',
                   'Aspect Ratio Keeper', 'List', 'List Row', 'Timeline', 'Map Card'],
    'Data': ['Charts', 'Sparkline', 'Table'],
    'Content': ['Avatar', 'Text', 'Logo', 'Chat Bubble', 'AI Prompt', 'Video Player'],
}
G = {c: g for g, cs in GROUP.items() for c in cs}

PLACEHOLDER = ('data:image/svg+xml,' + re.sub(r'\s+', ' ', """<svg xmlns='http://www.w3.org/2000/svg' width='320' height='200' viewBox='0 0 320 200'>
<rect width='320' height='200' fill='%23DDDDDD'/><path d='M120 130l30-36 22 26 14-16 34 26z' fill='%23A3A3A3'/><circle cx='200' cy='78' r='12' fill='%23A3A3A3'/></svg>"""))


def comp_name(title):
    last = title.split('/')[-1]
    n = re.sub(r'[^A-Za-z0-9]+', ' ', last).title().replace(' ', '')
    return n


def clean_html(h):
    h = re.sub(r'<script[\s\S]*?</script>', '', h)
    h = re.sub(r'(<img\b[^>]*?\bsrc=")([^"]*)(")', lambda m: m.group(1) + (m.group(2) if m.group(2).startswith('data:') else PLACEHOLDER) + m.group(3), h)
    h = re.sub(r'\ssrcset="[^"]*"', '', h)
    # canvas charts captured as PNG (light theme): scale to the card, keep a light backing in dark mode
    h = re.sub(r'<img src="(data:image/png;base64,[^"]+)"[^>]*>',
               r'<img class="dt-chart-img" alt="Chart rendered by ODS (light theme capture)" src="\1">', h)
    # Map Card stories sit on a full-viewport map: fixed-height stage, ODS map image embedded once per preview (MAP_BG)
    h = h.replace('<div style="height: 100vh;">', '<div class="dt-map-stage">')
    h = re.sub(r'background: url\(&quot;https://ods\.trap\.ng\.telekom\.net/assets/map-bg-[^&]+&quot;\) 0% 0% / cover;', '', h)
    h = re.sub(r'<(iframe|video|object|embed)\b[\s\S]*?</\1>', '<div class="dt-embed-note">[media]</div>', h)
    h = re.sub(r'<(source|track)\b[^>]*>', '', h)
    h = h.replace('</script', '<\\/script')
    return h


import base64 as _b64
MAP_BG = ('<style>.dt-pv-stage .dt-map-stage { position: relative; height: 640px; overflow: hidden; border-radius: 8px; '
          'background: #e9ecef url(data:image/jpeg;base64,%s) center / cover; } .dt-pv-stage .dt-map-stage > .ODSRow { position: static; }</style>'
          % _b64.b64encode(open(os.path.join(SRC, 'extra', 'map-bg-800.jpg'), 'rb').read()).decode())

PREVIEW_CSS = """<style>
  .dt-pv { display: flex; flex-direction: column; gap: 24px; padding: 16px; font-family: var(--font-sans); color: var(--colours-basic-text); background: var(--colours-basic-background); }
  .dt-pv-label { font: 700 0.75rem/1.3 var(--font-sans); letter-spacing: 0.04em; text-transform: uppercase; color: var(--colours-basic-text-recessive); margin: 0 0 8px; }
  .dt-pv-stage { position: relative; overflow: auto; }
  /* Storybook decorators only (never ODS-classed parts): drop their padding, centring, fixed boxes and margins */
  .dt-pv-stage > div > div:not([class*="ODS"]) { padding: 0 !important; }
  .dt-pv-stage div[style]:not([class*="ODS"]):not([class*="ODS"] *) { justify-content: flex-start !important; align-items: flex-start !important; height: auto !important; }
  .dt-pv-stage div[style*="margin: 5em"]:not([class*="ODS"]):not([class*="ODS"] *), .dt-pv-stage div[style*="margin: auto"]:not([class*="ODS"]):not([class*="ODS"] *) { margin: 0 !important; }
  .dt-pv-stage div[style*="width: 300px"]:not([class*="ODS"]):not([class*="ODS"] *) { width: auto !important; }
  .dt-pv-stage div[style]:not([class*="ODS"]):not([class*="ODS"] *):has(> .ODSDivider > .ODSDivider-rectangle--variant-vertical) { height: 160px !important; }
  .dt-pv-stage a.ODSButton { display: inline-flex; width: auto; }
  .dt-pv-stage .ODSBadgeNumber { width: max-content; }
  .dt-pv-stage { padding: 4px; }
  /* floating tooltips were captured in flow (position: relative) → size the bubble to its text, ODS max width 230 */
  .dt-pv-stage .ODSTooltip-Wrapper { width: max-content; max-width: 230px !important; }
  /* ODS: the expanded Side Navigation fills its container and the product sets the width; preview container 280 (DT side nav) */
  .dt-pv-stage .ODSSideNavigation--expanded { max-width: 280px; }
  .dt-pv-stage .ODSTextArea ~ .ODSTextArea, .dt-pv-stage .ODSTextField ~ .ODSTextField { margin-top: 16px; }
  .dt-pv-stage .ODSSearch-dropdown-wrapper-collapsing { height: 0 !important; overflow: hidden !important; }
  /* opened overlays: transform makes this box the containing block for their position:fixed layers */
  .dt-pv-overlay { transform: translateZ(0); min-height: 520px; overflow: hidden; border-radius: 16px; outline: 1px solid var(--colours-shades-neutral-shades-200); }
  .dt-chart-img { display: block; width: auto; max-width: 100%; max-height: 320px; height: auto; background: #ffffff; border-radius: 8px; }
  .dt-pv-stage [role="application"] { height: auto !important; }
  .dt-embed-note { padding: 24px; background: var(--colours-shades-neutral-shades-100); color: var(--colours-basic-text-recessive); border-radius: 16px; }
</style>"""

BEHAVIOUR = """<script>
// Static rendition of ODS markup; wire the one universal behaviour (disclosure) so accordions and menus toggle.
document.addEventListener('click', function (e) {
  var b = e.target.closest('button[aria-expanded][aria-controls]');
  if (!b) return;
  var scope = b.closest('section') || document;
  var p = scope.querySelector('[id="' + b.getAttribute('aria-controls') + '"]');
  var open = b.getAttribute('aria-expanded') !== 'true';
  b.setAttribute('aria-expanded', String(open));
  if (p) { if (open) { p.removeAttribute('hidden'); p.style.maxHeight = 'none'; p.classList.add(p.classList[1] + '--expanded'); }
           else { p.setAttribute('hidden', ''); p.style.maxHeight = '0px'; p.classList.remove(p.classList[1] + '--expanded'); } }
  b.querySelectorAll('.ODSIcon').forEach(function (i) { i.style.transform = open ? 'rotate(180deg)' : ''; });
});
</script>"""


def parse_docs_text(t):
    t = re.sub(r'\n?(Show code|Copy code|Hide code)\n?', '\n', t)
    t = re.sub(r'\n{3,}', '\n\n', t)
    return t.strip()


SECTION = re.compile(r'\n(General|Overview|Usage|Anatomy|Use Directives|When to use|Guidelines|Description)\n')


def split_docs(docs_text):
    """-> (intro above the props table, guidelines below it). The props table itself is dropped (see args/)."""
    t = docs_text
    i = t.find('Name\tDescription\tDefault\tControl')
    if i < 0:
        return t, ''
    intro, rest = t[:i], t[i:]
    m = SECTION.search(rest)
    return intro, (rest[m.start() + 1:] if m else '')


def summary_of(title, docs_text):
    name = title.split('/')[-1]
    intro, guide = split_docs(docs_text)
    m = re.search(r'General\n\n([^\n]{40,})', guide)
    if m:
        return re.sub(r'\s*Please note:?$', '', m.group(1).strip())
    for p in (guide + '\n' + intro).split('\n'):
        p = p.strip()
        if len(p) > 60 and 'extends the native' not in p and not p.startswith('Lorem') and 'dummy text' not in p:
            return p
    return 'The %s component from the ODS web library.' % name


used = {}
index = []
crawl = sorted(glob.glob(os.path.join(SRC, 'crawl', '*.json')))
for fn in crawl:
    r = json.load(open(fn))
    title = r['title']
    parts = title.split('/')
    name = comp_name(title)
    if name in used or name == 'Cover':
        name = comp_name('/'.join(parts[-2:]).replace('/', ' '))
    used[name] = title
    group = G.get(parts[2] if parts[1] == 'Global Header' and len(parts) > 2 else parts[1], 'Content')
    docs = r.get('docs') or {}
    text = parse_docs_text(docs.get('text', '')) if docs else ''
    stories = [s for s in r['stories'] if s.get('html') and not s.get('error')]
    ov_file = os.path.join(SRC, 'overlay', os.path.basename(fn))
    overlay = json.load(open(ov_file))['stories'] if os.path.exists(ov_file) else {}
    seen_html, blocks = set(), []
    for s in stories:
        ov = overlay.get(s['id'], {})
        portal = ov.get('portal', '')
        # drop Storybook's own body children (highlights menu, vision filters); keep from the first ODS portal on
        m = re.search(r'<div[^>]*data-floating-ui-portal', portal) or re.search(r'<(div|section|aside|ul)\b[^>]*class="[^"]*ODS', portal)
        portal = portal[m.start():].strip() if m else ''
        # slicing from the first ODS layer leaves its wrappers' closing tags: drop unmatched trailing </div>s
        while portal.endswith('</div>') and portal.count('</div>') > len(re.findall(r'<div\b', portal)):
            portal = portal[:-6].rstrip()
        # captured mid-transition: show the settled open state
        portal = portal.replace('data-status="initial"', 'data-status="open"').replace('data-status="opening"', 'data-status="open"')
        h = clean_html(ov['html'] if portal else s['html'])
        key = re.sub(r'_r_[0-9a-z]+_', '', h + portal)
        if key in seen_html:
            continue
        seen_html.add(key)
        if portal:
            # floating layers were positioned against the Storybook viewport: put them in flow under the trigger
            portal = re.sub(r'position: (absolute|fixed); left: 0px; top: 0px; transform: translate\([^)]*\);( will-change: transform;)?',
                            'position: relative; margin-top: 8px;', portal)
            full = 'position: fixed' in portal
            blocks.append('<section><p class="dt-pv-label">%s · open</p><div class="dt-pv-stage%s">%s%s</div></section>'
                          % (H.escape(s['name']), ' dt-pv-overlay' if full else ' dt-pv-open', h, clean_html(portal)))
        else:
            blocks.append('<section><p class="dt-pv-label">%s</p><div class="dt-pv-stage">%s</div></section>' % (H.escape(s['name']), h))
    blocks = blocks[:8]
    d = os.path.join(OUT, name)
    os.makedirs(d, exist_ok=True)
    height = min(1400, 160 + 140 * len(blocks))
    if blocks:
        prev = '<!-- @dsCard group="%s" height=%d subtitle="%s" -->\n%s\n<div class="dt-pv">\n%s\n</div>\n%s\n' % (
            group, height, H.escape(parts[1] if len(parts) > 2 else 'ODS'), PREVIEW_CSS, '\n'.join(blocks), BEHAVIOUR)
        if 'dt-map-stage' in prev:
            prev = prev.replace('<div class="dt-pv">', MAP_BG + '\n<div class="dt-pv">', 1)
        keep = len(blocks)
        while len(prev.encode()) > 250_000 and keep > 1:
            keep -= 1
            prev = '<!-- @dsCard group="%s" height=%d subtitle="%s" -->\n%s\n<div class="dt-pv">\n%s\n</div>\n%s\n' % (
                group, min(1400, 160 + 140 * keep), H.escape(parts[1] if len(parts) > 2 else 'ODS'), PREVIEW_CSS, '\n'.join(blocks[:keep]), BEHAVIOUR)
            if 'dt-map-stage' in prev:
                prev = prev.replace('<div class="dt-pv">', MAP_BG + '\n<div class="dt-pv">', 1)
        if len(prev.encode()) > 250_000:
            print('  WARNING: %s preview still %d KB' % (name, len(prev.encode()) // 1024))
        open(os.path.join(d, 'preview.html'), 'w').write(prev)

    # README
    args = []
    af = os.path.join(SRC, 'args', os.path.basename(fn))
    if os.path.exists(af):
        args = json.load(open(af)).get('rows', [])
    summ = re.sub(r'\s*Please note:?$', '', summary_of(title, text))
    md = ['# %s' % name, '', summ, '']
    md += ['- **ODS name:** `ODS%s`' % name, '- **Storybook:** %s' % title, '- **Stories:** %s' % ', '.join(s['name'] for s in r['stories']), '']
    if docs.get('code'):
        code = [c for c in docs['code'] if c.strip()][:2]
        if code:
            md += ['## Example (story args)', '']
            for c in code:
                md += ['```tsx', c.strip()[:3000], '```', '']
    if args:
        md += ['## Props', '', '| Prop | Type | Default | Description |', '|---|---|---|---|']
        for a in args:
            md.append('| `%s`%s | %s | %s | %s |' % (a['name'], ' *' if a.get('required') else '', a.get('type', '').replace('|', '\\|').replace('\n', ' ')[:200],
                                                   a.get('default', '').replace('|', '\\|')[:60] or '–', a.get('description', '').replace('|', '\\|').replace('\n', ' ')[:400]))
        md.append('')
    if text:
        intro, guide = split_docs(text)
        note = [l for l in intro.split('\n') if 'Preferred Content' in l or 'deprecated' in l.lower()]
        if note:
            md += ['> ' + ' '.join(note), '']
        if guide:
            g = re.sub(r'\n(General|Anatomy|Use Directives|Component Variants|Accessibility|Dos and don\'ts|Examples|States|Size|Colour Schemes|Behavior on Color Schemes)\n',
                       lambda m: '\n### %s\n' % m.group(1), '\n' + guide)
            md += ['## Guidelines (from the ODS docs page)', '', g.strip()[:30000], '']
    md += ['## What the consumer provides', '',
           'The ODS React component `ODS%s` (props above) or, for static HTML, the markup in this card\'s preview with `bundle.css` loaded. '
           'Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.' % name, '']
    open(os.path.join(d, 'README.md'), 'w').write('\n'.join(md))
    index.append((group, name, title, len(blocks)))

json.dump(index, open(os.path.join(SRC, 'component-index.json'), 'w'), indent=1)
print(len(index), 'components written;', sum(1 for i in index if i[3] == 0), 'without preview')
