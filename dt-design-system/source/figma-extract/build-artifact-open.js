/* Recreate 1809:488480 ("artifact open": narrow chat + artifact viewer) on 🎨 DT Pilot from DT/ODS components.
   Base = clone of "Chat — DT · Files in chat · Light". Artifact content = static preview image of the source canvas (user's choice). Re-run replaces. */
const page = await figma.getNodeByIdAsync('15012:25752'); await figma.setCurrentPageAsync(page);
const V = {}; for (const v of await figma.variables.getLocalVariablesAsync()) V[v.name] = v;
const TS = {}; for (const s of await figma.getLocalTextStylesAsync()) TS[s.name] = s;
for (const st of ['Bold', 'Medium']) await figma.loadFontAsync({ family: 'TeleNeo Var', style: st });
const col = await figma.variables.getVariableCollectionByIdAsync('VariableCollectionId:15009:22503');
const P = (n, c) => figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: c || { r: 0, g: 0, b: 0 } }, 'color', V[n] || V['basic/stroke']);
const icons = page.children.find(n => n.name === 'DT Icons'); const IC = {}; icons.findAllWithCriteria({ types: ['COMPONENT_SET'] }).forEach(s => { IC[s.name.split('/').pop()] = s; });
const icon = (names, size) => { for (const n of [].concat(names)) if (IC[n]) return IC[n].children.find(c => c.name === 'Style=Outline, Size=' + size); return null; };
const AL = (name, dir, gap, o = {}) => { const f = figma.createFrame(); f.name = name; f.layoutMode = dir; f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO'; f.itemSpacing = gap || 0; f.fills = []; f.clipsContent = false; Object.assign(f, o); return f; };
const pk = (inst, pre) => Object.keys(inst.componentProperties).find(k => k.startsWith(pre));
const BTN = await figma.getNodeByIdAsync('15046:642460'), XS = await figma.getNodeByIdAsync('15054:1341691'), ATT = await figma.getNodeByIdAsync('15050:152633');
function xs(iconName) { const i = XS.children.find(c => c.name === 'Variant=Ghost, State=Default').createInstance(); i.setProperties({ [pk(i, 'Icon')]: icon(iconName, 16).id }); i.name = [].concat(iconName)[0]; return i; }
async function btn(label, variant, left, right) { const i = BTN.children.find(c => c.name === `Variant=${variant}, Type=Standard, State=Default`).createInstance();
  const p = { [pk(i, 'Label')]: label, [pk(i, 'Show left icon')]: !!left, [pk(i, 'Show right icon')]: !!right };
  if (left) p[pk(i, 'Left icon')] = icon(left, 24).id; if (right) p[pk(i, 'Right icon')] = icon(right, 24).id; i.setProperties(p);
  const t = i.findOne(n => n.type === 'TEXT'); if (t) await t.setTextStyleIdAsync(TS['DT/Body S Bold'].id); i.name = label; return i; }
const capText = (t, w) => { t.textAutoResize = 'WIDTH_AND_HEIGHT'; if (t.width > w) { t.textAutoResize = 'HEIGHT'; t.resize(w, t.height); } };

// ---------- frame ----------
for (const n of page.children.filter(n => /^Chat — DT · Artifact open/.test(n.name))) n.remove();
const base = await figma.getNodeByIdAsync('15087:951365');
const F = base.clone(); page.appendChild(F); F.name = 'Chat — DT · Artifact open · Light';
const rowRight = (y0, y1) => Math.max(0, ...page.children.filter(n => n !== F && n.y < y1 && n.y + n.height > y0 && n.x > 0).map(n => n.x + n.width));
F.x = Math.max(rowRight(0, 900), rowRight(-2480, -1580)) + 115; F.y = 0;
F.findOne(n => n.name === 'Files in Chat' && n.type === 'FRAME').remove();
const main = F.findOne(n => n.name === 'Main'); main.resize(440, main.height);
main.findAll(n => n.name === 'Participants' || n.name === 'Unread').forEach(n => n.remove());

// header: compact, panel closed
const hdr = main.findOne(n => n.name === 'DT Chat Header'); hdr.paddingLeft = 16; hdr.paddingRight = 8;
const doc = hdr.findAll(n => n.type === 'INSTANCE' && n.name === 'Share' && Math.round(n.width) === 40)[0]; if (doc) doc.setProperties({ State: 'Default' });

// conversation: 408 column
const thread = main.findOne(n => n.name === 'Thread'); thread.paddingLeft = thread.paddingRight = 16;
const conv = thread.findOne(n => n.name === 'Conversation'); conv.layoutSizingHorizontal = 'FILL';
conv.findAll(n => n.name === 'Message group · Matt Rivera').forEach(n => n.remove());
for (const t of conv.findAll(n => n.type === 'TEXT' && n.parent && n.parent.name === 'ODS ChatText · incoming')) capText(t, 340);
const ans = conv.findOne(n => n.name === 'Answer'); const card = ans.findOne(n => n.name === 'Inline artifact');
const att = ATT.children.find(c => c.name === 'Type=File, State=Default').createInstance();
att.setProperties({ [pk(att, 'File name')]: 'Pipeline Command', [pk(att, 'File meta')]: 'Interactive HTML · 123 KB · Version 1', [pk(att, 'File icon')]: icon('html_file', 24).id, [pk(att, 'Show remove')]: true });
const rm = att.findOne(n => n.name === 'Remove' && n.type === 'INSTANCE'); rm.setProperties({ [pk(rm, 'Icon')]: icon('download', 16).id });
ans.insertChild(ans.children.indexOf(card), att); card.remove(); att.layoutSizingHorizontal = 'FILL';
// outgoing message (ODS ChatText outgoing), from the base chat screen
const outSrc = (await figma.getNodeByIdAsync('15046:641411')).findOne(n => n.name === 'Message row · outgoing');
const out = outSrc.clone(); conv.appendChild(out); out.layoutSizingHorizontal = 'FILL';
const ot = out.findOne(n => n.type === 'TEXT'); ot.characters = 'We are two-thirds through the quarter. How does commit actually look?'; capText(ot, 288);
// composer
const compo = main.findOne(n => n.name === 'Composer'); compo.layoutSizingHorizontal = 'FIXED'; compo.resize(408, compo.height);
const dock = main.findOne(n => n.name === 'Dock'); dock.paddingLeft = dock.paddingRight = 16;
for (const k of compo.children) if (k.layoutSizingHorizontal !== undefined) k.layoutSizingHorizontal = 'FILL';

// ---------- artifact viewer ----------
const viewer = AL('Artifact viewer', 'VERTICAL', 0); F.appendChild(viewer); viewer.layoutGrow = 1; viewer.layoutSizingVertical = 'FILL';
viewer.paddingTop = viewer.paddingBottom = viewer.paddingLeft = viewer.paddingRight = 8; viewer.fills = [P('basic/background')];
const cardV = AL('Artifact', 'VERTICAL', 0); viewer.appendChild(cardV); cardV.layoutSizingHorizontal = 'FILL'; cardV.layoutSizingVertical = 'FILL';
cardV.cornerRadius = 16; cardV.clipsContent = true; cardV.fills = [P('basic/background')]; cardV.strokes = [P('basic/stroke')]; cardV.strokeWeight = 1; cardV.strokeAlign = 'INSIDE';
const tb = AL('Artifact toolbar', 'HORIZONTAL', 8, { counterAxisAlignItems: 'CENTER' }); cardV.appendChild(tb); tb.layoutSizingHorizontal = 'FILL';
tb.counterAxisSizingMode = 'FIXED'; tb.resize(tb.width, 56); tb.paddingLeft = 8; tb.paddingRight = 12;
tb.strokes = [P('basic/stroke-subtle')]; tb.strokeBottomWeight = 1; tb.strokeTopWeight = tb.strokeLeftWeight = tb.strokeRightWeight = 0; tb.strokeAlign = 'INSIDE';
tb.appendChild(await btn('Untitled.xls', 'Ghost', 'csv', 'collapse_down'));
const sp = figma.createFrame(); sp.name = 'Spacer'; sp.fills = []; sp.resize(8, 8); tb.appendChild(sp); sp.layoutGrow = 1;
// preview / code toggle (DT Segment track cloned from the Artifacts list screen)
const listScreen = await figma.getNodeByIdAsync('15050:143163'); let toggle = null;
for (const fr of listScreen.findAll(n => n.type === 'FRAME' && n.children && n.children.length === 2)) { const ks = fr.children; if (ks.every(k => k.type === 'INSTANCE')) { const m = await ks[0].getMainComponentAsync(); if (m && m.parent && m.parent.name === 'DT Segment') { toggle = fr; break; } } }
if (toggle) { const tg = toggle.clone(); tg.name = 'Preview / Code'; tb.appendChild(tg);
  const [a, b] = tg.children; const ka = pk(a, 'Icon'), kb = pk(b, 'Icon');
  a.setProperties({ [ka]: icon('visibility_on', 24).id, Selected: 'Yes' }); b.setProperties({ [kb]: icon(['code', 'html_file'], 24).id, Selected: 'No' }); }
tb.appendChild(xs('copy_paste'));
const div = () => { const r = figma.createRectangle(); r.name = 'Divider'; r.resize(1, 24); r.fills = [P('basic/stroke-subtle')]; return r; };
tb.appendChild(div());
tb.appendChild(await btn('v3', 'Ghost', null, 'collapse_down'));
tb.appendChild(await btn('Publish', 'Outline', ['play', 'circle_play']));
tb.appendChild(xs('download')); tb.appendChild(xs('maximize_screen')); tb.appendChild(xs('close'));
// static preview of the artifact content (AI-generated app, not product UI)
const srcContent = await figma.getNodeByIdAsync('1990:516503');
const bytes = await srcContent.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: 2 } });
const img = figma.createImage(bytes);
const prev = figma.createRectangle(); prev.name = 'Artifact preview (static image of the generated app)'; cardV.appendChild(prev);
prev.resize(srcContent.width, srcContent.height); prev.layoutSizingHorizontal = 'FILL'; prev.layoutGrow = 1;
prev.fills = [{ type: 'IMAGE', imageHash: img.hash, scaleMode: 'FILL' }];
// split handle between chat and viewer
const h = figma.createRectangle(); F.appendChild(h); h.layoutPositioning = 'ABSOLUTE'; h.name = 'Resize handle'; h.resize(6, 44); h.cornerRadius = 3;
h.fills = [P('neutral/400')]; h.x = 56 + 440 + 1; h.y = Math.round((900 - 44) / 2);

// ---------- dark twin ----------
const D = F.clone(); page.appendChild(D); D.name = 'Chat — DT · Artifact open · Dark'; D.x = F.x; D.y = -2480;
D.setExplicitVariableModeForCollection(col, col.modes.find(m => m.name === 'Dark').modeId);
return { light: F.id, dark: D.id, toggle: !!toggle, code: !!IC['code'], play: !!IC['play'], x: F.x };
