/* Recreate 5975:413714 (group chat + "Files in Chat" panel) in Section 1 on 🎨 DT Pilot from DT/ODS components only.
   Base = clone of "Chat — DT · Light" (side nav, DT Chat Header, Dock/Composer). Re-run replaces the frames. ARGS {} */
const page = await figma.getNodeByIdAsync('15012:25752'); await figma.setCurrentPageAsync(page);
const V = {}; for (const v of await figma.variables.getLocalVariablesAsync()) V[v.name] = v;
const TS = {}; for (const s of await figma.getLocalTextStylesAsync()) TS[s.name] = s;
for (const st of ['Bold', 'Medium']) await figma.loadFontAsync({ family: 'TeleNeo Var', style: st });
const col = await figma.variables.getVariableCollectionByIdAsync('VariableCollectionId:15009:22503');
const P = (n, c) => figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: c || { r: 0, g: 0, b: 0 } }, 'color', V[n] || V['basic/stroke']);
const icons = page.children.find(n => n.name === 'DT Icons'); const IC = {}; icons.findAllWithCriteria({ types: ['COMPONENT_SET'] }).forEach(s => { IC[s.name.split('/').pop()] = s; });
const icon = (name, size) => IC[name].children.find(c => c.name === 'Style=Outline, Size=' + size);
const AL = (name, dir, gap, o = {}) => { const f = figma.createFrame(); f.name = name; f.layoutMode = dir; f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO'; f.itemSpacing = gap || 0; f.fills = []; f.clipsContent = false; Object.assign(f, o); return f; };
async function T(s, style, ink, name) { const t = figma.createText(); await t.setTextStyleIdAsync(TS[style].id); t.characters = s; t.fills = [P(ink)]; t.name = name || 'Text'; return t; }
const fill = (n) => { n.layoutSizingHorizontal = 'FILL'; };
const BTN = await figma.getNodeByIdAsync('15046:642460'), XS = await figma.getNodeByIdAsync('15054:1341691'), ATT = await figma.getNodeByIdAsync('15050:152633');
const AV = await figma.getNodeByIdAsync('15012:25979'), BADGE = await figma.getNodeByIdAsync('15065:180552');
const pk = (inst, pre) => Object.keys(inst.componentProperties).find(k => k.startsWith(pre));
function xs(iconName, state, variant) { const i = XS.children.find(c => c.name === `Variant=${variant || 'Ghost'}, State=${state || 'Default'}`).createInstance(); i.setProperties({ [pk(i, 'Icon')]: icon(iconName, 16).id }); return i; }
function btn(label, variant, iconName) { const i = BTN.children.find(c => c.name === `Variant=${variant}, Type=Standard, State=Default`).createInstance();
  const p = { [pk(i, 'Label')]: label, [pk(i, 'Show left icon')]: !!iconName }; if (iconName) p[pk(i, 'Left icon')] = icon(iconName, 24).id; i.setProperties(p); return i; }
async function label14(inst) { const t = inst.findOne(n => n.type === 'TEXT'); if (t) await t.setTextStyleIdAsync(TS['DT/Body S Bold'].id); } // Section 1 rule: button labels 14
async function attachment(name, meta, iconName, trailing, state) {
  const i = ATT.children.find(c => c.name === `Type=File, State=${state || 'Default'}`).createInstance();
  i.setProperties({ [pk(i, 'File name')]: name, [pk(i, 'File meta')]: meta, [pk(i, 'File icon')]: icon(iconName, 24).id, [pk(i, 'Show remove')]: !!trailing });
  if (trailing) { const r = i.findOne(n => n.name === 'Remove' && n.type === 'INSTANCE'); r.setProperties({ [pk(r, 'Icon')]: icon(trailing, 16).id }); }
  return i;
}
function avatar(initial, tint) { const a = AV.createInstance(); a.rescale(24 / a.width); a.fills = [P('palette/' + tint)]; const t = a.findOne(n => n.type === 'TEXT'); t.fills = [P('basic/text')]; return [a, t]; }

// ---------- frame ----------
const host = page; // screens live at page level (Section 1 was ungrouped)
for (const n of host.children.filter(n => /^Chat — DT · Files in chat/.test(n.name))) n.remove();
const base = await figma.getNodeByIdAsync('15046:641411');
const rowRight = (y0, y1) => Math.max(0, ...host.children.filter(n => n.y < y1 && n.y + n.height > y0 && n.x > 0).map(n => n.x + n.width));
const F = base.clone(); host.appendChild(F); F.name = 'Chat — DT · Files in chat · Light';
F.x = Math.max(rowRight(0, 900), rowRight(-2480, -1580)) + 115; F.y = 0;
const main = F.findOne(n => n.name === 'Main'); main.layoutSizingHorizontal = 'FIXED'; main.resize(984, main.height);

// ---------- header ----------
const hdr = main.findOne(n => n.name === 'DT Chat Header'); fill(hdr);
hdr.setProperties({ [pk(hdr, 'Title')]: 'Routines' });
const hb = hdr.findAll(n => n.type === 'INSTANCE' && n.name === 'Share');
const share = hb.find(n => Math.round(n.width) > 60); const small = hb.filter(n => Math.round(n.width) <= 40 && n.parent && !(n.parent.type === 'INSTANCE' && n.parent.name === 'Share')); const docBtn = small[0], moreBtn = small[1];
if (share) { const k = pk(share, 'Left icon'); if (k) share.setProperties({ [k]: icon('lock', 24).id }); }
async function xsOf(b) { if (!b) return null; const m = await b.getMainComponentAsync(); if (m && m.parent === XS) return b; for (const c of b.findAll(n => n.type === 'INSTANCE')) { const cm = await c.getMainComponentAsync(); if (cm && cm.parent === XS) return c; } return null; }
const docX = await xsOf(docBtn); if (docX) docX.setProperties({ State: 'Pressed' });
const moreX = await xsOf(moreBtn); if (moreX) moreX.setProperties({ [pk(moreX, 'Icon')]: icon('chat_text', 16).id });
// participants + unread badge (absolute, over the header)
const people = AL('Participants', 'HORIZONTAL', -4, { counterAxisAlignItems: 'CENTER' }); main.appendChild(people); people.layoutPositioning = 'ABSOLUTE';
for (const [ini, tint] of [['M', 'orchid/dominant'], ['J', 'aperitif/extra-dominant'], ['G', 'macaw/dominant']]) { const [a, t] = avatar(ini, tint); people.appendChild(a); t.characters = ini; a.strokes = [P('basic/background')]; a.strokeWeight = 2; a.strokeAlign = 'OUTSIDE'; }
const cost = hdr.findOne(n => n.type === 'INSTANCE' && n.name === 'Cost');
const cAbs = cost.absoluteTransform, mAbs = main.absoluteTransform;
people.x = (cAbs[0][2] - mAbs[0][2]) - people.width - 8; people.y = Math.round((56 - people.height) / 2);
if (moreBtn) { const b = BADGE.children.find(c => /Standard/.test(c.name) && /Default|Number/.test(c.name)) || BADGE.children[0]; const bi = b.createInstance(); main.appendChild(bi); bi.layoutPositioning = 'ABSOLUTE';
  const t = bi.findOne(n => n.type === 'TEXT'); if (t) t.characters = '2';
  const mb = moreBtn.absoluteTransform; bi.x = (mb[0][2] - mAbs[0][2]) + moreBtn.width - bi.width / 2 - 8; bi.y = 6; bi.name = 'Unread'; }

// ---------- conversation ----------
const thread = main.findOne(n => n.name === 'Thread'); thread.primaryAxisAlignItems = 'MAX'; thread.clipsContent = true; thread.paddingBottom = 16;
const conv = thread.findOne(n => n.name === 'Conversation'); const outRow = conv.findOne(n => n.name === 'Message row · outgoing'); const oldAnswer = conv.findOne(n => n.name === 'Answer');
const outBubble = outRow.findOne(n => n.name.startsWith('ODS ChatText'));
const thinking = oldAnswer.findOne(n => n.name === 'Thinking').clone();
for (const k of [...conv.children]) if (k !== outRow) k.remove();
const bubbleProto = outBubble.clone(); outRow.remove();
function bubble(text) { const b = bubbleProto.clone(); b.name = 'ODS ChatText · incoming'; b.fills = [P('basic/background-subtle')];
  const r = [b.topLeftRadius, b.topRightRadius]; b.topLeftRadius = r[1]; b.topRightRadius = r[0];
  const t = b.findOne(n => n.type === 'TEXT'); t.fills = [P('basic/text')]; return [b, t]; }
async function incoming(name, initial, tint, msgs) {
  const row = AL('Message group · ' + name, 'HORIZONTAL', 8, { counterAxisAlignItems: 'MIN' }); conv.appendChild(row); fill(row);
  const [a, at] = avatar(initial, tint); at.characters = initial; row.appendChild(a);
  const colm = AL('Content', 'VERTICAL', 4); row.appendChild(colm); colm.layoutGrow = 1;
  colm.appendChild(await T(name, 'DT/Body S Regular', 'basic/text-recessive', 'Name'));
  for (const m of msgs) { const [b, t] = bubble(m.text); colm.appendChild(b); t.textAutoResize = 'WIDTH_AND_HEIGHT'; t.characters = m.text;
    if (t.width > 608) { t.textAutoResize = 'HEIGHT'; t.resize(608, t.height); }
    if (m.mention) { await t.setRangeTextStyleIdAsync(0, m.mention.length, TS['DT/Body M Bold'].id); t.setRangeFills(0, m.mention.length, [P('basic/text-link')]); } }
  return row;
}
await incoming('Matt Rivera', 'M', 'orchid/dominant', [{ text: 'Easier to show you than describe it.' },
  { text: '@Assistant give me an interactive view of the quarter — the gap against quota, and the deals carrying it with what each one is waiting on.', mention: '@Assistant' }]);
// answer
const ans = AL('Answer', 'VERTICAL', 16); conv.appendChild(ans); fill(ans);
ans.appendChild(thinking);
for (const p of ['Interactive. Forecast against quota, the stage funnel, where the quarter moved, the rep leaderboard and the deals the graph flagged — all off one opportunity spine, so nothing in it can disagree with anything else.',
  'Matt’s six are in the at-risk table with what each is waiting on and how long it has been idle. Pick a stage and the funnel and the deal list move together.']) {
  const t = await T(p, 'DT/Body M Regular', 'basic/text', 'Paragraph'); ans.appendChild(t); t.textAutoResize = 'HEIGHT'; fill(t); }
const card = AL('Inline artifact', 'HORIZONTAL', 12, { counterAxisAlignItems: 'CENTER' }); ans.appendChild(card);
card.paddingLeft = 0; card.paddingRight = 16; card.cornerRadius = 16; card.fills = [P('basic/background-subtle')];
const art = await attachment('Pipeline Command', 'Interactive HTML · 123 KB · Version 1', 'html_file', null); card.appendChild(art); art.layoutGrow = 1;
card.primaryAxisSizingMode = 'FIXED'; card.resize(520, card.height);
const dl = btn('Download', 'Outline'); card.appendChild(dl); await label14(dl);
await incoming('John Whitaker', 'J', 'aperitif/extra-dominant', [{ text: 'Coverage by rep is the number I would act on. Marcus at 1.9x with five slipping is a staffing problem, not a forecasting one.' }]);
await incoming('Grace Coleman', 'G', 'macaw/dominant', [{ text: 'Can it flag where Atlas is present? Three of the six is a pattern, and it should be on the board slide rather than in a table.' }]);

// ---------- composer ----------
const msg = main.findOne(n => n.name === 'Message' && n.type === 'TEXT'); await msg.setTextStyleIdAsync(TS['DT/Body M Regular'].id);
msg.characters = 'Ask anything…'; msg.fills = [P('basic/text-recessive')]; msg.textAutoResize = 'HEIGHT';
const mw = msg.parent; if (mw.primaryAxisSizingMode) mw.primaryAxisSizingMode = 'AUTO';
const compo = main.findOne(n => n.name === 'Composer'); if (compo) compo.primaryAxisSizingMode = 'AUTO';

// ---------- files panel ----------
const panel = AL('Files in Chat', 'VERTICAL', 0); F.appendChild(panel); panel.primaryAxisSizingMode = 'FIXED'; panel.counterAxisSizingMode = 'FIXED'; panel.resize(400, 900);
panel.layoutSizingVertical = 'FILL'; panel.fills = [P('basic/background')]; panel.strokes = [P('basic/stroke-subtle')]; panel.strokeLeftWeight = 1; panel.strokeTopWeight = panel.strokeRightWeight = panel.strokeBottomWeight = 0; panel.strokeAlign = 'INSIDE';
const ph = AL('Panel header', 'HORIZONTAL', 8, { counterAxisAlignItems: 'CENTER' }); panel.appendChild(ph); fill(ph); ph.counterAxisSizingMode = 'FIXED'; ph.resize(400, 56); ph.paddingLeft = 16; ph.paddingRight = 16;
const pt = await T('Files in Chat', 'DT/Body S Bold', 'basic/text', 'Title'); ph.appendChild(pt); pt.layoutGrow = 1; ph.appendChild(xs('close'));
const body = AL('Sections', 'VERTICAL', 24); panel.appendChild(body); fill(body); body.paddingTop = 8; body.paddingLeft = body.paddingRight = 12;
async function section(title, right, rows) {
  const s = AL(title, 'VERTICAL', 8); body.appendChild(s); fill(s);
  const h = AL('Section header', 'HORIZONTAL', 8, { counterAxisAlignItems: 'CENTER' }); s.appendChild(h); fill(h); h.paddingLeft = 4; h.counterAxisSizingMode = 'FIXED'; h.resize(h.width, 40);
  const t = await T(title, 'DT/Body S Bold', 'basic/text-recessive', 'Title'); h.appendChild(t); t.layoutGrow = 1; if (right) h.appendChild(right);
  for (const r of rows) { const a = await attachment(...r); s.appendChild(a); fill(a); }
  return s;
}
const dall = btn('Download All', 'Ghost', 'download'); await label14(dall);
await section('Artifacts', dall, [['Pipeline Command', 'Interactive HTML · 123 KB · Version 1', 'html_file', 'download'], ['Pipeline Command', 'Interactive HTML · 123 KB · Version 1', 'html_file', 'download'], ['Pipeline Command', 'Interactive HTML · 123 KB · Version 1', 'html_file', 'download']]);
const listScreen = await figma.getNodeByIdAsync('15050:143163'); let toggle = null;
for (const fr of listScreen.findAll(n => n.type === 'FRAME' && n.children && n.children.length === 2)) { const kids = fr.children; if (kids.every(k => k.type === 'INSTANCE')) { const m = await kids[0].getMainComponentAsync(); if (m && m.parent && m.parent.name === 'DT Segment') { toggle = fr; break; } } }
const tg = toggle ? toggle.clone() : null; if (tg) tg.name = 'View toggle';
await section('Uploads', tg, [['Screenshot', '123 KB', 'image_file', 'visibility_on', 'Hover'], ['Filename.PDF', '123 KB', 'pdf_file', null], ['Filename.CSV', '123 KB', 'csv', null]]);

// ---------- dark twin ----------
const D = F.clone(); host.appendChild(D); D.name = 'Chat — DT · Files in chat · Dark'; D.x = F.x; D.y = -2480; D.setExplicitVariableModeForCollection(col, col.modes.find(m => m.name === 'Dark').modeId);
return { light: F.id, dark: D.id, toggle: !!toggle, share: !!share, doc: !!docX, more: !!moreX };
