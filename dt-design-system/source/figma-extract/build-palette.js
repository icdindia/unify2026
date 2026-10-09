/* "DT Palette" section on 🎨 DT Pilot: Light + Dark boards, 15 hues x 7 steps, swatches bound to palette/<hue>/<step>. Re-run replaces it. */
const page = await figma.getNodeByIdAsync('15012:25752'); await figma.setCurrentPageAsync(page);
const V = {}; for (const v of await figma.variables.getLocalVariablesAsync()) V[v.name] = v;
const TS = {}; for (const s of await figma.getLocalTextStylesAsync()) TS[s.name] = s;
for (const st of ['Bold', 'Medium']) await figma.loadFontAsync({ family: 'TeleNeo Var', style: st });
const col = await figma.variables.getVariableCollectionByIdAsync('VariableCollectionId:15009:22503');
const HUES = ['aperitif', 'basketball', 'cheddar', 'dandelion', 'egg', 'frog', 'guacamole', 'hummingbird', 'iguana', 'jacuzzi', 'kingfisher', 'lagoon', 'macaw', 'nebula', 'orchid'];
const STEPS = ['subtle', 'extra-dominant', 'dominant', 'base-subtle', 'base', 'recessive', 'extra-recessive'];
const P = (n, c) => figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: c || { r: 0, g: 0, b: 0 } }, 'color', V[n] || V[n.replace('-subtle', '')] || V['basic/stroke']);
const hex = c => '#' + [c.r, c.g, c.b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
const AL = (name, dir, gap) => { const f = figma.createFrame(); f.name = name; f.layoutMode = dir; f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO'; f.itemSpacing = gap || 0; f.fills = []; return f; };
async function T(s, style, ink, w) { const t = figma.createText(); await t.setTextStyleIdAsync(TS[style].id); t.characters = s; t.fills = [P(ink)]; if (w) { t.textAutoResize = 'HEIGHT'; t.resize(w, t.height); } return t; }
let sec = page.children.find(n => n.type === 'SECTION' && n.name === 'DT Palette'); if (sec) sec.remove();
const ff = page.children.find(n => n.type === 'SECTION' && n.name === 'DT Form & Feedback');
sec = figma.createSection(); sec.name = 'DT Palette'; sec.x = ff.x; sec.y = ff.y + ff.height + 200;
const boards = [];
for (const [mode, modeId] of [['Light', col.modes.find(m => m.name === 'Light').modeId], ['Dark', col.modes.find(m => m.name === 'Dark').modeId]]) {
  const b = AL('DT Palette · ' + mode, 'VERTICAL', 16); sec.appendChild(b);
  b.setExplicitVariableModeForCollection(col, modeId);
  b.paddingTop = b.paddingBottom = b.paddingLeft = b.paddingRight = 40; b.cornerRadius = 24; b.fills = [P('basic/background', { r: 1, g: 1, b: 1 })];
  b.strokes = [P('basic/stroke-subtle')]; b.strokeWeight = 1;
  b.appendChild(await T('DT palette · ' + mode, 'DT/Title S', 'basic/text'));
  b.appendChild(await T('15 ODS secondary hues × 7 steps. Variables palette/<hue>/<step> in DT Foundations. Use for data-viz, categories, avatars and tints; put basic/text on the fills, never palette colours as text.', 'DT/Body S Regular', 'basic/text-recessive', 800));
  const head = AL('Steps', 'HORIZONTAL', 8); b.appendChild(head);
  const sp = figma.createFrame(); sp.name = 'Spacer'; sp.resize(120, 16); sp.fills = []; head.appendChild(sp);
  for (const s of STEPS) { const t = await T(s, 'DT/Microcopy Bold', 'basic/text-recessive', 96); head.appendChild(t); }
  for (const h of HUES) {
    const row = AL(h, 'HORIZONTAL', 8); row.counterAxisAlignItems = 'CENTER'; b.appendChild(row);
    row.appendChild(await T(h, 'DT/Body S Bold', 'basic/text', 120));
    for (const s of STEPS) {
      const cell = AL(h + '/' + s, 'VERTICAL', 4); row.appendChild(cell);
      const sw = figma.createRectangle(); sw.name = 'Swatch'; sw.resize(96, 48); sw.cornerRadius = 8; const v = V['palette/' + h + '/' + s];
      sw.fills = [P('palette/' + h + '/' + s)]; sw.strokes = [P('basic/stroke-subtle')]; sw.strokeWeight = 1; sw.strokeAlign = 'INSIDE'; cell.appendChild(sw);
      cell.appendChild(await T(hex(v.valuesByMode[modeId]), 'DT/Microcopy Regular', 'basic/text-recessive'));
    }
  }
  boards.push(b);
}
boards[0].x = 80; boards[0].y = 80; boards[1].x = boards[0].x + boards[0].width + 80; boards[1].y = 80;
sec.resizeWithoutConstraints(boards[1].x + boards[1].width + 80, Math.max(...boards.map(b => b.height)) + 160);
return { section: sec.id, boards: boards.map(b => b.id + ' ' + Math.round(b.width) + 'x' + Math.round(b.height)) };
