/* Run a unit-interface script over the local main components collected by map-colors (globalThis.__map.doneMains).
   ARGS {script, from, ms, dry}. Writes are deferred by the script and flushed here. */
const ids = Object.keys((globalThis.__map && globalThis.__map.doneMains) || {});
const code = await (await fetch('http://localhost:9231/' + ARGS.script)).text();
const fn = new Function('figma', 'ARGS', 'return (async()=>{' + code + '})()');
const end = Date.now() + (ARGS.ms || 12000);
let k = ARGS.from || 0, start = ARGS.start || 0; const tally = {}; const fixes = {};
while (k < ids.length) {
  const budget = end - Date.now(); if (budget < 800) break;
  const m = await figma.getNodeByIdAsync(ids[k]); if (!m) { k++; continue; }
  const r = await fn(figma, { unit: { node: m }, start, budget, dry: !!ARGS.dry, defer: true });
  for (const x in r) if (typeof r[x] === 'number' && x !== 'next') tally[x] = (tally[x] || 0) + r[x];
  if (r.fixes) for (const x in r.fixes) fixes[x] = (fixes[x] || 0) + r.fixes[x];
  if (r.next != null) { start = r.next; break; }
  k++; start = 0;
}
let flushed = 0;
if (!ARGS.dry && globalThis.__a11y && globalThis.__a11y.pending) {
  const P = globalThis.__a11y.pending; globalThis.__a11y.pending = []; const loaded = new Set();
  for (const w of P) for (const f of w.fonts) { const key = f.family + '|' + f.style; if (!loaded.has(key)) { loaded.add(key); try { await figma.loadFontAsync(f); } catch (e) {} } }
  for (const w of P) { try { if (w.whole) w.n.fills = [w.paint]; else w.n.setRangeFills(w.s, w.e, [w.paint]); flushed++; } catch (e) {} }
}
return { mains: ids.length, k, start, done: k >= ids.length, flushed, ...tally, fixes };
