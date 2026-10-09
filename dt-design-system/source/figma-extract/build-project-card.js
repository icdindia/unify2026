// DT Project Card — ODS ActionCard (outline), states per DT Artifact Card. Source: Unify "Project card 1" 551:132342.
const A=ARGS;
await figma.setCurrentPageAsync(figma.root.children.find(p=>p.id==='15012:25752'));
const V={}; for(const v of await figma.variables.getLocalVariablesAsync()) V[v.name]=v;
const TS={}; for(const s of await figma.getLocalTextStylesAsync()) TS[s.name]=s;
await figma.loadFontAsync({family:'TeleNeo Var',style:'Medium'}); await figma.loadFontAsync({family:'TeleNeo Var',style:'Bold'});
const paint=n=>figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',V[n]);
const bindR=(f,n)=>{for(const k of ['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius']) f.setBoundVariable(k,V[n]);};
const AL=(dir,name,props)=>{const f=figma.createFrame(); f.name=name; f.layoutMode=dir; f.primaryAxisSizingMode='AUTO'; f.counterAxisSizingMode='AUTO'; f.fills=[]; f.clipsContent=false; Object.assign(f,props||{}); return f;};
const txt=async(parent,name,chars,style,col)=>{const t=figma.createText(); parent.appendChild(t); t.name=name; t.fontName={family:'TeleNeo Var',style:'Medium'}; t.characters=chars; await t.setTextStyleIdAsync(TS[style].id); t.fills=[paint(col)]; return t;};
const art=await figma.getNodeByIdAsync('15049:140321'); const artD=art.children.find(c=>c.name==='State=Default'); const artF=art.children.find(c=>c.name==='State=Focus');
const tileSrc=(await figma.getNodeByIdAsync('15091:953563')).children[0].findOne(n=>n.name==='Tile');
const sec=art.parent;
for(const o of sec.children.filter(n=>n.name==='DT Project Card'||n.name==='Board · DT Project Card')) o.remove();
const FOLDER='15038:290911', MORE='15038:287839';
const STATES={Default:'basic/background',Hover:'state/hover-background-hover',Pressed:'state/pressed-background-pressed',Focus:'basic/background',Disabled:'state/disabled-background-disabled'};
const btnSet=await figma.getNodeByIdAsync('15046:642460'); const sub=btnSet.children.find(c=>c.name==='Variant=Subtle, Type=Icon only, State=Default');
const comps=[];
for(const [st,bg] of Object.entries(STATES)){
  const C=figma.createComponent(); sec.appendChild(C); C.name='State='+st;
  C.layoutMode='VERTICAL'; C.counterAxisSizingMode='FIXED'; C.resize(288,10); C.primaryAxisSizingMode='AUTO'; C.itemSpacing=0; C.clipsContent=false;
  C.fills=[paint(bg)]; C.strokes=[paint('basic/stroke-subtle')]; C.strokeWeight=1; C.strokeAlign='INSIDE'; bindR(C,'radius/large');
  const K=AL('VERTICAL','Content',{paddingTop:16,paddingBottom:16,paddingLeft:16,paddingRight:16,itemSpacing:12}); C.appendChild(K); K.layoutSizingHorizontal='FILL';
  if(st==='Disabled') K.opacity=0.5;
  const tile=tileSrc.clone(); K.appendChild(tile); tile.name='Tile';
  const gi=tile.findOne(n=>n.type==='INSTANCE'); gi.swapComponent(await figma.getNodeByIdAsync(FOLDER)); gi.name='Glyph icon';
  const T=AL('VERTICAL','Text',{itemSpacing:4}); K.appendChild(T); T.layoutSizingHorizontal='FILL';
  const tr=AL('HORIZONTAL','Title row',{itemSpacing:8}); T.appendChild(tr); tr.layoutSizingHorizontal='FILL'; tr.counterAxisAlignItems='CENTER';
  const ti=await txt(tr,'Title','Banking Issues','DT/Body M Bold','basic/text'); ti.textTruncation='ENDING'; ti.maxLines=1;
  const pin=artD.findOne(n=>n.name==='Pin').clone(); tr.appendChild(pin);
  await txt(T,'Count','12 items','DT/Body S Regular','basic/text-recessive');
  const mr=AL('HORIZONTAL','Meta',{itemSpacing:8}); K.appendChild(mr); mr.layoutSizingHorizontal='FILL'; mr.counterAxisAlignItems='CENTER';
  const mt=await txt(mr,'Meta text','Ajeetabh Narayan · 12.04.2026','DT/Body S Regular','basic/text-recessive'); mt.layoutSizingHorizontal='FILL'; mt.textTruncation='ENDING'; mt.maxLines=1;
  const acc=artD.findOne(n=>n.name==='Access').clone(); mr.appendChild(acc);
  if(st==='Hover'||st==='Pressed'||st==='Focus'){ const b=sub.createInstance(); C.appendChild(b); b.name='More'; b.layoutPositioning='ABSOLUTE';
    const p={}; for(const k of Object.keys(b.componentProperties)){ if(k.startsWith('Left icon#')) p[k]=MORE; if(k.startsWith('Show left icon#')) p[k]=true; if(k.startsWith('Label#')) p[k]='More'; } b.setProperties(p);
    b.x=288-12-b.width; b.y=12; }
  if(st==='Focus'){ const fr=artF.findOne(n=>n.name==='Focus ring').clone(); C.appendChild(fr); fr.layoutPositioning='ABSOLUTE'; }
  comps.push(C);
}
const set=figma.combineAsVariants(comps,sec); set.name='DT Project Card';
set.layoutMode='HORIZONTAL'; set.itemSpacing=32; set.paddingLeft=set.paddingRight=set.paddingTop=set.paddingBottom=32; set.primaryAxisSizingMode='AUTO'; set.counterAxisSizingMode='AUTO'; set.fills=[]; 
for(const v of set.children){ const fr=v.findOne(n=>n.name==='Focus ring'); if(fr){ fr.x=-8; fr.y=-8; fr.resize(v.width+16,v.height+16); } }
const pT=set.addComponentProperty('Title','TEXT','Banking Issues'), pC=set.addComponentProperty('Count','TEXT','12 items'), pM=set.addComponentProperty('Meta','TEXT','Ajeetabh Narayan · 12.04.2026');
const pP=set.addComponentProperty('Pinned','BOOLEAN',true), pI=set.addComponentProperty('Icon','INSTANCE_SWAP',FOLDER);
const accMain=await artD.findOne(n=>n.name==='Access').findOne(n=>n.type==='INSTANCE').getMainComponentAsync();
const pA=set.addComponentProperty('Access icon','INSTANCE_SWAP',accMain.id);
for(const v of set.children){ v.findOne(n=>n.name==='Title').componentPropertyReferences={characters:pT}; v.findOne(n=>n.name==='Count').componentPropertyReferences={characters:pC}; v.findOne(n=>n.name==='Meta text').componentPropertyReferences={characters:pM};
  v.findOne(n=>n.name==='Pin').componentPropertyReferences={visible:pP}; v.findOne(n=>n.name==='Glyph icon').componentPropertyReferences={mainComponent:pI};
  v.findOne(n=>n.name==='Access').findOne(n=>n.type==='INSTANCE').componentPropertyReferences={mainComponent:pA}; }
set.description='Project card on ODS ActionCard (outline), matching DT Artifact Card: radius-large 24, 1px basic/stroke-subtle, padding 16, gap 12. 32 accent tile + 16 icon (folder), title Body M Bold with pin, count + meta Body S Regular recessive, 16 access icon (lock = private, business users = shared, international = public). States per ODS: Hover hover-background-hover, Pressed pressed-background-pressed, Focus 2px ring, Disabled 50% content; Hover/Pressed/Focus show the More button (ODS Button Small Subtle icon-only). Source: Unify "Project card 1" 551:132342.';
set.x=A.x; set.y=A.y;
return {id:set.id,w:set.width,h:set.height,acc:accMain.name,props:Object.keys(set.componentPropertyDefinitions)};
