"""Build showcase/dt-design-system.html: one self-contained page with everything in the DT Design System.

Sources: dev/tokens.css (ODS tokens), project/tokens.json (colour usage, DT palette, type, space), project/components/bundle.css
(ODS component CSS), project/components/<Comp>/{preview.html,README.md}, project/assets/Icons/icons.json, project/fonts,
project/assets/Logos, showcase/assets (Figma screens + DT component sheets), showcase/showcase.css (page styles).
usage: python3 tools/build_showcase.py
"""
import base64, html, json, os, re, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(ROOT, *a)
rd = lambda p: open(p, encoding='utf-8').read()
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
esc = html.escape

tokens = json.load(open(P('project', 'tokens.json')))
ctoks = tokens['color']['tokens']

# ---------- theme CSS: light on :root, dark via prefers-color-scheme (guarded) and [data-theme=dark] ----------
tcss = rd(P('dev', 'tokens.css'))
light = re.search(r':root, \[data-theme="light"\] \{(.*?)\n\}', tcss, re.S).group(1)
dark = re.search(r'\[data-theme="dark"\] \{(.*?)\n\}', tcss, re.S).group(1)
rest = tcss[tcss.index(':root {', tcss.index('[data-theme="dark"]')):]
pal_l = ''.join('\n  --%s: %s;' % (t['name'], t['value']['light']) for t in ctoks if t['name'].startswith('palette-'))
pal_d = ''.join('\n  --%s: %s;' % (t['name'], t['value']['dark']) for t in ctoks if t['name'].startswith('palette-'))
font = b64(P('project', 'fonts', 'TeleNeoVariable-Upright.woff2'))
theme_css = ('@font-face{font-family:"TeleNeo Var";src:url(data:font/woff2;base64,%s) format("woff2");font-weight:100 900;font-style:normal;font-display:swap}\n' % font +
             ':root{%s%s\n  color-scheme: light;\n}\n' % (light, pal_l) +
             '@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){%s%s\n  color-scheme: dark;\n}}\n' % (dark, pal_d) +
             ':root[data-theme="dark"]{%s%s\n  color-scheme: dark;\n}\n' % (dark, pal_d) + rest)

bundle = rd(P('project', 'components', 'bundle.css'))

# ---------- components ----------
GROUP_ORDER = ['Actions', 'Inputs', 'Feedback', 'Navigation', 'Containers', 'Content', 'Data']
comps, extra_css, shared_css = [], [], None
for d in sorted(glob.glob(P('project', 'components', '*', 'preview.html'))):
    name = os.path.basename(os.path.dirname(d))
    if name in ('Cover', 'Icons'):
        continue
    s = rd(d)
    meta = re.search(r'@dsCard group="([^"]+)"', s)
    group = meta.group(1) if meta else 'Content'
    for st in re.findall(r'<style>(.*?)</style>', s, re.S):
        if '.dt-pv {' in st and shared_css is None:
            shared_css = st
        elif '.dt-pv {' not in st:
            extra_css.append('/* %s */\n%s' % (name, st))
    body = re.sub(r'<!--.*?-->', '', s, flags=re.S)
    body = re.sub(r'<style>.*?</style>', '', body, flags=re.S)
    body = re.sub(r'<script>.*?</script>', '', body, flags=re.S)
    body = re.sub(r'<svg id="storybook-a11y-vision-filters".*?</svg>', '', body, flags=re.S)
    readme = rd(P('project', 'components', name, 'README.md')) if os.path.exists(P('project', 'components', name, 'README.md')) else ''
    para = next((l for l in readme.split('\n')[1:] if l.strip() and not l.startswith(('#', '-', '|'))), '')
    ods = re.search(r'\*\*ODS name:\*\* `([^`]+)`', readme)
    odsn = ods.group(1) if ods else 'ODS' + name
    props = []
    for line in readme.split('\n'):
        if line.startswith('| `'):
            cells = [c.strip() for c in re.split(r'(?<!\\)\|', line)[1:-1]]
            m = re.match(r'`([^`]+)`(\s*\*)?', cells[0]) if len(cells) >= 3 else None
            if m: props.append((m.group(1), cells[1], cells[2], bool(m.group(2))))
    attrs, kids = [], None
    for pn, pt, pd, req in props:
        pd = pd.strip()
        if pn in ('children',): kids = 'Content'
        elif pn in ('label', 'title', 'heading', 'text') and pd in ('–', ''): attrs.insert(0, '%s="%s"' % (pn, name))
        elif req and pd in ('–', '') and pt.strip() == 'string': attrs.insert(0, '%s="%s"' % (pn, pn.capitalize()))
        elif pd not in ('–', '') and not pd.startswith('('):
            v = pd.strip('"')
            attrs.append('%s="%s"' % (pn, v) if pd.startswith('"') else '%s={%s}' % (pn, v))
    jsx = '<%s%s%s' % (odsn, (' ' + ' '.join(attrs[:6])) if attrs else '', ('>%s</%s>' % (kids, odsn)) if kids else ' />')
    react = 'import { %s } from "@telekom-ods/react-ui-kit";\n// Next.js: import { %s } from "@telekom-ods/react-ui-kit/%s";\n\n%s\n' % (odsn, odsn, odsn, jsx)
    comps.append({'name': name, 'group': group, 'summary': para.strip(), 'ods': odsn, 'body': body.strip(), 'react': react})
comps.sort(key=lambda c: (GROUP_ORDER.index(c['group']) if c['group'] in GROUP_ORDER else 99, c['name']))

# ---------- icons ----------
ic = json.load(open(P('project', 'assets', 'Icons', 'icons.json')))
outline = ic['variants']['outline']['svg']
icon_html = []
for cat, names in ic['categories'].items():
    names = [n for n in (names if isinstance(names, list) else list(names)) if n in outline]
    cells = ''.join('<li title="%s"><svg viewBox="0 0 24 24" aria-hidden="true">%s</svg><span>%s</span></li>' % (n, outline[n], n.replace('_', ' ')) for n in names)
    icon_html.append('<div class="icon-cat" data-cat="%s"><h4>%s <small>%d</small></h4><ul class="icon-grid">%s</ul></div>' % (esc(cat), esc(cat), len(names), cells))
n_icons = sum(len(v if isinstance(v, list) else list(v)) for v in ic['categories'].values())

# ---------- colour ----------
def swatch_row(t):
    L, D = t['value']['light'], t['value']['dark']
    return ('<tr><td><span class="chip" style="background:var(--%s)"></span></td><td><code>%s</code></td>'
            '<td class="hex"><span class="mini" style="background:%s"></span>%s</td><td class="hex"><span class="mini" style="background:%s"></span>%s</td><td>%s</td></tr>'
            % (t['name'], t['name'], L, L.upper(), D, D.upper(), esc(t.get('usage', ''))))
cgroups = [('Basic', 'colours-basic-'), ('Interaction states', 'colours-interaction-states-'), ('Functional', 'colours-functional-'),
           ('Accents', 'colours-shades-accent'), ('Secondary accent', 'colours-shades-secondary-accent'), ('Neutral ramp', 'colours-shades-neutral'),
           ('Brand ramp', 'dt-')]
used, color_tables = set(), []
for label, pre in cgroups:
    rows = [t for t in ctoks if t['name'].startswith(pre) and t['name'] not in used]
    used.update(t['name'] for t in rows)
    if rows:
        color_tables.append('<details class="ctab"%s><summary>%s <small>%d tokens</small></summary><div class="scroll"><table class="tokens"><thead><tr><th></th><th>Token</th><th>Light</th><th>Dark</th><th>Use it for</th></tr></thead><tbody>%s</tbody></table></div></details>'
                            % (' open' if label == 'Basic' else '', label, len(rows), ''.join(swatch_row(t) for t in rows)))
other = [t for t in ctoks if t['name'] not in used and not t['name'].startswith('palette-')]
if other:
    color_tables.append('<details class="ctab"><summary>Other <small>%d tokens</small></summary><div class="scroll"><table class="tokens"><thead><tr><th></th><th>Token</th><th>Light</th><th>Dark</th><th>Use it for</th></tr></thead><tbody>%s</tbody></table></div></details>'
                        % (len(other), ''.join(swatch_row(t) for t in other)))
HUES = ['aperitif', 'basketball', 'cheddar', 'dandelion', 'egg', 'frog', 'guacamole', 'hummingbird', 'iguana', 'jacuzzi', 'kingfisher', 'lagoon', 'macaw', 'nebula', 'orchid']
STEPS = ['subtle', 'extra-dominant', 'dominant', 'base-subtle', 'base', 'recessive', 'extra-recessive']
pv = {t['name']: t['value'] for t in ctoks if t['name'].startswith('palette-')}
pal_rows = ''.join('<div class="pal-row"><div class="pal-name">%s</div>%s</div>' % (h, ''.join(
    '<button class="pal-cell" style="background:var(--palette-%s-%s)" data-copy="--palette-%s-%s" title="--palette-%s-%s"><span class="pl">%s</span><span class="pd">%s</span></button>'
    % (h, s, h, s, h, s, pv['palette-%s-%s' % (h, s)]['light'].upper(), pv['palette-%s-%s' % (h, s)]['dark'].upper()) for s in STEPS)) for h in HUES)

# ---------- type, space ----------
type_rows = ''
for g in tokens['type']['groups']:
    for st in g['styles']:
        fs = st['fontSize']; lh = st['lineHeight']
        type_rows += ('<div class="type-row"><div class="type-meta"><code>%s</code><span>%s · %s · %s</span><small>%s</small></div>'
                      '<p style="font:%s %s/%s var(--font-sans)">Erleben, was verbindet. Ask anything about your quarter.</p></div>'
                      % (st['name'], fs, lh, st['fontWeight'], esc(st.get('usage', '')), st['fontWeight'], fs, lh))
def scale_rows(fam, kind):
    out = ''
    for t in tokens[fam]['tokens']:
        v = t['value']
        viz = ('<span class="bar" style="width:%s"></span>' % v) if kind == 'bar' else ('<span class="rad" style="border-radius:%s"></span>' % v) if kind == 'rad' else ''
        out += '<tr><td><code>%s</code></td><td class="hex">%s</td><td>%s</td><td>%s</td></tr>' % (t['name'], v, viz, esc(t.get('usage', '')))
    return '<div class="scroll"><table class="tokens scale"><tbody>%s</tbody></table></div>' % out

# ---------- images ----------
A = P('showcase', 'assets')
def img(name):
    cands = [os.path.join(A, name + e) for e in ('.png', '.jpg') if os.path.exists(os.path.join(A, name + e))]
    p = min(cands, key=os.path.getsize)
    mime = 'image/png' if p.endswith('.png') else 'image/jpeg'
    return 'data:%s;base64,%s' % (mime, b64(p))
SCREENS = [('screen-landing-nav-open', 'Copilot landing', 'Open nav, composer add menu and skills menu (DT Flyout Menu Item).'),
           ('screen-chat', 'Chat', 'Answer with thinking row, citation tags, XSmall answer actions, sources pill and composer.'),
           ('screen-files-in-chat', 'Files in chat', 'Group chat with ODS incoming bubbles, palette-tinted avatars and the Files panel.'),
           ('screen-artifact-open', 'Artifact open', 'Narrow chat with the artifact viewer: ODS toolbar and a static preview of the generated app.'),
           ('screen-artifacts-grid', 'Artifacts · grid', 'DT Artifact Card grid with segment filters.'),
           ('screen-artifacts-list', 'Artifacts · list', 'DT Table Head Cell and DT Artifact List Row with the card menu open.'),
           ('screen-routines', 'Routines', 'Template gallery: DT Toggle Chip filters and DT Routine Card.'),
           ('screen-routines-list', 'Routines list', 'DT Routine Row table with status tags, New Routine menu and tooltip.'),
           ('screen-new-routine', 'New routine', 'Breadcrumb header, thought steps and the question card above the composer.')]
screens_html = ''.join('<figure class="shot"><img loading="lazy" src="%s" alt="%s screen"><figcaption><b>%s</b>%s</figcaption></figure>' % (img(f), t, t, c) for f, t, c in SCREENS)
SHEETS = [('sheet-tags-badges-chips', 'Tags, badges & chips'), ('sheet-form-feedback', 'Form & feedback'), ('sheet-routines', 'Routine card & row')]
sheets_html = ''.join('<figure class="sheet"><img loading="lazy" src="%s" alt="%s component sheet"><figcaption>%s</figcaption></figure>' % (img(f), t, t) for f, t in SHEETS)

FIGMA = [  # name, node, maps to, notes
    ('DT Button · ODS Small', '15046:642460', 'ODSButton size small', 'Primary / Secondary / Outline / Subtle / Ghost × Standard / Icon only × 5 states. 40 high; labels 14 in product screens.'),
    ('DT Icon Button · ODS XSmall', '15054:1341691', 'ODSIconButtonXSmall', '24 with a 16 icon. Compact icon actions: answer actions, composer tools, header icons, row menus.'),
    ('DT Segment', '15049:140095', 'ODSSegments size small', 'Body S Bold 14, 16 icon, 40 high. Filter tracks and view toggles.'),
    ('DT Tag Static', '15065:180255', 'ODSTagStatic', '10 types × Small / Medium / Standard. Status (Success / Warning), citations, file types.'),
    ('DT Tag Dismissible · Badge Number · Badge Icon', '15065:180541', 'ODSTagDismissible, ODSBadgeNumber, ODSBadgeIcon', 'Notification badge "2" on the chat icon uses Badge Number.'),
    ('DT Filter Chip · Toggle Chip · Dismissible Chip', '15065:180890', 'ODSFilterChip, ODSToggleChip, ODSDismissibleChip', 'Routines categories use Toggle Chip (48 high, labels 14).'),
    ('DT Text Field · Text Area · Dropdown Select', '15069:117138', 'ODSTextField, ODSTextArea, ODSDropdownSelect', 'Floating label: Body M Bold → Body S Bold 14; support row + counter.'),
    ('DT Tooltip · Support Message · Progress Bar', '15069:117457', 'ODSTooltip, ODSSupportMessage, ODSProgressBar', 'Tooltip max width 230, label Body S Bold 14.'),
    ('DT Flyout Menu Item', '15046:644196', 'ODSMenuListItem small', 'Standard / Checked / Cascade / Destructive × 5 states, optional helper text (turn off "icon after").'),
    ('DT Chat Header · Chat Actions · Composer', '15050:156109', 'ODS buttons + tokens', 'Title 14, cost / share / document buttons; composer tools are XSmall.'),
    ('DT Attachment', '15050:152633', 'ODSFileUpload item', 'Image / File × Default / Hover / Focus; name Body S Bold 14, meta Microcopy 12; trailing XSmall.'),
    ('DT Artifact Card · Artifact List Row · Table Head Cell', '15049:140321', 'ODSActionCard, ODSTable', 'Artifacts grid and list.'),
    ('DT Routine Card', '15091:953563', 'ODSActionCard (outline)', 'Default / Hover; accent tile, Body M Bold title, Body S description, Microcopy meta with icon or partner logo.'),
    ('DT Routine Row', '15094:955505', 'ODSTableRow', 'Default / Hover; Status = Tag Static Success "Active" / Warning "Paused".'),
    ('DT Side Nav (closed / open)', 'Chat — DT · Light', 'ODSSideNavigation (magenta scheme)', 'Rail items 40; open nav items Body M Bold 16 per ODS.'),
    ('DT Palette', '15084:947923', 'palette/<hue>/<step>', '15 hues × 7 steps in DT Foundations, light + dark boards.'),
]
figma_rows = ''.join('<tr><td><b>%s</b></td><td><code>%s</code></td><td>%s</td><td>%s</td></tr>' % tuple(esc(x) for x in r) for r in FIGMA)

# ---------- components html ----------
nav_groups, comp_html = {}, []
for c in comps:
    nav_groups.setdefault(c['group'], []).append(c['name'])
    comp_html.append('<section class="comp" id="c-%s" data-group="%s" data-name="%s" data-ods="%s"><header class="comp-head"><div><p class="eyebrow">%s</p><h3>%s</h3></div><code class="ods">%s</code></header>'
                     '<p class="comp-sum">%s</p><div class="comp-tools"><button type="button" class="tool" data-act="html">Copy HTML</button><button type="button" class="tool" data-act="react">Copy React</button>'
                     '<button type="button" class="tool dl" data-act="download" hidden>Download .html</button></div><div class="comp-stage">%s</div></section>'
                     % (c['name'], c['group'], c['name'], esc(c['ods']), c['group'], c['name'], esc(c['ods']), esc(c['summary']), c['body']))
comp_nav = ''.join('<li><span>%s</span><ul>%s</ul></li>' % (g, ''.join('<li><a href="#c-%s">%s</a></li>' % (n, n) for n in names)) for g, names in sorted(nav_groups.items(), key=lambda kv: GROUP_ORDER.index(kv[0]) if kv[0] in GROUP_ORDER else 99))

# ---------- exports (downloads) ----------
import io, zipfile
export_tokens = ('/* DT Design System tokens (ODS neutral scheme + DT palette). Light on :root; dark via prefers-color-scheme or data-theme="dark".\n'
                 '   Font: TeleNeo is licensed by Deutsche Telekom and not included; install TeleNeoWeb / "TeleNeo Var" from the ODS package. */\n' + theme_css[theme_css.index(':root{'):])
def sprite(variant):
    v = ic['variants'][variant]; sz = v.get('size', 24)
    return ('<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n' +
            ''.join('<symbol id="ods-%s" viewBox="0 0 %d %d">%s</symbol>\n' % (n, sz, sz, g) for n, g in sorted(v['svg'].items())) + '</svg>\n')
preview_css = (shared_css or '') + '\n' + '\n'.join(extra_css)
SCRIPT_DISCLOSURE = rd(P('showcase', 'disclosure.js'))
kit = io.BytesIO()
with zipfile.ZipFile(kit, 'w', zipfile.ZIP_DEFLATED) as z:
    z.writestr('dt-design-system-kit/README.md', rd(P('showcase', 'KIT-README.md')))
    z.writestr('dt-design-system-kit/tokens/dt-tokens.css', export_tokens)
    z.writestr('dt-design-system-kit/tokens/tokens.json', rd(P('project', 'tokens.json')))
    for var in ('outline', 'selected', 'small', 'small-selected'):
        if var in ic['variants']:
            z.writestr('dt-design-system-kit/icons/ods-icons-%s.svg' % var, sprite(var))
    z.writestr('dt-design-system-kit/components/ods-components.css', bundle)
    z.writestr('dt-design-system-kit/components/preview.css', preview_css)
    for c in comps:
        page = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n'
                '<title>%s · DT Design System</title>\n<link rel="stylesheet" href="../tokens/dt-tokens.css">\n<link rel="stylesheet" href="ods-components.css">\n'
                '<link rel="stylesheet" href="preview.css">\n<style>body{margin:0;font-family:"TeleNeo Var",TeleNeoWeb,system-ui,sans-serif;background:var(--colours-basic-background);color:var(--colours-basic-text)}</style>\n'
                '</head>\n<body>\n<!-- %s (%s). %s -->\n%s\n<script>\n%s</script>\n</body>\n</html>\n') % (c['name'], c['ods'], c['group'], c['summary'].replace('--', '-'), c['body'], SCRIPT_DISCLOSURE)
        z.writestr('dt-design-system-kit/components/%s.html' % c['name'], page)
    z.writestr('dt-design-system-kit/components/react-snippets.md', '# React snippets\n\n' + ''.join('## %s\n\n```tsx\n%s```\n\n' % (c['name'], c['react']) for c in comps))
    z.writestr('dt-design-system-kit/figma/dt-figma-components.md', '# DT Figma components (EB for DT 2026 · 🎨 DT Pilot)\n\n| Component | Node | ODS | Notes |\n|---|---|---|---|\n' +
               ''.join('| %s | `%s` | %s | %s |\n' % r for r in FIGMA))
kit_b64 = base64.b64encode(kit.getvalue()).decode()
snips = json.dumps({c['name']: c['react'] for c in comps}).replace('</', '<\\/')
tokens_json_txt = rd(P('project', 'tokens.json')).replace('</', '<\\/')
export_tokens_js = json.dumps(export_tokens).replace('</', '<\\/')
preview_css_js = json.dumps(preview_css).replace('</', '<\\/')
tmark = rd(P('project', 'assets', 'Logos', 't-mark-magenta.svg'))
page_css = rd(P('showcase', 'showcase.css'))
tpl = rd(P('showcase', 'template.html'))
out = (tpl.replace('/*THEME*/', theme_css).replace('/*BUNDLE*/', bundle).replace('/*PREVIEW*/', (shared_css or '') + '\n' + '\n'.join(extra_css)).replace('/*PAGE*/', page_css)
       .replace('<!--TMARK-->', tmark).replace('<!--COLOR_TABLES-->', ''.join(color_tables)).replace('<!--PALETTE-->', pal_rows)
       .replace('<!--TYPE-->', type_rows).replace('<!--SPACING-->', scale_rows('spacing', 'bar')).replace('<!--RADIUS-->', scale_rows('radius', 'rad'))
       .replace('<!--SIZING-->', scale_rows('sizing', '')).replace('<!--STROKES-->', scale_rows('strokes', '')).replace('<!--VIEWPORT-->', scale_rows('viewport', ''))
       .replace('<!--ICONS-->', ''.join(icon_html)).replace('<!--COMP_NAV-->', comp_nav).replace('<!--COMPONENTS-->', ''.join(comp_html))
       .replace('<!--FIGMA-->', figma_rows).replace('<!--SHEETS-->', sheets_html).replace('<!--SCREENS-->', screens_html)
       .replace('{{N_COMPS}}', str(len(comps))).replace('{{N_ICONS}}', str(n_icons)).replace('{{N_TOKENS}}', str(len([t for t in ctoks if not t['name'].startswith('palette-')])))
       .replace('{{N_SCREENS}}', str(len(SCREENS))).replace('{{N_FIGMA}}', str(len(FIGMA)))
       .replace('/*KIT_B64*/', kit_b64).replace('/*SNIPS*/', snips).replace('/*TOKENS_JSON*/', tokens_json_txt)
       .replace('/*EXPORT_TOKENS*/', export_tokens_js).replace('/*PREVIEW_CSS*/', preview_css_js).replace('/*DISCLOSURE*/', json.dumps(SCRIPT_DISCLOSURE))
       .replace('{{KIT_KB}}', str(round(len(kit.getvalue()) / 1024))))
os.makedirs(P('showcase'), exist_ok=True)
open(P('showcase', 'dt-design-system.html'), 'w', encoding='utf-8').write(out)
print('components', len(comps), 'icons', n_icons, 'bytes', len(out.encode()))
