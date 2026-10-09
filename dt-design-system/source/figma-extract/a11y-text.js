/* Text colour → ODS + WCAG AA contrast fix. Runs per work unit (same interface as remap-utility.js):
   ARGS {unit, start, budget, dry}
   1. Every text fill (whole node or styled segment) is rebound to an ODS text token:
      Unify Colors/Text/* → mapped role; DT local vars kept; unbound solids → by luminance.
   2. Contrast is measured against the nearest opaque solid ancestor fill (resolved for the node's mode).
      If it fails AA (4.5, or 3 for large text), the next ODS text token that passes is used.
*/
const A = ARGS;
const G = globalThis.__a11y || (globalThis.__a11y = { local: null, cache: {} });
if (!G.local) { G.local = {}; for (const v of await figma.variables.getLocalVariablesAsync()) G.local[v.name] = v; }
const L = G.local;
const UNIFY_TEXT = {
  'text-primary (900)': 'basic/text', 'text-base-dark': 'basic/text', 'text-brand-primary (900)': 'basic/text',
  'text-secondary (700)': 'basic/text-recessive', 'text-tertiary (600)': 'basic/text-recessive', 'text-quaternary (500)': 'basic/text-recessive', 'text-placeholder': 'basic/text-recessive',
  'text-brand-secondary (700)': 'basic/text-dominant', 'text-brand-tertiary (600)': 'basic/text-link',
  'text-white': 'basic/text-on-accent', 'text-disabled': 'state/disabled-text-disabled',
  'text-error-primary (600)': 'functional/destructive-standard', 'text-error-secondary (500)': 'functional/destructive-standard',
  'text-success-primary (600)': 'functional/success-standard', 'text-success-secondary (500)': 'functional/success-standard',
  'text-warning-primary (600)': 'functional/warning-standard', 'text-warning-secondary (500)': 'functional/warning-standard',
};
const lin = c => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const lum = c => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const blend = (fg, a, bg) => ({ r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a) });
async function varInfo(id) { if (id in G.cache) return G.cache[id]; const v = await figma.variables.getVariableByIdAsync(id); G.cache[id] = v ? { v, name: v.name, remote: v.remote } : null; return G.cache[id]; }
async function resolve(paint, node) {
  const id = paint.boundVariables && paint.boundVariables.color && paint.boundVariables.color.id;
  if (id) { const i = await varInfo(id); if (i) { try { const r = i.v.resolveForConsumer(node); if (r && r.value && 'r' in r.value) return r.value; } catch (e) {} } }
  return paint.color;
}
async function solidOf(n) {
  if (!('fills' in n) || !Array.isArray(n.fills) || n.visible === false) return undefined;
  const vis = n.fills.filter(f => f.visible !== false && (f.opacity == null || f.opacity > 0));
  for (let k = vis.length - 1; k >= 0; k--) {
    const f = vis[k];
    if (f.type === 'IMAGE' || f.type.startsWith('GRADIENT')) return null; // unknown
    if (f.type === 'SOLID' && (f.opacity == null || f.opacity >= 0.95) && (n.opacity == null || n.opacity >= 0.95)) return await resolve(f, n);
  }
  return undefined; // transparent
}
async function bgFor(node) {
  const b = node.absoluteBoundingBox; const cx = b ? b.x + b.width / 2 : 0, cy = b ? b.y + b.height / 2 : 0;
  let cur = node, p = node.parent;
  while (p && p.type !== 'PAGE' && p.type !== 'DOCUMENT') {
    // siblings painted behind `cur` that cover the text centre (e.g. button Bg shapes)
    const kids = p.children; const idx = kids.indexOf(cur);
    for (let k = idx - 1; k >= 0; k--) {
      const s = kids[k]; if (s.visible === false || s.type === 'TEXT') continue;
      const sb = s.absoluteBoundingBox; if (!sb || cx < sb.x || cx > sb.x + sb.width || cy < sb.y || cy > sb.y + sb.height) continue;
      const c = await solidOf(s); if (c === null) return null; if (c) return c;
    }
    const own = await solidOf(p); if (own === null) return null; if (own) return own;
    cur = p; p = p.parent;
  }
  return { r: 1, g: 1, b: 1 }; // canvas default
}
const isAccent = c => { const mx = Math.max(c.r, c.g, c.b), mn = Math.min(c.r, c.g, c.b); if (mx - mn < 0.35) return false; let h; const d = mx - mn;
  if (mx === c.r) h = ((c.g - c.b) / d) % 6; else if (mx === c.g) h = (c.b - c.r) / d + 2; else h = (c.r - c.g) / d + 4; h *= 60; if (h < 0) h += 360; return h > 300 && h < 345 && lum(c) < 0.3; };
function roleOf(name) { // name of the current binding, or null
  if (!name) return null;
  const m = name.match(/Colors\/Text\/(.+)$/); if (m) return UNIFY_TEXT[m[1]] || 'basic/text';
  if (/^(basic|state|functional|brand|neutral|shades|accents|secondary)\//.test(name)) return name; // already DT/ODS
  if (/Utility|Colors\//.test(name)) return null;
  return null;
}
const isDisabled = n => /disabled/i.test(n) ;
const tp = (name, c) => figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: c || { r: 0, g: 0, b: 0 } }, 'color', L[name]);
const CANDIDATES = ['basic/text-recessive', 'basic/text', 'basic/text-on-accent'];
let checked = 0, rebound = 0, fixed = 0, unknownBg = 0, errors = 0; const fixes = {};
async function choose(seg, node, large, bg) {
  const p = seg.fills.find(f => f.visible !== false && f.type === 'SOLID'); if (!p) return null;
  const id = p.boundVariables && p.boundVariables.color && p.boundVariables.color.id; const info = id ? await varInfo(id) : null;
  let role = info ? roleOf(info.name) : null;
  if (!role) { // unbound or unmapped (e.g. secondary palette via Utility): choose by luminance
    const c = await resolve(p, node); role = lum(c) > 0.5 ? 'basic/text-on-accent' : (lum(c) > 0.12 ? 'basic/text-recessive' : 'basic/text');
    if (info && /secondary\/|functional\//.test(info.name)) role = info.name;
  }
  if (!L[role]) role = 'basic/text';
  if (isDisabled(role)) return { role, changed: !info || info.name !== role };
  const need = large ? 3 : 4.5; const alpha = (p.opacity == null ? 1 : p.opacity);
  const pass = async (r, withAlpha) => { const c = L[r].resolveForConsumer(node).value; const eff = withAlpha && alpha < 1 && bg ? blend(c, alpha, bg) : c; return !bg || ratio(eff, bg) >= need; };
  let finalRole = role;
  if (bg && isAccent(bg) && role !== 'basic/text-on-accent' && /^(basic\/text|brand\/white|brand\/black)/.test(role) && await pass('basic/text-on-accent', false)) { fixes['accent ' + role + ' → basic/text-on-accent'] = (fixes['accent ' + role + ' → basic/text-on-accent'] || 0) + 1; return { role: 'basic/text-on-accent', changed: true, contrastFix: true }; }
  if (bg && !(await pass(role, true))) {
    if (await pass(role, false)) { fixes['opacity removed ' + role] = (fixes['opacity removed ' + role] || 0) + 1; return { role, changed: true, contrastFix: true }; }
    finalRole = null;
    const order = role === 'basic/text-on-accent' ? ['basic/text-on-accent', 'basic/text'] : CANDIDATES;
    for (const r of order) if (r !== role && await pass(r, false)) { finalRole = r; break; }
    if (!finalRole) { // nothing passes on this background: take the best available and record it
      let best = null, br = 0; for (const r of ['basic/text', 'basic/text-on-accent']) { const cc = L[r].resolveForConsumer(node).value; const q = ratio(cc, bg); if (q > br) { br = q; best = r; } }
      finalRole = best; G.samples = G.samples || []; if (G.samples.length < 400) G.samples.push({ id: node.id, name: node.name, text: node.characters.slice(0, 30), bg: '#' + [bg.r, bg.g, bg.b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join(''), best: br.toFixed(2) });
      fixes['UNRESOLVED ' + role] = (fixes['UNRESOLVED ' + role] || 0) + 1; }
    fixes[role + ' → ' + finalRole] = (fixes[role + ' → ' + finalRole] || 0) + 1;
  }
  return { role: finalRole, changed: !info || info.name !== finalRole || alpha < 1, contrastFix: finalRole !== role };
}
const roots = []; if (A.unit.self) roots.push({ n: A.unit.self, deep: false }); else roots.push({ n: A.unit.node, deep: true });
function* walk(n, deep) { yield n; if (deep && 'children' in n) for (const c of n.children) if (c.visible !== false) yield* walk(c, true); }
const deadline = Date.now() + (A.budget || 12000);
const writes = A.defer ? (G.pending = G.pending || []) : [];
const w0 = writes.length;
let i = -1, done = true; const startAt = A.start || 0;
outer: for (const r of roots) for (const n of walk(r.n, r.deep)) {
  i++; if (i < startAt) continue;
  if (Date.now() > deadline) { done = false; break outer; }
  if (n.type !== 'TEXT' || n.visible === false || !n.characters.length) continue;
  try {
    checked++;
    const bg = await bgFor(n); if (!bg) unknownBg++;
    const segs = n.getStyledTextSegments(['fills', 'fontSize', 'fontWeight']);
    for (const s of segs) {
      const large = s.fontSize >= 24 || (s.fontSize >= 18.66 && s.fontWeight >= 700);
      const c = await choose(s, n, large, bg); if (!c || !c.changed) continue;
      if (c.contrastFix) fixed++; else rebound++;
      if (!A.dry) {
        const base = L[c.role].resolveForConsumer(n).value;
        writes.push({ n, whole: segs.length === 1, s: s.start, e: s.end, paint: tp(c.role, base), fonts: n.getRangeAllFontNames(s.start, s.end) });
      }
    }
  } catch (e) { errors++; }
}
// phase 2: all writes together (no reads in between, so Figma does not re-layout per node)
if (A.defer) return { writes: writes.length - w0, next: done ? null : i, checked, rebound, fixed, unknownBg, errors, fixes };
const loaded = new Set();
for (const w of writes) for (const f of w.fonts) { const k = f.family + '|' + f.style; if (!loaded.has(k)) { loaded.add(k); try { await figma.loadFontAsync(f); } catch (e) {} } }
for (const w of writes) { try { if (w.whole) w.n.fills = [w.paint]; else w.n.setRangeFills(w.s, w.e, [w.paint]); } catch (e) { errors++; } }
return { writes: writes.length, next: done ? null : i, checked, rebound, fixed, unknownBg, errors, fixes };
