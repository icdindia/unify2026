#!/usr/bin/env python3
"""Inline a prototype's linked CSS, JS and image assets into one self-contained HTML file.

    python3 tools/build-standalone.py prototypes/playbook-studio/index.html dist/playbook-studio.html

The linked prototype stays the source of record (FIGMA-TO-HTML §9); the output
is the file to open directly or send around (failure-modes §6). Google Fonts
stays external — the one acceptable external reference. Local ./assets/*.svg
referenced via <img src="…"> are base64-encoded and inlined as data: URIs so
the file opens cleanly from file:// with no missing-image boxes.
"""
import base64
import mimetypes
import os
import re
import sys

src, dst = sys.argv[1], sys.argv[2]
base = os.path.dirname(src)
html = open(src).read()


def strip_query(path):
    return path.split('?', 1)[0]


def read_local(href):
    """Resolve a href like './app.js?v=21' relative to the source and return its bytes."""
    p = os.path.join(base, strip_query(href))
    return open(p, 'rb').read().decode('utf-8')


def read_local_binary(href):
    p = os.path.join(base, strip_query(href))
    return open(p, 'rb').read()


def css_repl(m):
    href = m.group(1)
    if href.startswith('http') or href.startswith('data:'):
        return m.group(0)
    body = read_local(href)
    return f'<style data-src="{strip_query(href)}">\n{body}\n</style>'


def js_repl(m):
    s = m.group(1)
    body = read_local(s)
    assert '</script' not in body, s
    return f'<script data-src="{strip_query(s)}">\n{body}\n</script>'


def img_repl(m):
    """<img src="./assets/…"> → data URI. Skips http(s) / data: sources."""
    prefix, href = m.group(1), m.group(2)
    if href.startswith('http') or href.startswith('data:'):
        return m.group(0)
    mime, _ = mimetypes.guess_type(strip_query(href))
    if not mime:
        mime = 'application/octet-stream'
    data = base64.b64encode(read_local_binary(href)).decode('ascii')
    return f'{prefix}"data:{mime};base64,{data}"'


# Inline linked CSS/JS regardless of a trailing ?v=NN cache-buster.
html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', css_repl, html)
html = re.sub(r'<script src="([^"]+)"></script>', js_repl, html)

# Inline any <img src="./assets/…"> references injected by the app at runtime
# come from JS-string literals — those are picked up separately below when
# they appear literally in a .js file the builder already read.
html = re.sub(r'(<img[^>]*\ssrc=)"([^"]+)"', img_repl, html)

# JS/CSS files may reference ./assets/… inside string literals — inline those
# too so the standalone file has no local references left.
def js_img_repl(m):
    """`src="./assets/unify-logo.svg"` in a JS-string literal → data URI."""
    quote, href = m.group(1), m.group(2)
    if not href.startswith('./assets/'):
        return m.group(0)
    try:
        mime, _ = mimetypes.guess_type(strip_query(href))
        if not mime:
            mime = 'application/octet-stream'
        data = base64.b64encode(read_local_binary(href)).decode('ascii')
        return f'src={quote}data:{mime};base64,{data}{quote}'
    except FileNotFoundError:
        return m.group(0)


html = re.sub(r'src=(["\\\'])(\./assets/[^"\'\\\\]+)\1', js_img_repl, html)

os.makedirs(os.path.dirname(dst), exist_ok=True)
open(dst, 'w').write(html)

remaining = re.findall(r'(?:^|\s)(?:href|src)="(?!https?:|#|data:)([^"]+)"', html)
print(dst, len(html), 'bytes;', 'remaining local refs:', remaining or 'none')
