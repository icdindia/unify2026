// DT Chat Cost Panel (ODS) from Unify "cost stat" 6027:423831. ARGS: {step:1|2, id?}
const A=ARGS;
await figma.setCurrentPageAsync(figma.root.children.find(p=>p.id==='15012:25752'));
const V={}; for(const v of await figma.variables.getLocalVariablesAsync()) V[v.name]=v;
const TS={}; for(const s of await figma.getLocalTextStylesAsync()) TS[s.name]=s;
const M={family:'TeleNeo Var',style:'Medium'}; await figma.loadFontAsync(M); await figma.loadFontAsync({family:'TeleNeo Var',style:'Bold'});
const paint=n=>figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',V[n]);
const AL=(dir,props)=>{const f=figma.createFrame(); f.layoutMode=dir; f.primaryAxisSizingMode='AUTO'; f.counterAxisSizingMode='AUTO'; f.fills=[]; Object.assign(f,props||{}); return f;};
const txt=async(parent,chars,style,col)=>{const t=figma.createText(); parent.appendChild(t); t.fontName=M; t.characters=chars; await t.setTextStyleIdAsync(TS[style].id); t.fills=[paint(col)]; return t;};
const bindR=(f,n)=>{for(const k of ['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius']) f.setBoundVariable(k,V[n]);};
if(A.step===1){
  const sec=await figma.getNodeByIdAsync('15046:641874');
  for(const o of sec.children.filter(n=>/DT Chat Cost Panel/.test(n.name))) o.remove();
  sec.resizeWithoutConstraints(sec.width, 2834+760+80);
  const board=figma.createRectangle(); sec.appendChild(board); board.name='Board · DT Chat Cost Panel'; board.x=56; board.y=2834; board.resize(428,760); board.fills=[paint('neutral/200')]; board.locked=true;
  const C=figma.createComponent(); sec.appendChild(C); C.name='DT Chat Cost Panel'; C.x=80; C.y=2858;
  C.layoutMode='VERTICAL'; C.primaryAxisSizingMode='AUTO'; C.counterAxisSizingMode='FIXED'; C.resize(380,100); C.itemSpacing=0; C.clipsContent=true;
  C.fills=[paint('basic/background')]; C.strokes=[paint('basic/stroke-subtle')]; C.strokeWeight=1; C.strokeAlign='INSIDE'; bindR(C,'radius/large');
  C.effects=[{type:'DROP_SHADOW',color:{r:0,g:0,b:0,a:0.12},offset:{x:0,y:8},radius:24,spread:0,visible:true,blendMode:'NORMAL'}];
  const head=AL('HORIZONTAL',{name:'Header',paddingLeft:16,paddingRight:16,paddingTop:16,paddingBottom:12}); C.appendChild(head); head.layoutSizingHorizontal='FILL'; head.primaryAxisAlignItems='SPACE_BETWEEN'; head.counterAxisAlignItems='CENTER';
  await txt(head,'This chat','DT/Body M Bold','basic/text'); const tot=await txt(head,'$19.12','DT/Body M Bold','basic/text'); tot.name='Total';
  const table=AL('VERTICAL',{name:'ODS Table',paddingLeft:4,paddingRight:4}); C.appendChild(table); table.layoutSizingHorizontal='FILL';
  const thSet=await figma.getNodeByIdAsync('15050:142918'); const thV=thSet.children.find(c=>c.name==='Sort=None, State=Default');
  const hr=AL('HORIZONTAL',{name:'Head row'}); table.appendChild(hr); hr.layoutSizingHorizontal='FILL';
  for(const [lab,w] of [['Query',null],['Cost',104]]){ const h=thV.createInstance(); hr.appendChild(h); const k=Object.keys(h.componentProperties).find(k=>k.startsWith('Label#')); h.setProperties({[k]:lab}); if(w){h.layoutSizingHorizontal='FIXED'; h.resize(w,h.height);} else h.layoutSizingHorizontal='FILL'; }
  return {id:C.id};
}
if(A.step===2){
  const C=await figma.getNodeByIdAsync(A.id); const table=C.findOne(n=>n.name==='ODS Table');
  const rows=[['We are two-thirds through the quarter. How does coverage look?','$0.01703'],['Which of my open deals lost momentum this week?','$0.00892'],['Draft a Loom transcript summary — Meridian security review','$0.00706'],['Explain the Atlas Data Cloud presence on three customers','$0.00622'],['Draft a follow-up to Meridian’s security review.','$0.00612'],['Draft talking points for Friday’s pipeline call.','$0.00524'],['Compare Atlas vs. Vertex Data Cloud objections.','$0.00458'],['What’s my open pipeline coverage for Q4?','$0.00456'],['Summarize last week’s forecast call.','$0.00354'],['Which reps are behind on quota by more than 10%?','$0.00278']];
  for(const [q,c] of rows){
    const r=AL('HORIZONTAL',{name:'Row'}); table.appendChild(r); r.layoutSizingHorizontal='FILL';
    r.strokes=[paint('basic/stroke-subtle')]; r.strokeTopWeight=0; r.strokeLeftWeight=0; r.strokeRightWeight=0; r.strokeBottomWeight=1; r.strokeAlign='INSIDE';
    const c1=AL('HORIZONTAL',{name:'ODS Table Row Cell',paddingLeft:12,paddingRight:12,paddingTop:12,paddingBottom:12}); r.appendChild(c1); c1.layoutSizingHorizontal='FILL';
    const t1=await txt(c1,q,'DT/Body M Regular','basic/text'); t1.layoutSizingHorizontal='FILL'; t1.textTruncation='ENDING'; t1.maxLines=1;
    const c2=AL('HORIZONTAL',{name:'ODS Table Row Cell',paddingLeft:12,paddingRight:12,paddingTop:12,paddingBottom:12}); r.appendChild(c2); c2.layoutSizingHorizontal='FIXED'; c2.resize(104,c2.height); c2.primaryAxisAlignItems='MAX';
    const t2=await txt(c2,c,'DT/Body M Regular','basic/text'); t2.fontFeatures; 
  }
  return {rows:table.children.length, h:C.height};
}
if(A.step===3){
  const C=await figma.getNodeByIdAsync(A.id);
  const foot=AL('VERTICAL',{name:'Usage',paddingLeft:16,paddingRight:16,paddingTop:16,paddingBottom:16,itemSpacing:16}); C.appendChild(foot); foot.layoutSizingHorizontal='FILL'; foot.fills=[paint('basic/background-subtle')];
  const pb=(await figma.getNodeByIdAsync('15069:117554')).children.find(c=>c.name==='Mode=Standard').createInstance(); foot.appendChild(pb); pb.layoutSizingHorizontal='FILL';
  const P=pb.componentProperties, set={}; for(const k of Object.keys(P)){ if(k.startsWith('Label#')) set[k]='Your usage this month'; if(k.startsWith('Counter#')) set[k]='$128 of $259'; if(k.startsWith('Helper text#')) set[k]='51% used • Resets in 12 days'; if(k.startsWith('Show helper#')) set[k]=true; }
  pb.setProperties(set);
  const fill=pb.findOne(n=>/progress|fill|bar/i.test(n.name)&&n.type!=='TEXT'&&n.parent&&/track|background|bar/i.test(n.parent.name));
  const link=await txt(foot,'See your usage','DT/Body S Bold','basic/text'); link.textDecoration='UNDERLINE'; link.name='ODS Link';
  // per-chat limit scale
  const sc=AL('VERTICAL',{name:'Chat limit',itemSpacing:8}); foot.appendChild(sc); sc.layoutSizingHorizontal='FILL';
  const tr=AL('HORIZONTAL',{name:'Scale',itemSpacing:4}); sc.appendChild(tr); tr.layoutSizingHorizontal='FILL';
  const cols=['shades/accent-extra-dominant','neutral/200','neutral/200'];
  for(let i=0;i<3;i++){ const s=figma.createRectangle(); s.name='Segment'; s.resize(100,4); s.fills=[paint(cols[i])]; tr.appendChild(s); s.layoutGrow=1; bindR(s,'radius/full'); }
  const lab=figma.createFrame(); lab.name='Labels'; lab.fills=[]; sc.appendChild(lab); lab.layoutSizingHorizontal='FILL'; lab.resize(348,16);
  const W=348, seg=(W-8)/3;
  for(const [t,x] of [['$0',0],['$2',seg+4],['$5',2*(seg+4)]]){ const l=await txt(lab,t,'DT/Microcopy Regular','basic/text-recessive'); l.x=x; l.y=0; }
  const mk=figma.createPolygon(); mk.name='Marker · $1.20'; mk.pointCount=3; mk.resize(8,6); mk.rotation=180; mk.fills=[paint('basic/text')]; sc.appendChild(mk); mk.layoutPositioning='ABSOLUTE'; mk.x=seg*0.6+4; mk.y=-8;
  const cap=await txt(sc,'Under limit — well inside the $5 a chat session gets.','DT/Microcopy Regular','basic/text-recessive');
  return {h:C.height, pbProps:Object.keys(P)};
}
