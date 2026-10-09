/* Map every Unify component inside a root node (default: section "Nav Compos") to DT Pilot / ODS components.
   ARGS {rootId, phase:'plan'|'apply', from, ms}. Plans are kept in globalThis.__nav.plans between calls. */
const A = ARGS;
const G = globalThis.__nav || (globalThis.__nav = {});
if (!G.init) {
  const byId = async id => await figma.getNodeByIdAsync(id);
  const kids = s => { const o = {}; for (const c of s.children) o[c.name] = c; return o; };
  const pk = (set, p) => Object.keys(set.componentPropertyDefinitions).find(k => k.startsWith(p + '#'));
  G.btn = await byId('15046:642460'); G.btnC = kids(G.btn);
  G.xs = await byId('15054:1341691'); G.xsC = kids(G.xs);
  G.avatar = await byId('15012:25979');
  G.navRow = await byId('15019:279868'); G.navRowC = kids(G.navRow);
  G.seg = await byId('15049:140095'); G.segC = kids(G.seg);
  G.sw = await byId('15064:987016'); G.swC = kids(G.sw);
  G.dot = await byId('15064:987021'); G.dotC = kids(G.dot);
  G.tag = await byId('15064:987034'); G.tagC = kids(G.tag);
  G.logo = { White: await byId('15064:987035'), Magenta: await byId('15064:987040') };
  G.k = { label: pk(G.btn, 'Label'), sl: pk(G.btn, 'Show left icon'), li: pk(G.btn, 'Left icon'), sr: pk(G.btn, 'Show right icon'), ri: pk(G.btn, 'Right icon'), xi: pk(G.xs, 'Icon'),
    av: pk(G.avatar, 'Initials'), nl: pk(G.navRow, 'Label'), ni: pk(G.navRow, 'Icon'), sgl: pk(G.seg, 'Label'), sgsl: pk(G.seg, 'Show label'), sgsi: pk(G.seg, 'Show icon'), sgi: pk(G.seg, 'Icon'),
    tl: pk(G.tag, 'Label') };
  const page = await byId('15012:25752'); await page.loadAsync();
  G.ods = {}; page.children.find(n => n.name === 'DT Icons').findAllWithCriteria({ types: ['COMPONENT_SET'] }).forEach(s => { G.ods[s.name.split('/').pop()] = s; });
  const sec = page.children.find(n => n.type === 'SECTION' && n.name === 'DT Chat Components');
  G.search = sec.findOne(n => n.type === 'COMPONENT' && n.name === 'DT Flyout Menu Search');
  G.spinner = sec.findOne(n => n.type === 'COMPONENT' && n.name === 'DT Icon/loading_spinner');
  G.searchK = Object.keys(G.search.componentPropertyDefinitions)[0];
  G.plans = []; G.stats = {}; G.skipped = {}; G.init = true;
}
const ICON = { 'plus': 'add', 'x': 'close', 'x-close': 'close', 'check': 'checkmark', 'dots-horizontal': 'more', 'dots-vertical': 'more', 'chevron-down': 'collapse_down', 'chevron-up': 'collapse_up',
  'chevron-right': 'right_condensed', 'chevron-left': 'left_condensed', 'chevron-selector-vertical': 'sort', 'search': 'search', 'search-md': 'search', 'layout-left': 'pop_up_window', 'layout-right': 'pop_up_window',
  'calendar': 'calendar', 'clock': 'clock', 'clock-rewind': 'history', 'folder': 'folder', 'book-open': 'operating_manual', 'cube': 'package', 'ai-agent': 'magenta_ai', 'explore-ai-agents': 'magenta_ai', 'ai-avatar': 'magenta_ai',
  'log-out': 'logout', 'log-in': 'login', 'settings': 'settings', 'home': 'home', 'home-line': 'home', 'users': 'group', 'user': 'user', 'bell': 'notification', 'star': 'star', 'pin': 'pin', 'edit': 'edit', 'trash': 'delete',
  'share': 'share', 'download': 'download', 'upload': 'upload', 'copy': 'copy_paste', 'link': 'link', 'lock': 'lock', 'mail': 'email', 'message-chat-circle': 'chat', 'message-circle': 'chat', 'grid': 'applications',
  'dotpoints': 'to_do_list', 'filter-lines': 'filter', 'arrow-left': 'arrow_left', 'arrow-right': 'arrow_right', 'arrow-up': 'arrow_up', 'arrow-down': 'arrow_down', 'help-circle': 'help', 'info-circle': 'information',
  'sun': 'light_dark_mode', 'moon': 'light_dark_mode', 'layers-two': 'file_collection', 'layers-three': 'file_collection', 'building': 'company', 'globe': 'language', 'bookmark': 'bookmark', 'sparkles': 'magic_wand', 'stars': 'magenta_ai',
  'menu': 'menu', 'phone': 'phone', 'file': 'file', 'image': 'image_file', 'microphone': 'microphone', 'refresh-cw': 'refresh', 'refresh-ccw': 'refresh', 'expand': 'maximize_screen', 'minimize': 'minimize_screen',
  'switch-horizontal': 'switch_users', 'switch-vertical': 'sort', 'announcement': 'news', 'zap': 'light_bulb', 'target': 'my_location', 'tool': 'tools', 'bar-chart': 'analytics' };
const norm = s => String(s || '').toLowerCase().replace(/^.*\//, '').trim().replace(/\s+/g, '-').replace(/-(solid|filled|fill|line|sm|md|lg)$/g, '').replace(/-\d+$/g, '').replace(/-(solid|filled|fill|line|sm|md|lg)$/g, '');
function odsIcon(name, w) {
  const solid = /solid|filled/i.test(name); const k = norm(name);
  const key = ICON[k] || (G.ods[k.replace(/-/g, '_')] ? k.replace(/-/g, '_') : null); if (!key || !G.ods[key]) return null;
  const size = w <= 18 ? 16 : 24; const set = G.ods[key];
  return set.children.find(c => c.name === `Style=${solid ? 'Selected' : 'Outline'}, Size=${size}`) || set.children.find(c => c.name === `Style=Outline, Size=${size}`);
}
const val = (props, name) => { const k = Object.keys(props).find(x => x.split('#')[0].replace(/^[^A-Za-z]+/, '').trim().toLowerCase() === name.toLowerCase()); return k ? props[k].value : undefined; };
const STATE = { Default: 'Default', Hover: 'Hover', Hovered: 'Hover', Pressed: 'Pressed', Focused: 'Focus', Focus: 'Focus', Disabled: 'Disabled' };
const firstText = n => { const t = n.findOne && n.findOne(x => x.type === 'TEXT' && x.visible !== false) || (n.findOne && n.findOne(x => x.type === 'TEXT')); return t ? t.characters : ''; };
const vecPaint = n => { const v = n.findOne && n.findOne(x => (x.type === 'VECTOR' || x.type === 'BOOLEAN_OPERATION') && Array.isArray(x.fills) && x.fills.length); return v ? v.fills[0] : null; };
async function iconOf(container, w) { const i = container.findOne && container.findOne(x => x.type === 'INSTANCE'); if (!i) return null; const m = await i.getMainComponentAsync(); const nm = m ? (m.parent && m.parent.type === 'COMPONENT_SET' ? m.parent.name : m.name) : i.name; return odsIcon(nm, w || 24); }
function bgLum(n) { for (let p = n.parent; p && p.type !== 'PAGE'; p = p.parent) { if (Array.isArray(p.fills)) { const f = p.fills.find(q => q.type === 'SOLID' && q.visible !== false); if (f) { const c = f.color; return 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b; } } } return 1; }
const stat = k => { G.stats[k] = (G.stats[k] || 0) + 1; };
async function plan(n, m, k) {
  const props = n.componentProperties; const w = n.width;
  let mm;
  if ((mm = k.match(/^Buttons\/Button (Brand|Neutral|Error)/))) {
    const hier = val(props, 'Hierarchy') || 'Tertiary', only = val(props, 'Icon') === 'Only', st = STATE[val(props, 'State')] || 'Default';
    const variant = { Brand: { Primary: 'Primary', Secondary: 'Outline', Tertiary: 'Ghost' }, Neutral: { Primary: 'Secondary', Secondary: 'Outline', Tertiary: 'Ghost' }, Error: { Primary: 'Primary', Secondary: 'Outline', Tertiary: 'Ghost' } }[mm[1]][hier] || 'Ghost';
    const ico = await iconOf(n, 20); const set = {};
    if (only) { if (ico) set[G.k.li] = ico.id; } else { set[G.k.label] = firstText(n) || 'Button'; set[G.k.sl] = !!val(props, 'Icon leading'); set[G.k.sr] = false; if (ico) set[G.k.li] = ico.id; }
    stat('Button → DT Button Small'); return { n, comp: G.btnC[`Variant=${variant}, Type=${only ? 'Icon only' : 'Standard'}, State=${st}`], set };
  }
  if (k === 'Small Icon Button' || k === '_WYSIWYG button') { const ico = await iconOf(n, 16); stat(k + ' → XSmall'); return { n, comp: G.xsC[`Variant=Ghost, State=${STATE[val(props, 'State')] || 'Default'}`], set: ico ? { [G.k.xi]: ico.id } : {} }; }
  if (k === 'Avatar') { stat('Avatar → DT Avatar'); return { n, comp: G.avatar, set: { [G.k.av]: (firstText(n) || 'A').slice(0, 2) } }; }
  if (k === '_Avatar online indicator') { stat('Online → Badge Dot'); return { n, comp: G.dotC['Mode=Success'], set: {} }; }
  if (k === 'Dot') { const c = String(val(props, 'Colour') || ''); const mode = /success|green/i.test(c) ? 'Success' : /error|red/i.test(c) ? 'Error' : /brand|primary/i.test(c) ? 'Notification' : 'Neutral'; stat('Dot → Badge Dot'); return { n, comp: G.dotC['Mode=' + mode], set: {} }; }
  if (k === 'Toggle') { const on = /true/i.test(String(val(props, 'Pressed'))); const st = STATE[val(props, 'State')] || 'Default'; stat('Toggle → DT Switch'); return { n, comp: G.swC[`Selected=${on ? 'On' : 'Off'}, State=${st}`], set: {} }; }
  if (/^Pill squared$/i.test(k)) { stat('Pill → DT Tag'); return { n, comp: G.tagC['Type=Subtle'], set: { [G.k.tl]: firstText(n) || '' } }; }
  if (k === 'Base_Platform Nav Menu Unit') { const sel = val(props, 'Selected') === 'Yes'; const st = sel ? 'Selected' : (STATE[val(props, 'State')] === 'Hover' ? 'Hover' : 'Default'); const ico = await iconOf(n.findOne(x => x.name === '_nav icon') || n, 24); const set = { [G.k.nl]: firstText(n) }; if (ico) set[G.k.ni] = ico.id; stat('Nav menu unit → DT Nav Row'); return { n, comp: G.navRowC['State=' + st] || G.navRowC['State=Default'], set }; }
  if (k === 'Search_outline') { stat('Search → DT Flyout Menu Search'); return { n, comp: G.search, set: { [G.searchK]: firstText(n) || 'Search' } }; }
  if (k === 'Filter Tabs Base') { const ico = await iconOf(n, 20); const set = { [G.k.label]: firstText(n), [G.k.sl]: !!ico, [G.k.sr]: false }; if (ico) set[G.k.li] = ico.id; stat('Filter tab → DT Button Small Ghost'); return { n, comp: G.btnC[`Variant=Ghost, Type=Standard, State=${STATE[val(props, 'State')] || 'Default'}`], set }; }
  if (k === 'Unify Logo') { stat('Unify Logo → DT T-mark'); return { n, comp: G.logo[bgLum(n) < 0.5 ? 'White' : 'Magenta'], set: {} }; }
  if (/spinner/i.test(k)) { stat('Spinner → DT loading spinner'); return { n, comp: G.spinner, set: {}, keepSize: true }; }
  if (k === 'Horizontal tabs' || k === 'Toggle group') return { n, segmentize: true, kind: k };
  const ico = odsIcon(k === 'AI Avatar' ? 'ai-avatar' : k, w);
  if (ico) { stat('icon ' + norm(k) + ' → ' + ico.parent.name.split('/').pop()); return { n, comp: ico, set: {}, ink: vecPaint(n), keepSize: true }; }
  return null;
}
const KEEP = /^(hubspot|salesforce|slack|t-mobile|t-mobile-white|Cursor|placeholder|Featured icon|Featured Icon_Solid|Agent_Avatar|_nav icon|_Toggle group base|Button Tab base|_Toggle base)$/i;
if (A.phase === 'plan') {
  const root = await figma.getNodeByIdAsync(A.rootId || '10773:763908'); G.plans = []; G.stats = {}; G.skipped = {};
  const st = [...root.children]; const t = Date.now();
  while (st.length) {
    const x = st.pop();
    if (x.type === 'INSTANCE') {
      let m = null; try { m = await x.getMainComponentAsync(); } catch (e) {}
      if (m && m.remote) {
        const k = m.parent && m.parent.type === 'COMPONENT_SET' ? m.parent.name : m.name;
        let p = null; try { p = await plan(x, m, k); } catch (e) { G.skipped['ERR ' + k] = String(e).slice(0, 80); }
        if (p && (p.comp || p.segmentize)) { G.plans.push(p); continue; }
        if (!KEEP.test(k)) G.skipped[k] = (G.skipped[k] || 0) + 1;
      }
    }
    if ('children' in x) for (const c of x.children) st.push(c);
  }
  return { plans: G.plans.length, ms: Date.now() - t, stats: G.stats, skipped: G.skipped };
}
// apply
const end = Date.now() + (A.ms || 20000); let i = A.from || 0, ok = 0, err = 0; const errs = [];
for (; i < G.plans.length && Date.now() < end; i++) {
  const p = G.plans[i];
  try {
    if (p.n.removed) continue;
    if (p.segmentize) {
      if (p.n.id.includes(';')) { G.skipped['nested ' + p.kind] = (G.skipped['nested ' + p.kind] || 0) + 1; continue; }
      const bases = p.n.findAll(x => x.type === 'INSTANCE' && /(_Toggle group base|Button Tab base)/.test(x.name) && x.visible !== false);
      const tr = figma.createFrame(); tr.name = (p.kind === 'Toggle group' ? 'View' : 'Tabs') + ' · ODS SegmentedButton'; tr.layoutMode = 'HORIZONTAL'; tr.itemSpacing = 4; tr.paddingLeft = tr.paddingRight = tr.paddingTop = tr.paddingBottom = 4; tr.primaryAxisSizingMode = 'AUTO'; tr.counterAxisSizingMode = 'AUTO'; tr.cornerRadius = 999;
      const V = await figma.variables.getLocalVariablesAsync(); tr.fills = [figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: .95, g: .95, b: .95 } }, 'color', V.find(v => v.name === 'basic/background-subtle'))];
      let first = true;
      for (const b of bases) {
        const bp = b.componentProperties; const selRaw = Object.entries(bp).find(([kk, vv]) => /current|active|selected|state/i.test(kk) && /true|active|current|selected|yes/i.test(String(vv.value)));
        const sel = selRaw ? true : false; const txt = firstText(b); const ico = txt ? null : await iconOf(b, 16);
        const s = G.segC[`Type=Secondary, Selected=${sel ? 'Yes' : 'No'}, State=Default`].createInstance(); const set = {};
        if (txt) { set[G.k.sgl] = txt; } else { set[G.k.sgsl] = false; set[G.k.sgsi] = true; if (ico) set[G.k.sgi] = ico.id; }
        s.setProperties(set); s.name = txt || 'Icon'; tr.appendChild(s); first = false;
      }
      const par = p.n.parent; const idx = par.children.indexOf(p.n); par.insertChild(idx, tr);
      if (par.layoutMode === 'NONE' || !par.layoutMode) { tr.x = p.n.x; tr.y = p.n.y; } else if (p.n.layoutPositioning === 'ABSOLUTE') { tr.layoutPositioning = 'ABSOLUTE'; tr.x = p.n.x; tr.y = p.n.y; }
      tr.visible = p.n.visible; p.n.remove(); G.stats['segmented ' + p.kind] = (G.stats['segmented ' + p.kind] || 0) + 1; ok++; continue;
    }
    const w = p.n.width, h = p.n.height;
    p.n.swapComponent(p.comp);
    if (Object.keys(p.set).length) p.n.setProperties(p.set);
    if (p.keepSize) { try { p.n.resize(w, h); } catch (e) {} }
    if (p.ink) p.n.findAll(x => x.type === 'VECTOR' || x.type === 'BOOLEAN_OPERATION').forEach(v => { v.fills = [p.ink]; });
    ok++;
  } catch (e) { err++; if (errs.length < 5) errs.push(String(e).slice(0, 120)); }
}
return { applied: ok, err, errs, next: i, of: G.plans.length, done: i >= G.plans.length, skipped: G.skipped };
