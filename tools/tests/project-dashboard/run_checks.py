#!/usr/bin/env python3
"""Run a checks script inside dist/project-dashboard.html in a given viewing context.

    python3 run_checks.py --ctx srcdoc --checks checks.js --w 1200 --h 700

ctx: http (served page) | file (file://) | sandbox (sandboxed <iframe src>) | srcdoc (sandboxed <iframe srcdoc>, how inline preview panes render it)
The checks script runs after the app script, may be async, and must call window.__report(obj).
Prints the reported JSON (plus any uncaught errors the page threw) to stdout.
Needs the dev server on :4187 (launch config "project-dashboard") for http/sandbox/srcdoc.
"""
import argparse, json, os, re, subprocess, sys, uuid, pathlib
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[2]   # tools/tests/project-dashboard -> repo root
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
ap = argparse.ArgumentParser()
ap.add_argument('--ctx', required=True, choices=['http', 'file', 'sandbox', 'srcdoc'])
ap.add_argument('--checks', required=True)
ap.add_argument('--w', type=int, default=1440); ap.add_argument('--h', type=int, default=900)
ap.add_argument('--query', default='', help='extra query string for the page, e.g. mode=light')
ap.add_argument('--budget', type=int, default=8000)
ap.add_argument('--mutate', action='append', help="'old=>new' text replacement applied to the page before loading")
a = ap.parse_args()
html = (ROOT / 'dist' / 'project-dashboard.html').read_text()
pre = ('<script>window.__errors=[];window.addEventListener("error",function(e){window.__errors.push(String(e.message))});'
       'window.__report=function(o){o.uncaughtErrors=window.__errors;var s=JSON.stringify(o);'
       'var p=document.getElementById("__results")||document.body.appendChild(Object.assign(document.createElement("pre"),{id:"__results"}));'
       'p.textContent=s;try{parent.postMessage("__RESULTS__"+s,"*")}catch(e){}};</script>')
html = html.replace('<head>', '<head>' + pre, 1)
checks = pathlib.Path(a.checks).read_text()
html = html.replace('</body>', '<script>\n' + checks + '\n</script>\n</body>', 1)
if a.mutate:   # optional: apply 'old=>new' replacements to the page (e.g. to re-create a past bug)
    for pair in a.mutate:
        old, new = pair.split('=>', 1); assert old in html, 'mutate target not found: ' + old; html = html.replace(old, new)
name = 'tmp_%s.html' % uuid.uuid4().hex[:8]
tmp = HERE / name
tmp.write_text(html)
tmp2 = HERE / ('srcdoc_' + name)
import html as H
tmp2.write_text('<!doctype html><meta charset="utf-8"><title>srcdoc runner</title>'
                '<style>html,body{margin:0;height:100%}iframe{border:0;width:100%;height:100%;display:block}</style>'
                '<iframe sandbox="allow-scripts" srcdoc="' + H.escape(html, quote=True) + '"></iframe><pre id="__results"></pre>'
                '<script>addEventListener("message",function(e){if(typeof e.data==="string"&&e.data.indexOf("__RESULTS__")===0)'
                'document.getElementById("__results").textContent=e.data.slice(11)});</script>')
base = 'http://localhost:4187/tools/tests/project-dashboard/'   # outside prototypes/ so verify.sh does not scan the harness pages
qs = ('?' + a.query) if a.query else ''
url = {'http': base + name + qs, 'file': tmp.as_uri() + qs,
       'sandbox': base + 'runner.html?mode=src&src=' + name + qs.replace('?', '%3F'),
       'srcdoc': base + tmp2.name}[a.ctx]
try:
    out = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
                          '--window-size=%d,%d' % (a.w, a.h), '--virtual-time-budget=%d' % a.budget, '--dump-dom', url],
                         capture_output=True, text=True, timeout=120).stdout
finally:
    tmp.unlink(missing_ok=True); tmp2.unlink(missing_ok=True)
m = list(re.finditer(r'<pre id="__results">(.*?)</pre>', out, re.S))
m = m[-1] if m else None
if not m or not m.group(1).strip():
    print(json.dumps({'ctx': a.ctx, 'error': 'no results reported (script never reached __report)'})); sys.exit(1)
import html as H
res = json.loads(H.unescape(m.group(1)))
res['ctx'] = a.ctx; res['viewport'] = [a.w, a.h]
print(json.dumps(res, indent=1))
# NOTE: in --ctx sandbox the frame is an out-of-process opaque-origin iframe; headless virtual time does not
# advance its timers, so checks run there must be synchronous (no setTimeout/await on timers).
