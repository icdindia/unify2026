// Login — DT (ODS) from Unify 5135:488748. ARGS: {x, y, parentId, mode:'Light'|'Dark', name}
const A=ARGS;
await figma.setCurrentPageAsync(figma.root.children.find(p=>p.id==='15012:25752'));
const V={}; for(const v of await figma.variables.getLocalVariablesAsync()) V[v.name]=v;
const miss=['basic/background','basic/text','basic/text-recessive','basic/stroke-subtle','brand/white'].filter(n=>!V[n]);
if(miss.length) return {missing:miss};
const TS={}; for(const s of await figma.getLocalTextStylesAsync()) TS[s.name]=s;
const paint=n=>figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',V[n]);
const AL=(dir,props)=>{const f=figma.createFrame(); f.layoutMode=dir; f.primaryAxisSizingMode='AUTO'; f.counterAxisSizingMode='AUTO'; f.fills=[]; Object.assign(f,props||{}); return f;};
const txt=async(chars,style,col,props)=>{const t=figma.createText(); await figma.loadFontAsync(TS[style].fontName); await t.setTextStyleIdAsync(TS[style].id); t.characters=chars; t.fills=[paint(col)]; Object.assign(t,props||{}); return t;};
const parent=await figma.getNodeByIdAsync(A.parentId);
for(const o of parent.children.filter(n=>n.name===A.name)) o.remove();
const F=figma.createFrame(); parent.appendChild(F); F.name=A.name; F.resize(1440,900); F.x=A.x; F.y=A.y; F.fills=[paint('basic/background')];
F.layoutMode='HORIZONTAL'; F.primaryAxisSizingMode='FIXED'; F.counterAxisSizingMode='FIXED'; F.clipsContent=true;
F.setExplicitVariableModeForCollection(await figma.variables.getVariableCollectionByIdAsync('VariableCollectionId:15009:22503'), A.mode==='Dark'?'15009:1':'15009:0');
// Hero (image kept from source; text static white on photo)
const src=await figma.getNodeByIdAsync('5135:488749');
const H=AL('VERTICAL',{name:'Hero'}); F.appendChild(H); H.fills=JSON.parse(JSON.stringify(src.fills));
H.primaryAxisSizingMode='FIXED'; H.counterAxisSizingMode='FIXED'; H.resize(720,900); H.paddingLeft=H.paddingRight=48; H.paddingTop=40; H.paddingBottom=32; H.layoutSizingVertical='FILL';
const tmSet=await figma.getNodeByIdAsync('15064:987045');
const tmW=tmSet.children.find(c=>c.name==='Color=White').createInstance(); H.appendChild(tmW); tmW.name='DT Logo T-mark'; tmW.rescale(48/tmW.height);
const sp=figma.createFrame(); sp.name='Spacer'; sp.fills=[]; H.appendChild(sp); sp.layoutSizingHorizontal='FILL'; sp.layoutGrow=1;
const copy=AL('VERTICAL',{name:'Copy',itemSpacing:24}); H.appendChild(copy); copy.layoutSizingHorizontal='FILL';
const h1=await txt('Enterprise Intelligence,\nUnlocked','DT/Title M','brand/white'); copy.appendChild(h1); h1.layoutSizingHorizontal='FILL'; h1.textAutoResize='HEIGHT';
const b1=await txt('Ask Unify is your AI brain connecting knowledge, systems, and workflows to answer, automate, and get work done.','DT/Body L','brand/white'); copy.appendChild(b1); b1.layoutSizingHorizontal='FILL'; b1.textAutoResize='HEIGHT';
const g=figma.createFrame(); g.name='Gap'; g.fills=[]; g.resize(10,96); H.appendChild(g);
const foot=AL('HORIZONTAL',{name:'Footer links',itemSpacing:24}); H.appendChild(foot);
for(const l of ['Privacy','Terms of Service']){ const t=await txt(l,'DT/Body S Regular','brand/white'); t.textDecoration='UNDERLINE'; t.name='ODS Link · '+l; foot.appendChild(t); }
// Sign in
const R=AL('VERTICAL',{name:'Sign in'}); F.appendChild(R); R.fills=[paint('basic/background')]; R.primaryAxisAlignItems='CENTER'; R.counterAxisAlignItems='CENTER'; R.layoutSizingHorizontal='FILL'; R.layoutSizingVertical='FILL';
const card=AL('VERTICAL',{name:'Card',itemSpacing:32}); R.appendChild(card); card.counterAxisSizingMode='FIXED'; card.resize(340,10); card.counterAxisAlignItems='CENTER';
const head=AL('VERTICAL',{name:'Header',itemSpacing:8}); head.counterAxisAlignItems='CENTER'; card.appendChild(head); head.layoutSizingHorizontal='FILL';
const tmM=tmSet.children.find(c=>c.name==='Color=Magenta').createInstance(); head.appendChild(tmM); tmM.name='DT Logo T-mark'; tmM.rescale(64/tmM.height);
const t1=await txt('Ask Unify','DT/Title S','basic/text',{textAlignHorizontal:'CENTER'}); head.appendChild(t1);
const t2=await txt('Your AI Brain that gets work done','DT/Body S Regular','basic/text-recessive',{textAlignHorizontal:'CENTER'}); head.appendChild(t2);
const act=AL('VERTICAL',{name:'Actions',itemSpacing:24}); act.counterAxisAlignItems='CENTER'; card.appendChild(act); act.layoutSizingHorizontal='FILL';
const btnSet=await figma.getNodeByIdAsync('15046:642460');
const bv=btnSet.children.find(c=>/Variant=Primary/.test(c.name)&&/Type=Standard/.test(c.name)&&/State=Default/.test(c.name));
const btn=bv.createInstance(); act.appendChild(btn); btn.name='DT Button · Continue with Google'; btn.layoutSizingHorizontal='FILL';
const gI=await (await figma.getNodeByIdAsync('5364:282821')).getMainComponentAsync();
const pr={}; for(const k of Object.keys(btn.componentProperties)){ if(k.startsWith('Label#')) pr[k]='Continue with Google'; if(k.startsWith('Show left icon#')) pr[k]=true; if(k.startsWith('Left icon#')&&gI) pr[k]=gI.id; }
btn.setProperties(pr);
const lab=btn.findOne(n=>n.type==='TEXT'&&n.visible); if(lab){ await figma.loadFontAsync(lab.fontName); await lab.setTextStyleIdAsync(TS['DT/Body S Bold'].id); }
const or=AL('HORIZONTAL',{name:'ODS Divider · OR',itemSpacing:16}); or.counterAxisAlignItems='CENTER'; act.appendChild(or); or.layoutSizingHorizontal='FILL';
for(const i of [0,1,2]){ if(i===1){ or.appendChild(await txt('OR','DT/Microcopy Regular','basic/text-recessive')); continue; }
  const d=figma.createRectangle(); d.name='ODS Divider'; d.resize(100,1); d.fills=[paint('basic/stroke-subtle')]; or.appendChild(d); d.layoutGrow=1; }
const em=await txt('Login with your email','DT/Body S Regular','basic/text',{textAlignHorizontal:'CENTER'}); em.name='Text + ODS Link'; act.appendChild(em);
await figma.loadFontAsync(TS['DT/Body S Bold'].fontName);
await em.setRangeTextStyleIdAsync(16,21,TS['DT/Body S Bold'].id); em.setRangeTextDecoration(16,21,'UNDERLINE');
return {id:F.id,btn:[btn.width,btn.height],gIcon:gI&&gI.name,label:lab&&lab.characters,card:[card.width,card.height],h1:h1.height};
