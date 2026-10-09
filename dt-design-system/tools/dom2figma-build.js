/* DOM → Figma builder (runs inside the Figma Desktop Bridge plugin).
   Loaded with: new Function('figma','ARGS', code)(figma, {names:[...], x, y, maxW, sectionId, base})
   For each component name it fetches <base>/<name>.json (written by dom2figma-extract.js) and builds a
   component set "DT/<Group>/<Name>" with one variant per story. Every colour that matched a DT light token
   is bound to the "DT Foundations" variable; text uses the DT/… TeleNeo text styles where size/weight/line-height match.
   Returns {built:[{name,id,w,h}], rawColours, nodes}.
*/
const A = ARGS;
const V = {}; for (const v of await figma.variables.getLocalVariablesAsync()) V[v.name] = v;
const TS = await figma.getLocalTextStylesAsync();
const WEIGHT = w => (w >= 900 ? 'Ultra' : w >= 800 ? 'ExtraBold' : w >= 600 ? 'Bold' : w >= 500 ? 'Medium' : w >= 350 ? 'Regular' : 'Thin');
for (const st of ['Thin', 'Regular', 'Medium', 'Bold', 'ExtraBold', 'Ultra']) await figma.loadFontAsync({ family: 'TeleNeo Var', style: st });

function varName(tok) {
  if (tok.startsWith('dt-')) return 'brand/' + tok.slice(3);
  let n = tok.replace(/^colours-/, '');
  n = n.replace('shades-accent-shades-', 'shades/').replace('shades-secondary-accent-shades-', 'shades/').replace('shades-neutral-shades-', 'neutral/')
       .replace('shades-accents-', 'accents/').replace('interaction-states-', 'state/').replace('functional-', 'functional/').replace('basic-', 'basic/');
  return n;
}
let raw = 0, nodes = 0;
function paint(c) {
  if (!c) return null;
  if (c.k) {
    const v = V[varName(c.k)];
    if (v) return figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', v);
  }
  raw++;
  const h = (c.h || '#000000').slice(1);
  return { type: 'SOLID', color: { r: parseInt(h.slice(0, 2), 16) / 255, g: parseInt(h.slice(2, 4), 16) / 255, b: parseInt(h.slice(4, 6), 16) / 255 }, opacity: c.a === undefined ? 1 : c.a };
}
function textStyleFor(n) {
  return TS.find(s => s.fontSize === n.fs && s.fontName.style === WEIGHT(n.fw) &&
    (n.lh == null || Math.abs((s.lineHeight.unit === 'PERCENT' ? s.lineHeight.value * s.fontSize / 100 : s.lineHeight.value) - n.lh) < 0.6));
}
async function build(n, parent) {
  nodes++;
  if (n.t === 'x') {
    const t = figma.createText();
    const st = textStyleFor(n);
    if (st) await t.setTextStyleIdAsync(st.id);
    else { t.fontName = { family: 'TeleNeo Var', style: WEIGHT(n.fw) }; t.fontSize = n.fs; if (n.lh) t.lineHeight = { unit: 'PIXELS', value: n.lh }; }
    t.characters = n.text;
    if (n.ls) t.letterSpacing = { unit: 'PIXELS', value: n.ls };
    if (n.up) t.textCase = 'UPPER';
    if (n.ul) t.textDecoration = 'UNDERLINE';
    const p = paint(n.c); if (p) t.fills = [p];
    t.textAlignHorizontal = n.al === 'center' ? 'CENTER' : n.al === 'right' || n.al === 'end' ? 'RIGHT' : 'LEFT';
    parent.appendChild(t);
    if (n.wrap) { t.textAutoResize = 'HEIGHT'; t.resize(Math.max(1, n.w + 1), t.height); } else t.textAutoResize = 'WIDTH_AND_HEIGHT';
    t.x = n.x; t.y = n.y + Math.max(0, (n.h - t.height) / 2);
    t.name = n.text.slice(0, 40);
    return;
  }
  if (n.t === 'v') {
    let s;
    try { s = figma.createNodeFromSvg(n.svg); } catch (e) { return; }
    s.name = 'Icon'; parent.appendChild(s); s.resize(Math.max(1, n.w), Math.max(1, n.h)); s.x = n.x; s.y = n.y;
    const p = paint(n.c);
    if (p) s.findAll(v => 'fills' in v && Array.isArray(v.fills) && v.fills.length && v.fills[0].type === 'SOLID' &&
      v.fills[0].color.r === 0 && v.fills[0].color.g === 0 && v.fills[0].color.b === 0).forEach(v => { v.fills = [p]; });
    s.fills = [];
    return;
  }
  const f = figma.createFrame();
  f.name = n.name || (n.t === 'i' ? 'Image' : 'Frame');
  parent.appendChild(f);
  f.resize(Math.max(0.01, n.w), Math.max(0.01, n.h)); f.x = n.x; f.y = n.y;
  const img = src => { const im = figma.createImage(figma.base64Decode(src.split(',', 2)[1])); return { type: 'IMAGE', imageHash: im.hash, scaleMode: 'FILL' }; };
  if (n.t === 'i') {
    if (n.src) { f.name = 'Chart image'; f.fills = [img(n.src)]; return; }
    f.fills = [paint({ k: 'colours-shades-neutral-shades-200' })]; f.cornerRadius = 8; return;
  }
  const fp = paint(n.fill); f.fills = (fp ? [fp] : []).concat(n.bgi ? [img(n.bgi)] : []);
  if (n.sw && n.sw.some(w => w > 0)) {
    const sp = paint(n.sc); if (sp) {
      f.strokes = [sp]; f.strokeAlign = 'INSIDE';
      if (n.sw.every(w => w === n.sw[0])) f.strokeWeight = n.sw[0];
      else { f.strokeTopWeight = n.sw[0]; f.strokeRightWeight = n.sw[1]; f.strokeBottomWeight = n.sw[2]; f.strokeLeftWeight = n.sw[3]; }
    }
  }
  if (n.r) { const cap = Math.min(n.w, n.h) / 2; [f.topLeftRadius, f.topRightRadius, f.bottomRightRadius, f.bottomLeftRadius] = n.r.map(r => Math.min(r, cap)); }
  f.clipsContent = !!n.clip;
  if (n.op !== undefined) f.opacity = n.op;
  for (const k of n.kids || []) await build(k, f);
}

const idx = A.index || {};
const built = [];
let cx = A.x, cy = A.y, rowH = 0;
const section = await figma.getNodeByIdAsync(A.sectionId);
for (const name of A.names) {
  const res = await fetch(A.base + '/' + name + '.json'); if (!res.ok) continue;
  const d = await res.json();
  const comps = [];
  for (const s of d.s) {
    if (!s.w || !s.h) continue;
    const c = figma.createComponent();
    c.name = 'Story=' + s.label.replace(/[=,]/g, ' ').slice(0, 60);
    c.resize(Math.max(1, s.w), Math.max(1, s.h)); c.fills = []; c.clipsContent = false;
    for (const k of s.tree) await build(k, c);
    comps.push(c);
  }
  if (!comps.length) continue;
  const set = figma.combineAsVariants(comps, section);
  set.name = 'DT/' + (idx[name] || 'Components') + '/' + name;
  set.layoutMode = 'VERTICAL'; set.itemSpacing = 24; set.paddingLeft = set.paddingRight = set.paddingTop = set.paddingBottom = 24;
  set.primaryAxisSizingMode = 'AUTO'; set.counterAxisSizingMode = 'AUTO'; set.cornerRadius = 16;
  set.fills = [paint({ k: 'colours-basic-background' })];
  set.strokes = [paint({ k: 'colours-shades-neutral-shades-200' })]; set.strokeWeight = 1;
  set.description = 'ODS ' + name + ' — converted from the rendered ODS Storybook markup (DT design system preview). Colours bound to DT Foundations, text in TeleNeo. Static geometry: variants are the Storybook stories.';
  if (cx + set.width > A.x + A.maxW && cx > A.x) { cx = A.x; cy += rowH + 48; rowH = 0; }
  set.x = cx; set.y = cy; cx += set.width + 48; rowH = Math.max(rowH, set.height);
  built.push({ name, id: set.id, w: Math.round(set.width), h: Math.round(set.height) });
}
return { built, rawColours: raw, nodes, nextY: cy + rowH + 48 };
