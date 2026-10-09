/* Unify brand_600 / brand_alpha_* landed on neutral/900. Rebind by role (frames only; logos/vectors untouched):
   Main_nav → brand/magenta, COT "Icon" → basic/accent, "Results" pill → accents/accent-subtle, "Message Body" → basic/accent-secondary.
   Unit interface; skips inside top-level local instances (mains are handled via mains-run), but processes their overrides. */
const A = ARGS;
const G = globalThis.__fix9 || (globalThis.__fix9 = { stats: {}, pending: [] });
if (!G.v) { const vs = await figma.variables.getLocalVariablesAsync(); G.v = {}; for (const v of vs) G.v[v.name] = v; G.n9 = G.v['neutral/900'].id; }
function roleFor(n) {
  if (n.type !== 'FRAME' && n.type !== 'INSTANCE' && n.type !== 'COMPONENT') return null;
  if (/^Main_nav/.test(n.name)) return 'brand/magenta';
  if (n.name === 'Results') return 'accents/accent-subtle';
  if (n.name === 'Message Body') return 'basic/accent-secondary';
  if (n.name === 'Icon' && n.parent && /^COT/.test(n.parent.name)) return 'basic/accent';
  return null;
}
function fix(n) {
  const role = roleFor(n); if (!role || !Array.isArray(n.fills)) return;
  let ch = false; const out = n.fills.map(f => { const id = f.boundVariables && f.boundVariables.color && f.boundVariables.color.id; if (id !== G.n9) return f; ch = true; return figma.variables.setBoundVariableForPaint(Object.assign({}, f, { opacity: 1 }), 'color', G.v[role]); });
  if (ch) { G.pending.push({ n, out }); G.stats[n.name + ' → ' + role] = (G.stats[n.name + ' → ' + role] || 0) + 1; }
}
const root = A.unit.self || A.unit.node; const deep = !A.unit.self;
const deadline = Date.now() + (A.budget || 12000);
let i = -1, done = true; const startAt = A.start || 0; const stack = [root];
while (stack.length) {
  const n = stack.pop(); i++;
  let local = false;
  if (n.type === 'INSTANCE' && deep && !n.id.startsWith('I') && n !== root) { let m = null; try { m = await n.getMainComponentAsync(); } catch (e) {} local = !!(m && !m.remote); }
  if (i >= startAt) {
    if (Date.now() > deadline) { done = false; break; }
    try { fix(n); if (local) for (const o of n.overrides || []) if (o.overriddenFields.includes('fills')) { const t = await figma.getNodeByIdAsync(o.id); if (t) fix(t); } } catch (e) {}
  }
  if (local) continue;
  if (deep && 'children' in n) for (let k = n.children.length - 1; k >= 0; k--) { const c = n.children[k]; if (c.visible !== false) stack.push(c); }
}
let flushed = 0; if (!A.dry) { const P = G.pending; G.pending = []; for (const w of P) { try { w.n.fills = w.out; flushed++; } catch (e) {} } }
return { next: done ? null : i, fixed: flushed };
