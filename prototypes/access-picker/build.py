#!/usr/bin/env python3
"""Build dist/access-picker.html — a single self-contained file.

tools/build-standalone.py inlines the CSS, JS and <img> tags in the HTML. Icons
that app.js renders at runtime go through A(name), which reads window.AP_ASSETS;
this script injects that map as data URIs so the file opens straight from disk.

    python3 prototypes/access-picker/build.py
"""
import base64, json, pathlib, re, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
HERE = pathlib.Path(__file__).resolve().parent
DIST = ROOT / 'dist' / 'access-picker.html'

subprocess.run([sys.executable, str(ROOT / 'tools' / 'build-standalone.py'),
                str(HERE / 'index.html'), str(DIST)], check=True, cwd=ROOT)

app = (HERE / 'app.js').read_text()
names = sorted(set(re.findall(r"'([a-z0-9-]+\.svg)'", app)))
assets = {n: 'data:image/svg+xml;base64,' + base64.b64encode((HERE / 'assets' / n).read_bytes()).decode()
          for n in names}

html = DIST.read_text()
marker = '<script data-src='
assert marker in html, 'build-standalone output changed; update the injection marker'
html = html.replace(marker, '<script>window.AP_ASSETS=' + json.dumps(assets) + ';</script>\n' + marker, 1)
DIST.write_text(html)
print(f'{DIST.relative_to(ROOT)}: {len(html):,} bytes, {len(assets)} runtime icons inlined')
