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

const F = page.children.find(n => n.name === 'Routines — DT · Light'); const colm = F.findOne(n => n.name === 'Content');
F.findAll(n => n.name === 'Templates').forEach(n => n.remove()); page.children.filter(n => n.name === 'Routines — DT · Dark').forEach(n => n.remove());
const set = page.findOne(n => n.type === 'COMPONENT_SET' && n.name === 'DT Routine Card');
// template grid
// partner logos: reuse the library components already used by the source frame (importComponentByKeyAsync hangs the bridge)
const srcF = await figma.getNodeByIdAsync('875:162202'); const L = {};
for (const [k, nm] of [['slack', 'slack'], ['gcal', 'google-meet'], ['jira', 'jira']]) { const n = srcF.findOne(x => x.type === 'INSTANCE' && x.name.toLowerCase() === nm); L[k] = n ? await n.getMainComponentAsync() : null; }
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
return { set: set.id, light: F.id, dark: D.id, logos: Object.fromEntries(Object.entries(L).map(([k, v]) => [k, !!v])), x: F.x };
