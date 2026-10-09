/* Tally non-text layers bound to neutral/900 (where Unify "brand_600" / "brand_alpha_*" landed). Unit interface.
   ARGS.fix: rebind them to the magenta accent (solid → basic/accent, translucent → basic/accent keeping opacity). */
const A = ARGS;
const G = globalThis.__n9 || (globalThis.__n9 = { byName: {}, alpha: 0, solid: 0, pending: [] });
if (!G.n9) { const vs = await figma.variables.getLocalVariablesAsync(); G.n9 = vs.find(v => v.name === 'neutral/900').id; G.acc = vs.find(v => v.name === 'basic/accent'); }
const root = A.unit.self || A.unit.node; const deep = !A.unit.self;
const deadline = Date.now() + (A.budget || 12000);
let i = -1, done = true; const startAt = A.start || 0; const stack = [root];
while (stack.length) {
  const n = stack.pop(); i++;
  if (i >= startAt) {
    if (Date.now() > deadline) { done = false; break; }
    if (n.type !== 'TEXT') for (const kind of ['fills', 'strokes']) {
      if (!(kind in n) || !Array.isArray(n[kind])) continue;
      let ch = false; const out = n[kind].map(f => {
        const id = f.boundVariables && f.boundVariables.color && f.boundVariables.color.id;
        if (id !== G.n9) return f;
        const a = f.opacity == null ? 1 : f.opacity; if (a < 0.99) G.alpha++; else G.solid++;
        const key = (a < 0.99 ? 'α ' : '') + n.type + ' ' + kind + ' ' + n.name.slice(0, 22) + ' < ' + (n.parent ? n.parent.name.slice(0, 22) : '');
        G.byName[key] = (G.byName[key] || 0) + 1;
        if (A.fix && (A.fix === 'all' || a < 0.99)) { ch = true; return figma.variables.setBoundVariableForPaint(f, 'color', G.acc); }
        return f; });
      if (ch) G.pending.push({ n, kind, out });
    }
  }
  if (deep && 'children' in n) for (let k = n.children.length - 1; k >= 0; k--) { const c = n.children[k]; if (c.visible !== false) stack.push(c); }
}
return { next: done ? null : i };
