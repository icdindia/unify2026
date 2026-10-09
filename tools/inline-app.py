#!/usr/bin/env python3
"""Fold the Vite build of app/ (dist/eb-app/) into one self-contained file, dist/eb-app.html.

Vite already turns every image into a data URI (assetsInlineLimit) and emits one JS + one CSS file;
this inlines those two, so the prototype opens straight from disk, from an email attachment, or inside
a sandboxed preview pane. Fonts stay on Google Fonts, as in every other prototype in this repo.
"""
import pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
SRC = ROOT / 'dist' / 'eb-app'
OUT = ROOT / 'dist' / 'eb-app.html'

html = (SRC / 'index.html').read_text()

def css(m):
    return '<style>\n' + (SRC / m.group(1)).read_text() + '\n</style>'

def js(m):
    code = (SRC / m.group(1)).read_text().replace('</script', '<\\/script')
    return '<script type="module">\n' + code + '\n</script>'

html, n_css = re.subn(r'<link rel="stylesheet"[^>]*href="\./([^"]+\.css)"[^>]*>', css, html)
html, n_js = re.subn(r'<script type="module"[^>]*src="\./([^"]+\.js)"[^>]*></script>', js, html)
left = re.findall(r'(?:src|href)="\./assets/[^"]+"', html)
if n_js != 1 or left:
    sys.exit(f'inline-app: expected 1 module script and no loose assets; got {n_js} scripts, leftover {left}')
OUT.write_text(html)
print(f'{OUT.relative_to(ROOT)}: {OUT.stat().st_size:,} bytes ({n_css} css, {n_js} js inlined)')
