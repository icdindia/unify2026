"""ODS icon set (@telekom-ods/react-icons, 375 icons x 4 variants) from source/icons/*.json.

Outputs:
  icons/<variant>/<name>.svg               one file per icon (repo use; ink = currentColor)
  project/assets/Icons/ods-icons-<variant>.svg  sprite per variant (<symbol id="ods-<name>">)
  project/assets/Icons/icons.json          {variant: {category: [name]}} + path data
  project/components/Icons/preview.html    gallery card with Selected / Small switches
"""
import json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'source', 'icons')
VARIANTS = {'default': ('outline', 24), 'selected': ('selected', 24), 'small': ('small', 16), 'selected-small': ('small-selected', 16)}

data = {}
for v in VARIANTS:
    data[v] = json.load(open(os.path.join(SRC, v + '.json')))['cats']

cats = list(data['default'].keys())
assets = os.path.join(ROOT, 'project', 'assets', 'Icons')
os.makedirs(assets, exist_ok=True)
index = {'package': '@telekom-ods/react-icons', 'categories': {c: [i['name'] for i in data['default'][c]] for c in cats}, 'variants': {}}

for v, (label, px) in VARIANTS.items():
    d = os.path.join(ROOT, 'icons', label)
    os.makedirs(d, exist_ok=True)
    symbols, paths = [], {}
    for c in cats:
        for i in data[v][c]:
            inner = i['inner'].strip()
            open(os.path.join(d, i['name'] + '.svg'), 'w').write(
                '<svg xmlns="http://www.w3.org/2000/svg" width="%s" height="%s" viewBox="%s" fill="none">%s</svg>\n' % (px, px, i['vb'], inner))
            symbols.append('<symbol id="ods-%s" viewBox="%s">%s</symbol>' % (i['name'], i['vb'], inner))
            paths[i['name']] = inner
    open(os.path.join(assets, 'ods-icons-%s.svg' % label), 'w').write(
        '<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n%s\n</svg>\n' % '\n'.join(symbols))
    index['variants'][label] = {'size': px, 'svg': paths}

open(os.path.join(assets, 'icons.json'), 'w').write(json.dumps(index, separators=(',', ':')))

# ---- gallery card (inline, self-contained: reads the default + selected path data embedded below) ----
emb = {lab: index['variants'][lab]['svg'] for lab in ('outline', 'selected', 'small', 'small-selected')}
card = """<!-- @dsCard group="Foundations" height=900 subtitle="@telekom-ods/react-icons · 375 icons" -->
<style>
  .ig { font-family: var(--font-sans); color: var(--colours-basic-text); background: var(--colours-basic-background); padding: 16px; }
  .ig-bar { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; margin-bottom: 16px; }
  .ig-bar input[type=search] { font: 500 1rem/1.25 var(--font-sans); padding: 10px 14px; border-radius: var(--radius-small); border: var(--strokes-1) solid var(--colours-basic-stroke-subtle); background: var(--colours-basic-background); color: var(--colours-basic-text); min-width: 0; flex: 1 1 200px; }
  .ig-bar label { display: inline-flex; gap: 8px; align-items: center; font: 500 0.875rem/1.25 var(--font-sans); }
  .ig h3 { font: 700 1rem/1.25 var(--font-sans); margin: 20px 0 8px; display: flex; gap: 8px; align-items: baseline; }
  .ig h3 span { font-weight: 500; color: var(--colours-basic-text-recessive); font-size: 0.875rem; }
  .ig-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 4px; }
  .ig-card { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 12px 4px; border-radius: var(--radius-small); border: 0; background: none; color: inherit; cursor: pointer; font: 500 0.75rem/1.3 var(--font-sans); text-align: center; overflow-wrap: anywhere; }
  .ig-card:hover { background: var(--colours-interaction-states-hover-background-hover); }
  .ig-card:focus-visible { outline: var(--strokes-2) solid var(--colours-interaction-states-focus-focus); outline-offset: 2px; }
  .ig-card svg { color: var(--colours-basic-text); }
  .ig-copied { color: var(--colours-basic-text-recessive); font: 500 0.75rem/1.3 var(--font-sans); min-height: 1em; }
</style>
<div class="ig">
  <div class="ig-bar">
    <input type="search" id="ig-q" placeholder="Filter by name" aria-label="Filter icons by name">
    <label><input type="checkbox" id="ig-sel"> Selected</label>
    <label><input type="checkbox" id="ig-small"> Small (16px)</label>
    <span class="ig-copied" id="ig-msg" aria-live="polite"></span>
  </div>
  <div id="ig-out"></div>
</div>
<script>
var CATS = %s, P = null;
function load(urls) {
  var u = urls.shift();
  return fetch(u).then(function (r) { if (!r.ok) throw 0; return r.json(); }).catch(function () { if (urls.length) return load(urls); throw 0; });
}
function draw() {
  if (!P) return;
  var q = document.getElementById('ig-q').value.trim().toLowerCase();
  var sel = document.getElementById('ig-sel').checked, sm = document.getElementById('ig-small').checked;
  var v = sm ? (sel ? 'small-selected' : 'small') : (sel ? 'selected' : 'outline'), px = sm ? 16 : 24;
  var h = '';
  Object.keys(CATS).forEach(function (c) {
    var names = CATS[c].filter(function (n) { return !q || n.indexOf(q) > -1; });
    if (!names.length) return;
    h += '<h3>' + c + ' <span>' + names.length + '</span></h3><div class="ig-grid">' + names.map(function (n) {
      return '<button type="button" class="ig-card" data-n="' + n + '"><svg width="' + px + '" height="' + px + '" viewBox="0 0 ' + px + ' ' + px + '" aria-hidden="true">' + P[v][n] + '</svg>' + n + '</button>';
    }).join('') + '</div>';
  });
  document.getElementById('ig-out').innerHTML = h || '<p>No icon matches “' + q + '”.</p>';
}
['ig-q', 'ig-sel', 'ig-small'].forEach(function (id) { document.getElementById(id).addEventListener('input', draw); });
document.getElementById('ig-out').addEventListener('click', function (e) {
  var b = e.target.closest('.ig-card'); if (!b) return;
  var name = 'ODS' + b.dataset.n.split('_').map(function (s) { return s.charAt(0).toUpperCase() + s.slice(1); }).join('');
  var msg = document.getElementById('ig-msg');
  var done = function () { msg.textContent = 'Copied ' + name; };
  try { navigator.clipboard.writeText(name).then(done, function () { msg.textContent = name; }); } catch (err) { msg.textContent = name; }
});
load(['../../assets/Icons/icons.json', '../project/assets/Icons/icons.json']).then(function (j) {
  P = {}; Object.keys(j.variants).forEach(function (k) { P[k] = j.variants[k].svg; }); draw();
}, function () { document.getElementById('ig-out').textContent = 'Icon data (assets/Icons/icons.json) could not be loaded.'; });
</script>
""" % json.dumps(index['categories'])
d = os.path.join(ROOT, 'project', 'components', 'Icons')
os.makedirs(d, exist_ok=True)
open(os.path.join(d, 'preview.html'), 'w').write(card)
print('icons: %d per variant; card %d KB' % (sum(len(x) for x in index['categories'].values()), len(card) // 1024))
