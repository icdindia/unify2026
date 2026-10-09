/* Build ODS icons as Figma component sets (runs in the Desktop Bridge plugin).
   ARGS: {base, cat, from, to, pageId}
   - ensures a SECTION "DT Icons" on the page (below "DT Components") and a wrap frame per category
   - one component set per icon: "DT Icons/<Category>/<name>", variants Style=Outline|Selected × Size=24|16
   - vector fills bound to the DT variable basic/text (follows Light/Dark)
*/
const A = ARGS;
const page = await figma.getNodeByIdAsync(A.pageId); await figma.setCurrentPageAsync(page);
const data = await (await fetch(A.base + '/icons-all.json')).json();
const V = {}; for (const v of await figma.variables.getLocalVariablesAsync()) V[v.name] = v;
const ink = figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', V['basic/text']);
const TS = {}; for (const s of await figma.getLocalTextStylesAsync()) TS[s.name] = s;
await figma.loadFontAsync({ family: 'TeleNeo Var', style: 'Bold' }); await figma.loadFontAsync({ family: 'TeleNeo Var', style: 'Medium' });

let sec = page.children.find(n => n.type === 'SECTION' && n.name === 'DT Icons');
if (!sec) {
  const comps = page.children.find(n => n.type === 'SECTION' && n.name === 'DT Components');
  sec = figma.createSection(); sec.name = 'DT Icons'; page.appendChild(sec);
  sec.x = comps.x; sec.y = comps.y + comps.height + 240; sec.resizeWithoutConstraints(3000, 400);
  const t = figma.createText(); await t.setTextStyleIdAsync(TS['DT/Title M'].id); t.characters = 'ODS icons'; sec.appendChild(t); t.x = 40; t.y = 32; t.name = 'Heading';
  const n = figma.createText(); await n.setTextStyleIdAsync(TS['DT/Body M Regular'].id);
  n.characters = '375 icons from @telekom-ods/react-icons. One component set per icon: Style = Outline | Selected, Size = 24 | 16. Ink bound to basic/text. React name: ODS + PascalCase (arrow_left → ODSArrowLeft).';
  sec.appendChild(n); n.x = 40; n.y = 96; n.name = 'Note';
}
// category frame
const catName = A.cat;
let cf = sec.children.find(n => n.type === 'FRAME' && n.name === 'Category / ' + catName);
if (!cf) {
  const prev = sec.children.filter(n => n.type === 'FRAME' && n.name.startsWith('Category / '));
  const y = prev.length ? Math.max(...prev.map(p => p.y + p.height)) + 48 : 160;
  cf = figma.createFrame(); cf.name = 'Category / ' + catName; sec.appendChild(cf);
  cf.x = 40; cf.y = y; cf.layoutMode = 'VERTICAL'; cf.itemSpacing = 16; cf.fills = [];
  cf.primaryAxisSizingMode = 'AUTO'; cf.counterAxisSizingMode = 'FIXED'; cf.resize(2920, 100);
  const h = figma.createText(); await h.setTextStyleIdAsync(TS['DT/Title S'].id); h.characters = catName + ' (' + data.categories[catName].length + ')'; cf.appendChild(h); h.name = 'Heading';
  const g = figma.createFrame(); g.name = 'Icons'; cf.appendChild(g); g.layoutMode = 'HORIZONTAL'; g.layoutWrap = 'WRAP'; g.itemSpacing = 16; g.counterAxisSpacing = 16; g.fills = [];
  g.layoutSizingHorizontal = 'FILL'; g.primaryAxisSizingMode = 'FIXED'; g.counterAxisSizingMode = 'AUTO';
}
const grid = cf.children.find(n => n.name === 'Icons');
const have = new Set(grid.children.map(n => n.name.replace('Cell / ', 'DT Icons/' + catName + '/')));
const names = data.categories[catName].slice(A.from, A.to);
const VARS = [['outline', 'Outline', 24], ['selected', 'Selected', 24], ['small', 'Outline', 16], ['small-selected', 'Selected', 16]];
const built = [];
for (const name of names) {
  const setName = 'DT Icons/' + catName + '/' + name;
  if (have.has(setName)) continue;
  const comps = [];
  for (const [vk, style, size] of VARS) {
    const inner = data.variants[vk].svg[name]; if (!inner) continue;
    const node = figma.createNodeFromSvg('<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">' + inner.replace(/currentColor/g, '#000000') + '</svg>');
    const c = figma.createComponent(); c.name = 'Style=' + style + ', Size=' + size; c.resize(size, size); c.fills = []; c.clipsContent = true;
    for (const ch of [...node.children]) c.appendChild(ch); node.remove();
    c.findAll(n => 'fills' in n && Array.isArray(n.fills) && n.fills.length).forEach(n => { n.fills = [ink]; });
    comps.push(c);
  }
  const cell = figma.createFrame(); cell.name = 'Cell / ' + name; grid.appendChild(cell);
  cell.layoutMode = 'VERTICAL'; cell.itemSpacing = 4; cell.fills = []; cell.primaryAxisSizingMode = 'AUTO'; cell.counterAxisSizingMode = 'FIXED'; cell.resize(168, 60);
  const set = figma.combineAsVariants(comps, cell);
  set.name = setName;
  set.layoutMode = 'HORIZONTAL'; set.itemSpacing = 8; set.counterAxisAlignItems = 'CENTER';
  set.paddingLeft = set.paddingRight = set.paddingTop = set.paddingBottom = 8;
  set.primaryAxisSizingMode = 'AUTO'; set.counterAxisSizingMode = 'AUTO'; set.fills = [];
  const pascal = 'ODS' + name.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
  set.description = 'ODS icon "' + name + '" (' + catName + '). React: ' + pascal + ' from @telekom-ods/react-icons. Style Outline/Selected, Size 24/16. Ink = basic/text.';
  const lab = figma.createText(); await lab.setTextStyleIdAsync(TS['DT/Microcopy Regular'].id); lab.characters = name; cell.appendChild(lab); lab.name = 'Name';
  lab.fills = [figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', V['basic/text-recessive'])];
  lab.layoutSizingHorizontal = 'FILL'; lab.textTruncation = 'ENDING';
  built.push(name);
}
// grow the section to fit
let maxX = 0, maxY = 0; for (const n of sec.children) { maxX = Math.max(maxX, n.x + n.width); maxY = Math.max(maxY, n.y + n.height); }
sec.resizeWithoutConstraints(Math.max(3000, maxX + 40), maxY + 60);
return { cat: catName, built: built.length, total: grid.children.length, of: data.categories[catName].length };
