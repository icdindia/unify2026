/* Replace every remaining Unify colour with ODS / DT Foundations. Unit interface: ARGS {unit, start, budget, dry, defer}
   1. Remote variable bindings → DT variable by semantic rules (Background/Border/Foreground/Icon/Text/Palette/Component/…),
      otherwise nearest DT colour by value.
   2. Raw (unbound) near-neutral solids → nearest DT neutral/basic token. Saturated raw colours (logos, images) are kept.
   Writes are deferred (G.pending) and flushed by remap-driver.js.
*/
const A = ARGS;
const G = globalThis.__map || (globalThis.__map = { init: false });
if (!G.init) {
  G.L = {}; for (const v of await figma.variables.getLocalVariablesAsync()) G.L[v.name] = v;
  const col = (await figma.variables.getLocalVariableCollectionsAsync()).find(c => c.name === 'DT Foundations');
  G.lightMode = col.modes.find(m => m.name === 'Light').modeId;
  G.val = n => { let v = G.L[n] && G.L[n].valuesByMode[G.lightMode]; return v && 'r' in v ? v : null; };
  G.vc = {}; G.stats = {}; G.unknown = {}; G.pending = []; G.init = true;
}
const L = G.L;
const lin = c => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const lum = c => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
const sat = c => { const mx = Math.max(c.r, c.g, c.b), mn = Math.min(c.r, c.g, c.b); return mx === 0 ? 0 : (mx - mn) / mx; };
const dist = (a, b) => Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b);
const NEUTRALS = ['brand/white', 'neutral/50', 'neutral/100', 'neutral/200', 'neutral/300', 'neutral/400', 'neutral/500', 'neutral/600', 'neutral/700', 'neutral/800', 'neutral/900', 'brand/black'];
const PALETTE_NEAREST = NEUTRALS.concat(Object.keys(L).filter(n => /^secondary\//.test(n)), ['basic/accent', 'functional/destructive-standard', 'functional/destructive-subtle', 'functional/success-standard', 'functional/success-subtle', 'functional/warning-standard', 'functional/warning-subtle', 'functional/informational-standard', 'functional/informational-subtle']);
function nearest(c, list) { let best = null, bd = 9; for (const n of list) { const v = G.val(n); if (!v) continue; const d = dist(c, v); if (d < bd) { bd = d; best = n; } } return best; }
const FAM = { 'Brand': 'magenta', 'Magenta': 'magenta', 'Mulberry': 'magenta', 'Terracotta': 'aperitif', 'Rose': 'aperitif', 'Error': 'aperitif', 'Orange': 'basketball', 'Orange dark': 'basketball', 'Warning': 'cheddar', 'Yellow': 'dandelion',
  'Brand Tertiary': 'dandelion', 'Lime': 'guacamole', 'Green': 'hummingbird', 'Success': 'hummingbird', 'Jade green': 'iguana', 'Harbor Teal': 'jacuzzi', 'Teal': 'kingfisher', 'Cyan': 'kingfisher', 'Blue light': 'lagoon', 'Warm Blue': 'lagoon', 'Blue': 'macaw',
  'Steel Blue': 'macaw', 'Pigeon Blue': 'nebula', 'Indigo': 'nebula', 'Violet': 'orchid', 'Purple': 'orchid', 'Royal violet': 'orchid', 'Plum': 'orchid', 'Pink': 'magenta', 'Fuchsia': 'magenta', 'Red': 'aperitif', 'Brand Secondary': 'neutral' };
const STEP = { 25: 'subtle', 50: 'subtle', 100: 'subtle', 200: 'extra-dominant', 300: 'dominant', 400: 'base-subtle', 500: 'base', 600: 'recessive', 700: 'extra-recessive', 800: 'extra-recessive', 900: 'extra-recessive', 950: 'extra-recessive' };
const NSTEP = s => (s <= 50 ? 50 : s >= 900 ? 900 : Math.round(s / 100) * 100);
function semantic(name, kind) {
  let n = name; const s = n.toLowerCase();
  const status = s.match(/(error|success|warning)/); const st = status ? { error: 'destructive', success: 'success', warning: 'warning' }[status[1]] : null;
  // Background
  let m = n.match(/Colors\/Background\/(.+)$/);
  if (m) { const k = m[1];
    if (st) return /solid/.test(k) ? `functional/${st}-standard` : `functional/${st}-subtle`;
    if (/disabled/.test(k)) return 'state/disabled-background-disabled';
    if (/brand-solid_hover/.test(k)) return 'state/hover-accent-hover';
    if (/brand-solid/.test(k)) return 'basic/accent';
    if (/brand.*_hover/.test(k)) return 'state/hover-accent-subtle-hover';
    if (/brand/.test(k)) return 'accents/accent-subtle';
    if (/base-dark|solid/.test(k)) return 'basic/accent-secondary';
    if (/_hover/.test(k)) return /primary|white/.test(k) ? 'state/hover-background-hover' : 'state/hover-background-subtle-hover';
    if (/secondary|tertiary|quaternary/.test(k)) return 'basic/background-subtle';
    return 'basic/background'; }
  m = n.match(/Colors\/Border\/(.+)$/);
  if (m) { const k = m[1];
    if (st) return `functional/${st}-standard`;
    if (/disabled/.test(k)) return 'state/disabled-stroke-disabled';
    if (/brand/.test(k)) return 'basic/accent';
    if (/white/.test(k)) return 'brand/white';
    if (/base-dark/.test(k)) return 'basic/stroke';
    if (/primary/.test(k)) return 'basic/stroke-subtle';
    return 'neutral/200'; }
  m = n.match(/Colors\/(Foreground|Icon|Text)\/(.+)$/);
  if (m) { const k = m[2];
    if (st) return `functional/${st}-standard`;
    if (/disabled/.test(k)) return 'state/disabled-text-disabled';
    if (/white/.test(k)) return 'basic/text-on-accent';
    if (/_hover/.test(k)) return 'state/hover-text-hover';
    if (/brand/.test(k)) return m[1] === 'Text' ? 'basic/text-dominant' : 'basic/accent';
    if (/placeholder|secondary|tertiary|quaternary/.test(k)) return 'basic/text-recessive';
    return 'basic/text'; }
  if (/Nav Bar\/navbar-bg/.test(n)) return 'brand/magenta';
  if (/Nav Bar\/navbar-border/.test(n)) return 'brand/magenta-dominant';
  m = n.match(/Component\/(Buttons|Link)\/(.+)$/);
  if (m) { const k = m[2];
    if (/disabled/.test(k)) return /bg/.test(k) ? 'state/disabled-background-disabled' : (/border/.test(k) ? 'state/disabled-stroke-disabled' : 'state/disabled-text-disabled');
    if (m[1] === 'Link') return /error/i.test(k) ? 'functional/destructive-standard' : (/hover/.test(k) ? 'state/hover-text-link-hover' : 'basic/text-link');
    if (/Error/.test(k)) return /fg/.test(k) ? 'basic/text-on-accent' : 'functional/destructive-standard';
    const brandPrimary = /Brand\/Primary/.test(k), neutralPrimary = /Neutral\/Primary/.test(k);
    if (/-bg/.test(k)) return brandPrimary ? (/hover/.test(k) ? 'state/hover-accent-hover' : 'basic/accent') : neutralPrimary ? (/hover/.test(k) ? 'state/hover-accent-secondary-hover' : 'basic/accent-secondary') : (/hover/.test(k) ? 'state/hover-background-hover' : 'basic/background');
    if (/-fg/.test(k)) return brandPrimary ? 'basic/text-on-accent' : neutralPrimary ? 'basic/text-on-accent-secondary' : 'basic/text';
    if (/border/.test(k)) return brandPrimary ? 'basic/accent' : neutralPrimary ? 'basic/accent-secondary' : 'basic/stroke';
    return null; }
  m = n.match(/(?:^|\/)Palette\/(?:Gray[^/]*|Grey[^/]*)\/(\d+)$/) || n.match(/Browsers\/Chorme\/Neutral (\d+)$/);
  if (m) return 'neutral/' + NSTEP(+m[1]);
  if (/(Palette\/Base\/white|Neutrals White|\/White$)/i.test(n) && !/alpha/i.test(n)) return 'brand/white';
  if (/(Palette\/Base\/black|Neutrals Black)/i.test(n) && !/alpha/i.test(n)) return 'brand/black';
  m = n.match(/Palette\/([^/]+)\/(\d+)$/);
  if (m && /^Brand$/.test(m[1])) { const st = +m[2]; return 'palette/magenta/' + (st <= 200 ? 'subtle' : st === 300 ? 'extra-dominant' : st === 400 ? 'dominant' : st === 500 ? 'base-subtle' : st === 600 ? 'base' : st === 700 ? 'recessive' : 'extra-recessive'); }
  if (m && FAM[m[1].replace(/ \(.*\)$/, '')]) { const hue = FAM[m[1].replace(/ \(.*\)$/, '')]; return hue === 'neutral' ? 'neutral/' + NSTEP(+m[2]) : `palette/${hue}/${STEP[+m[2]] || 'base'}`; }
  if (/alpha-black|Alpha Colors\/Black/i.test(n)) return 'brand/black*';
  if (/alpha-white|Alpha Colors\/White/i.test(n)) return 'brand/white*';
  return null; // unknown → nearest by value
}
async function resolveRemote(v, node) { try { const r = v.resolveForConsumer(node); if (r && r.value && 'r' in r.value) return r.value; } catch (e) {} return null; }
async function targetFor(id, kind, node) {
  const key = id + '|' + kind;
  if (key in G.vc) return G.vc[key];
  const v = await figma.variables.getVariableByIdAsync(id);
  let t = null;
  if (v && v.remote && v.resolvedType === 'COLOR') {
    let name = semantic(v.name, kind);
    let alpha = null;
    if (name && name.endsWith('*')) { name = name.slice(0, -1); const c = await resolveRemote(v, node); alpha = c && c.a != null ? c.a : null; }
    if (!name || !L[name]) { const c = await resolveRemote(v, node); if (c) { name = nearest(c, PALETTE_NEAREST); alpha = c.a != null && c.a < 0.99 ? c.a : null; G.unknown[v.name] = name; } }
    if (name && L[name]) t = { v: L[name], alpha, from: v.name };
  }
  G.vc[key] = t; return t;
}
function rawTarget(p, kind) {
  const c = p.color; if (!c || sat(c) > 0.2) return null;          // keep saturated (logos, illustrations)
  if (kind === 'text') return null;                                  // text handled by the a11y pass
  const n = nearest(c, NEUTRALS); if (!n) return null;
  if (kind === 'fill' && (n === 'brand/white')) return 'basic/background';
  return n;
}
async function remap(arr, kind, node) {
  if (!Array.isArray(arr)) return null; let ch = false; const out = [];
  for (const p of arr) {
    const id = p.boundVariables && p.boundVariables.color && p.boundVariables.color.id;
    if (p.type === 'SOLID' && id) {
      const t = await targetFor(id, kind, node);
      if (t) { let np = figma.variables.setBoundVariableForPaint(p, 'color', t.v); if (t.alpha != null) np = Object.assign({}, np, { opacity: (p.opacity == null ? 1 : p.opacity) * t.alpha }); out.push(np); ch = true; G.stats[t.from + ' → ' + t.v.name] = (G.stats[t.from + ' → ' + t.v.name] || 0) + 1; continue; }
    } else if (p.type === 'SOLID' && !id && p.visible !== false) {
      const n = rawTarget(p, kind);
      if (n && L[n]) { out.push(figma.variables.setBoundVariableForPaint(p, 'color', L[n])); ch = true; G.stats['raw → ' + n] = (G.stats['raw → ' + n] || 0) + 1; continue; }
    }
    out.push(p);
  }
  return ch ? out : null;
}
const root = A.unit.self || A.unit.node; const deep = !A.unit.self;
const deadline = Date.now() + (A.budget || 12000);
let i = -1, done = true, count = 0; const startAt = A.start || 0; const stack = [root];
async function processNode(n) {
  const w = { n };
  if ('fills' in n && n.fills !== figma.mixed && !(n.type === 'TEXT')) { const r = await remap(n.fills, /^(VECTOR|BOOLEAN_OPERATION|LINE|STAR|POLYGON)$/.test(n.type) ? 'icon' : 'fill', n); if (r) w.fills = r; }
  if ('strokes' in n && n.strokes.length) { const r = await remap(n.strokes, 'stroke', n); if (r) w.strokes = r; }
  if ('effects' in n && n.effects.length) { let ch = false; const eff = [];
    for (const e of n.effects) { const id = e.boundVariables && e.boundVariables.color && e.boundVariables.color.id; const t = id && await targetFor(id, 'effect', n);
      if (t) { ch = true; const v = await figma.variables.getVariableByIdAsync(id); const c = await resolveRemote(v, n) || e.color; const ne = Object.assign({}, e, { color: { r: c.r, g: c.g, b: c.b, a: c.a == null ? e.color.a : c.a } }); delete ne.boundVariables; eff.push(ne); } else eff.push(e); }
    if (ch) w.effects = eff; }
  if (w.fills || w.strokes || w.effects) { count++; if (!A.dry) G.pending.push(w); }
}
while (stack.length) {
  const n = stack.pop(); i++;
  let localInstance = false;
  let mainNode = null;
  if (n.type === 'INSTANCE' && deep && !n.id.startsWith('I')) { try { mainNode = await n.getMainComponentAsync(); } catch (e) {} localInstance = !!(mainNode && !mainNode.remote); }
  if (i >= startAt) {
    if (Date.now() > deadline) { done = false; break; }
    try {
      if (!A.mainsOnly) await processNode(n);
      if (localInstance && !(G.doneMains = G.doneMains || {})[mainNode.id]) { G.doneMains[mainNode.id] = true; (G.mq = G.mq || []).push(mainNode); }
      if (localInstance && !A.mainsOnly) { // content comes from a local main component (fixed on its own page): only overridden colours here
        for (const o of n.overrides || []) { if (o.id === n.id) continue; if (!o.overriddenFields.some(f => f === 'fills' || f === 'strokes' || f === 'effects')) continue;
          const t = await figma.getNodeByIdAsync(o.id); if (t && t.visible !== false && t.type !== 'TEXT') await processNode(t); }
      }
    } catch (e) {}
  }
  if (localInstance || (A.mainsOnly && n.type === 'INSTANCE')) continue;
  if (deep && 'children' in n) for (let k = n.children.length - 1; k >= 0; k--) { const c = n.children[k]; if (c.visible !== false) stack.push(c); }
}
// drain the main-component queue within the remaining budget (resumable across calls)
G.mq = G.mq || [];
while (G.mq.length && Date.now() < deadline + 2000) {
  const q = G.mq.pop();
  try { await processNode(q);
    if (q.type === 'INSTANCE') { let mm = null; try { mm = await q.getMainComponentAsync(); } catch (e) {} if (mm && !mm.remote && !G.doneMains[mm.id]) { G.doneMains[mm.id] = true; G.mq.push(mm); } }
    if ('children' in q) for (const c of q.children) G.mq.push(c);
  } catch (e) {}
}
return { next: done ? null : i, count, mq: G.mq.length };
