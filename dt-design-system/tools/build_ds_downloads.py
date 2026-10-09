"""Stage downloads for the DT Design System artifact (type "Design System"): asset groups the type page lists with a download.

Out (under build/ds-downloads/project/):
  assets/Downloads/{README.md, dt-design-system-kit.zip, dt-tokens.css, tokens.json, react-snippets.md}
  assets/Component pages/{README.md, <Comp>.html ×N}   self-contained: DT tokens + only the ODS CSS each page uses
  components/<Comp>/README.md                          + a "Use it" section (React snippet, pointer to its page)
Needs showcase/dt-design-system.html built first (the kit zip and snippets are read back from it, so both artifacts ship the same files).
usage: python3 tools/build_ds_downloads.py
"""
import base64, io, json, os, re, shutil, zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(ROOT, *a)
OUT = P('build', 'ds-downloads', 'project')
shutil.rmtree(P('build', 'ds-downloads'), ignore_errors=True)
os.makedirs(os.path.join(OUT, 'assets', 'Downloads'))
os.makedirs(os.path.join(OUT, 'assets', 'Component pages'))

show = open(P('showcase', 'dt-design-system.html'), encoding='utf-8').read()
kit = base64.b64decode(re.search(r'<script type="text/plain" id="kit-b64">(.*?)</script>', show, re.S).group(1).strip())
snips = json.loads(re.search(r'<script type="application/json" id="snips">(.*?)</script>', show, re.S).group(1).replace('<\\/', '</'))
z = zipfile.ZipFile(io.BytesIO(kit))
K = lambda p: z.read('dt-design-system-kit/' + p).decode('utf-8')
tokens_css, bundle, preview_css = K('tokens/dt-tokens.css'), K('components/ods-components.css'), K('components/preview.css')

D = os.path.join(OUT, 'assets', 'Downloads')
open(os.path.join(D, 'dt-tokens.css'), 'w', encoding='utf-8').write(tokens_css)
open(os.path.join(D, 'tokens.json'), 'w', encoding='utf-8').write(K('tokens/tokens.json'))
open(os.path.join(D, 'react-snippets.md'), 'w', encoding='utf-8').write(K('components/react-snippets.md'))
open(os.path.join(D, 'README.md'), 'w', encoding='utf-8').write(
    '# Downloads\n\n'
    '- **Everything in one zip** — the kit (tokens, icon sprites, ODS stylesheet, every component page, React snippets, Figma map, README) downloads from the DT Design System showcase page (Download kit).\n'
    '- **dt-tokens.css** — all tokens as CSS custom properties; light on `:root`, dark under `prefers-color-scheme: dark` or `data-theme="dark"`.\n'
    '- **tokens.json** — the same tokens as data, each colour with a light and a dark value and a usage note.\n'
    '- **react-snippets.md** — an import and a starting JSX element for each ODS component.\n\n'
    'Icons: download the sprites from the Icons group. Single components: the Component pages group. TeleNeo is licensed by Deutsche Telekom and is not included.\n')

# ---- CSS subset per component (rule kept when every class it names is used in the markup) ----
def blocks(css):
    i, n, out = 0, len(css), []
    while i < n:
        j = css.find('{', i)
        if j < 0: break
        head = css[i:j].strip(); depth, k = 1, j + 1
        while k < n and depth:
            depth += {'{': 1, '}': -1}.get(css[k], 0); k += 1
        out.append((re.sub(r'/\*.*?\*/', '', head, flags=re.S).strip(), css[j + 1:k - 1])); i = k
    return out
def split_top(sel):
    parts, depth, cur = [], 0, ''
    for ch in sel:
        if ch == '(': depth += 1
        elif ch == ')': depth -= 1
        if ch == ',' and depth == 0: parts.append(cur); cur = ''
        else: cur += ch
    return parts + [cur]
def subset(css, classes, attrs):
    out = []
    for head, body in blocks(css):
        if head.startswith('@media') or head.startswith('@supports'):
            inner = subset(body, classes, attrs)
            if inner: out.append('%s {\n%s}\n' % (head, inner))
        elif head.startswith('@keyframes') or head.startswith('@-webkit-keyframes'):
            out.append('%s {%s}\n' % (head, body))
        elif head.startswith('@'):
            continue
        else:
            keep = False
            if not re.search(r'\.[_a-zA-Z-]', head) and not re.search(r'\[data-', head):
                # class-free globals: resets (box-sizing…), :root variable blocks — keep, unless they only define another component's variables
                comps_here = set(re.findall(r'--(ODS[A-Za-z]+)-', body))
                keep = bool(comps_here & classes) or not comps_here
            for part in ([] if keep else split_top(head)):
                core = part
                for _ in range(3): core = re.sub(r':(not|is|where|has)\([^()]*\)', '', core)
                cls = re.findall(r'\.(-?[_a-zA-Z][\w-]*)', core)
                if cls and all(c in classes for c in cls): keep = True; break
                if not cls and re.search(r'\[(data-[\w-]+)', part) and any(a in part for a in attrs): keep = True; break
            if keep: out.append('%s {%s}\n' % (head, body))
    return ''.join(out)

disclosure = open(P('showcase', 'disclosure.js'), encoding='utf-8').read()
CP = os.path.join(OUT, 'assets', 'Component pages')
names = []
for f in sorted(z.namelist()):
    m = re.match(r'dt-design-system-kit/components/([A-Za-z]+)\.html$', f)
    if not m: continue
    name = m.group(1); page = z.read(f).decode('utf-8')
    body = page[page.index('<body>') + 6:page.index('<script>')]
    classes = set(c for cl in re.findall(r'class="([^"]*)"', body) for c in cl.split())
    attrs = set(re.findall(r'\s(data-[\w-]+)=', body))
    head = re.search(r'<title>.*?</title>', page).group(0)
    out = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n%s\n'
           '<style>\n%s\n</style>\n<style>\n%s</style>\n<style>\n%s\nbody{margin:0;font-family:"TeleNeo Var",TeleNeoWeb,system-ui,sans-serif;'
           'background:var(--colours-basic-background);color:var(--colours-basic-text)}\n</style>\n</head>\n<body>%s<script>\n%s</script>\n</body>\n</html>\n'
           % (head, tokens_css, subset(bundle, classes, attrs), preview_css, body, disclosure))
    open(os.path.join(CP, name + '.html'), 'w', encoding='utf-8').write(out); names.append(name)
open(os.path.join(CP, 'README.md'), 'w', encoding='utf-8').write(
    '# Component pages\n\nOne self-contained HTML page per ODS component: its markup and examples, the DT tokens and only the ODS CSS it uses. '
    'Download one and open it in a browser; it follows light and dark mode. TeleNeo is not included; pages fall back to the system sans-serif.\n')

# ---- "Use it" section in each component README ----
MARK = '\n## Use it\n'
for name in names:
    src = P('project', 'components', name, 'README.md')
    if not os.path.exists(src): continue
    txt = open(src, encoding='utf-8').read()
    if MARK in txt: txt = txt[:txt.index(MARK)]
    txt = txt.rstrip('\n') + '\n' + MARK + '\n```tsx\n' + snips.get(name, '').rstrip('\n') + '\n```\n\n' + \
          'Static HTML: download **%s.html** from Assets › Component pages (markup, DT tokens and the ODS CSS it uses). Everything at once: the kit zip on the DT Design System showcase page.\n' % name
    d = os.path.join(OUT, 'components', name); os.makedirs(d, exist_ok=True)
    open(os.path.join(d, 'README.md'), 'w', encoding='utf-8').write(txt)
sizes = {n: os.path.getsize(os.path.join(CP, n + '.html')) for n in names}
print('pages', len(names), 'largest', max(sizes.items(), key=lambda kv: kv[1]), 'total KB', sum(sizes.values()) // 1024)
