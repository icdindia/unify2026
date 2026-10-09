/* Driver: ARGS {pageId, unit, start, ms}. Work units = top-level nodes, with sections/frames expanded two levels
   so no single unit is huge. Runs remap-utility.js per unit until the time budget, returns resume state. */
const code = await (await fetch('http://localhost:9231/' + (ARGS.script || 'remap-utility.js'))).text();
const fn = new Function('figma', 'ARGS', 'return (async()=>{' + code + '})()');
const page = await figma.getNodeByIdAsync(ARGS.pageId); await page.loadAsync();
const end = Date.now() + (ARGS.ms || 12000);
const units = [];
let T = 0;
const expand = (n, d) => { if (d < 2 && 'children' in n && n.type !== 'INSTANCE' && n.children.length > 1) { units.push({ self: n, t: T }); for (const c of n.children) expand(c, d + 1); } else units.push({ node: n, t: T }); };
for (const t of page.children) { expand(t, 0); T++; }
let u = ARGS.fromTop != null ? units.findIndex(x => x.t >= ARGS.fromTop) : (ARGS.unit || 0), start = ARGS.start || 0; const tally = {}; const fixes = {};
while (u < units.length) {
  const budget = end - Date.now(); if (budget < 1000) break;
  const r = await fn(figma, { unit: units[u], start, dry: !!ARGS.dry, budget, localMap: ARGS.localMap, mainsOnly: ARGS.mainsOnly, defer: ARGS.script === 'a11y-text.js' || ARGS.script === 'swap-buttons.js' || ARGS.script === 'map-colors.js' });
  for (const k in r) if (typeof r[k] === 'number' && k !== 'next') tally[k] = (tally[k] || 0) + r[k]; if (r.fixes) for (const k in r.fixes) fixes[k] = (fixes[k] || 0) + r.fixes[k];
  if (r.next != null) { start = r.next; break; }
  u++; start = 0;
}
let flushed = 0;
if (ARGS.script === 'a11y-text.js' && globalThis.__a11y && globalThis.__a11y.pending) {
  const P = globalThis.__a11y.pending; globalThis.__a11y.pending = [];
  const loaded = new Set();
  for (const w of P) for (const f of w.fonts) { const k = f.family + '|' + f.style; if (!loaded.has(k)) { loaded.add(k); try { await figma.loadFontAsync(f); } catch (e) {} } }
  for (const w of P) { try { if (w.whole) w.n.fills = [w.paint]; else w.n.setRangeFills(w.s, w.e, [w.paint]); flushed++; } catch (e) {} }
}
if (ARGS.script === 'swap-buttons.js' && globalThis.__swap && globalThis.__swap.pending && !ARGS.dry) {
  const P = globalThis.__swap.pending; globalThis.__swap.pending = [];
  for (const w of P) { try { w.n.swapComponent(w.comp); if (Object.keys(w.set).length) w.n.setProperties(w.set); flushed++; } catch (e) { globalThis.__swap.err = (globalThis.__swap.err || 0) + 1; globalThis.__swap.lastErr = String(e).slice(0, 200); } }
}
if (ARGS.script === 'map-colors.js' && globalThis.__map && globalThis.__map.pending && !ARGS.dry) {
  const P = globalThis.__map.pending; globalThis.__map.pending = [];
  for (const w of P) { try { if (w.fills) w.n.fills = w.fills; if (w.strokes) w.n.strokes = w.strokes; if (w.effects) w.n.effects = w.effects; flushed++; } catch (e) { globalThis.__map.err = (globalThis.__map.err || 0) + 1; globalThis.__map.lastErr = String(e).slice(0, 160); } }
}
return { flushed, page: page.name, units: units.length, unit: u, start, done: u >= units.length, ...tally, fixes };
