/* Name-based variant of fix-n900.js: per unit, native findAll for the four role names, then rebind neutral/900 fills. */
const A = ARGS;
const G = globalThis.__fix9 || (globalThis.__fix9 = { stats: {}, pending: [] });
if (!G.v) { const vs = await figma.variables.getLocalVariablesAsync(); G.v = {}; for (const v of vs) G.v[v.name] = v; G.n9 = G.v['neutral/900'].id; }
const role = n => { if (/^Main_nav/.test(n.name)) return 'brand/magenta'; if (n.name === 'Results') return 'accents/accent-subtle'; if (n.name === 'Message Body') return 'basic/accent-secondary'; if (n.name === 'Icon' && n.parent && /^COT/.test(n.parent.name)) return 'basic/accent'; return null; };
const want = n => (n.type === 'FRAME' || n.type === 'INSTANCE') && (n.name === 'Icon' || n.name === 'Results' || n.name === 'Message Body' || /^Main_nav/.test(n.name));
const root = A.unit.self || A.unit.node;
const hits = [root].filter(want);
if (!A.unit.self && 'findAll' in root) for (const n of root.findAll(want)) hits.push(n);
let fixed = 0;
for (const n of hits) {
  const r = role(n); if (!r || !Array.isArray(n.fills)) continue;
  let ch = false; const out = n.fills.map(f => { const id = f.boundVariables && f.boundVariables.color && f.boundVariables.color.id; if (id !== G.n9) return f; ch = true; return figma.variables.setBoundVariableForPaint(Object.assign({}, f, { opacity: 1 }), 'color', G.v[r]); });
  if (ch && !A.dry) { n.fills = out; fixed++; G.stats[n.name + ' → ' + r] = (G.stats[n.name + ' → ' + r] || 0) + 1; }
}
return { next: null, fixed };
