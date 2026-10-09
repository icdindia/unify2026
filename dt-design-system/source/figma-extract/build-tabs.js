// DT Tab (ODS TabElement) + DT Tabs (ODS Tabs) — measured from ods.trap.ng.telekom.net components-tabs--example-story (2026-10-07).
// ARGS {step:'tab'|'tabs', x, y, sectionId}
const A=ARGS;
await figma.setCurrentPageAsync(figma.root.children.find(p=>p.id==='15012:25752'));
const V={}; for(const v of await figma.variables.getLocalVariablesAsync()) V[v.name]=v;
const TS={}; for(const s of await figma.getLocalTextStylesAsync()) TS[s.name]=s;
await figma.loadFontAsync({family:'TeleNeo Var',style:'Medium'}); await figma.loadFontAsync({family:'TeleNeo Var',style:'Bold'});
const paint=n=>figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',V[n]);
const bindR=(f,n)=>{for(const k of ['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius']) f.setBoundVariable(k,V[n]);};
const sec=await figma.getNodeByIdAsync(A.sectionId);
const ICON={o16:'15038:289356',s16:(await figma.getNodeByIdAsync('15038:289356')).parent.children.find(c=>c.name==='Style=Selected, Size=16').id,o24:'15038:289344'};
ICON.s24=(await figma.getNodeByIdAsync('15038:289344')).parent.children.find(c=>c.name==='Style=Selected, Size=24').id;
// colour map per ODS CSS
const COL={Default:{lab:'basic/text',ic:'basic/accent-secondary',labS:'basic/text-dominant',icS:'basic/accent',lineS:'basic/accent'},
           Hover:{lab:'state/hover-text-dominant-hover',ic:'state/hover-accent-hover',labS:'state/hover-text-dominant-hover',icS:'state/hover-accent-hover',lineS:'state/hover-accent-hover'},
           Pressed:{lab:'state/pressed-text-dominant-pressed',ic:'state/pressed-accent-pressed',labS:'state/pressed-text-dominant-pressed',icS:'state/pressed-accent-pressed',lineS:'state/pressed-accent-pressed'},
           Focus:{lab:'basic/text',ic:'basic/accent-secondary',labS:'basic/text-dominant',icS:'basic/accent',lineS:'basic/accent'}};
if(A.step==='tab'){
  for(const o of sec.children.filter(n=>n.name==='DT Tab · ODS'||n.name==='Board · DT Tab · ODS')) o.remove();
  const comps=[];
  for(const size of ['Small','Large']) for(const sel of ['False','True']) for(const st of ['Default','Hover','Pressed','Focus']){
    const L=size==='Large'; const S=sel==='True'; const c=COL[st];
    const T=figma.createComponent(); sec.appendChild(T); T.name=`Size=${size}, Selected=${sel}, State=${st}`;
    T.layoutMode='VERTICAL'; T.primaryAxisSizingMode='AUTO'; T.counterAxisSizingMode='AUTO'; T.itemSpacing=L?20:8; T.minWidth=80; T.counterAxisAlignItems='CENTER'; T.fills=[]; T.clipsContent=false;
    const C=figma.createFrame(); T.appendChild(C); C.name='Content'; C.layoutMode='HORIZONTAL'; C.primaryAxisSizingMode='AUTO'; C.counterAxisSizingMode='AUTO'; C.paddingTop=C.paddingBottom=8; C.itemSpacing=L?16:8; C.counterAxisAlignItems='CENTER'; C.fills=[];
    const ic=(await figma.getNodeByIdAsync(S?(L?ICON.s24:ICON.s16):(L?ICON.o24:ICON.o16))).createInstance(); C.appendChild(ic); ic.name='Icon'; if(L) ic.resize(22,22);
    for(const v of ic.findAll(n=>'fills' in n&&Array.isArray(n.fills)&&n.fills.length&&n.fills[0].type==='SOLID')) v.fills=[paint(S?c.icS:c.ic)];
    const t=figma.createText(); C.appendChild(t); t.name='Label'; t.fontName={family:'TeleNeo Var',style:'Bold'}; t.characters='Tab'; await t.setTextStyleIdAsync(TS[L?'DT/Subtitle':'DT/Body M Bold'].id); t.fills=[paint(S?c.labS:c.lab)];
    const ln=figma.createRectangle(); T.appendChild(ln); ln.name='Indicator'; ln.resize(80,4); ln.layoutSizingHorizontal='FILL'; bindR(ln,'radius/extra-small'); ln.fills=S?[paint(c.lineS)]:[];
    if(st==='Focus'){ T.strokes=[paint('state/focus-focus')]; T.strokeWeight=2; T.strokeAlign='OUTSIDE'; bindR(T,'radius/extra-small'); }
    comps.push(T);
  }
  const set=figma.combineAsVariants(comps,sec); set.name='DT Tab · ODS';
  set.layoutMode='HORIZONTAL'; set.layoutWrap='WRAP'; set.itemSpacing=32; set.counterAxisSpacing=32; set.paddingLeft=set.paddingRight=set.paddingTop=set.paddingBottom=24; set.primaryAxisSizingMode='FIXED'; set.resize(4*112+3*32+48+40,100); set.counterAxisSizingMode='AUTO';
  set.fills=[paint('basic/background')]; set.cornerRadius=16;
  const pL=set.addComponentProperty('Label','TEXT','Tab'); const pS=set.addComponentProperty('Show icon','BOOLEAN',true);
  const pI=set.addComponentProperty('Icon','INSTANCE_SWAP',ICON.o16); const pIS=set.addComponentProperty('Icon selected','INSTANCE_SWAP',ICON.s16);
  for(const v of set.children){ const S=/Selected=True/.test(v.name); v.findOne(n=>n.name==='Label').componentPropertyReferences={characters:pL};
    const ic=v.findOne(n=>n.name==='Icon'); ic.componentPropertyReferences={visible:pS, mainComponent:S?pIS:pI}; }
  set.x=A.x; set.y=A.y;
  set.description='ODS TabElement. Size Small (48: content 8/0 padding, 16 icon, 8 gap, Body M Bold 16, 8 gap, 4px indicator r6) or Large (64: 22 icon, 16 gap, 24 Bold label, 20 gap, 4px indicator). Selected = text-dominant label + accent icon (use the filled "Icon selected") + accent indicator; Hover/Pressed use the interaction-state tokens; min width 80. Use inside DT Tabs · ODS.';
  return {id:set.id,w:set.width,h:set.height,props:Object.keys(set.componentPropertyDefinitions)};
}
if(A.step==='tabs'){
  for(const o of sec.children.filter(n=>n.name==='DT Tabs · ODS')) o.remove();
  const tabSet=await figma.getNodeByIdAsync(A.tabId);
  const comps=[];
  for(const size of ['Small','Large']) for(const variant of ['Hug','Fill']) for(const div of ['True','False']){
    const L=size==='Large';
    const B=figma.createComponent(); sec.appendChild(B); B.name=`Size=${size}, Variant=${variant}, Divider=${div}`;
    B.layoutMode='HORIZONTAL'; B.counterAxisSizingMode='AUTO'; B.primaryAxisSizingMode='FIXED'; B.resize(variant==='Fill'?560:560,10); B.paddingTop=B.paddingBottom=6; B.itemSpacing=20; B.fills=[]; B.clipsContent=false; B.counterAxisAlignItems='MAX';
    if(div==='True'){ const d=figma.createRectangle(); B.appendChild(d); d.name='Divider'; d.layoutPositioning='ABSOLUTE'; d.resize(560,4); d.fills=[paint('state/disabled-background-disabled')]; bindR(d,'radius/extra-small'); d.constraints={horizontal:'STRETCH',vertical:'MAX'}; }
    const labels=['Tab one','Tab two','Tab three','Tab four','Tab five'];
    for(let i=0;i<5;i++){ const v=tabSet.children.find(c=>c.name===`Size=${size}, Selected=${i===0?'True':'False'}, State=Default`); const t=v.createInstance(); B.appendChild(t); t.name='Tab '+(i+1);
      t.setProperties({[Object.keys(t.componentProperties).find(k=>k.startsWith('Label#'))]:labels[i]}); if(variant==='Fill') t.layoutGrow=1; }
    const d=B.findOne(n=>n.name==='Divider'); if(d){ d.x=0; d.y=B.height-6-4; d.resize(B.width,4); }
    comps.push(B);
  }
  const set=figma.combineAsVariants(comps,sec); set.name='DT Tabs · ODS';
  set.layoutMode='VERTICAL'; set.itemSpacing=32; set.paddingLeft=set.paddingRight=set.paddingTop=set.paddingBottom=24; set.primaryAxisSizingMode='AUTO'; set.counterAxisSizingMode='AUTO';
  set.fills=[paint('basic/background')]; set.cornerRadius=16;
  for(let i=4;i<=5;i++){ const p=set.addComponentProperty('Show tab '+i,'BOOLEAN',true); for(const v of set.children) v.findOne(n=>n.name==='Tab '+i).componentPropertyReferences={visible:p}; }
  set.x=A.x; set.y=A.y;
  set.description='ODS Tabs bar: padding 6/0, 20 between tabs, Variant Hug (tabs hug) or Fill (tabs share the width), optional Divider = 4px track (state/disabled-background, r6) under the indicators. Tabs are DT Tab · ODS instances: override Label / Icon / Icon selected and Selected per tab. Up to 5 tabs (ODS guidance).';
  return {id:set.id,w:set.width,h:set.height};
}
