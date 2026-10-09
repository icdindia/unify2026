#!/usr/bin/env python3
"""Build dist/notification-panels.html — a single self-contained file.

tools/build-standalone.py inlines the CSS, JS and <img> tags in the HTML. Assets
that app.js renders at runtime go through A(name), which reads window.NP_ASSETS;
this script injects that map as data URIs so the file opens straight from disk.

    python3 prototypes/notification-panels/build.py
"""
import base64, json, mimetypes, pathlib, re, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
HERE = pathlib.Path(__file__).resolve().parent
DIST = ROOT / 'dist' / 'notification-panels.html'

subprocess.run([sys.executable, str(ROOT / 'tools' / 'build-standalone.py'),
                str(HERE / 'index.html'), str(DIST)], check=True, cwd=ROOT)

app = (HERE / 'app.js').read_text()
names = sorted(set(re.findall(r"'([a-z0-9-]+\.(?:svg|png))'", app)))
assets = {}
for n in names:
    mime = mimetypes.guess_type(n)[0]
    assets[n] = f'data:{mime};base64,' + base64.b64encode((HERE / 'assets' / n).read_bytes()).decode()
# es-image-1.png is passed through img() with a literal in the template, not a quoted name list
for extra in ('es-image-1.png',):
    p = HERE / 'assets' / extra
    assets.setdefault(extra, 'data:image/png;base64,' + base64.b64encode(p.read_bytes()).decode())

html = DIST.read_text()
marker = '<script data-src='
assert marker in html, 'build-standalone output changed; update the injection marker'
html = html.replace(marker, '<script>window.NP_ASSETS=' + json.dumps(assets) + ';</script>\n' + marker, 1)
DIST.write_text(html)
print(f'{DIST.relative_to(ROOT)}: {len(html):,} bytes, {len(assets)} runtime assets inlined')
