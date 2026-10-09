/* Swap Unify button instances for DT/ODS buttons. Unit interface: ARGS {unit, start, budget, dry, defer}
   Buttons/Button Brand|Neutral|Error (+ flattened "Buttons/Button …" comps) → DT Button · ODS Small (40)
   Small Icon Button, _WYSIWYG button                                   → DT Icon Button · ODS XSmall (24)
   Links, split buttons, toggle groups are left alone (not buttons in ODS terms).
   Reads are collected first; swaps happen in one batch at the end of the driver call (see remap-driver.js).
*/
const A = ARGS;
const G = globalThis.__swap || (globalThis.__swap = { init: false });
if (!G.init) {
  const small = await figma.getNodeByIdAsync('15046:642460'), xs = await figma.getNodeByIdAsync('15054:1341691');
  const pk = (set, p) => Object.keys(set.componentPropertyDefinitions).find(k => k.startsWith(p + '#'));
  G.small = {}; for (const c of small.children) G.small[c.name] = c;
  G.xs = {}; for (const c of xs.children) G.xs[c.name] = c;
  G.k = { label: pk(small, 'Label'), sl: pk(small, 'Show left icon'), li: pk(small, 'Left icon'), sr: pk(small, 'Show right icon'), ri: pk(small, 'Right icon'), xi: pk(xs, 'Icon') };
  const page = await figma.getNodeByIdAsync('15012:25752'); await page.loadAsync();
  G.ods = {}; page.children.find(n => n.name === 'DT Icons').findAllWithCriteria({ types: ['COMPONENT_SET'] }).forEach(s => { const c = s.children.find(x => x.name === 'Style=Outline, Size=24'); if (c) G.ods[s.name.split('/').pop()] = c; });
  const sec = page.children.find(n => n.type === 'SECTION' && n.name === 'DT Chat Components'); const st = sec && sec.findOne(n => n.type === 'COMPONENT' && n.name === 'DT Icon/stop'); if (st) G.ods['__stop'] = st; const sp = sec && sec.findOne(n => n.type === 'COMPONENT' && n.name === 'DT Icon/loading_spinner'); if (sp) G.ods['__spinner'] = sp;
  G.main = {}; G.iconName = {}; G.unmapped = {}; G.stats = {}; G.pending = []; G.init = true;
}
const ICON = {
  'plus': 'add', 'plus-circle': 'circle_add', 'x': 'close', 'x-close': 'close', 'close': 'close', 'x-circle': 'circle_close', 'check': 'checkmark', 'check-circle': 'success',
  'dots-horizontal': 'more', 'dots-vertical': 'more', 'chevron-down': 'collapse_down', 'chevron-up': 'collapse_up', 'chevron-right': 'right_condensed', 'chevron-left': 'left_condensed',
  'chevron-selector-vertical': 'sort', 'arrow-up': 'arrow_up', 'arrow-down': 'arrow_down', 'arrow-left': 'arrow_left', 'arrow-right': 'arrow_right', 'arrow-up-right': 'navigation_external_link',
  'search': 'search', 'filter-lines': 'filter', 'filter-funnel': 'filter', 'copy': 'copy_paste', 'edit': 'edit', 'pencil': 'edit', 'trash': 'delete', 'share': 'share', 'download': 'download', 'upload': 'upload',
  'refresh-cw': 'refresh', 'refresh-ccw': 'refresh', 'settings': 'settings', 'home': 'home', 'home-line': 'home', 'mail': 'email', 'send': 'send', 'attachment': 'attachment', 'paperclip': 'attachment', 'link': 'link', 'link-external': 'navigation_external_link',
  'lock': 'lock', 'unlock': 'unlock', 'eye': 'visibility_on', 'eye-off': 'visibility_off', 'star': 'star', 'heart': 'heart', 'bell': 'notification', 'calendar': 'calendar', 'clock': 'clock', 'folder': 'folder', 'folder-solid': 'folder',
  'file': 'file', 'image': 'image_file', 'microphone': 'microphone', 'stop': '__stop', 'stop-filled': '__stop', 'stop-circle': '__stop', 'play': 'play', 'pause': 'pause', 'info-circle': 'information', 'help-circle': 'help',
  'alert-circle': 'warning', 'alert-triangle': 'warning', 'menu': 'menu', 'grid': 'applications', 'dotpoints': 'to_do_list', 'list': 'to_do_list', 'layout-left': 'pop_up_window', 'layout-right': 'pop_up_window',
  'thumbs-up': 'thumbs_up', 'thumbs-down': 'thumbs_down', 'message-chat-circle': 'chat', 'message-circle': 'chat', 'message-square': 'chat', 'message-text-square': 'chat_text', 'users': 'group', 'user': 'user', 'user-plus': 'user',
  'globe': 'language', 'building': 'company', 'telescope': 'clipboard', 'log-out': 'logout', 'log-in': 'login', 'zoom-in': 'zoom_in', 'zoom-out': 'zoom_out', 'minus': 'minus', 'bookmark': 'bookmark', 'pin': 'pin',
  'magic-wand': 'magic_wand', 'stars': 'magenta_ai', 'star-06': 'magenta_ai', 'sound-on': 'sound_on', 'volume-max': 'volume_up', 'voice-mode': 'voice_mode', 'forward': 'forward', 'branch': 'route', 'maximize': 'maximize_screen',
  'minimize': 'minimize_screen', 'expand': 'maximize_screen', 'printer': 'print', 'tag': 'price_tag', 'phone': 'phone', 'camera': 'photo_camera', 'video-recorder': 'video_camera', 'marker-pin': 'location', 'bar-chart': 'analytics',
  'line-chart-up': 'data_visualisation', 'sun': 'light_dark_mode', 'moon': 'light_dark_mode', 'lightbulb': 'light_bulb', 'key': 'key', 'shield': 'security', 'cloud': 'cloud', 'database': 'server', 'code': 'api',
  'corner-down-right': 'return', 'reply': 'reply_all', 'flip-backward': 'backward', 'rotate-cw': 'refresh', 'repeat': 'loop', 'sort': 'sort', 'switch-vertical': 'sort', 'help': 'help', 'information': 'information',
  'history': 'history', 'cost_loader': '__spinner', 'openai': 'magenta_ai', 'ai_generate-text': 'magic_wand', 'ai-star': 'magenta_ai', 'reverse-left': 'arrow_u_turn_backwards', 'reverse-right': 'forward', 'rotate-left': 'arrow_u_turn_backwards', 'rotate-right': 'refresh', 'face-smile': 'smile', 'artifact-icons': 'file_collection', 'outlook': 'email', 'list-numbers': 'to_do_list', 'clock-rewind': 'history', 'archive': 'inbox', 'inbox': 'inbox', 'save': 'download', 'layers-three': 'file_collection', 'file-check': 'file', 'announcement': 'news', 'slash-circle': 'circle_close', 'target': 'my_location',
};
function norm(name) { return String(name || '').toLowerCase().replace(/^.*\//, '').replace(/\s+/g, '-').replace(/-(solid|filled|fill|line|sm|md|lg)$/g, '').replace(/-\d+$/g, '').replace(/-(solid|filled|fill|line|sm|md|lg)$/g, '').trim(); }
async function mapIcon(compId) {
  if (!compId) return null;
  if (!(compId in G.iconName)) { const c = await figma.getNodeByIdAsync(compId); G.iconName[compId] = c ? (c.parent && c.parent.type === 'COMPONENT_SET' ? c.parent.name : c.name) : ''; }
  const raw = G.iconName[compId], k = norm(raw);
  if (k === 'placeholder' || k === '') return null; // no real icon: keep the DT default
  const ods = ICON[k] || ICON[raw.toLowerCase()] || (G.ods[k.replace(/-/g, '_')] ? k.replace(/-/g, '_') : null);
  if (ods && G.ods[ods]) return G.ods[ods].id;
  G.unmapped[k] = (G.unmapped[k] || 0) + 1; return compId; // keep the original glyph (ink is still masked by the DT button)
}
const VARIANT = { Brand: { Primary: 'Primary', Secondary: 'Outline', Tertiary: 'Ghost' }, Neutral: { Primary: 'Secondary', Secondary: 'Outline', Tertiary: 'Ghost' }, Error: { Primary: 'Primary', Secondary: 'Outline', Tertiary: 'Ghost' } };
const STATE = { Default: 'Default', Hover: 'Hover', Hovered: 'Hover', Pressed: 'Pressed', Focused: 'Focus', Focus: 'Focus', Disabled: 'Disabled' };
const val = (props, name) => { const k = Object.keys(props).find(x => x.split('#')[0].replace(/^[^A-Za-z]+/, '').trim().toLowerCase() === name.toLowerCase()); return k ? props[k].value : undefined; };
async function plan(n) {
  let m = G.main[n.id]; if (m === undefined) { m = await n.getMainComponentAsync(); }
  if (!m || !m.remote) return null;
  const setName = m.parent && m.parent.type === 'COMPONENT_SET' ? m.parent.name : m.name;
  const props = n.componentProperties;
  let family = null, hier, state, iconOnly;
  let mm = setName.match(/^Buttons\/Button (Brand|Neutral|Error)$/);
  if (mm) { family = mm[1]; hier = val(props, 'Hierarchy'); state = val(props, 'State'); iconOnly = val(props, 'Icon') === 'Only'; }
  else if ((mm = setName.match(/^Buttons\/Button (Brand|Neutral|Error)\/[a-z]+\/(Primary|Secondary|Tertiary)\/([A-Za-z]+)\/([A-Za-z]+)$/))) { family = mm[1]; hier = mm[2]; state = mm[4] === 'Default' ? 'Default' : mm[4]; iconOnly = mm[3] === 'Only'; }
  if (family) {
    const variant = (VARIANT[family] || VARIANT.Neutral)[hier] || 'Ghost'; const st = STATE[state] || 'Default';
    const comp = G.small[`Variant=${variant}, Type=${iconOnly ? 'Icon only' : 'Standard'}, State=${st}`]; if (!comp) return null;
    const lead = val(props, 'Icon leading'), trail = val(props, 'Icon trailing');
    const leadSwap = await mapIcon(val(props, 'Icon leading swap')), trailSwap = await mapIcon(val(props, 'Icon trailing swap'));
    const set = {};
    if (iconOnly) { if (leadSwap) set[G.k.li] = leadSwap; }
    else {
      const t = n.findOne(x => x.type === 'TEXT' && x.visible !== false); if (t) set[G.k.label] = t.characters;
      set[G.k.sl] = !!lead; set[G.k.sr] = !!trail; if (leadSwap) set[G.k.li] = leadSwap; if (trailSwap) set[G.k.ri] = trailSwap;
    }
    const key = setName.split('/').slice(0, 2).join('/') + ' ' + hier + ' → ' + variant + (iconOnly ? ' icon' : ''); G.stats[key] = (G.stats[key] || 0) + 1;
    return { n, comp, set };
  }
  if (setName === 'Small Icon Button' || setName === '_WYSIWYG button') {
    const st = STATE[val(props, 'State')] || 'Default'; const comp = G.xs[`Variant=Ghost, State=${st}`];
    const sw = await mapIcon(val(props, 'Icon swap')); const set = {}; if (sw) set[G.k.xi] = sw;
    G.stats[setName + ' → XSmall Ghost'] = (G.stats[setName + ' → XSmall Ghost'] || 0) + 1;
    return { n, comp, set };
  }
  return null;
}
const looksLikeButton = n => { let ks; try { ks = Object.keys(n.componentProperties); } catch (e) { return false; }
  const has = w => ks.some(k => k.split('#')[0].replace(/^[^A-Za-z]+/, '').trim() === w);
  return (has('Hierarchy') && has('State')) || (has('Icon swap') && has('State')) || /^Buttons\/Button (Brand|Neutral|Error)\//.test(n.name); };
const root = A.unit.self || A.unit.node; const deep = !A.unit.self;
const deadline = Date.now() + (A.budget || 12000);
let i = -1, done = true, found = 0; const startAt = A.start || 0;
const stack = [root];
while (stack.length) {
  const n = stack.pop(); i++;
  if (i >= startAt && Date.now() > deadline) { done = false; break; }
  if (n.type === 'INSTANCE' && looksLikeButton(n)) {
    if (i >= startAt) { try { const pl = await plan(n); if (pl) { found++; if (!A.dry) G.pending.push(pl); } } catch (e) {} }
    continue; // never descend into a button
  }
  if (deep && 'children' in n) for (let k = n.children.length - 1; k >= 0; k--) { const c = n.children[k]; if (c.visible !== false) stack.push(c); }
}
return { next: done ? null : i, found };
