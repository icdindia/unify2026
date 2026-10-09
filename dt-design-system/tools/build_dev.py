"""Local harness: dev/tokens.css (mirrors what the Design System page compiles) + dev/index.html viewer."""
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
t = json.load(open(os.path.join(ROOT, 'project', 'tokens.json')))
os.makedirs(os.path.join(ROOT, 'dev'), exist_ok=True)

light = ['  --%s: %s;' % (c['name'], c['value']['light']) for c in t['color']['tokens']]
dark = ['  --%s: %s;' % (c['name'], c['value']['dark']) for c in t['color']['tokens'] if c['value']['dark'] != c['value']['light']]
other = []
for fam in ('spacing', 'radius', 'sizing', 'strokes', 'zIndex', 'viewport'):
    other += ['  --%s: %s;' % (x['name'], x['value']) for x in t[fam]['tokens']]
other += ['  --font-%s: %s;' % (k, v) for k, v in t['type']['families'].items()]
faces = ['@font-face { font-family: "%s"; src: url("../project/%s") format("woff2"); font-weight: %s; font-style: %s; font-display: swap; }'
         % (f['family'], f['file'], f['weight'], f['style']) for f in t['type']['fonts']]
css = '\n'.join(faces) + '\n:root, [data-theme="light"] {\n' + '\n'.join(light) + '\n}\n[data-theme="dark"] {\n' + '\n'.join(dark) + '\n}\n:root {\n' + '\n'.join(other) + '\n}\n'
open(os.path.join(ROOT, 'dev', 'tokens.css'), 'w').write(css)

comps = sorted(d for d in os.listdir(os.path.join(ROOT, 'project', 'components'))
               if os.path.exists(os.path.join(ROOT, 'project', 'components', d, 'preview.html')))
open(os.path.join(ROOT, 'dev', 'index.html'), 'w').write("""<!doctype html><html data-theme="light"><head><meta charset="utf-8">
<title>DT DS dev</title><link rel="stylesheet" href="tokens.css"><link rel="stylesheet" href="../project/components/bundle.css">
<style>body{margin:0;display:grid;grid-template-columns:220px 1fr;min-height:100vh}nav{padding:12px;border-right:1px solid var(--colours-basic-stroke-subtle);overflow:auto;height:100vh;position:sticky;top:0}
nav a{display:block;padding:4px 8px;color:var(--colours-basic-text);text-decoration:none;font:500 14px/1.4 var(--font-sans)}nav a:hover{background:var(--colours-interaction-states-hover-background-hover)}
#bar{display:flex;gap:8px;padding:8px 0 16px}#stage{min-width:0}</style></head><body><nav><div id="bar"><button onclick="document.documentElement.dataset.theme='light'">Light</button><button onclick="document.documentElement.dataset.theme='dark'">Dark</button></div>
%s</nav><main id="stage"></main><script>
async function show(c){const h=await (await fetch('../project/components/'+c+'/preview.html')).text();const s=document.getElementById('stage');s.innerHTML=h;
s.querySelectorAll('script').forEach(o=>{const n=document.createElement('script');n.textContent=o.textContent;o.replaceWith(n)});location.hash=c}
show(location.hash.slice(1)||%s)</script></body></html>""" % ('\n'.join('<a href="#%s" onclick="show(\'%s\');return false">%s</a>' % (c, c, c) for c in comps), json.dumps(comps[0] if comps else '')))
print('dev harness:', len(comps), 'previews')
