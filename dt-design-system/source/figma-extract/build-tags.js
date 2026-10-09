/* Build ODS Tags, Badges and Chips as property-driven DT components on 🎨 DT Pilot (section "DT Tags, Badges & Chips").
   Specs from dt-design-system/project/components/{TagStatic,TagDismissible,BadgeNumber,BadgeIcon,FilterChip,ToggleChip,DismissibleChip}.
   ARGS {only?: [names]} */
const page = await figma.getNodeByIdAsync('15012:25752'); await figma.setCurrentPageAsync(page);
const V = {}; for (const v of await figma.variables.getLocalVariablesAsync()) V[v.name] = v;
const TS = {}; for (const s of await figma.getLocalTextStylesAsync()) TS[s.name] = s;
for (const st of ['Bold', 'Medium']) await figma.loadFontAsync({ family: 'TeleNeo Var', style: st });
const W = { r: 1, g: 1, b: 1 }, K = { r: 0, g: 0, b: 0 };
const P = (n, c) => { if (!V[n]) throw new Error('missing var ' + n); return figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: c || K }, 'color', V[n]); };
const icons = page.children.find(n => n.name === 'DT Icons'); const IC = {}; icons.findAllWithCriteria({ types: ['COMPONENT_SET'] }).forEach(s => { IC[s.name.split('/').pop()] = s; });
const ic = (n, sz) => IC[n].children.find(c => c.name === 'Style=Outline, Size=' + (sz <= 16 ? 16 : 24));
// icon slot with mask so the ink follows the variant (swap-safe)
function slot(name, iconName, ink, sz) { const f = figma.createFrame(); f.name = name; f.resize(sz, sz); f.fills = []; f.clipsContent = true;
  const g = figma.createFrame(); g.name = 'Glyph'; g.resize(sz, sz); g.fills = []; f.appendChild(g); const i = ic(iconName, sz).createInstance(); i.name = 'Icon'; g.appendChild(i); if (i.width !== sz) i.rescale(sz / i.width); i.x = 0; i.y = 0; g.isMask = true; g.maskType = 'ALPHA';
  const r = figma.createRectangle(); r.name = 'Ink'; r.resize(sz, sz); r.fills = [ink]; f.appendChild(r); return f; }
async function text(s, style, ink) { const t = figma.createText(); await t.setTextStyleIdAsync(TS[style].id); t.characters = s; t.fills = [ink]; t.name = 'Label'; return t; }
const hl = (f, dir) => { f.layoutMode = dir || 'HORIZONTAL'; f.counterAxisAlignItems = 'CENTER'; f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO'; f.fills = []; return f; };
function ring(c, radius, pad) { const f = figma.createRectangle(); f.name = 'Focus ring'; c.appendChild(f); f.layoutPositioning = 'ABSOLUTE'; f.x = -pad; f.y = -pad; f.resize(c.width + 2 * pad, c.height + 2 * pad); f.cornerRadius = radius; f.fills = []; f.strokes = [P('state/focus-focus')]; f.strokeWeight = 2; f.strokeAlign = 'INSIDE'; f.constraints = { horizontal: 'STRETCH', vertical: 'STRETCH' }; return f; }
let sec = page.children.find(n => n.type === 'SECTION' && n.name === 'DT Tags, Badges & Chips');
if (!sec) { const ref = page.children.find(n => n.type === 'SECTION' && n.name === 'DT Chat Components'); sec = figma.createSection(); sec.name = 'DT Tags, Badges & Chips'; sec.x = ref.x + ref.width + 200; sec.y = ref.y; sec.resizeWithoutConstraints(2400, 400); }
const only = ARGS && ARGS.only; const want = n => !only || only.includes(n);
function finish(set, desc) { set.layoutMode = 'HORIZONTAL'; set.layoutWrap = 'WRAP'; set.itemSpacing = 24; set.counterAxisSpacing = 24; set.counterAxisAlignItems = 'CENTER';
  set.paddingLeft = set.paddingRight = set.paddingTop = set.paddingBottom = 32; set.primaryAxisSizingMode = 'FIXED'; set.resize(Math.min(2200, set.width), 100); set.counterAxisSizingMode = 'AUTO';
  set.fills = [P('basic/background', W)]; set.cornerRadius = 16; set.strokes = [P('neutral/200')]; set.strokeWeight = 1; set.description = desc;
  const others = sec.children.filter(n => n !== set); set.x = 80; set.y = others.length ? Math.max(...others.map(n => n.y + n.height)) + 80 : 120;
  sec.resizeWithoutConstraints(Math.max(sec.width, set.width + 160), set.y + set.height + 80); return set; }
const built = {};
// ---------- Tag Static
if (want('tag')) {
  sec.children.filter(n => n.name === 'DT Tag Static').forEach(n => n.remove());
  const TYPES = { Basic: ['basic/background', 'basic/text'], Strong: ['accents/accent-secondary-strong', 'basic/text-on-accent-secondary'], Medium: ['accents/accent-secondary-medium', 'basic/text'], Subtle: ['accents/accent-secondary-subtle', 'basic/text'],
    Success: ['functional/success-subtle', 'functional/success-standard'], Warning: ['functional/warning-subtle', 'functional/warning-standard'], Error: ['functional/destructive-subtle', 'functional/destructive-standard'],
    Savings: ['accents/accent-subtle', 'accents/text-on-accent-subtle'], Promotion: ['basic/accent', 'basic/text-on-accent'], Disabled: ['state/disabled-background-disabled', 'state/disabled-text-disabled'] };
  const SIZES = { Small: { py: 2, px: 4, r: 4, gap: 4, font: 'DT/Microcopy Bold', icon: 12 }, Medium: { py: 2, px: 8, r: 4, gap: 4, font: 'DT/Body S Bold', icon: 12 }, Standard: { py: 4, px: 8, r: 6, gap: 8, font: 'DT/Body M Bold', icon: 16 } };
  const comps = [];
  for (const sz in SIZES) for (const tp in TYPES) {
    const s = SIZES[sz], [bg, ink] = TYPES[tp]; const dark = /Strong|Promotion/.test(tp);
    const c = figma.createComponent(); sec.appendChild(c); c.name = `Type=${tp}, Size=${sz}`; hl(c); c.itemSpacing = s.gap; c.paddingTop = c.paddingBottom = s.py + 1; c.paddingLeft = c.paddingRight = s.px + 1; c.cornerRadius = s.r;
    c.fills = [P(bg, dark ? K : W)];
    c.appendChild(slot('Icon', 'price_tag', P(ink, dark ? W : K), s.icon)); c.appendChild(await text('Tag', s.font, P(ink, dark ? W : K)));
    comps.push(c);
  }
  const set = figma.combineAsVariants(comps, sec); set.name = 'DT Tag Static';
  const pL = set.addComponentProperty('Label', 'TEXT', 'Tag'), pS = set.addComponentProperty('Show icon', 'BOOLEAN', false), pI = set.addComponentProperty('Icon', 'INSTANCE_SWAP', ic('price_tag', 16).id);
  for (const c of set.children) { c.findOne(n => n.name === 'Label').componentPropertyReferences = { characters: pL }; const sl = c.findOne(n => n.name === 'Icon' && n.type === 'FRAME'); sl.componentPropertyReferences = { visible: pS }; sl.findOne(n => n.type === 'INSTANCE').componentPropertyReferences = { mainComponent: pI }; }
  finish(set, 'ODS TagStatic (Components/Tag/Tag Static). Type Basic / Strong / Medium / Subtle / Success / Warning / Error / Savings / Promotion, plus Disabled. Size Small (2/4 padding, radius 4, Microcopy Bold 12, icon 12, gap 4) / Medium (2/8, radius 4, Body S Bold 14, icon 12, gap 4) / Standard (4/8, radius-extra-small 6, Body M Bold 16, icon 16, gap 8). 1px transparent border included. Label, Show icon, Icon.');
  built.tag = set.id;
}
// ---------- Tag Dismissible
if (want('tagd')) {
  sec.children.filter(n => n.name === 'DT Tag Dismissible').forEach(n => n.remove());
  const T = { Basic: ['basic/background', 'basic/text', 'state/hover-background-subtle-hover', 'state/pressed-background-subtle-pressed', 'state/focus-focus'], Subtle: ['basic/background-subtle', 'basic/text', 'state/hover-background-subtle-hover', 'state/pressed-background-subtle-pressed', 'state/focus-focus'],
    Strong: ['basic/accent-secondary', 'basic/text-on-accent-secondary', 'state/hover-accent-secondary-hover', 'state/pressed-accent-secondary-pressed', 'basic/text-on-accent-secondary'] };
  const comps = [];
  for (const tp in T) for (const st of ['Default', 'Close hover', 'Close pressed', 'Focus', 'Disabled']) {
    const [bg, ink, hov, prs, foc] = T[tp]; const dis = st === 'Disabled'; const inkP = () => P(dis ? 'state/disabled-text-disabled' : ink, tp === 'Strong' && !dis ? W : K);
    const c = figma.createComponent(); sec.appendChild(c); c.name = `Type=${tp}, State=${st}`; hl(c); c.paddingLeft = c.paddingRight = c.paddingTop = c.paddingBottom = 8; c.minHeight = 48; c.minWidth = 48;
    const tag = hl(figma.createFrame()); tag.name = 'Tag'; c.appendChild(tag); tag.itemSpacing = 8; tag.paddingTop = tag.paddingBottom = 5; tag.paddingLeft = 9; tag.paddingRight = 5; tag.cornerRadius = 6;
    tag.fills = [P(dis ? 'state/disabled-background-disabled' : bg, tp === 'Strong' && !dis ? K : W)];
    tag.appendChild(slot('Icon', 'price_tag', inkP(), 16)); tag.appendChild(await text('Tag', 'DT/Body M Bold', inkP()));
    const cb = hl(figma.createFrame()); cb.name = 'Close button'; tag.appendChild(cb); cb.cornerRadius = 6; cb.paddingLeft = cb.paddingRight = cb.paddingTop = cb.paddingBottom = 2;
    if (st === 'Close hover') cb.fills = [P(hov, W)]; if (st === 'Close pressed') cb.fills = [P(prs, W)];
    cb.appendChild(slot('Close', 'close', inkP(), 16));
    if (st === 'Focus') { cb.strokes = [P(foc, tp === 'Strong' ? W : K)]; cb.strokeWeight = 1; cb.strokeAlign = 'OUTSIDE'; }
    comps.push(c);
  }
  const set = figma.combineAsVariants(comps, sec); set.name = 'DT Tag Dismissible';
  const pL = set.addComponentProperty('Label', 'TEXT', 'Tag'), pS = set.addComponentProperty('Show icon', 'BOOLEAN', false), pI = set.addComponentProperty('Icon', 'INSTANCE_SWAP', ic('price_tag', 16).id);
  for (const c of set.children) { c.findOne(n => n.name === 'Label').componentPropertyReferences = { characters: pL }; const sl = c.findOne(n => n.name === 'Icon' && n.type === 'FRAME'); sl.componentPropertyReferences = { visible: pS }; sl.findOne(n => n.type === 'INSTANCE').componentPropertyReferences = { mainComponent: pI }; }
  finish(set, 'ODS TagDismissible (Components/Tag/Tag Dismissible). Type Basic / Subtle / Strong. Tap area min 48 with 8 padding; tag 4/8 padding (+1px border), radius-extra-small 6, gap 8, Body M Bold, icon 16, close button radius 6 with 16 close icon. States Default / Close hover / Close pressed / Focus (1px outline on close) / Disabled. Use 8px gaps between tags in a group.');
  built.tagd = set.id;
}
// ---------- Badge Number
if (want('bnum')) {
  sec.children.filter(n => n.name === 'DT Badge Number').forEach(n => n.remove());
  const comps = [];
  for (const vr of ['Notification', 'Neutral']) for (const sz of ['Small', 'Standard', 'Large']) {
    const bg = vr === 'Notification' ? 'basic/accent' : 'basic/accent-secondary', ink = vr === 'Notification' ? 'basic/text-on-accent' : 'basic/text-on-accent-secondary';
    const c = figma.createComponent(); sec.appendChild(c); c.name = `Variant=${vr}, Size=${sz}`; c.cornerRadius = 999; c.fills = [P(bg, vr === 'Neutral' ? K : W)];
    if (sz === 'Small') { c.resize(10, 10); c.strokes = [P('basic/background', W)]; c.strokeWeight = 1; c.strokeAlign = 'INSIDE'; }
    else { hl(c); c.primaryAxisAlignItems = 'CENTER'; c.paddingLeft = c.paddingRight = 4; c.minHeight = sz === 'Large' ? 22 : 16; c.minWidth = sz === 'Large' ? 22 : 16; c.counterAxisSizingMode = 'FIXED'; c.resize(c.width, sz === 'Large' ? 22 : 16);
      const t = await text('3', sz === 'Large' ? 'DT/Body M Bold' : 'DT/Microcopy Bold', P(ink, W)); t.name = 'Number'; t.textAlignHorizontal = 'CENTER'; c.appendChild(t); }
    comps.push(c);
  }
  const set = figma.combineAsVariants(comps, sec); set.name = 'DT Badge Number';
  const pN = set.addComponentProperty('Number', 'TEXT', '3'); for (const c of set.children) { const t = c.findOne(n => n.name === 'Number'); if (t) t.componentPropertyReferences = { characters: pN }; }
  finish(set, 'ODS BadgeNumber (Components/Badge/Badge Number). Variant Notification (basic/accent) / Neutral (basic/accent-secondary). Size Small = 10px dot with 1px basic/background ring, no number; Standard = min 16, padding 0/4, Microcopy Bold; Large = min 22, padding 0/4, Body M Bold. Radius full. Number property.');
  built.bnum = set.id;
}
// ---------- Badge Icon
if (want('bicon')) {
  sec.children.filter(n => n.name === 'DT Badge Icon').forEach(n => n.remove());
  const comps = [];
  for (const md of ['Success', 'Error']) for (const sz of ['Small', 'Standard', 'Large']) {
    const bg = md === 'Success' ? 'functional/success-standard' : 'functional/destructive-standard';
    const c = figma.createComponent(); sec.appendChild(c); c.name = `Mode=${md}, Size=${sz}`; c.cornerRadius = 999; c.fills = [P(bg, W)];
    if (sz === 'Small') { c.resize(10, 10); c.strokes = [P('basic/background', W)]; c.strokeWeight = 1; c.strokeAlign = 'INSIDE'; }
    else { const d = sz === 'Large' ? 22 : 16, isz = sz === 'Large' ? 16 : 12; hl(c); c.primaryAxisAlignItems = 'CENTER'; c.primaryAxisSizingMode = 'FIXED'; c.counterAxisSizingMode = 'FIXED'; c.resize(d, d);
      if (md === 'Error') c.paddingBottom = 2; c.appendChild(slot('Icon', md === 'Success' ? 'checkmark' : 'error', P('basic/text-on-accent-secondary', W), isz)); }
    comps.push(c);
  }
  const set = figma.combineAsVariants(comps, sec); set.name = 'DT Badge Icon';
  finish(set, 'ODS BadgeIcon (Components/Badge/Badge Icon). Mode Success (functional/success-standard, checkmark) / Error (functional/destructive-standard, error icon, 2px bottom padding). Size Small = 10px dot with 1px basic/background ring; Standard = 16 with 12 icon; Large = 22 with 16 icon. Icon ink basic/text-on-accent-secondary. Radius full.');
  built.bicon = set.id;
}
// ---------- Chips (Filter / Toggle / Dismissible)
const CH = { un: { Default: ['basic/stroke', null], Hover: ['state/hover-stroke-hover', 'state/hover-background-hover'], Pressed: ['state/pressed-stroke-pressed', 'state/pressed-background-pressed'], Focus: ['basic/stroke', 'basic/background'], Disabled: ['state/disabled-stroke-disabled', 'state/disabled-background-disabled'] },
  sel: { Default: 'basic/accent-secondary', Hover: 'state/hover-accent-secondary-hover', Pressed: 'state/pressed-accent-secondary-pressed', Focus: 'basic/accent-secondary', Disabled: 'state/disabled-accent-secondary-disabled' } };
async function chipBody(c, selected, st, leftPad, rightPad) {
  hl(c); c.paddingLeft = c.paddingRight = 0; c.paddingTop = c.paddingBottom = 4; c.minHeight = 48; c.minWidth = 64; c.clipsContent = false;
  const ch = hl(figma.createFrame()); ch.name = 'Chip'; c.appendChild(ch); ch.itemSpacing = 8; ch.paddingLeft = leftPad + 1; ch.paddingRight = rightPad + 1; ch.cornerRadius = 999; ch.counterAxisSizingMode = 'FIXED'; ch.resize(ch.width, 40); ch.primaryAxisSizingMode = 'AUTO'; ch.minWidth = 64;
  const dis = st === 'Disabled';
  if (selected) { ch.fills = [P(CH.sel[st], K)]; } else { const [stroke, bg] = CH.un[st]; ch.fills = bg ? [P(bg, W)] : []; ch.strokes = [P(stroke)]; ch.strokeWeight = 1; ch.strokeAlign = 'INSIDE'; }
  const ink = selected ? (dis ? 'state/disabled-text-on-accent-secondary-disabled' : 'basic/text-on-accent-secondary') : (dis ? 'state/disabled-text-disabled' : 'basic/text');
  if (st === 'Focus') ring(ch, 999, 3);
  return { ch, ink: () => P(ink, selected && !dis ? W : K) };
}
if (want('filter')) {
  sec.children.filter(n => n.name === 'DT Filter Chip').forEach(n => n.remove()); const comps = [];
  for (const sel of ['No', 'Yes']) for (const ex of ['No', 'Yes']) for (const st of ['Default', 'Hover', 'Pressed', 'Focus', 'Disabled']) {
    const c = figma.createComponent(); sec.appendChild(c); c.name = `Selected=${sel}, Expanded=${ex}, State=${st}`;
    const { ch, ink } = await chipBody(c, sel === 'Yes', st, 20, 16); ch.appendChild(await text('Filter', 'DT/Body M Bold', ink())); ch.appendChild(slot('Chevron', ex === 'Yes' ? 'collapse_up' : 'collapse_down', ink(), 24));
    comps.push(c);
  }
  const set = figma.combineAsVariants(comps, sec); set.name = 'DT Filter Chip'; const pL = set.addComponentProperty('Label', 'TEXT', 'Filter');
  for (const c of set.children) c.findOne(n => n.name === 'Label').componentPropertyReferences = { characters: pL };
  finish(set, 'ODS FilterChip (Components/Chips/Filter Chip). Tap area min 48; chip 40 high, min width 64, padding 0 16 0 20 (+1px border), gap 8, radius full, Body M Bold, collapse icon 24 (down / up when Expanded). Unselected: transparent with 1px basic/stroke; Selected: basic/accent-secondary with text-on-accent-secondary. States Default / Hover / Pressed / Focus (2px ring) / Disabled.');
  built.filter = set.id;
}
if (want('toggle')) {
  sec.children.filter(n => n.name === 'DT Toggle Chip').forEach(n => n.remove()); const comps = [];
  for (const sel of ['No', 'Yes']) for (const st of ['Default', 'Hover', 'Pressed', 'Focus', 'Disabled']) {
    const c = figma.createComponent(); sec.appendChild(c); c.name = `Selected=${sel}, State=${st}`;
    const { ch, ink } = await chipBody(c, sel === 'Yes', st, 20, 20);
    const ico = slot('Icon', sel === 'Yes' ? 'checkmark' : 'price_tag', ink(), 16); ch.appendChild(ico); if (sel === 'Yes') ico.name = 'Checkmark';
    ch.appendChild(await text('Chip', 'DT/Body M Bold', ink())); comps.push(c);
  }
  const set = figma.combineAsVariants(comps, sec); set.name = 'DT Toggle Chip';
  const pL = set.addComponentProperty('Label', 'TEXT', 'Chip'), pS = set.addComponentProperty('Show icon', 'BOOLEAN', false), pI = set.addComponentProperty('Icon', 'INSTANCE_SWAP', ic('price_tag', 16).id);
  for (const c of set.children) { c.findOne(n => n.name === 'Label').componentPropertyReferences = { characters: pL }; const sl = c.findOne(n => n.name === 'Icon' && n.type === 'FRAME'); if (sl) { sl.componentPropertyReferences = { visible: pS }; sl.findOne(n => n.type === 'INSTANCE').componentPropertyReferences = { mainComponent: pI }; } }
  finish(set, 'ODS ToggleChip (Components/Chips/Toggle Chip). Tap area min 48; chip 40 high, min width 64, padding 0/20 (+1px border), gap 8, radius full, Body M Bold, icon 16; selected shows a 16 checkmark. Unselected: transparent, 1px basic/stroke; Selected: basic/accent-secondary. States Default / Hover / Pressed / Focus (2px ring) / Disabled.');
  built.toggle = set.id;
}
if (want('dchip')) {
  sec.children.filter(n => n.name === 'DT Dismissible Chip').forEach(n => n.remove()); const comps = [];
  for (const st of ['Default', 'Hover', 'Pressed', 'Focus', 'Disabled']) {
    const c = figma.createComponent(); sec.appendChild(c); c.name = `State=${st}`; hl(c); c.paddingTop = c.paddingBottom = 4; c.minHeight = 48; c.minWidth = 64; c.clipsContent = false;
    const dis = st === 'Disabled'; const ch = hl(figma.createFrame()); ch.name = 'Chip'; c.appendChild(ch); ch.itemSpacing = 8; ch.paddingLeft = 21; ch.paddingRight = 13; ch.cornerRadius = 999; ch.counterAxisSizingMode = 'FIXED'; ch.resize(ch.width, 40); ch.primaryAxisSizingMode = 'AUTO';
    ch.fills = [P(dis ? 'state/disabled-accent-secondary-disabled' : 'basic/accent-secondary', K)]; const ink = () => P(dis ? 'state/disabled-text-on-accent-secondary-disabled' : 'basic/text-on-accent-secondary', W);
    const ico = slot('Icon', 'price_tag', ink(), 16); ch.appendChild(ico); ch.appendChild(await text('Chip', 'DT/Body M Bold', ink()));
    const a = hl(figma.createFrame()); a.name = 'Action'; ch.appendChild(a); a.cornerRadius = 6; a.paddingLeft = a.paddingRight = a.paddingTop = a.paddingBottom = 4;
    if (st === 'Hover') a.fills = [P('state/hover-accent-secondary-hover', K)]; if (st === 'Pressed') a.fills = [P('state/pressed-accent-secondary-pressed', K)];
    a.appendChild(slot('Close', 'close', ink(), 16)); if (st === 'Focus') { a.strokes = [P('basic/text-on-accent-secondary', W)]; a.strokeWeight = 2; a.strokeAlign = 'OUTSIDE'; }
    comps.push(c);
  }
  const set = figma.combineAsVariants(comps, sec); set.name = 'DT Dismissible Chip';
  const pL = set.addComponentProperty('Label', 'TEXT', 'Chip'), pS = set.addComponentProperty('Show icon', 'BOOLEAN', true), pI = set.addComponentProperty('Icon', 'INSTANCE_SWAP', ic('price_tag', 16).id);
  for (const c of set.children) { c.findOne(n => n.name === 'Label').componentPropertyReferences = { characters: pL }; const sl = c.findOne(n => n.name === 'Icon' && n.type === 'FRAME'); sl.componentPropertyReferences = { visible: pS }; sl.findOne(n => n.type === 'INSTANCE').componentPropertyReferences = { mainComponent: pI }; }
  finish(set, 'ODS DismissibleChip (Components/Chips/Dismissible Chip). Tap area min 48; chip 40 high, padding 0/20 (+1px border), gap 8, radius full, basic/accent-secondary with text-on-accent-secondary, Body M Bold, optional 16 icon (variant withIcon / standard), close action radius-extra-small 6 with 16 close icon. States Default / Hover / Pressed (on the close action) / Focus (2px outline) / Disabled.');
  built.dchip = set.id;
}
return { section: sec.id, built };
