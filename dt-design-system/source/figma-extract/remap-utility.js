/* Rebind Unify "Colors/Utility/<Family>/utility-<family>-<step>" variables to the DT secondary palette.
   ARGS: {pageId, dry}
   Runs in the Figma Desktop Bridge via new Function('figma','ARGS', code).
*/
const A = ARGS;
const FAM = {
  'Brand': 'magenta', 'Magenta': 'magenta', 'Mulberry': 'magenta',
  'Terracotta': 'aperitif', 'Rose': 'aperitif', 'Error': 'aperitif',
  'Orange': 'basketball', 'Warning': 'cheddar', 'Brand Tertiary': 'dandelion',
  'Lime': 'guacamole', 'Success': 'hummingbird', 'Jade green': 'iguana',
  'Harbor Teal': 'jacuzzi', 'Teal': 'kingfisher', 'Warm Blue': 'lagoon',
  'Steel Blue': 'macaw', 'Pigeon Blue': 'nebula', 'Royal violet': 'orchid', 'Plum': 'orchid',
  'Gray': 'neutral', 'Brand Secondary': 'neutral',
  // added 2026-10-01: remaining Unify utility families, nearest DT palette hue
  'Blue': 'macaw', 'Blue dark': 'macaw', 'Blue light': 'lagoon', 'Indigo': 'nebula', 'Cyan': 'kingfisher',
  'Green': 'iguana', 'Green light': 'guacamole', 'Moss': 'guacamole', 'Yellow': 'dandelion', 'Orange dark': 'basketball',
  'Violet': 'orchid', 'Purple': 'orchid', 'Fuchsia': 'orchid', 'Pink': 'magenta',
  'Gray blue': 'neutral', 'Gray cool': 'neutral', 'Gray modern': 'neutral', 'Gray neutral': 'neutral', 'Gray iron': 'neutral', 'Gray true': 'neutral', 'Gray warm': 'neutral',
};
const STEP = { 25: 'subtle', 50: 'subtle', 100: 'subtle', 200: 'extra-dominant', 300: 'dominant', 400: 'base-subtle', 500: 'base', 600: 'recessive', 700: 'extra-recessive', 800: 'extra-recessive', 900: 'extra-recessive', 950: 'extra-recessive' };
const NEUTRAL = { 25: 50, 50: 50, 100: 100, 200: 200, 300: 300, 400: 400, 500: 500, 600: 600, 700: 700, 800: 800, 900: 900, 950: 900 };

const KEY = A.localMap ? '__remapLocal' : '__remapCache';
const G = globalThis[KEY] || (globalThis[KEY] = { local: null, cache: {} });
if (!G.local) { G.local = {}; for (const v of await figma.variables.getLocalVariablesAsync()) G.local[v.name] = v; }
const local = G.local;
const cache = G.cache; // remote var id -> target local var | null
async function target(id) {
  if (id in cache) return cache[id];
  let t = null;
  const v = await figma.variables.getVariableByIdAsync(id);
  if (A.localMap) { if (v && !v.remote && A.localMap[v.name]) t = local[A.localMap[v.name]] || null; cache[id] = t; return t; }
  if (v && v.remote) {
    const m = v.name.match(/Utility\/([^/]+)\/utility-[a-z-]+-(\d+)$/);
    if (m && FAM[m[1]]) {
      const hue = FAM[m[1]], step = +m[2];
      const name = hue === 'neutral' ? 'neutral/' + NEUTRAL[step] : 'palette/' + hue + '/' + STEP[step];
      t = local[name] || null;
    }
  }
  cache[id] = t; return t;
}
const page = A.unit ? { name: '' , children: [] } : await figma.getNodeByIdAsync(A.pageId);
if (!A.unit) await page.loadAsync();
let nodes = 0, paints = 0, texts = 0, effects = 0, missing = 0; const used = {};
async function remapPaints(arr) {
  if (!Array.isArray(arr)) return null;
  let changed = false; const out = [];
  for (const p of arr) {
    const id = p.boundVariables && p.boundVariables.color && p.boundVariables.color.id;
    if (p.type === 'SOLID' && id) {
      const t = await target(id);
      if (t) { changed = true; paints++; used[t.name] = (used[t.name] || 0) + 1; out.push(figma.variables.setBoundVariableForPaint(p, 'color', t)); continue; }
      else if (cache[id] === null) { /* not a utility var */ }
    }
    if (p.type && p.type.startsWith('GRADIENT') && p.gradientStops) {
      let gc = false; const stops = [];
      for (const s of p.gradientStops) {
        const sid = s.boundVariables && s.boundVariables.color && s.boundVariables.color.id; const t = sid && await target(sid);
        if (t) { gc = true; paints++; stops.push(Object.assign({}, s, { boundVariables: { color: { type: 'VARIABLE_ALIAS', id: t.id } } })); } else stops.push(s);
      }
      if (gc) { changed = true; out.push(Object.assign({}, p, { gradientStops: stops })); continue; }
    }
    out.push(p);
  }
  return changed ? out : null;
}
const roots = [];
if (A.unit) { if (A.unit.self) roots.push({ n: A.unit.self, deep: false }); else roots.push({ n: A.unit.node, deep: true }); }
else for (const t of page.children.slice(A.from || 0, A.to == null ? undefined : A.to)) roots.push({ n: t, deep: true });
function* walk(n, deep) { yield n; if (deep && 'children' in n) for (const c of n.children) yield* walk(c, true); }
const deadline = Date.now() + (A.budget || 25000);
let i = -1, done = true; const startAt = A.start || 0;
outer: for (const r of roots) for (const n of walk(r.n, r.deep)) {
  i++;
  if (i < startAt) continue;
  if (Date.now() > deadline) { done = false; break outer; }
  let touched = false;
  try {
    if ('fills' in n && n.fills !== figma.mixed) { const r = await remapPaints(n.fills); if (r) { if (!A.dry) n.fills = r; touched = true; } }
    if ('strokes' in n) { const r = await remapPaints(n.strokes); if (r) { if (!A.dry) n.strokes = r; touched = true; } }
    if (n.type === 'TEXT' && n.fills === figma.mixed) {
      for (const seg of n.getStyledTextSegments(['fills'])) {
        const r = await remapPaints(seg.fills);
        if (r) { if (!A.dry) { for (const f of n.getRangeAllFontNames(seg.start, seg.end)) await figma.loadFontAsync(f); n.setRangeFills(seg.start, seg.end, r); } texts++; touched = true; }
      }
    }
    if ('effects' in n && n.effects.length) {
      let ch = false; const eff = [];
      for (const e of n.effects) { const id = e.boundVariables && e.boundVariables.color && e.boundVariables.color.id; const t = id && await target(id);
        if (t) { ch = true; effects++; eff.push(figma.variables.setBoundVariableForEffect(e, 'color', t)); } else eff.push(e); }
      if (ch) { if (!A.dry) n.effects = eff; touched = true; }
    }
  } catch (e) { missing++; }
  if (touched) nodes++;
}
return { page: page.name, tops: page.children.length, from: A.from || 0, to: A.to, scanned: i + 1, next: done ? null : i, nodes, paints, texts, effects, errors: missing, used };
