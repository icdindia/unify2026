/* Find leftover Unify utility colours anywhere in the file: paints/effects bound to remote variables named ".../Utility/...",
   or fill/stroke styles whose name contains "Utility". Resumable across calls (globalThis.__scanU). ARGS {reset, budget} */
const G = (ARGS.reset || !globalThis.__scanU) ? (globalThis.__scanU = { pages: null, pi: 0, stack: null, hits: {}, n: 0, vcache: {}, scache: {}, samples: [] }) : globalThis.__scanU;
if (!G.pages) { await figma.loadAllPagesAsync(); G.pages = figma.root.children.map(p => p.id); }
const t0 = Date.now(), budget = ARGS.budget || 24000;
async function isUtilVar(id) { if (id in G.vcache) return G.vcache[id]; const v = await figma.variables.getVariableByIdAsync(id); const r = !!(v && /Utility/i.test(v.name)) ? v.name : false; G.vcache[id] = r; return r; }
async function isUtilStyle(id) { if (!id || typeof id !== 'string') return false; if (id in G.scache) return G.scache[id]; const s = await figma.getStyleByIdAsync(id); const r = !!(s && /Utility/i.test(s.name)) ? s.name : false; G.scache[id] = r; return r; }
async function check(n) {
  for (const k of ['fills', 'strokes']) { const ps = n[k]; if (!Array.isArray(ps)) continue;
    for (const p of ps) { const id = p.boundVariables && p.boundVariables.color && p.boundVariables.color.id; if (id) { const u = await isUtilVar(id); if (u) return u; } } }
  if (Array.isArray(n.effects)) for (const e of n.effects) { const id = e.boundVariables && e.boundVariables.color && e.boundVariables.color.id; if (id) { const u = await isUtilVar(id); if (u) return u; } }
  for (const k of ['fillStyleId', 'strokeStyleId']) { const u = await isUtilStyle(n[k]); if (u) return 'style:' + u; }
  return false;
}
while (G.pi < G.pages.length) {
  const page = await figma.getNodeByIdAsync(G.pages[G.pi]);
  if (!G.stack) G.stack = [...page.children];
  while (G.stack.length) {
    if (Date.now() - t0 > budget) return { done: false, page: page.name, scanned: G.n, hits: G.hits };
    const n = G.stack.pop(); G.n++;
    const u = await check(n);
    if (u) { const key = page.name + ' | ' + u; G.hits[key] = (G.hits[key] || 0) + 1; if (G.samples.length < 30) G.samples.push(n.id + ' ' + n.name.slice(0, 30) + ' ' + u); }
    if ('children' in n) for (const c of n.children) G.stack.push(c);
  }
  G.pi++; G.stack = null;
}
return { done: true, scanned: G.n, hits: G.hits, samples: G.samples };
