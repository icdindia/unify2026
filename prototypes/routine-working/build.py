#!/usr/bin/env python3
"""Build dist/routine-working.html (standalone) and dist/routine-working.artifact.html (publishable page).

    python3 prototypes/routine-working/build.py

The standalone file is what tools/build-standalone.py makes: CSS, JS and every <img> inlined, so it opens
from disk. The artifact file is the same page as a fragment for the Artifact tool, which wraps it in its
own document skeleton, so the doctype / html / head / body tags are dropped. It is also pinned to the
light design: the DS dark-mode token blocks are cut from the inlined tokens, because this page replicates
one light Figma frame and a viewer on a dark OS must not get half a dark landing page.
"""
import pathlib, re, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
HERE = pathlib.Path(__file__).resolve().parent
STANDALONE = ROOT / 'dist' / 'routine-working.html'
ARTIFACT = ROOT / 'dist' / 'routine-working.artifact.html'

subprocess.run([sys.executable, str(ROOT / 'tools' / 'build-standalone.py'),
                str(HERE / 'index.html'), str(STANDALONE)], check=True, cwd=ROOT)

html = STANDALONE.read_text()

# 1. light tokens only
marker = '/* ---- semantic colors: DARK ---- */'
assert html.count(marker) == 1, 'tokens.css dark marker moved; update build.py'
head, tail = html.split(marker, 1)
end = tail.index('</style>')
dark, rest = tail[:end], tail[end:]
assert dark.lstrip().startswith(':root[data-theme="dark"]') and '@media (prefers-color-scheme: dark)' in dark, 'unexpected content after the dark marker'
assert dark.count('{') == dark.count('}'), 'unbalanced braces in the cut dark blocks'
art = head + rest

# 2. fragment: drop the document wrapper the Artifact tool adds itself
art = re.sub(r'<!doctype html>\s*', '', art, flags=re.I)
art = re.sub(r'</?(html|head|body)\b[^>]*>\s*', '', art, flags=re.I)
art = re.sub(r'<meta charset="utf-8">\s*', '', art)
art = re.sub(r'<meta name="viewport"[^>]*>\s*', '', art)
assert '<title>Routine Status Dot</title>' in art
assert 'prefers-color-scheme: dark' not in art.replace('prefers-reduced-motion', '')
ARTIFACT.write_text(art)

for p in (STANDALONE, ARTIFACT):
    print(f'{p.relative_to(ROOT)}: {len(p.read_text()):,} bytes')
