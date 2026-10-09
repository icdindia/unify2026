/* Recreate 334:112714 (Routines list + "New Routine" menu open) on 🎨 DT Pilot from DT/ODS components.
   1) "DT Routine Row" component set (ODS TableRow pattern, State Default/Hover) in "DT Routines Components".
   2) "Routines list — DT · Light" + Dark twin. Re-run replaces. */
const page = await figma.getNodeByIdAsync('15012:25752'); await figma.setCurrentPageAsync(page);
const V = {}; for (const v of await figma.variables.getLocalVariablesAsync()) V[v.name] = v;
const TS = {}; for (const s of await figma.getLocalTextStylesAsync()) TS[s.name] = s;
for (const st of ['Bold', 'Medium']) await figma.loadFontAsync({ family: 'TeleNeo Var', style: st });
const col = await figma.variables.getVariableCollectionByIdAsync('VariableCollectionId:15009:22503');
const P = (n, c) => figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: c || { r: 0, g: 0, b: 0 } }, 'color', V[n]);
const icons = page.children.find(n => n.name === 'DT Icons'); const IC = {}; icons.findAllWithCriteria({ types: ['COMPONENT_SET'] }).forEach(s => { IC[s.name.split('/').pop()] = s; });
const icon = (names, s) => { for (const n of [].concat(names)) if (IC[n]) return IC[n].children.find(c => c.name === 'Style=Outline, Size=' + s); throw new Error('icon ' + names); };
const AL = (name, dir, gap, o = {}) => { const f = figma.createFrame(); f.name = name; f.layoutMode = dir; f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO'; f.itemSpacing = gap || 0; f.fills = []; f.clipsContent = false; Object.assign(f, o); return f; };
async function T(s, style, ink, name) { const t = figma.createText(); await t.setTextStyleIdAsync(TS[style].id); t.characters = s; t.fills = [P(ink)]; t.name = name || 'Text'; return t; }
const pk = (i, p) => Object.keys(i.componentProperties).find(k => k.startsWith(p));
const BTN = await figma.getNodeByIdAsync('15046:642460'), XS = await figma.getNodeByIdAsync('15054:1341691');
const TAG = await figma.getNodeByIdAsync('15065:180255'), HEAD = await figma.getNodeByIdAsync('15050:142918'), MI = await figma.getNodeByIdAsync('15046:644196'), TIP = await figma.getNodeByIdAsync('15069:117457');
function inkIcon(name, size, ink, label) { const f = figma.createFrame(); f.name = label || 'Icon'; f.resize(size, size); f.fills = []; f.clipsContent = true;
  const g = figma.createFrame(); g.name = 'Glyph'; g.resize(size, size); g.fills = []; f.appendChild(g);
  const i = icon(name, size <= 16 ? 16 : 24).createInstance(); i.name = 'Glyph icon'; g.appendChild(i); if (i.width !== size) i.rescale(size / i.width); i.x = 0; i.y = 0; g.isMask = true; g.maskType = 'ALPHA';
  const r = figma.createRectangle(); r.name = 'Ink'; r.resize(size, size); r.fills = [P(ink)]; f.appendChild(r); return f; }
async function btn(label, variant, left, right) { const i = BTN.children.find(c => c.name === `Variant=${variant}, Type=Standard, State=Default`).createInstance();
  const p = { [pk(i, 'Label')]: label, [pk(i, 'Show left icon')]: !!left, [pk(i, 'Show right icon')]: !!right };
  if (left) p[pk(i, 'Left icon')] = icon(left, 24).id; if (right) p[pk(i, 'Right icon')] = icon(right, 24).id; i.setProperties(p);
  const t = i.findOne(n => n.type === 'TEXT'); if (t) await t.setTextStyleIdAsync(TS['DT/Body S Bold'].id); i.name = label; return i; }
const COLS = [['Name', 305], ['Trigger', 268], ['Cost (last 30 days)', 155], ['Status', 144], ['', 56]];

// ---------- 1. DT Routine Row ----------
const sec = page.children.find(n => n.type === 'SECTION' && n.name === 'DT Routines Components');
sec.children.filter(n => n.name === 'DT Routine Row').forEach(n => n.remove());
const variants = [];
for (const st of ['Default', 'Hover']) {
  const c = figma.createComponent(); sec.appendChild(c); c.name = 'State=' + st; c.layoutMode = 'HORIZONTAL'; c.counterAxisAlignItems = 'CENTER';
  c.primaryAxisSizingMode = 'FIXED'; c.counterAxisSizingMode = 'FIXED'; c.resize(928, 48); c.fills = st === 'Hover' ? [P('state/hover-background-hover')] : [];
  c.strokes = [P('basic/stroke-subtle')]; c.strokeBottomWeight = 1; c.strokeTopWeight = c.strokeLeftWeight = c.strokeRightWeight = 0; c.strokeAlign = 'INSIDE';
  const cell = (name, w) => { const f = AL(name, 'HORIZONTAL', 8, { counterAxisAlignItems: 'CENTER' }); c.appendChild(f); f.primaryAxisSizingMode = 'FIXED'; f.counterAxisSizingMode = 'FIXED'; f.resize(w, 48); f.paddingLeft = f.paddingRight = 12; return f; };
  const n = cell('Name cell', COLS[0][1]);
  const tile = figma.createFrame(); tile.name = 'Tile'; n.appendChild(tile); tile.resize(24, 24); tile.cornerRadius = 6; tile.fills = [P('basic/accent')];
  const ti = inkIcon('news', 16, 'basic/text-on-accent'); tile.appendChild(ti); ti.x = 4; ti.y = 4;
  const nm = await T('Morning brief', 'DT/Body M Bold', 'basic/text', 'Name'); n.appendChild(nm); nm.layoutGrow = 1; nm.textTruncation = 'ENDING';
  n.appendChild(inkIcon('folder', 16, 'basic/text-recessive', 'Project')); n.appendChild(inkIcon('pin', 16, 'basic/text-recessive', 'Pinned'));
  const tr = cell('Trigger cell', COLS[1][1]); tr.appendChild(await T('Every weekday, 6:30 AM', 'DT/Body M Regular', 'basic/text', 'Trigger'));
  const co = cell('Cost cell', COLS[2][1]); co.appendChild(await T('$0.70', 'DT/Body M Regular', 'basic/text', 'Cost'));
  const sc = cell('Status cell', COLS[3][1]); const tg = TAG.children.find(x => x.name === 'Type=Success, Size=Medium').createInstance(); tg.name = 'Status'; sc.appendChild(tg);
  tg.setProperties({ [pk(tg, 'Label')]: 'Active', [pk(tg, 'Show icon')]: true, [pk(tg, 'Icon')]: icon('checkmark', 16).id });
  const ac = cell('Actions cell', COLS[4][1]); ac.primaryAxisAlignItems = 'CENTER';
  const more = XS.children.find(x => x.name === 'Variant=Ghost, State=Default').createInstance(); more.setProperties({ [pk(more, 'Icon')]: icon('more', 16).id }); more.name = 'More'; ac.appendChild(more);
  variants.push(c);
}
const set = figma.combineAsVariants(variants, sec); set.name = 'DT Routine Row';
set.description = 'Routine table row on the ODS TableRow pattern: 48 high, bottom strokes-1 basic/stroke-subtle, Hover = state/hover-background-hover. Cells: Name (24 accent tile + Body M Bold + project/pinned 16 icons), Trigger and Cost (Body M Regular), Status (DT Tag Static Success/Warning, Medium), Actions (XSmall Ghost more).';
const K = { name: set.addComponentProperty('Name', 'TEXT', 'Morning brief'), trig: set.addComponentProperty('Trigger', 'TEXT', 'Every weekday, 6:30 AM'), cost: set.addComponentProperty('Cost', 'TEXT', '$0.70'),
  icon: set.addComponentProperty('Icon', 'INSTANCE_SWAP', icon('news', 16).id), proj: set.addComponentProperty('Show project', 'BOOLEAN', true), pin: set.addComponentProperty('Show pinned', 'BOOLEAN', true) };
for (const c of set.children) {
  c.findOne(n => n.name === 'Name' && n.type === 'TEXT').componentPropertyReferences = { characters: K.name };
  c.findOne(n => n.name === 'Trigger' && n.type === 'TEXT').componentPropertyReferences = { characters: K.trig };
  c.findOne(n => n.name === 'Cost' && n.type === 'TEXT').componentPropertyReferences = { characters: K.cost };
  c.findOne(n => n.name === 'Glyph icon').componentPropertyReferences = { mainComponent: K.icon };
  c.findOne(n => n.name === 'Project').componentPropertyReferences = { visible: K.proj };
  c.findOne(n => n.name === 'Pinned').componentPropertyReferences = { visible: K.pin };
}
set.layoutMode = 'VERTICAL'; set.itemSpacing = 16; set.paddingTop = set.paddingBottom = set.paddingLeft = set.paddingRight = 32; set.primaryAxisSizingMode = 'AUTO'; set.counterAxisSizingMode = 'AUTO';
set.fills = [P('basic/background', { r: 1, g: 1, b: 1 })]; set.cornerRadius = 16;
const card = sec.children.find(n => n.name === 'DT Routine Card'); set.x = 80; set.y = card ? card.y + card.height + 80 : 80;
sec.resizeWithoutConstraints(Math.max(sec.width, set.width + 160), set.y + set.height + 80);

// ---------- 2. screen ----------
for (const n of page.children.filter(n => /^Routines list — DT/.test(n.name))) n.remove();
const F = figma.createFrame(); page.appendChild(F); F.name = 'Routines list — DT · Light'; F.resize(1440, 900); F.layoutMode = 'HORIZONTAL'; F.primaryAxisSizingMode = 'FIXED'; F.counterAxisSizingMode = 'FIXED'; F.fills = [P('basic/background')]; F.clipsContent = true;
const rowRight = (y0, y1) => Math.max(0, ...page.children.filter(n => n !== F && n.y < y1 && n.y + n.height > y0 && n.x > 0).map(n => n.x + n.width));
F.x = Math.max(rowRight(0, 900), rowRight(-2480, -1580)) + 115; F.y = 0;
const nav = (await figma.getNodeByIdAsync('15020:280132')).findOne(n => /^DT Side Nav · open/.test(n.name)).clone(); F.appendChild(nav); nav.layoutSizingVertical = 'FILL';
const main = AL('Main', 'VERTICAL', 0, { counterAxisAlignItems: 'CENTER' }); F.appendChild(main); main.layoutGrow = 1; main.layoutSizingVertical = 'FILL'; main.paddingTop = 60;
const colm = AL('Content', 'VERTICAL', 24); main.appendChild(colm); colm.counterAxisSizingMode = 'FIXED'; colm.resize(928, colm.height);
const ph = AL('Page header', 'HORIZONTAL', 8, { counterAxisAlignItems: 'CENTER' }); colm.appendChild(ph); ph.layoutSizingHorizontal = 'FILL';
const h1 = await T('Routines', 'DT/Title S', 'basic/text', 'Title'); ph.appendChild(h1); h1.layoutGrow = 1;
const srch = BTN.children.find(c => c.name === 'Variant=Ghost, Type=Icon only, State=Default').createInstance(); srch.setProperties({ [pk(srch, 'Left icon')]: icon('search', 24).id }); srch.name = 'Search'; ph.appendChild(srch);
ph.appendChild(await btn('Latest first', 'Outline', null, 'collapse_down'));
const nr = await btn('New Routine', 'Primary', 'add'); ph.appendChild(nr);
// table
const table = AL('Routines table', 'VERTICAL', 0); colm.appendChild(table); table.layoutSizingHorizontal = 'FILL';
const head = AL('Head row', 'HORIZONTAL', 0); table.appendChild(head); head.layoutSizingHorizontal = 'FILL';
head.strokes = [P('basic/stroke-subtle')]; head.strokeBottomWeight = 1; head.strokeTopWeight = head.strokeLeftWeight = head.strokeRightWeight = 0; head.strokeAlign = 'INSIDE';
for (const [lab, w] of COLS) { if (!lab) { const e = figma.createFrame(); e.name = 'Actions head'; e.fills = []; e.resize(w, 48); head.appendChild(e); continue; }
  const h = HEAD.children.find(x => x.name === 'Sort=None, State=Default').createInstance(); h.setProperties({ [pk(h, 'Label')]: lab }); head.appendChild(h); h.layoutSizingHorizontal = 'FIXED'; h.resize(w, 48); }
const rows = [
  ['Morning brief', 'Every weekday, 6:30 AM', 'Active', 'news', true, true],
  ['What I owe people', 'Every weekday, 7:30 AM', 'Paused', 'to_do_list', false, true],
  ['Escalation watch', 'New email from a customer', 'Paused', 'email', false, false],
  ['Friday pipeline movement', 'Every weekday, 6:30 AM', 'Active', 'clipboard', true, false],
  ['Deal desk check', 'Deal moves to proposal', 'Paused', 'draft_file', false, false],
  ['Board pre-read assembly', 'Monday before a board meeting', 'Active', 'file_collection', false, true, 'Hover'],
  ['Daily risk register', 'Every weekday, 6:00 PM', 'Paused', 'warning', false, false]];
const rowNodes = [];
for (const [name, trig, status, ic, proj, pin, st] of rows) {
  const r = set.children.find(x => x.name === 'State=' + (st || 'Default')).createInstance(); table.appendChild(r); r.name = name; r.layoutSizingHorizontal = 'FILL';
  r.setProperties({ [pk(r, 'Name')]: name, [pk(r, 'Trigger')]: trig, [pk(r, 'Cost')]: '$0.70', [pk(r, 'Icon')]: icon(ic, 16).id, [pk(r, 'Show project')]: proj, [pk(r, 'Show pinned')]: pin });
  const tg = r.findOne(n => n.name === 'Status' && n.type === 'INSTANCE');
  tg.setProperties(status === 'Active' ? { Type: 'Success', [pk(tg, 'Label')]: 'Active', [pk(tg, 'Icon')]: icon('checkmark', 16).id } : { Type: 'Warning', [pk(tg, 'Label')]: 'Paused', [pk(tg, 'Icon')]: icon('pause', 16).id });
  rowNodes.push(r);
}
// overlays: tooltip on the project icon of row 4, New Routine menu under the button
const tip = TIP.children.find(x => x.name === 'Pin=Top').createInstance(); main.appendChild(tip); tip.layoutPositioning = 'ABSOLUTE'; tip.setProperties({ [pk(tip, 'Label')]: 'Gulf Exclusions' }); tip.name = 'Tooltip';
const projIcon = rowNodes[3].findOne(n => n.name === 'Project'); const pa = projIcon.absoluteTransform, ma = main.absoluteTransform;
tip.x = Math.round(pa[0][2] - ma[0][2] + 8 - tip.width / 2); tip.y = Math.round(pa[1][2] - ma[1][2] + 16 + 2);
const menu = AL('New Routine menu', 'VERTICAL', 4); main.appendChild(menu); menu.layoutPositioning = 'ABSOLUTE';
menu.counterAxisSizingMode = 'FIXED'; menu.resize(340, menu.height); menu.paddingTop = menu.paddingBottom = menu.paddingLeft = menu.paddingRight = 12; menu.cornerRadius = 16;
menu.fills = [P('basic/background')]; menu.strokes = [P('basic/stroke')]; menu.strokeWeight = 1; menu.strokeAlign = 'INSIDE';
for (const [lab, help, ic, st] of [['Create with AI', 'Say what you need and it drafts the routine with you.', 'magenta_ai', 'Hover'], ['Create Manually', 'Set the trigger, the instructions and the tools yourself.', 'filter_2'], ['Choose from Templates', 'Start from one of the most popular routines and make it yours.', 'applications']]) {
  const it = MI.children.find(x => x.name === `Type=Standard, State=${st || 'Default'}`).createInstance(); menu.appendChild(it); it.layoutSizingHorizontal = 'FILL';
  it.setProperties({ [pk(it, 'Label')]: lab, [pk(it, 'Show icon')]: true, [pk(it, 'Icon')]: icon(ic, 24).id, [pk(it, 'Show helper text')]: true, [pk(it, 'Helper text')]: help });
  const ht = it.findAll(n => n.type === 'TEXT').find(n => n.characters === help); if (ht) { ht.textAutoResize = 'HEIGHT'; ht.layoutSizingHorizontal = 'FILL'; }
}
const ba = nr.absoluteTransform; menu.x = Math.round(ba[0][2] - ma[0][2] + nr.width - 340); menu.y = Math.round(ba[1][2] - ma[1][2] + nr.height + 8);
// dark twin
const D = F.clone(); page.appendChild(D); D.name = 'Routines list — DT · Dark'; D.x = F.x; D.y = -2480; D.setExplicitVariableModeForCollection(col, col.modes.find(m => m.name === 'Dark').modeId);
return { set: set.id, light: F.id, dark: D.id };
