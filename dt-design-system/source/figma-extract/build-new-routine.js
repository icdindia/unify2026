/* Recreate 875:165686 ("New routine" chat with a question card) on 🎨 DT Pilot from DT/ODS components.
   Base = clone of "Chat — DT · Light" with the open DT side nav. Re-run replaces. */
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
const BTN = await figma.getNodeByIdAsync('15046:642460'), XS = await figma.getNodeByIdAsync('15054:1341691'), TAG = await figma.getNodeByIdAsync('15065:180255'), BC = await figma.getNodeByIdAsync('15012:25983');
function xs(iconName, name) { const i = XS.children.find(c => c.name === 'Variant=Ghost, State=Default').createInstance(); i.setProperties({ [pk(i, 'Icon')]: icon(iconName, 16).id }); i.name = name || [].concat(iconName)[0]; return i; }
function inkIcon(name, size, ink, label) { const f = figma.createFrame(); f.name = label || 'Icon'; f.resize(size, size); f.fills = []; f.clipsContent = true;
  const g = figma.createFrame(); g.name = 'Glyph'; g.resize(size, size); g.fills = []; f.appendChild(g);
  const i = icon(name, size <= 16 ? 16 : 24).createInstance(); i.name = 'Glyph icon'; g.appendChild(i); if (i.width !== size) i.rescale(size / i.width); i.x = 0; i.y = 0; g.isMask = true; g.maskType = 'ALPHA';
  const r = figma.createRectangle(); r.name = 'Ink'; r.resize(size, size); r.fills = [P(ink)]; f.appendChild(r); return f; }
const hr = () => { const r = figma.createRectangle(); r.name = 'Divider'; r.resize(10, 1); r.fills = [P('basic/stroke-subtle')]; return r; };

// ---------- frame ----------
for (const n of page.children.filter(n => /^New routine — DT/.test(n.name))) n.remove();
const base = await figma.getNodeByIdAsync('15046:641411');
const F = base.clone(); page.appendChild(F); F.name = 'New routine — DT · Light';
const rowRight = (y0, y1) => Math.max(0, ...page.children.filter(n => n !== F && n.y < y1 && n.y + n.height > y0 && n.x > 0).map(n => n.x + n.width));
F.x = Math.max(rowRight(0, 900), rowRight(-2480, -1580)) + 115; F.y = 0;
F.findOne(n => /^DT Side Nav · closed/.test(n.name)).remove();
const navOpen = (await figma.getNodeByIdAsync('15020:280132')).findOne(n => /^DT Side Nav · open/.test(n.name)).clone(); F.insertChild(0, navOpen); navOpen.layoutSizingVertical = 'FILL';
const main = F.findOne(n => n.name === 'Main'); main.layoutSizingHorizontal = 'FIXED'; main.resize(1160, main.height);

// ---------- breadcrumb header ----------
const oldHdr = main.findOne(n => n.name === 'DT Chat Header');
const hdr = AL('Header', 'HORIZONTAL', 4, { counterAxisAlignItems: 'CENTER' }); main.insertChild(main.children.indexOf(oldHdr), hdr); oldHdr.remove();
hdr.layoutSizingHorizontal = 'FILL'; hdr.counterAxisSizingMode = 'FIXED'; hdr.resize(hdr.width, 56); hdr.paddingLeft = 24; hdr.paddingRight = 24;
const bc = BC.createInstance(); hdr.appendChild(bc); bc.setProperties({ [pk(bc, 'Parent')]: 'Routines', [pk(bc, 'Current')]: 'New routine' });
hdr.appendChild(xs('collapse_down', 'Rename / options'));

// ---------- conversation ----------
const conv = main.findOne(n => n.name === 'Conversation');
const out = conv.findOne(n => n.name === 'Message row · outgoing'); const ot = out.findOne(n => n.type === 'TEXT');
ot.characters = 'I want to set up a scheduled task. Briefly explain how scheduled tasks work, then ask me a few questions to figure out what I\'d like you to do and when it should run.';
ot.textAutoResize = 'WIDTH_AND_HEIGHT'; if (ot.width > 560) { ot.textAutoResize = 'HEIGHT'; ot.resize(560, ot.height); }
const ans = conv.findOne(n => n.name === 'Answer');
for (const k of [...ans.children]) if (k.name !== 'Thinking') k.remove();
const think = ans.findOne(n => n.name === 'Thinking'); const tt = think.findOne(n => n.type === 'TEXT'); tt.characters = 'Thoughts';
const steps = AL('Thought steps', 'VERTICAL', 0); ans.appendChild(steps); steps.paddingLeft = 4;
const S = [['clipboard', 'Reading your routines', false], ['applications', 'Checking connected systems', false], ['checkmark', 'Reading your description', true]];
for (const [i, [ic, label, done]] of S.entries()) {
  const row = AL('Step · ' + label, 'HORIZONTAL', 12, { counterAxisAlignItems: 'CENTER' }); steps.appendChild(row);
  row.appendChild(inkIcon(ic, 16, done ? 'basic/text' : 'basic/text-recessive'));
  row.appendChild(await T(label, 'DT/Body S Regular', done ? 'basic/text' : 'basic/text-recessive', 'Label'));
  if (i < S.length - 1) { const ln = figma.createRectangle(); ln.name = 'Connector'; ln.resize(1, 12); ln.fills = [P('basic/stroke-subtle')]; const w = AL('Connector', 'HORIZONTAL', 0); w.paddingLeft = 7.5; w.appendChild(ln); steps.appendChild(w); }
}
const para = await T('Before I set this up — four things I cannot infer.', 'DT/Body M Regular', 'basic/text', 'Paragraph'); ans.appendChild(para);

// ---------- question card + composer ----------
const dock = main.findOne(n => n.name === 'Dock'); const compo = dock.findOne(n => n.name === 'Composer');
const stack = AL('Dock stack', 'VERTICAL', 12); dock.insertChild(dock.children.indexOf(compo), stack); stack.appendChild(compo);
const card = AL('Question card', 'VERTICAL', 0); stack.insertChild(0, card); card.counterAxisSizingMode = 'FIXED'; card.resize(760, card.height);
card.cornerRadius = 16; card.clipsContent = true; card.fills = [P('basic/background')]; card.strokes = [P('basic/stroke-subtle')]; card.strokeWeight = 1; card.strokeAlign = 'INSIDE';
const top = AL('Question', 'HORIZONTAL', 8, { counterAxisAlignItems: 'CENTER' }); card.appendChild(top); top.layoutSizingHorizontal = 'FILL'; top.paddingTop = top.paddingBottom = 12; top.paddingLeft = 16; top.paddingRight = 12; top.fills = [P('basic/background-subtle')];
const q = await T('How should the escalations be presented?', 'DT/Body M Bold', 'basic/text', 'Question'); top.appendChild(q); q.layoutGrow = 1;
const pager = AL('Pager', 'HORIZONTAL', 4, { counterAxisAlignItems: 'CENTER' }); top.appendChild(pager);
pager.appendChild(xs(['left_condensed', 'navigation_left', 'arrow_left'], 'Previous')); pager.appendChild(await T('2 of 4', 'DT/Microcopy Regular', 'basic/text-recessive', 'Count')); pager.appendChild(xs('right_condensed', 'Next'));
top.appendChild(xs('close', 'Close'));
const opts = AL('Options', 'VERTICAL', 0); card.appendChild(opts); opts.layoutSizingHorizontal = 'FILL'; opts.paddingLeft = opts.paddingRight = 8; opts.paddingBottom = 8;
const option = async (lead, text, ink, trailing) => {
  const r = AL('Option', 'HORIZONTAL', 12, { counterAxisAlignItems: 'CENTER' }); opts.appendChild(r); r.layoutSizingHorizontal = 'FILL'; r.counterAxisSizingMode = 'FIXED'; r.resize(r.width, 48); r.paddingLeft = r.paddingRight = 8;
  r.strokes = [P('basic/stroke-subtle')]; r.strokeBottomWeight = 1; r.strokeTopWeight = r.strokeLeftWeight = r.strokeRightWeight = 0; r.strokeAlign = 'INSIDE';
  r.appendChild(lead); const t = await T(text, 'DT/Body S Regular', ink, 'Label'); r.appendChild(t); t.layoutGrow = 1; if (trailing) r.appendChild(trailing); return r; };
for (const [i, txt] of ['One headline escalation per account', 'All escalations, grouped by account', 'The single biggest escalation overall'].entries()) {
  const n = TAG.children.find(x => x.name === 'Type=Subtle, Size=Small').createInstance(); n.setProperties({ [pk(n, 'Label')]: String(i + 1), [pk(n, 'Show icon')]: false }); n.name = 'Number';
  await option(n, txt, 'basic/text');
}
const skip = BTN.children.find(c => c.name === 'Variant=Outline, Type=Standard, State=Default').createInstance(); skip.setProperties({ [pk(skip, 'Label')]: 'Skip', [pk(skip, 'Show left icon')]: false }); skip.name = 'Skip';
const sl = skip.findOne(n => n.type === 'TEXT'); if (sl) await sl.setTextStyleIdAsync(TS['DT/Body S Bold'].id);
const last = await option(inkIcon('edit', 16, 'basic/text-recessive'), 'Describe the shape you want', 'basic/text-recessive', skip); last.strokes = [];
// composer: placeholder + running state (stop)
const msg = main.findOne(n => n.name === 'Message' && n.type === 'TEXT'); await msg.setTextStyleIdAsync(TS['DT/Body M Regular'].id); msg.characters = 'Ask anything…'; msg.fills = [P('basic/text-recessive')]; msg.textAutoResize = 'HEIGHT';
const send = compo.findOne(n => n.type === 'INSTANCE' && n.name === 'Send');
const stopComp = page.findOne(n => n.type === 'COMPONENT' && n.name === 'DT Icon/stop');
if (send) { send.setProperties({ Variant: 'Secondary' }); const k = pk(send, 'Left icon'); if (k && stopComp) send.setProperties({ [k]: stopComp.id }); send.name = 'Stop'; }

// ---------- dark twin ----------
const D = F.clone(); page.appendChild(D); D.name = 'New routine — DT · Dark'; D.x = F.x; D.y = -2480; D.setExplicitVariableModeForCollection(col, col.modes.find(m => m.name === 'Dark').modeId);
return { light: F.id, dark: D.id, stop: !!(send && stopComp) };
