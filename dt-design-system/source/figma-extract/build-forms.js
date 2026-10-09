/* ODS form + feedback components on 🎨 DT Pilot, section "DT Form & Feedback". ARGS {only?: [...]} */
const page = await figma.getNodeByIdAsync('15012:25752'); await figma.setCurrentPageAsync(page);
const V = {}; for (const v of await figma.variables.getLocalVariablesAsync()) V[v.name] = v;
const TS = {}; for (const s of await figma.getLocalTextStylesAsync()) TS[s.name] = s;
for (const st of ['Bold', 'Medium']) await figma.loadFontAsync({ family: 'TeleNeo Var', style: st });
const W = { r: 1, g: 1, b: 1 }, K = { r: 0, g: 0, b: 0 };
const P = (n, c) => { if (!V[n]) throw new Error('missing var ' + n); return figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: c || K }, 'color', V[n]); };
const icons = page.children.find(n => n.name === 'DT Icons'); const IC = {}; icons.findAllWithCriteria({ types: ['COMPONENT_SET'] }).forEach(s => { IC[s.name.split('/').pop()] = s; });
const ic = (n, sz) => (IC[n] || IC['information']).children.find(c => c.name === 'Style=Outline, Size=' + (sz <= 16 ? 16 : 24));
function slot(name, iconName, ink, sz) { const f = figma.createFrame(); f.name = name; f.resize(sz, sz); f.fills = []; f.clipsContent = true;
  const g = figma.createFrame(); g.name = 'Glyph'; g.resize(sz, sz); g.fills = []; f.appendChild(g); const i = ic(iconName, sz).createInstance(); i.name = 'Icon'; g.appendChild(i); if (i.width !== sz) i.rescale(sz / i.width); i.x = 0; i.y = 0; g.isMask = true; g.maskType = 'ALPHA';
  const r = figma.createRectangle(); r.name = 'Ink'; r.resize(sz, sz); r.fills = [ink]; f.appendChild(r); return f; }
async function text(s, style, ink, name) { const t = figma.createText(); await t.setTextStyleIdAsync(TS[style].id); t.characters = s; t.fills = [ink]; t.name = name || 'Label'; return t; }
const auto = (name, dir) => { const f = figma.createFrame(); f.name = name; f.layoutMode = dir || 'HORIZONTAL'; f.counterAxisAlignItems = dir === 'VERTICAL' ? 'MIN' : 'CENTER'; f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO'; f.fills = []; return f; };
let sec = page.children.find(n => n.type === 'SECTION' && n.name === 'DT Form & Feedback');
if (!sec) { const ref = page.children.find(n => n.type === 'SECTION' && n.name === 'DT Tags, Badges & Chips'); sec = figma.createSection(); sec.name = 'DT Form & Feedback'; sec.x = ref.x; sec.y = ref.y + ref.height + 200; sec.resizeWithoutConstraints(2400, 400); }
const only = ARGS && ARGS.only; const want = n => !only || only.includes(n);
function finish(set, desc, w) { set.layoutMode = 'HORIZONTAL'; set.layoutWrap = 'WRAP'; set.itemSpacing = 32; set.counterAxisSpacing = 32; set.counterAxisAlignItems = 'MIN';
  set.paddingLeft = set.paddingRight = set.paddingTop = set.paddingBottom = 32; set.primaryAxisSizingMode = 'FIXED'; set.resize(w || 2000, 100); set.counterAxisSizingMode = 'AUTO';
  set.fills = [P('neutral/200', { r: .87, g: .87, b: .87 })]; set.cornerRadius = 16; set.description = desc;
  const others = sec.children.filter(n => n !== set); set.x = 80; set.y = others.length ? Math.max(...others.map(n => n.y + n.height)) + 80 : 120;
  sec.resizeWithoutConstraints(Math.max(sec.width, set.width + 160), set.y + set.height + 80); return set; }
function bindProps(set, defs) { const keys = {}; for (const [name, type, def] of defs) keys[name] = set.addComponentProperty(name, type, def);
  for (const c of set.children) for (const [name, type, , layer, field] of defs) { const n = c.findOne(x => x.name === layer); if (n) { const refs = Object.assign({}, n.componentPropertyReferences || {}); refs[field] = keys[name]; n.componentPropertyReferences = refs; } } return keys; }
const built = {};
const FIELD = { Empty: ['basic/stroke', 'basic/background'], Hover: ['state/hover-stroke-hover', 'state/hover-background-hover'], Focused: ['state/focus-stroke-active', 'basic/background'], Filled: ['basic/stroke', 'basic/background'], Error: ['functional/destructive-standard', 'basic/background'], Disabled: ['state/disabled-stroke-disabled', 'state/disabled-background-disabled'] };
async function support(mode, disabled) { const s = auto('Support message'); s.itemSpacing = 4; const ico = mode === 'Error' ? 'error' : mode === 'Success' ? 'success' : 'information';
  const ink = disabled ? 'state/disabled-text-recessive-disabled' : mode === 'Error' ? 'functional/destructive-standard' : mode === 'Success' ? 'functional/success-standard' : 'basic/text-recessive';
  s.appendChild(slot('Support icon', ico, P(ink), 16)); s.appendChild(await text(mode === 'Error' ? 'Error message' : 'Helper text', 'DT/Body S Bold', P(disabled ? 'state/disabled-text-recessive-disabled' : 'basic/text'), 'Support text')); return s; }
async function field(kind, st) {
  const c = figma.createComponent(); sec.appendChild(c); c.name = 'State=' + st; c.layoutMode = 'VERTICAL'; c.itemSpacing = 8; c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'FIXED'; c.resize(360, 100); c.fills = []; c.clipsContent = false;
  const [stroke, bg] = FIELD[st]; const dis = st === 'Disabled', floated = st === 'Focused' || st === 'Filled' || st === 'Error';
  const box = figma.createFrame(); box.name = 'Input field'; c.appendChild(box); box.layoutMode = 'HORIZONTAL'; box.counterAxisAlignItems = kind === 'area' ? 'MIN' : 'CENTER'; box.itemSpacing = 8; box.paddingLeft = kind === 'area' ? 20 : 24; box.paddingRight = kind === 'area' ? 20 : 8;
  if (kind === 'area') { box.paddingTop = box.paddingBottom = 20; }
  box.cornerRadius = 16; box.fills = [P(bg, W)]; box.strokes = [P(stroke)]; box.strokeWeight = st === 'Error' ? 3 : 1; box.strokeAlign = 'INSIDE'; box.layoutSizingHorizontal = 'FILL'; box.primaryAxisSizingMode = 'FIXED'; box.counterAxisSizingMode = 'FIXED'; box.resize(360, kind === 'area' ? 160 : 58); box.clipsContent = false;
  const content = auto('Content', 'VERTICAL'); content.itemSpacing = 2; box.appendChild(content); content.layoutGrow = 1; content.counterAxisSizingMode = 'FIXED';
  const labInk = dis ? 'state/disabled-text-disabled' : 'basic/text-recessive';
  const lab = await text('Label', floated ? 'DT/Body S Bold' : 'DT/Body M Bold', P(labInk), 'Label'); content.appendChild(lab); lab.layoutSizingHorizontal = 'FILL';
  const val = await text(kind === 'area' ? 'Entered text wraps over several lines inside the text area.' : 'Entered value', 'DT/Body M Bold', P(dis ? 'state/disabled-text-disabled' : 'basic/text'), 'Value'); content.appendChild(val); val.layoutSizingHorizontal = 'FILL'; if (kind === 'area') val.textAutoResize = 'HEIGHT';
  val.visible = floated || (st === 'Disabled' && false);
  if (kind !== 'area') { const iw = auto('Icon container'); iw.primaryAxisSizingMode = 'FIXED'; iw.counterAxisSizingMode = 'FIXED'; iw.resize(48, 48); iw.primaryAxisAlignItems = 'CENTER'; box.appendChild(iw); iw.appendChild(slot('Right icon', 'search', P(dis ? 'state/disabled-text-disabled' : 'basic/text-recessive'), 24)); iw.visible = false; }
  if (st === 'Focused') { const r = figma.createRectangle(); r.name = 'Focus ring'; box.appendChild(r); r.layoutPositioning = 'ABSOLUTE'; r.x = -4; r.y = -4; r.resize(box.width + 8, box.height + 8); r.cornerRadius = 20; r.fills = []; r.strokes = [P('state/focus-focus')]; r.strokeWeight = 2; r.strokeAlign = 'INSIDE'; r.constraints = { horizontal: 'STRETCH', vertical: 'STRETCH' }; }
  const sup = auto('Support row'); sup.itemSpacing = 8; sup.paddingLeft = kind === 'area' ? 20 : 24; c.appendChild(sup); sup.layoutSizingHorizontal = 'FILL'; sup.counterAxisAlignItems = 'MIN';
  const sm = await support(st === 'Error' ? 'Error' : 'Informative', dis); sup.appendChild(sm); sm.layoutGrow = 1;
  const cnt = await text('0/100', 'DT/Body S Regular', P(dis ? 'state/disabled-text-recessive-disabled' : 'basic/text-recessive'), 'Counter'); cnt.textAlignHorizontal = 'RIGHT'; sup.appendChild(cnt); cnt.resize(80, cnt.height); cnt.textAutoResize = 'HEIGHT';
  return c;
}
if (want('textfield') || want('textarea')) for (const kind of ['field', 'area']) {
  if (kind === 'field' && !want('textfield')) continue; if (kind === 'area' && !want('textarea')) continue;
  const name = kind === 'field' ? 'DT Text Field' : 'DT Text Area'; sec.children.filter(n => n.name === name).forEach(n => n.remove());
  const comps = []; for (const st of Object.keys(FIELD)) comps.push(await field(kind, st));
  const set = figma.combineAsVariants(comps, sec); set.name = name;
  bindProps(set, [['Label', 'TEXT', 'Label', 'Label', 'characters'], ['Value', 'TEXT', kind === 'area' ? 'Entered text wraps over several lines inside the text area.' : 'Entered value', 'Value', 'characters'],
    ['Support text', 'TEXT', 'Helper text', 'Support text', 'characters'], ['Show support', 'BOOLEAN', true, 'Support message', 'visible'], ['Counter', 'TEXT', '0/100', 'Counter', 'characters'], ['Show counter', 'BOOLEAN', true, 'Counter', 'visible']]
    .concat(kind === 'field' ? [['Show icon', 'BOOLEAN', false, 'Icon container', 'visible']] : []));
  finish(set, kind === 'field'
    ? 'ODS TextField, size small: input field min 58 high, radius-medium 16, padding 0 8 0 24, 1px basic/stroke (3px destructive in Error, focus-stroke-active + 2px focus ring when Focused). Floating label: Body M Bold recessive when empty, Body S Bold (14) above the value when focused / filled. Value Body M Bold. Support row (padding-left 24): Support Message (Body S Bold 14 + 16 icon) and Counter (Body S Regular 14, 80 wide). Optional 24 icon in a 48 container. States Empty / Hover / Focused / Filled / Error / Disabled.'
    : 'ODS TextArea, size small: min height 160 (sizing-component-20), padding 20, radius-medium 16, 1px basic/stroke (3px destructive in Error). Floating label Body M Bold → Body S Bold (14) when focused / filled; value Body M Bold, wraps. Support row: Support Message (Body S Bold 14) + Counter (Body S Regular 14). States Empty / Hover / Focused / Filled / Error / Disabled.', 2400);
  built[kind] = set.id;
}
if (want('dropdown')) {
  sec.children.filter(n => n.name === 'DT Dropdown Select').forEach(n => n.remove()); const comps = [];
  const S = { Default: ['basic/stroke', 'basic/background'], Hover: ['state/hover-stroke-hover', 'state/hover-background-hover'], Pressed: ['state/pressed-stroke-pressed', 'state/pressed-background-pressed'], Focus: ['basic/stroke', 'basic/background'], Selected: ['basic/stroke', 'basic/background'], Expanded: ['basic/stroke', 'basic/background'], Error: ['functional/destructive-standard', 'basic/background'], Disabled: ['state/disabled-stroke-disabled', 'state/disabled-background-disabled'] };
  for (const st in S) {
    const c = figma.createComponent(); sec.appendChild(c); c.name = 'State=' + st; c.layoutMode = 'VERTICAL'; c.itemSpacing = 8; c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'FIXED'; c.resize(320, 100); c.fills = []; c.clipsContent = false;
    const [stroke, bg] = S[st]; const dis = st === 'Disabled', sel = st === 'Selected' || st === 'Expanded';
    const box = figma.createFrame(); box.name = 'Input field'; c.appendChild(box); box.layoutMode = 'HORIZONTAL'; box.counterAxisAlignItems = 'CENTER'; box.itemSpacing = 8; box.paddingLeft = 24; box.paddingRight = 8; box.cornerRadius = 16; box.fills = [P(bg, W)];
    box.strokes = [P(stroke)]; box.strokeWeight = st === 'Error' ? 3 : 1; box.strokeAlign = 'INSIDE'; box.layoutSizingHorizontal = 'FILL'; box.primaryAxisSizingMode = 'FIXED'; box.counterAxisSizingMode = 'FIXED'; box.resize(320, 58); box.clipsContent = false;
    const content = auto('Content', 'VERTICAL'); content.itemSpacing = 2; box.appendChild(content); content.layoutGrow = 1;
    const lab = await text('Label', sel ? 'DT/Body S Bold' : 'DT/Body M Bold', P(dis ? 'state/disabled-text-disabled' : 'basic/text-recessive'), 'Label'); content.appendChild(lab);
    const val = await text('Option 1', 'DT/Body M Bold', P(dis ? 'state/disabled-text-disabled' : 'basic/text'), 'Value'); content.appendChild(val); val.visible = sel;
    const iw = auto('Chevron container'); iw.primaryAxisSizingMode = 'FIXED'; iw.counterAxisSizingMode = 'FIXED'; iw.resize(48, 48); iw.primaryAxisAlignItems = 'CENTER'; box.appendChild(iw);
    iw.appendChild(slot('Chevron', st === 'Expanded' ? 'collapse_up' : 'collapse_down', P(dis ? 'state/disabled-text-disabled' : 'basic/text-recessive'), 24));
    if (st === 'Focus') { const r = figma.createRectangle(); r.name = 'Focus ring'; box.appendChild(r); r.layoutPositioning = 'ABSOLUTE'; r.x = -5; r.y = -5; r.resize(box.width + 10, box.height + 10); r.cornerRadius = 21; r.fills = []; r.strokes = [P('state/focus-focus')]; r.strokeWeight = 2; r.strokeAlign = 'INSIDE'; r.constraints = { horizontal: 'STRETCH', vertical: 'STRETCH' }; }
    const sup = auto('Support row'); sup.paddingLeft = 24; c.appendChild(sup); sup.layoutSizingHorizontal = 'FILL'; sup.appendChild(await support(st === 'Error' ? 'Error' : 'Informative', dis));
    comps.push(c);
  }
  const set = figma.combineAsVariants(comps, sec); set.name = 'DT Dropdown Select';
  bindProps(set, [['Label', 'TEXT', 'Label', 'Label', 'characters'], ['Value', 'TEXT', 'Option 1', 'Value', 'characters'], ['Support text', 'TEXT', 'Helper text', 'Support text', 'characters'], ['Show support', 'BOOLEAN', false, 'Support message', 'visible']]);
  finish(set, 'ODS DropdownSelect, size small: input field min 58, radius-medium 16, padding 0 8 0 24, 1px basic/stroke (3px destructive in Error), 24 collapse chevron in a 48 container. Label Body M Bold recessive; once selected the label shrinks to Body S Bold (14) above the value (Body M Bold). Focus: 2px ring, offset 5. Open the list with DT Flyout Menu Item (Checked). States Default / Hover / Pressed / Focus / Selected / Expanded / Error / Disabled.', 2400);
  built.dropdown = set.id;
}
if (want('tooltip')) {
  sec.children.filter(n => n.name === 'DT Tooltip').forEach(n => n.remove()); const comps = [];
  for (const pin of ['Bottom', 'Top', 'Left', 'Right', 'None']) {
    const c = figma.createComponent(); sec.appendChild(c); c.name = 'Pin=' + pin; c.layoutMode = (pin === 'Left' || pin === 'Right') ? 'HORIZONTAL' : 'VERTICAL'; c.counterAxisAlignItems = 'CENTER'; c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'AUTO'; c.fills = []; c.itemSpacing = 0;
    const b = auto('Tooltip'); b.paddingTop = b.paddingBottom = 4; b.paddingLeft = b.paddingRight = 12; b.cornerRadius = 4; b.fills = [P('basic/accent-secondary', K)];
    const t = await text('Tooltip content', 'DT/Body S Bold', P('basic/text-on-accent-secondary', W), 'Label'); b.appendChild(t);
    const tri = figma.createPolygon(); tri.name = 'Pin'; tri.pointCount = 3; tri.resize(12, 6); tri.fills = [P('basic/accent-secondary', K)];
    if (pin === 'Top') { tri.rotation = 0; c.appendChild(tri); c.appendChild(b); } else if (pin === 'Bottom') { tri.rotation = 180; c.appendChild(b); c.appendChild(tri); }
    else if (pin === 'Left') { tri.rotation = 90; c.appendChild(tri); c.appendChild(b); } else if (pin === 'Right') { tri.rotation = -90; c.appendChild(b); c.appendChild(tri); } else { c.appendChild(b); tri.remove(); }
    comps.push(c);
  }
  const set = figma.combineAsVariants(comps, sec); set.name = 'DT Tooltip'; bindProps(set, [['Label', 'TEXT', 'Tooltip content', 'Label', 'characters']]);
  for (const c of set.children) { const t = c.findOne(n => n.name === 'Label'); t.textAutoResize = 'WIDTH_AND_HEIGHT'; }
  finish(set, 'ODS Tooltip: basic/accent-secondary background, padding 4/12, radius 4, label Body S Bold (14) basic/text-on-accent-secondary, max width 230, 6px pin. Pin Bottom / Top / Left / Right / None.', 1400);
  built.tooltip = set.id;
}
if (want('support')) {
  sec.children.filter(n => n.name === 'DT Support Message').forEach(n => n.remove()); const comps = [];
  for (const md of ['Informative', 'Error', 'Success', 'Disabled']) { const c = figma.createComponent(); sec.appendChild(c); c.name = 'Mode=' + md; c.layoutMode = 'HORIZONTAL'; c.counterAxisAlignItems = 'CENTER'; c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'AUTO'; c.fills = []; c.itemSpacing = 4;
    const s = await support(md === 'Disabled' ? 'Informative' : md, md === 'Disabled'); for (const k of [...s.children]) c.appendChild(k); s.remove(); comps.push(c); }
  const set = figma.combineAsVariants(comps, sec); set.name = 'DT Support Message'; bindProps(set, [['Label', 'TEXT', 'Helper text', 'Support text', 'characters']]);
  finish(set, 'ODS SupportMessage: 16 icon + label Body S Bold (14) basic/text, gap 4. Mode Informative (information icon, text-recessive) / Error (error icon, destructive) / Success (success icon, success) / Disabled.', 1400);
  built.support = set.id;
}
if (want('progress')) {
  sec.children.filter(n => n.name === 'DT Progress Bar').forEach(n => n.remove()); const comps = [];
  const M = { Standard: 'basic/text', Highlight: 'basic/accent', Success: 'functional/success-standard', Error: 'functional/destructive-standard', Disabled: 'state/disabled-background-subtle-disabled' };
  for (const md in M) { const c = figma.createComponent(); sec.appendChild(c); c.name = 'Mode=' + md; c.layoutMode = 'VERTICAL'; c.itemSpacing = 4; c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'FIXED'; c.resize(320, 60); c.fills = [];
    const dis = md === 'Disabled'; const top = auto('Main data'); top.itemSpacing = 16; c.appendChild(top); top.layoutSizingHorizontal = 'FILL';
    const lb = await text('Label', 'DT/Microcopy Bold', P(dis ? 'state/disabled-text-disabled' : 'basic/text'), 'Label text'); top.appendChild(lb); lb.layoutGrow = 1;
    if (md === 'Success' || md === 'Error') top.appendChild(slot('Status icon', md === 'Success' ? 'success' : 'warning', P(M[md]), 16));
    const ct = await text(md === 'Success' ? '100%' : '75%', 'DT/Microcopy Bold', P(dis ? 'state/disabled-text-disabled' : 'basic/text'), 'Counter text'); top.appendChild(ct);
    const tr = figma.createFrame(); tr.name = 'Track'; c.appendChild(tr); tr.layoutSizingHorizontal = 'FILL'; tr.resize(320, 8); tr.cornerRadius = 16; tr.fills = [P(dis ? 'state/disabled-background-disabled' : md === 'Error' ? 'functional/destructive-subtle' : 'neutral/200', W)]; tr.clipsContent = true;
    const pr = figma.createRectangle(); pr.name = 'Progress'; tr.appendChild(pr); pr.resize(md === 'Success' ? 320 : dis ? 0.01 : 240, 8); pr.cornerRadius = 16; pr.fills = [P(M[md])]; pr.constraints = { horizontal: 'SCALE', vertical: 'STRETCH' };
    const hp = await text('Helper text', 'DT/Microcopy Bold', P(dis ? 'state/disabled-text-recessive-disabled' : 'basic/text-recessive'), 'Helper text'); c.appendChild(hp);
    comps.push(c); }
  const set = figma.combineAsVariants(comps, sec); set.name = 'DT Progress Bar';
  bindProps(set, [['Label', 'TEXT', 'Label', 'Label text', 'characters'], ['Counter', 'TEXT', '75%', 'Counter text', 'characters'], ['Helper text', 'TEXT', 'Helper text', 'Helper text', 'characters'], ['Show helper', 'BOOLEAN', true, 'Helper text', 'visible']]);
  finish(set, 'ODS ProgressBar: label, counter and helper text in Microcopy Bold (12); helper text-recessive; gap 4; track 8 high (size small), radius-medium, neutral/200. Progress fill: Standard basic/text, Highlight basic/accent, Success success-standard (with success icon), Error destructive (subtle track, warning icon), Disabled. Resize the Progress layer to set the value.', 1800);
  built.progress = set.id;
}
return { section: sec.id, built };
