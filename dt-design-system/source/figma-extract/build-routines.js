/* Recreate 875:162202 (Routines landing) on 🎨 DT Pilot from DT/ODS components.
   1) "DT Routine Card" component set (ODS ActionCard outline pattern; State Default/Hover) in section "DT Routines Components".
   2) "Routines — DT · Light" + Dark twin at page level, right of the existing screen rows. Re-run replaces. */
const page = await figma.getNodeByIdAsync('15012:25752'); await figma.setCurrentPageAsync(page);
const V = {}; for (const v of await figma.variables.getLocalVariablesAsync()) V[v.name] = v;
const TS = {}; for (const s of await figma.getLocalTextStylesAsync()) TS[s.name] = s;
for (const st of ['Bold', 'Medium']) await figma.loadFontAsync({ family: 'TeleNeo Var', style: st });
const col = await figma.variables.getVariableCollectionByIdAsync('VariableCollectionId:15009:22503');
const P = (n, c) => figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: c || { r: 0, g: 0, b: 0 } }, 'color', V[n] || V['basic/stroke']);
const icons = page.children.find(n => n.name === 'DT Icons'); const IC = {}; icons.findAllWithCriteria({ types: ['COMPONENT_SET'] }).forEach(s => { IC[s.name.split('/').pop()] = s; });
const icon = (n, s) => IC[n].children.find(c => c.name === 'Style=Outline, Size=' + s);
const AL = (name, dir, gap, o = {}) => { const f = figma.createFrame(); f.name = name; f.layoutMode = dir; f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO'; f.itemSpacing = gap || 0; f.fills = []; f.clipsContent = false; Object.assign(f, o); return f; };
async function T(s, style, ink, name) { const t = figma.createText(); await t.setTextStyleIdAsync(TS[style].id); t.characters = s; t.fills = [P(ink)]; t.name = name || 'Text'; return t; }
const pk = (i, p) => Object.keys(i.componentProperties).find(k => k.startsWith(p));
const BTN = await figma.getNodeByIdAsync('15046:642460'), XS = await figma.getNodeByIdAsync('15054:1341691');
function inkIcon(name, size, ink) { // swap-safe mask icon (Glyph mask + Ink rect), same pattern as the other DT components
  const f = figma.createFrame(); f.name = 'Icon'; f.resize(size, size); f.fills = []; f.clipsContent = true;
  const g = figma.createFrame(); g.name = 'Glyph'; g.resize(size, size); g.fills = []; f.appendChild(g);
  const i = icon(name, size <= 16 ? 16 : 24).createInstance(); i.name = 'Glyph icon'; g.appendChild(i); if (i.width !== size) i.rescale(size / i.width); i.x = 0; i.y = 0; g.isMask = true; g.maskType = 'ALPHA';
  const r = figma.createRectangle(); r.name = 'Ink'; r.resize(size, size); r.fills = [P(ink)]; f.appendChild(r); return f; }
async function btn(label, variant, left, right) { const i = BTN.children.find(c => c.name === `Variant=${variant}, Type=Standard, State=Default`).createInstance();
  const p = { [pk(i, 'Label')]: label, [pk(i, 'Show left icon')]: !!left, [pk(i, 'Show right icon')]: !!right };
  if (left) p[pk(i, 'Left icon')] = icon(left, 24).id; if (right) p[pk(i, 'Right icon')] = icon(right, 24).id; i.setProperties(p);
  const t = i.findOne(n => n.type === 'TEXT'); if (t) await t.setTextStyleIdAsync(TS['DT/Body S Bold'].id); i.name = label; return i; }

// ---------- 1. DT Routine Card ----------
let sec = page.children.find(n => n.type === 'SECTION' && n.name === 'DT Routines Components');
if (!sec) { const ref = page.children.find(n => n.type === 'SECTION' && n.name === 'DT Artifacts Components'); sec = figma.createSection(); sec.name = 'DT Routines Components'; sec.x = ref.x; sec.y = ref.y + ref.height + 200; }
sec.children.filter(n => n.name === 'DT Routine Card').forEach(n => n.remove());
const variants = [];
for (const st of ['Default', 'Hover']) {
  const c = figma.createComponent(); sec.appendChild(c); c.name = 'State=' + st; c.layoutMode = 'HORIZONTAL'; c.itemSpacing = 12; c.counterAxisAlignItems = 'MIN';
  c.primaryAxisSizingMode = 'FIXED'; c.counterAxisSizingMode = 'FIXED'; c.resize(301, 160); c.paddingTop = c.paddingBottom = c.paddingLeft = c.paddingRight = 16;
  c.cornerRadius = 16; c.fills = [P('basic/background', { r: 1, g: 1, b: 1 })]; c.strokes = [P(st === 'Hover' ? 'basic/stroke' : 'basic/stroke-subtle')]; c.strokeWeight = 1; c.strokeAlign = 'INSIDE'; c.clipsContent = false;
  const tile = figma.createFrame(); tile.name = 'Tile'; c.appendChild(tile); tile.resize(32, 32); tile.cornerRadius = 8; tile.fills = [P('basic/accent')];
  const ti = inkIcon('inbox', 16, 'basic/text-on-accent'); tile.appendChild(ti); ti.x = 8; ti.y = 8;
  const body = AL('Body', 'VERTICAL', 8); c.appendChild(body); body.layoutGrow = 1; body.layoutSizingVertical = 'FILL';
  const title = await T('Morning inbox triage', 'DT/Body M Bold', 'basic/text', 'Title'); body.appendChild(title); title.layoutSizingHorizontal = 'FILL'; title.textAutoResize = 'HEIGHT';
  const desc = await T('Reads overnight mail and tells you the five things that actually need a reply.', 'DT/Body S Regular', 'basic/text-recessive', 'Description'); body.appendChild(desc); desc.layoutSizingHorizontal = 'FILL'; desc.textAutoResize = 'HEIGHT'; desc.maxLines = 3; desc.textTruncation = 'ENDING';
  const gap = figma.createFrame(); gap.name = 'Spacer'; gap.fills = []; gap.resize(8, 1); body.appendChild(gap); gap.layoutGrow = 1;
  const meta = AL('Metadata', 'HORIZONTAL', 6, { counterAxisAlignItems: 'CENTER' }); body.appendChild(meta); meta.layoutSizingHorizontal = 'FILL'; meta.paddingTop = 8;
  meta.strokes = [P('basic/stroke-subtle')]; meta.strokeTopWeight = 1; meta.strokeBottomWeight = meta.strokeLeftWeight = meta.strokeRightWeight = 0; meta.strokeAlign = 'INSIDE';
  const lead = icon('clock', 16).createInstance(); lead.name = 'Leading'; meta.appendChild(lead);
  const mt = await T('Every Friday · 4:00 PM', 'DT/Microcopy Regular', 'basic/text-recessive', 'Meta'); meta.appendChild(mt); mt.layoutGrow = 1;
  if (st === 'Hover') { const add = XS.children.find(x => x.name === 'Variant=Secondary, State=Default').createInstance(); add.setProperties({ [pk(add, 'Icon')]: icon('add', 16).id }); add.name = 'Add'; c.appendChild(add); add.layoutPositioning = 'ABSOLUTE'; add.x = 301 - 16 - 24; add.y = 14; }
  variants.push(c);
}
const set = figma.combineAsVariants(variants, sec); set.name = 'DT Routine Card';
set.description = 'Routine template card on the ODS ActionCard outline pattern: radius-medium 16, strokes-1 basic/stroke-subtle (Hover: basic/stroke + Secondary XSmall add). 32 accent tile with a 16 icon (text-on-accent), title Body M Bold, description Body S Regular recessive (3 lines max), metadata row Microcopy Regular recessive with a 16 leading icon or partner logo.';
const keys = { title: set.addComponentProperty('Title', 'TEXT', 'Morning inbox triage'), desc: set.addComponentProperty('Description', 'TEXT', 'Reads overnight mail and tells you the five things that actually need a reply.'),
  meta: set.addComponentProperty('Meta', 'TEXT', 'Every Friday · 4:00 PM'), icon: set.addComponentProperty('Icon', 'INSTANCE_SWAP', icon('inbox', 16).id), lead: set.addComponentProperty('Leading', 'INSTANCE_SWAP', icon('clock', 16).id) };
for (const c of set.children) {
  c.findOne(n => n.name === 'Title').componentPropertyReferences = { characters: keys.title };
  c.findOne(n => n.name === 'Description').componentPropertyReferences = { characters: keys.desc };
  c.findOne(n => n.name === 'Meta').componentPropertyReferences = { characters: keys.meta };
  c.findOne(n => n.name === 'Glyph icon').componentPropertyReferences = { mainComponent: keys.icon };
  c.findOne(n => n.name === 'Leading').componentPropertyReferences = { mainComponent: keys.lead };
}
set.layoutMode = 'HORIZONTAL'; set.itemSpacing = 32; set.paddingTop = set.paddingBottom = set.paddingLeft = set.paddingRight = 32; set.primaryAxisSizingMode = 'AUTO'; set.counterAxisSizingMode = 'AUTO';
set.fills = [P('neutral/200', { r: .87, g: .87, b: .87 })]; set.cornerRadius = 16; set.x = 80; set.y = 80;
sec.resizeWithoutConstraints(set.width + 160, set.height + 160);

// ---------- 2. screen ----------
for (const n of page.children.filter(n => /^Routines — DT/.test(n.name))) n.remove();
const base = await figma.getNodeByIdAsync('15046:641411');
const F = figma.createFrame(); page.appendChild(F); F.name = 'Routines — DT · Light'; F.resize(1440, 900); F.layoutMode = 'HORIZONTAL'; F.primaryAxisSizingMode = 'FIXED'; F.counterAxisSizingMode = 'FIXED'; F.fills = [P('basic/background')]; F.clipsContent = true;
const rowRight = (y0, y1) => Math.max(0, ...page.children.filter(n => n !== F && n.y < y1 && n.y + n.height > y0 && n.x > 0).map(n => n.x + n.width));
F.x = Math.max(rowRight(0, 900), rowRight(-2480, -1580)) + 115; F.y = 0;
const nav = base.findOne(n => /^DT Side Nav/.test(n.name)).clone(); F.appendChild(nav); nav.layoutSizingVertical = 'FILL';
const rr = nav.findOne(n => n.type === 'INSTANCE' && n.name === 'Routines'); if (rr) rr.setProperties({ State: 'Selected' });
const main = AL('Main', 'VERTICAL', 0, { counterAxisAlignItems: 'CENTER' }); F.appendChild(main); main.layoutGrow = 1; main.layoutSizingVertical = 'FILL'; main.paddingTop = 60; main.clipsContent = true;
const colm = AL('Content', 'VERTICAL', 0); main.appendChild(colm); colm.counterAxisSizingMode = 'FIXED'; colm.resize(928, colm.height);
// page header
const ph = AL('Page header', 'HORIZONTAL', 16, { counterAxisAlignItems: 'CENTER' }); colm.appendChild(ph); ph.layoutSizingHorizontal = 'FILL';
const h1 = await T('Routines', 'DT/Title S', 'basic/text', 'Title'); ph.appendChild(h1); h1.layoutGrow = 1; ph.appendChild(await btn('New Routine', 'Primary', 'add'));
const s1 = figma.createFrame(); s1.name = 'Gap'; s1.fills = []; s1.resize(8, 40); colm.appendChild(s1);
async function heading(a, b) { const t = await T(a + ' ' + b, 'DT/Paragraph', 'basic/text', 'Heading'); await t.setRangeTextStyleIdAsync(a.length + 1, a.length + 1 + b.length, TS['DT/Body L'].id); return t; }
colm.appendChild(await heading('Create a new', 'Routine'));
const s2 = figma.createFrame(); s2.name = 'Gap'; s2.fills = []; s2.resize(8, 16); colm.appendChild(s2);
const compo = (await figma.getNodeByIdAsync('15019:279907')).createInstance(); colm.appendChild(compo); compo.layoutSizingHorizontal = 'FILL';
const s3 = figma.createFrame(); s3.name = 'Gap'; s3.fills = []; s3.resize(8, 40); colm.appendChild(s3);
const th = AL('Templates header', 'HORIZONTAL', 8, { counterAxisAlignItems: 'CENTER' }); colm.appendChild(th); th.layoutSizingHorizontal = 'FILL';
const h2 = await heading('Or start with a', 'Template'); th.appendChild(h2); h2.layoutGrow = 1;
const srch = BTN.children.find(c => c.name === 'Variant=Ghost, Type=Icon only, State=Default').createInstance(); srch.setProperties({ [pk(srch, 'Left icon')]: icon('search', 24).id }); srch.name = 'Search'; th.appendChild(srch);
th.appendChild(await btn('Browse All', 'Outline', null, 'right_condensed'));
const s4 = figma.createFrame(); s4.name = 'Gap'; s4.fills = []; s4.resize(8, 16); colm.appendChild(s4);
// category chips (ODS ToggleChip, labels 14 per the screens rule), clipped row
const TC = await figma.getNodeByIdAsync('15065:180998');
const chips = AL('Categories', 'HORIZONTAL', 8, { counterAxisAlignItems: 'CENTER' }); colm.appendChild(chips); chips.layoutSizingHorizontal = 'FILL'; chips.primaryAxisSizingMode = 'FIXED'; chips.clipsContent = true;
const cats = ['Most Popular', 'Email & Inbox', 'Meetings & Calendar', 'Planning & Focus', 'Reading & Research', 'Money & Admin', 'Health & Habits', 'Catch Ups'];
for (const [i, c] of cats.entries()) { const ch = TC.children.find(x => x.name === `Selected=${i === 0 ? 'Yes' : 'No'}, State=Default`).createInstance(); ch.setProperties({ [pk(ch, 'Label')]: c, [pk(ch, 'Show icon')]: false }); ch.name = c;
  const t = ch.findOne(n => n.type === 'TEXT'); if (t) await t.setTextStyleIdAsync(TS['DT/Body S Bold'].id); chips.appendChild(ch); }
const s5 = figma.createFrame(); s5.name = 'Gap'; s5.fills = []; s5.resize(8, 24); colm.appendChild(s5);
// template grid
const logo = async key => { try { return await figma.importComponentByKeyAsync(key); } catch (e) { return null; } };
const L = { slack: await logo('71d15cfeee6f0298f94cd0cc28cc58b752b7e40f'), gcal: await logo('733383e284c257bb0902ce581e8792cf5f1b08be'), jira: await logo('5087bfe41abc1112662d010561a6514ed52c0352') };
const cards = [
  ['Morning inbox triage', 'Reads overnight mail and tells you the five things that actually need a reply.', 'Every Friday · 4:00 PM', 'inbox', null],
  ['Daily plan', 'Turns your calendar and all open tasks into a streamlined weekday schedule.', 'Every day · 9:00 AM', 'to_do_list', null],
  ['Mention catch-up', 'Collects all, where you were tagged across messages, comments, and threads so you can review and reply.', 'Slack · You are mentioned', 'chat_text', 'slack', 'Hover'],
  ['Meeting prep brief', 'Fifteen minutes before a meeting, gives you who, what happened last time, and the open asks.', 'Google Calendar · Before every meeting', 'calendar', 'gcal'],
  ['New work assigned to me', 'Deploys any ticket that lands in your queue and what it will take. Prioritizes based on urgency.', 'Jira · Issue assigned to me', 'high_priority', 'jira'],
  ['Weekly unsubscribe sweep', 'Finds newsletters and gives you a simple way to clean up your inbox without the guilt.', 'Every day · 9:00 AM', 'news', null],
  ['File every attachment', 'Sorts incoming attachments into the right folder as they arrive, makes sure you find them.', 'Google Calendar · Before every meeting', 'folder', 'gcal'],
  ['VIP sender alert', 'Pings you the moment someone important writes so it never sits unseen.', 'Jira · Issue assigned to me', 'star', 'jira'],
  ['Morning inbox triage', 'Reads overnight mail and tells you the five things that actually need a reply.', 'Every day · 9:00 AM', 'inbox', null]];
const grid = AL('Templates', 'HORIZONTAL', 12); colm.appendChild(grid); grid.layoutSizingHorizontal = 'FILL'; grid.layoutWrap = 'WRAP'; grid.counterAxisSpacing = 20; grid.primaryAxisSizingMode = 'FIXED';
for (const [title, desc, meta, ic, lg, st] of cards) {
  const c = set.children.find(x => x.name === 'State=' + (st || 'Default')).createInstance(); grid.appendChild(c); c.name = title;
  const p = { [pk(c, 'Title')]: title, [pk(c, 'Description')]: desc, [pk(c, 'Meta')]: meta, [pk(c, 'Icon')]: icon(ic, 16).id };
  if (lg && L[lg]) p[pk(c, 'Leading')] = L[lg].id; c.setProperties(p);
  if (lg && L[lg]) { const ld = c.findOne(n => n.name === 'Leading'); if (ld && ld.width !== 16) ld.rescale(16 / ld.width); }
}
// dark twin
const D = F.clone(); page.appendChild(D); D.name = 'Routines — DT · Dark'; D.x = F.x; D.y = -2480; D.setExplicitVariableModeForCollection(col, col.modes.find(m => m.name === 'Dark').modeId);
return { set: set.id, light: F.id, dark: D.id, logos: Object.fromEntries(Object.entries(L).map(([k, v]) => [k, !!v])), railSelected: !!rr, x: F.x };
