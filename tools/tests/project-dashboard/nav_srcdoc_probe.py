#!/usr/bin/env python3
"""nav_ probe: does clicking a nav <a href="#"> (no data-nav) inside a sandboxed srcdoc preview navigate the
whole preview frame away? Counts the iframe's load events from the parent and reads the iframe's location
after the click (via postMessage from the inner page before / pagehide).
    python3 nav_srcdoc_probe.py [--pick '#nav-dark .nagent'] [--w 1200 --h 700]
"""
import argparse, json, pathlib, re, subprocess, uuid, html as H
HERE = pathlib.Path(__file__).resolve().parent; ROOT = HERE.parents[2]
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
ap = argparse.ArgumentParser(); ap.add_argument('--pick', default='#nav-dark .nagent'); ap.add_argument('--w', type=int, default=1200); ap.add_argument('--h', type=int, default=700)
a = ap.parse_args()
page = (ROOT / 'dist' / 'project-dashboard.html').read_text()
inner = ('<script>document.addEventListener("DOMContentLoaded",function(){})</script>')
probe = ('<script>(function(){var d=document;'
         'function go(){d.querySelector(".pcard").click();var el=d.querySelector(%s);'
         'parent.postMessage("P:before "+JSON.stringify({dash:!d.querySelector("#view-dashboard").hidden,href:el.href||null}),"*");'
         'addEventListener("pagehide",function(){parent.postMessage("P:pagehide","*")});'
         'el.click();parent.postMessage("P:afterclick "+JSON.stringify({dash:!d.querySelector("#view-dashboard").hidden}),"*");}'
         'addEventListener("load",function(){parent.postMessage("P:inner-load","*");go()});})();</script>') % json.dumps(a.pick)
page = page.replace('</body>', probe + '</body>', 1)
name = 'nav_probe_%s.html' % uuid.uuid4().hex[:8]
tmp = HERE / name
tmp.write_text('<!doctype html><meta charset="utf-8"><title>probe</title><pre id="log"></pre>'
               '<script>if(window===top){var log=document.getElementById("log"),loads=0;'
               'function w(s){log.textContent+=s+"\\n"}'
               'addEventListener("message",function(e){if(typeof e.data==="string"&&e.data.indexOf("P:")===0)w(e.data)});'
               'var f=document.createElement("iframe");f.setAttribute("sandbox","allow-scripts");f.style.cssText="width:100%;height:600px;border:0";'
               'f.addEventListener("load",function(){loads++;w("iframe load #"+loads)});'
               'document.body.appendChild(f);f.srcdoc=' + json.dumps(page).replace('</', '<\\/') + ';}'
               'else{document.title="RELOADED-INSIDE-FRAME"}</script>')
url = 'http://localhost:4187/prototypes/project-dashboard/_test/' + name
try:
    out = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=%d,%d' % (a.w, a.h),
                          '--virtual-time-budget=15000', '--dump-dom', url], capture_output=True, text=True, timeout=120).stdout
finally:
    tmp.unlink(missing_ok=True)
m = re.search(r'<pre id="log">(.*?)</pre>', out, re.S)
print(H.unescape(m.group(1)) if m else out[:2000])
