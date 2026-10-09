/* Density pass: Ghost/Subtle icon-only DT Button · ODS Small (40) → DT Icon Button · ODS XSmall (24, 16 icon), per ODS IconButtonXSmall.
   Edits at the source (skips instances nested in other instances), so screens inherit from the mains. Skips the DT Components docs section.
   ARGS {dry, section?} */
const page = await figma.getNodeByIdAsync('15012:25752'); await figma.setCurrentPageAsync(page);
const BTN = await figma.getNodeByIdAsync('15046:642460'), XS = await figma.getNodeByIdAsync('15054:1341691');
const skipSec = new Set(page.children.filter(n => n.type === 'SECTION' && /^DT (Components|Icons|Form)/.test(n.name)).map(n => n.id));
const xsKey = Object.keys(XS.componentPropertyDefinitions).find(k => k.startsWith('Icon'));
const out = { swapped: 0, byParent: {}, noIcon: 0, skipped: 0 };
const roots = page.children.filter(n => !skipSec.has(n.id));
const targets = [];
for (const r of roots) for (const i of (r.type === 'INSTANCE' ? [r] : []).concat('findAllWithCriteria' in r ? r.findAllWithCriteria({ types: ['INSTANCE'] }) : [])) {
  let p = i.parent, nested = false; while (p && p.type !== 'PAGE') { if (p.type === 'INSTANCE') { nested = true; break; } p = p.parent; }
  if (nested) continue;
  const m = await i.getMainComponentAsync(); if (!m || m.parent !== BTN) continue;
  const v = m.variantProperties; if (v.Type !== 'Icon only' || !/Ghost|Subtle/.test(v.Variant)) continue;
  if (i.parent && (ARGS.skipParents || ['Filters']).includes(i.parent.name)) { out.skipped++; continue; }
  targets.push({ i, v });
}
for (const { i, v } of targets) {
  const props = i.componentProperties; const li = Object.entries(props).find(([k]) => k.startsWith('Left icon'));
  let icon16 = null;
  if (li) { const ic = await figma.getNodeByIdAsync(li[1].value); const set = ic && ic.parent && ic.parent.type === 'COMPONENT_SET' ? ic.parent : null;
    icon16 = set ? set.children.find(c => c.name === (ic.variantProperties && ic.variantProperties.Style ? 'Style=' + ic.variantProperties.Style + ', Size=16' : 'Size=16')) || set.children.find(c => /Size=16/.test(c.name)) : ic; }
  if (!icon16) out.noIcon++;
  const key = (i.parent && i.parent.name || '?').slice(0, 30); out.byParent[key] = (out.byParent[key] || 0) + 1;
  if (ARGS.dry) continue;
  const tgt = XS.children.find(c => c.name === `Variant=${v.Variant}, State=${v.State}`) || XS.children.find(c => c.name === `Variant=${v.Variant}, State=Default`);
  const abs = !(i.parent.layoutMode && i.parent.layoutMode !== 'NONE') || i.layoutPositioning === 'ABSOLUTE';
  const cx = i.x + i.width / 2, cy = i.y + i.height / 2;
  i.swapComponent(tgt); i.resize(24, 24);
  i.fills = JSON.parse(JSON.stringify(tgt.fills)); i.strokes = JSON.parse(JSON.stringify(tgt.strokes));
  if (icon16) try { i.setProperties({ [xsKey]: icon16.id }); } catch (e) { out.noIcon++; }
  if (abs) { i.x = Math.round(cx - 12); i.y = Math.round(cy - 12); }
  out.swapped++;
}
// icon-only rows: 8px between 24px buttons
if (!ARGS.dry) { const parents = new Set(targets.map(t => t.i.parent)); let g = 0;
  for (const p of parents) if (p.layoutMode && p.layoutMode !== 'NONE' && p.children.every(c => c.type === 'INSTANCE' && Math.round(c.width) === 24) && p.itemSpacing < 8) { p.itemSpacing = 8; g++; }
  out.gapsFixed = g; }
out.targets = targets.length;
return out;
