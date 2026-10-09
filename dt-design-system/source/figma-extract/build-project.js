// Project dashboard — DT (ODS). Source: Unify "Dashboard" 901:212281. ARGS {step, id?, x, y}
const A=ARGS;
await figma.setCurrentPageAsync(figma.root.children.find(p=>p.id==='15012:25752'));
const V={}; for(const v of await figma.variables.getLocalVariablesAsync()) V[v.name]=v;
const TS={}; for(const s of await figma.getLocalTextStylesAsync()) TS[s.name]=s;
await figma.loadFontAsync({family:'TeleNeo Var',style:'Medium'}); await figma.loadFontAsync({family:'TeleNeo Var',style:'Bold'});
const paint=n=>figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',V[n]);
const AL=(dir,name,props)=>{const f=figma.createFrame(); f.name=name; f.layoutMode=dir; f.primaryAxisSizingMode='AUTO'; f.counterAxisSizingMode='AUTO'; f.fills=[]; f.clipsContent=false; Object.assign(f,props||{}); return f;};
const txt=async(parent,chars,style,col,sid)=>{const t=figma.createText(); parent.appendChild(t); t.fontName={family:'TeleNeo Var',style:'Medium'}; t.characters=chars; await t.setTextStyleIdAsync(sid||TS[style].id); t.fills=[paint(col)]; return t;};
const IC={chat:'15038:289356',shared:'15038:289409',clock:'15038:290407',apps:'15038:290134',settings:'15038:294567',pin:'15038:287957',more:'15038:287839',leave:'15038:287012',logout:'15038:287643',down:'15038:293938'};
const btnSet=await figma.getNodeByIdAsync('15046:642460');
const BV=(variant,type)=>btnSet.children.find(c=>c.name===`Variant=${variant}, Type=${type}, State=Default`);
const setBtn=async(b,o)=>{const p={}; for(const k of Object.keys(b.componentProperties)){ if(k.startsWith('Label#')&&o.label) p[k]=o.label; if(k.startsWith('Show left icon#')) p[k]=!!o.icon; if(k.startsWith('Left icon#')&&o.icon) p[k]=o.icon; if(k.startsWith('Show right icon#')) p[k]=false; } b.setProperties(p);
  if(o.label){ const l=b.findOne(n=>n.type==='TEXT'&&n.visible); if(l){ await figma.loadFontAsync(l.fontName); await l.setTextStyleIdAsync(TS['DT/Body S Bold'].id);} } };
const scr=await figma.getNodeByIdAsync('15098:957964');
if(A.step===1){
  for(const o of scr.children.filter(n=>n.name==='Project — DT · Light')) o.remove();
  const F=figma.createFrame(); scr.appendChild(F); F.name='Project — DT · Light'; F.resize(1440,900); F.x=A.x; F.y=A.y; F.fills=[paint('basic/background')]; F.clipsContent=true;
  F.layoutMode='HORIZONTAL'; F.primaryAxisSizingMode='FIXED'; F.counterAxisSizingMode='FIXED';
  F.setExplicitVariableModeForCollection(await figma.variables.getVariableCollectionByIdAsync('VariableCollectionId:15009:22503'),'15009:0');
  const nav=(await figma.getNodeByIdAsync('15119:959873')).clone(); F.appendChild(nav); nav.layoutSizingVertical='FILL';
  const items=nav.findAll(n=>n.type==='INSTANCE'&&n.componentProperties&&n.componentProperties.State);
  const sel=[]; for(const it of items){ const lab=Object.entries(it.componentProperties).find(([k])=>k.startsWith('Label#')); const L=lab?lab[1].value:it.name;
    if(it.componentProperties.State.value==='Selected'){ it.setProperties({State:'Default'}); sel.push('off:'+L);} }
  const proj=items.find(it=>{const l=Object.entries(it.componentProperties).find(([k])=>k.startsWith('Label#')); return l&&l[1].value==='Projects'&&it.componentProperties.Type&&it.componentProperties.Type.value==='Item';});
  if(proj){ proj.setProperties({State:'Selected'}); sel.push('on:Projects'); }
  const M=AL('VERTICAL','Main'); F.appendChild(M); M.layoutSizingHorizontal='FILL'; M.layoutSizingVertical='FILL'; M.counterAxisAlignItems='CENTER';
  const top=AL('HORIZONTAL','Top bar',{paddingLeft:24,paddingRight:24,itemSpacing:4}); M.appendChild(top); top.layoutSizingHorizontal='FILL'; top.counterAxisSizingMode='FIXED'; top.resize(1160,56); top.counterAxisAlignItems='CENTER';
  const bc=(await figma.getNodeByIdAsync('15012:25983')).createInstance(); top.appendChild(bc); bc.setProperties({'Parent#15012:28':'Routines','Current#15012:29':'Client Onboarding'});
  const xs=await figma.getNodeByIdAsync('15054:1341691'); const xv=xs.type==='COMPONENT_SET'?(xs.children.find(c=>/Ghost/.test(c.name)&&/Default/.test(c.name))||xs.defaultVariant):xs;
  const chev=xv.createInstance(); top.appendChild(chev); chev.name='Project menu';
  const ck=Object.keys(chev.componentProperties).find(k=>/icon/i.test(k)&&chev.componentProperties[k].type==='INSTANCE_SWAP'); if(ck) chev.setProperties({[ck]:IC.down});
  const C=AL('VERTICAL','Content',{itemSpacing:32,paddingTop:24}); M.appendChild(C); C.counterAxisSizingMode='FIXED'; C.resize(760,10); C.primaryAxisSizingMode='AUTO';
  const head=AL('VERTICAL','Project header',{itemSpacing:4}); C.appendChild(head); head.layoutSizingHorizontal='FILL';
  const tr=AL('HORIZONTAL','Title row',{itemSpacing:8}); head.appendChild(tr); tr.layoutSizingHorizontal='FILL'; tr.counterAxisAlignItems='CENTER';
  const refTitle=await figma.getNodeByIdAsync('15094:955556');
  const ti=await txt(tr,'Client Onboarding',null,'basic/text',refTitle.textStyleId); ti.name='Title'; ti.layoutSizingHorizontal='FILL';
  for(const [nm,ic] of [['Pin','pin'],['More','more']]){ const b=BV('Ghost','Icon only').createInstance(); tr.appendChild(b); b.name=nm; await setBtn(b,{icon:IC[ic],label:nm}); }
  const sh=BV('Outline','Standard').createInstance(); tr.appendChild(sh); sh.name='Share'; await setBtn(sh,{label:'Share'});
  await txt(head,'Tracking Q1 close activities','DT/Body S Regular','basic/text-recessive');
  const comp=(await figma.getNodeByIdAsync('15019:279907')).createInstance(); C.appendChild(comp); comp.layoutSizingHorizontal='FILL';
  return {id:F.id,sel,chevProps:Object.keys(chev.componentProperties),xv:xv.name};
}
if(A.step===2){
  const F=await figma.getNodeByIdAsync(A.id); const C=F.findOne(n=>n.name==='Content');
  const tabsF=AL('HORIZONTAL','ODS Tabs',{itemSpacing:8}); C.appendChild(tabsF); tabsF.layoutSizingHorizontal='FILL';
  tabsF.strokes=[paint('basic/stroke-subtle')]; tabsF.strokeTopWeight=0; tabsF.strokeLeftWeight=0; tabsF.strokeRightWeight=0; tabsF.strokeBottomWeight=1; tabsF.strokeAlign='INSIDE';
  const tabSet=await figma.getNodeByIdAsync('15012:25953');
  for(const [lab,ic,s] of [['Chats','chat',1],['Shared chats','shared',0],['Routines','clock',0],['Artifacts','apps',0],['Settings','settings',0]]){
    const t=tabSet.children.find(c=>c.name==='State='+(s?'Selected':'Default')).createInstance(); tabsF.appendChild(t); t.name=lab;
    t.setProperties({'Label#15012:17':lab,'Icon#15012:20':IC[ic]}); }
  const tb=AL('VERTICAL','Chats table'); C.appendChild(tb); tb.layoutSizingHorizontal='FILL';
  const thV=(await figma.getNodeByIdAsync('15050:142918')).children.find(c=>c.name==='Sort=None, State=Default');
  const hr=AL('HORIZONTAL','Head row'); tb.appendChild(hr); hr.layoutSizingHorizontal='FILL';
  for(const [lab,w] of [['Chat',null],['Cost',120],['Time & date',144]]){ const h=thV.createInstance(); hr.appendChild(h); h.setProperties({'Label#15050:185':lab}); if(w){h.layoutSizingHorizontal='FIXED'; h.resize(w,h.height);} else h.layoutSizingHorizontal='FILL'; }
  const rows=[['Product Roadmap Sync','3h ago'],['Enterprise Deal Review','1h ago'],['QBR with Acme Corp','3h ago'],['Customer Success Standup','3h ago'],['Cross-Sell Strategy Workshop','3h ago'],['Eng-Product Alignment','3h ago'],['Marketing Attribution Review','3h ago']];
  for(const [a,t] of rows){
    const r=AL('HORIZONTAL','Row'); tb.appendChild(r); r.layoutSizingHorizontal='FILL';
    r.strokes=[paint('basic/stroke-subtle')]; r.strokeTopWeight=0; r.strokeLeftWeight=0; r.strokeRightWeight=0; r.strokeBottomWeight=1; r.strokeAlign='INSIDE';
    for(const [val,w,st] of [[a,null,'DT/Body M Bold'],['$0.70',120,'DT/Body M Regular'],[t,144,'DT/Body M Regular']]){
      const c=AL('HORIZONTAL','ODS Table Row Cell',{paddingLeft:12,paddingRight:12,paddingTop:12,paddingBottom:12}); r.appendChild(c);
      if(w){ c.layoutSizingHorizontal='FIXED'; c.resize(w,c.height);} else c.layoutSizingHorizontal='FILL';
      const x=await txt(c,val,st,'basic/text'); if(!w){ x.layoutSizingHorizontal='FILL'; x.textTruncation='ENDING'; x.maxLines=1; } }
  }
  return {h:C.height};
}
if(A.step===3){
  const F=await figma.getNodeByIdAsync(A.id);
  const ref=await figma.getNodeByIdAsync('15046:644965');
  const menu=figma.createFrame(); F.appendChild(menu); menu.name='Project menu · open'; menu.layoutPositioning='ABSOLUTE';
  menu.layoutMode='VERTICAL'; menu.counterAxisSizingMode='FIXED'; menu.resize(240,10); menu.primaryAxisSizingMode='AUTO'; menu.itemSpacing=0;
  menu.paddingTop=menu.paddingBottom=menu.paddingLeft=menu.paddingRight=12;
  menu.fills=JSON.parse(JSON.stringify(ref.fills)); menu.strokes=JSON.parse(JSON.stringify(ref.strokes)); menu.strokeWeight=1; menu.strokeAlign='INSIDE'; menu.cornerRadius=16; menu.effects=JSON.parse(JSON.stringify(ref.effects));
  const itemSet=await figma.getNodeByIdAsync('15046:644196');
  for(const [lab,ic,type] of [['Leave project','15038:287012','Destructive'],['Log out','15038:287643','Standard']]){
    const iv=itemSet.children.find(c=>c.name===`Type=${type}, State=Default`); const i=iv.createInstance(); menu.appendChild(i); i.name=lab; i.layoutSizingHorizontal='FILL';
    i.setProperties({'Label#15046:259':lab,'Show icon#15046:280':true,'Icon#15046:301':ic}); }
  const chev=F.findOne(n=>n.name==='Project menu'); const bb=chev.absoluteBoundingBox, fb=F.absoluteBoundingBox;
  menu.x=Math.round(bb.x-fb.x-120); menu.y=Math.round(bb.y-fb.y+bb.height+4);
  return {menu:[menu.x,menu.y,menu.height]};
}
