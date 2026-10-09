const {chromium}=require('playwright');const fs=require('fs');
(async()=>{
 const body=fs.readFileSync(require('path').join(__dirname,'..','playbook-studio.html'),'utf8');
 fs.writeFileSync(require('path').join(__dirname,'..','preview.html'),'<!doctype html><html><head><meta charset="utf-8"><style>html{color-scheme:light}body{margin:0;background:#faf9f7;font:14px system-ui}[hidden]{display:none!important}</style></head><body>'+body+'</body></html>');
 const b=await chromium.launch(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:(require('fs').existsSync('/opt/pw-browsers/chromium')?{executablePath:'/opt/pw-browsers/chromium'}:{}));
 const p=await b.newPage({viewport:{width:1440,height:900}});
 const errs=[];p.on('pageerror',e=>errs.push(String(e).slice(0,200)));
 await p.goto('file://'+require('path').join(__dirname,'..','preview.html')); await p.waitForTimeout(700);
 const out=await p.evaluate(()=>{
  const r=[];
  document.querySelectorAll('.rail-scroll > *').forEach(el=>{
    const b=el.getBoundingClientRect();
    r.push({node:el.className||el.tagName, top:+b.top.toFixed(1), bot:+b.bottom.toFixed(1), h:+b.height.toFixed(1)});
  });
  const items=[...document.querySelectorAll('#navPrimary .rail-item')].map(el=>{
    const b=el.getBoundingClientRect(); const cs=getComputedStyle(el);
    const pb=getComputedStyle(el,'::before');
    return {t:el.textContent.trim(), top:+b.top.toFixed(1), h:+b.height.toFixed(1), left:+b.left.toFixed(1), w:+b.width.toFixed(1), fs:cs.fontSize, plate:pb.backgroundColor};
  });
  return {r,items};
 });
 console.log(JSON.stringify(out,null,1));
 await p.hover('#navPrimary .rail-item:nth-child(2)');
 await p.waitForTimeout(250);
 const hov=await p.evaluate(()=>{const el=document.querySelectorAll('#navPrimary .rail-item')[1];const pb=getComputedStyle(el,'::before');const b=el.getBoundingClientRect();const pr=pb.inset;return {bg:pb.backgroundColor,br:pb.borderRadius,itemW:b.width,color:getComputedStyle(el).color};});
 console.log('hover',JSON.stringify(hov));
 await p.screenshot({path:require('path').join(__dirname,'..','nav.png'),clip:{x:0,y:0,width:300,height:900}});
 console.log('errs',errs);
 await b.close();
})();
