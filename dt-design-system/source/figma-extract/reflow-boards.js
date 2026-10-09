/* Fix overlapping "Board · <name>" backdrops on 🎨 DT Pilot.
   1. Icons frame: drop per-icon boards, give the frame one board fill + padding.
   2. Remove orphan boards (component gone).
   3. Shelf-pack component+board units per section (DT Components: only the screen-components band above the snapshot headings), shifting lower content / sections if a band grows. */
const page = await figma.getNodeByIdAsync('15012:25752'); await figma.setCurrentPageAsync(page);
const V = {}; for (const v of await figma.variables.getLocalVariablesAsync()) V[v.name] = v;
const GAP = 40, log = [];
const sec = n => page.children.find(c => c.name === n);
// 1. Icons frame
const icons = sec('DT Components').children.find(n => n.name === 'Icons');
if (icons) {
  const bs = icons.children.filter(n => n.name.startsWith('Board · ')); bs.forEach(b => { b.locked = false; b.remove(); });
  icons.fills = [figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: .87, g: .87, b: .87 } }, 'color', V['neutral/200'])];
  icons.cornerRadius = 16; icons.paddingLeft = icons.paddingRight = icons.paddingTop = icons.paddingBottom = 24; icons.itemSpacing = 24;
  icons.layoutWrap = 'NO_WRAP'; icons.primaryAxisSizingMode = 'AUTO'; icons.counterAxisSizingMode = 'AUTO';
  log.push('icons: removed ' + bs.length + ' boards, frame ' + Math.round(icons.width) + 'x' + Math.round(icons.height));
}
// 2 + 3
function units(container, filter) {
  const kids = container.children.map(n => ({ n, name: n.name, board: n.type === 'RECTANGLE' && n.name.startsWith('Board · ') })); const boardOf = new Map(); const used = new Set(); const gone = new Set();
  for (const k of kids) if (k.board) { const b = k.n;
    const t = kids.find(c => !c.board && c.name === k.name.slice(8) && !used.has(c.n)); 
    if (!t) { b.locked = false; log.push('orphan removed: ' + k.name); gone.add(b); b.remove(); continue; }
    used.add(t.n); boardOf.set(t.n, b); }
  const out = [];
  for (const k of kids) { const n = k.n;
    if (gone.has(n) || k.board) continue;
    if (filter && !filter(n)) continue;
    const b = boardOf.get(n); const bx = b ? b : n;
    out.push({ n, b, x: bx.x, y: bx.y, w: bx.width, h: bx.height, dx: b ? n.x - b.x : 0, dy: b ? n.y - b.y : 0 });
  }
  out.sort((a, c) => (Math.round(a.y / 120) - Math.round(c.y / 120)) || (a.x - c.x));
  return out;
}
function pack(us, x0, y0, maxW) {
  let x = x0, y = y0, rowH = 0;
  for (const u of us) {
    if (x > x0 && x + u.w > x0 + maxW) { x = x0; y += rowH + GAP; rowH = 0; }
    const tx = x, ty = y;
    if (u.b) { u.b.locked = false; u.b.x = tx; u.b.y = ty; u.b.locked = true; u.n.x = tx + u.dx; u.n.y = ty + u.dy; } else { u.n.x = tx; u.n.y = ty; }
    x += u.w + GAP; rowH = Math.max(rowH, u.h);
  }
  return y + rowH; // bottom
}
// DT Components top band
{
  const s = sec('DT Components');
  const firstSnap = s.children.find(n => n.name === 'Heading / Actions'); const bandEnd = firstSnap.y;
  const keep = n => n.name.startsWith('Heading / Screen') || n.name === 'Heading / note' || n.name === 'Expand';
  const us = units(s, n => n.y < bandEnd && !keep(n));
  const bottom = pack(us, 40, 124, s.width - 80);
  const delta = Math.max(0, bottom + 120 - bandEnd);
  if (delta) { for (const n of s.children) if (n.y >= bandEnd - 1 && !us.find(u => u.n === n || u.b === n)) { const l = n.locked; n.locked = false; n.y += delta; n.locked = l; } s.resizeWithoutConstraints(s.width, s.height + delta); const di = sec('DT Icons'); if (di.y < s.y + s.height + 150) di.y = s.y + s.height + 150; }
  log.push('DT Components band bottom ' + Math.round(bottom) + ', shifted snapshots ' + Math.round(delta));
}
// Chat + Artifacts sections, then restack sections in that column
for (const nm of ['DT Chat Components', 'DT Artifacts Components']) {
  const s = sec(nm); const us = units(s);
  const bottom = pack(us, 56, 80, s.width - 112);
  s.resizeWithoutConstraints(s.width, bottom + 80); log.push(nm + ' height ' + Math.round(s.height));
}
{ const a = sec('DT Chat Components'), b = sec('DT Artifacts Components'); b.y = a.y + a.height + 200; }
{ const t = sec('DT Tags, Badges & Chips'), f = sec('DT Form & Feedback'); f.y = t.y + t.height + 200; }
return log;
