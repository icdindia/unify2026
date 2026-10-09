/* Storybook snapshots on 🎨 DT Pilot: after linking DT text styles the text boxes are line-height tall but keep the crawl's glyph-box y,
   so they poke out of their frames. Pull them back inside (centre when the frame is shorter), and give TagStatic its ODS padding. ARGS {dry} */
const page = await figma.getNodeByIdAsync('15012:25752'); await figma.setCurrentPageAsync(page);
const s = page.children.find(n => n.name === 'DT Components');
const sets = s.children.filter(n => (n.type === 'COMPONENT_SET' || n.type === 'COMPONENT') && n.name.startsWith('DT/'));
for (const st of ['Bold', 'Medium']) await figma.loadFontAsync({ family: 'TeleNeo Var', style: st });
const log = { moved: 0, centred: 0, wide: [] };
for (const set of sets) for (const t of set.findAllWithCriteria({ types: ['TEXT'] })) {
  const p = t.parent; if (!p || p.type === 'COMPONENT_SET') continue;
  if (p.layoutMode && p.layoutMode !== 'NONE' && t.layoutPositioning !== 'ABSOLUTE') continue;
  if (t.y + t.height > p.height + 0.5) {
    if (!ARGS.dry) t.y = t.height <= p.height ? p.height - t.height : Math.round((p.height - t.height) / 2);
    t.height <= p.height ? log.moved++ : log.centred++;
  }
  if (t.x + t.width > p.width + 1 && p.clipsContent) log.wide.push(set.name + ' › ' + t.characters.slice(0, 30));
}
// TagStatic → ODS size standard: padding 4/8, gap 8, radius extra-small 6, icon 16, Body M Bold
const ts = sets.find(n => n.name === 'DT/Feedback/TagStatic');
if (ts && !ARGS.dry) for (const c of ts.children) {
  const tag = c.children[0]; const label = tag.findOne(n => n.name === 'ODSTagStatic-Label'); const txt = label.findOne(n => n.type === 'TEXT');
  label.layoutMode = 'HORIZONTAL'; label.primaryAxisSizingMode = 'AUTO'; label.counterAxisSizingMode = 'AUTO'; label.paddingTop = label.paddingBottom = label.paddingLeft = label.paddingRight = 0; label.clipsContent = false;
  txt.textAutoResize = 'WIDTH_AND_HEIGHT';
  tag.layoutMode = 'HORIZONTAL'; tag.primaryAxisSizingMode = 'AUTO'; tag.counterAxisSizingMode = 'AUTO'; tag.counterAxisAlignItems = 'CENTER';
  tag.paddingTop = tag.paddingBottom = 4; tag.paddingLeft = tag.paddingRight = 8; tag.itemSpacing = 8; tag.cornerRadius = 6; tag.clipsContent = false;
  c.layoutMode = 'HORIZONTAL'; c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'AUTO'; c.paddingTop = c.paddingBottom = c.paddingLeft = c.paddingRight = 0; c.itemSpacing = 0;
  log['tag ' + c.name] = Math.round(tag.width) + 'x' + Math.round(tag.height);
}
return log;
