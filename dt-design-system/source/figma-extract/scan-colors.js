/* Read-only inventory of remote (Unify) colour bindings. Unit interface: ARGS {unit, start, budget}
   Tallies into globalThis.__scan: vars {name: count}, styles {name: count}, raw {hex: count} */
const A = ARGS;
const G = globalThis.__scan || (globalThis.__scan = { vars: {}, styles: {}, raw: {}, vcache: {}, scache: {} });
async function vname(id) { if (id in G.vcache) return G.vcache[id]; const v = await figma.variables.getVariableByIdAsync(id); G.vcache[id] = v && v.remote ? v.name : null; return G.vcache[id]; }
async function sname(id) { if (id in G.scache) return G.scache[id]; let s = null; try { s = await figma.getStyleByIdAsync(id); } catch (e) {} G.scache[id] = s && s.remote ? s.name : null; return G.scache[id]; }
const hex = c => '#' + [c.r, c.g, c.b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
async function paints(arr, kind) {
  if (!Array.isArray(arr)) return;
  for (const p of arr) {
    if (p.visible === false) continue;
    const id = p.boundVariables && p.boundVariables.color && p.boundVariables.color.id;
    if (id) { const n = await vname(id); if (n) G.vars[kind + ' ' + n] = (G.vars[kind + ' ' + n] || 0) + 1; continue; }
    if (p.type === 'SOLID') { const h = kind + ' ' + hex(p.color); G.raw[h] = (G.raw[h] || 0) + 1; }
  }
}
const root = A.unit.self || A.unit.node; const deep = !A.unit.self;
const deadline = Date.now() + (A.budget || 12000);
let i = -1, done = true; const startAt = A.start || 0; const stack = [root];
while (stack.length) {
  const n = stack.pop(); i++;
  if (i >= startAt) {
    if (Date.now() > deadline) { done = false; break; }
    try {
      if ('fillStyleId' in n && typeof n.fillStyleId === 'string' && n.fillStyleId) { const s = await sname(n.fillStyleId); if (s) G.styles['fill ' + s] = (G.styles['fill ' + s] || 0) + 1; }
      if ('strokeStyleId' in n && n.strokeStyleId) { const s = await sname(n.strokeStyleId); if (s) G.styles['stroke ' + s] = (G.styles['stroke ' + s] || 0) + 1; }
      if ('fills' in n && n.fills !== figma.mixed) await paints(n.fills, n.type === 'TEXT' ? 'text' : 'fill');
      if ('strokes' in n) await paints(n.strokes, 'stroke');
      if ('effects' in n && n.effects.length) for (const e of n.effects) { const id = e.boundVariables && e.boundVariables.color && e.boundVariables.color.id; if (id) { const nm = await vname(id); if (nm) G.vars['effect ' + nm] = (G.vars['effect ' + nm] || 0) + 1; } }
    } catch (e) {}
  }
  if (deep && 'children' in n) for (let k = n.children.length - 1; k >= 0; k--) { const c = n.children[k]; if (c.visible !== false) stack.push(c); }
}
return { next: done ? null : i };
