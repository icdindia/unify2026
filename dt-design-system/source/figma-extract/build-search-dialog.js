// DT Search Chats Dialog (ODS Dialog + ODS Search small + ODS Search Inline Result Items). Source: Unify "Modal Unit" 592:201953.
const A=ARGS;
await figma.setCurrentPageAsync(figma.root.children.find(p=>p.id==='15012:25752'));
const V={}; for(const v of await figma.variables.getLocalVariablesAsync()) V[v.name]=v;
const TS={}; for(const s of await figma.getLocalTextStylesAsync()) TS[s.name]=s;
await figma.loadFontAsync({family:'TeleNeo Var',style:'Medium'}); await figma.loadFontAsync({family:'TeleNeo Var',style:'Bold'});
const paint=n=>figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',V[n]);
const AL=(dir,name,props)=>{const f=figma.createFrame(); f.name=name; f.layoutMode=dir; f.primaryAxisSizingMode='AUTO'; f.counterAxisSizingMode='AUTO'; f.fills=[]; f.clipsContent=false; Object.assign(f,props||{}); return f;};
const txt=async(parent,chars,style,col)=>{const t=figma.createText(); parent.appendChild(t); t.fontName={family:'TeleNeo Var',style:'Medium'}; t.characters=chars; await t.setTextStyleIdAsync(TS[style].id); t.fills=[paint(col)]; return t;};
const bindR=(f,n)=>{for(const k of ['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius']) f.setBoundVariable(k,V[n]);};
const sec=await figma.getNodeByIdAsync('15046:641874');
if(A.step===1){
  for(const o of sec.children.filter(n=>/DT Search Chats Dialog/.test(n.name))) o.remove();
  const board=figma.createRectangle(); sec.appendChild(board); board.name='Board · DT Search Chats Dialog'; board.x=832; board.y=2834; board.resize(648,700); board.fills=[paint('neutral/200')];
  const C=figma.createComponent(); sec.appendChild(C); C.name='DT Search Chats Dialog'; C.x=856; C.y=2858;
  C.layoutMode='VERTICAL'; C.counterAxisSizingMode='FIXED'; C.resize(600,100); C.primaryAxisSizingMode='AUTO'; C.itemSpacing=0; C.clipsContent=true;
  C.fills=[paint('basic/background')]; bindR(C,'radius/medium');
  C.effects=[{type:'DROP_SHADOW',color:{r:0,g:0,b:0,a:0.1},offset:{x:0,y:2},radius:8,spread:0,visible:true,blendMode:'NORMAL'},{type:'DROP_SHADOW',color:{r:0,g:0,b:0,a:0.12},offset:{x:0,y:12},radius:32,spread:0,visible:true,blendMode:'NORMAL'}];
  // ODS Dialog header
  const H=AL('HORIZONTAL','ODS Dialog Title Container',{paddingTop:24,paddingBottom:24,paddingLeft:24,paddingRight:56}); C.appendChild(H); H.layoutSizingHorizontal='FILL';
  const ti=await txt(H,'Search chats','DT/Subtitle','basic/text'); ti.name='Header';
  const btnSet=await figma.getNodeByIdAsync('15046:642460');
  const bv=btnSet.children.find(c=>/Variant=Ghost/.test(c.name)&&/Type=Icon only/.test(c.name)&&/State=Default/.test(c.name));
  const close=bv.createInstance(); C.appendChild(close); close.name='Close'; close.layoutPositioning='ABSOLUTE';
  const pr={}; for(const k of Object.keys(close.componentProperties)){ if(k.startsWith('Left icon#')) pr[k]='15038:287086'; if(k.startsWith('Show left icon#')) pr[k]=true; if(k.startsWith('Label#')) pr[k]='Close'; }
  close.setProperties(pr); close.x=600-16-close.width; close.y=Math.round((72-close.height)/2);
  const dv=figma.createRectangle(); dv.name='ODS Divider'; C.appendChild(dv); dv.resize(600,1); dv.fills=[paint('basic/stroke-subtle')]; dv.layoutSizingHorizontal='FILL';
  return {id:C.id,close:[close.width,close.height]};
}
if(A.step===2){
  const C=await figma.getNodeByIdAsync(A.id);
  const S=AL('VERTICAL','ODS Dialog Slot',{paddingLeft:24,paddingRight:24,paddingTop:8,paddingBottom:24,itemSpacing:8}); C.appendChild(S); S.layoutSizingHorizontal='FILL';
  // ODS Search · Small
  const srch=AL('VERTICAL','ODS Search · Small',{itemSpacing:0}); S.appendChild(srch); srch.layoutSizingHorizontal='FILL';
  const row=AL('HORIZONTAL','Container',{paddingTop:12,paddingBottom:12,itemSpacing:8}); srch.appendChild(row); row.layoutSizingHorizontal='FILL'; row.counterAxisAlignItems='CENTER';
  const pt=await txt(row,'Search chats','DT/Body L','basic/text-recessive'); pt.name='Prompt'; pt.layoutSizingHorizontal='FILL';
  const iconSet=(await figma.getNodeByIdAsync('15038:288272'));
  const box=AL('HORIZONTAL','Search icon container'); row.appendChild(box); box.primaryAxisSizingMode='FIXED'; box.counterAxisSizingMode='FIXED'; box.resize(48,48); box.primaryAxisAlignItems='CENTER'; box.counterAxisAlignItems='CENTER';
  const ic=iconSet.createInstance(); box.appendChild(ic); ic.rescale(20/24); ic.name='Search';
  const dc=AL('VERTICAL','Divider Container',{paddingTop:4}); srch.appendChild(dc); dc.layoutSizingHorizontal='FILL';
  const ul=figma.createRectangle(); ul.name='ODS Divider'; dc.appendChild(ul); ul.resize(552,1); ul.fills=[paint('basic/stroke')]; ul.layoutSizingHorizontal='FILL';
  // results
  const L=AL('VERTICAL','Results',{itemSpacing:0}); S.appendChild(L); L.layoutSizingHorizontal='FILL';
  const items=[['Entry Strategy Overview','3h ago'],['Budget Allocation','3m ago'],['Market Analysis','2h ago'],['Competitor Assessment','1h ago'],['User Persona Development','45m ago'],['Feature Prioritization','30m ago'],['Initial Design Concepts','15m ago'],['Stakeholder Feedback','5m ago'],['Strategy Alignment','4h ago']];
  for(const [a,b] of items){
    const it=AL('HORIZONTAL','ODS Search Inline Result Item',{paddingTop:12,paddingBottom:12,paddingLeft:12,paddingRight:12,itemSpacing:8}); L.appendChild(it); it.layoutSizingHorizontal='FILL'; it.counterAxisAlignItems='CENTER'; it.minHeight=48; bindR(it,'radius/small');
    const p=await txt(it,a,'DT/Body M Bold','basic/text'); p.name='Text primary'; p.layoutSizingHorizontal='FILL'; p.textTruncation='ENDING'; p.maxLines=1;
    const r=await txt(it,b,'DT/Body M Bold','basic/text-recessive'); r.name='Text recessive';
  }
  const board=sec.findOne(n=>n.name==='Board · DT Search Chats Dialog'); board.resize(648,C.height+48); board.locked=true;
  let maxY=0; for(const n of sec.children) maxY=Math.max(maxY,n.y+n.height); if(maxY+80>sec.height) sec.resizeWithoutConstraints(sec.width,maxY+80);
  C.description='Search chats dialog mapped to ODS: ODS Dialog (radius medium, title container 24/56/24/24, Subtitle header, ghost icon-only close, divider), ODS Search · Small (Body L prompt, 20px search icon in 48 tappable area, divider), ODS Search Inline Result Items (padding 12, gap 8, min 48, radius small, Body M Bold primary + recessive). Source: Unify "Modal Unit" 592:201953.';
  return {h:C.height};
}
