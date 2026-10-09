const {chromium}=require('playwright');const fs=require('fs');
(async()=>{
 const body=fs.readFileSync(require('path').join(__dirname,'..','playbook-studio.html'),'utf8');
 fs.writeFileSync(require('path').join(__dirname,'..','preview.html'),'<!doctype html><html><head><meta charset="utf-8"><style>html{color-scheme:light}body{margin:0;background:#faf9f7;font:14px system-ui}[hidden]{display:none!important}</style></head><body>'+body+'</body></html>');
 const b=await chromium.launch(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:(require('fs').existsSync('/opt/pw-browsers/chromium')?{executablePath:'/opt/pw-browsers/chromium'}:{}));
 for(const [w,tag] of [[1700,'max'],[1500,'split']]){
  const p=await b.newPage({viewport:{width:w,height:1000}});
  const errs=[];p.on('pageerror',e=>errs.push(String(e).slice(0,200)));
  await p.goto('file://'+require('path').join(__dirname,'..','preview.html')); await p.waitForTimeout(700);
  await p.click('#railToggle'); await p.waitForTimeout(400);
  await p.click('[data-type="msa"]'); await p.waitForTimeout(400);
  await p.click('[data-perm="docsource"][data-v="always"]'); await p.waitForTimeout(300);
  await p.click('[data-perm="redlines"][data-v="once"]'); await p.waitForTimeout(5200);
  await p.click('.qc-opt'); await p.waitForTimeout(300);
  await p.click('.qc-opt'); await p.waitForTimeout(300);
  await p.click('.qc-opt'); await p.waitForTimeout(2800);
  if(tag==='max'){ await p.click('#maxBtn'); await p.waitForTimeout(500); }
  const m=await p.evaluate(()=>{const g=s=>{const e=document.querySelector(s);if(!e)return null;const b=e.getBoundingClientRect();return{w:+b.width.toFixed(1)}};
    return{md:g('.md'),plist:g('.plist'),pdet:g('.pdet'),head:g('.pdet-head-in'),scroll:g('.pdet-scroll')}});
  console.log(tag,JSON.stringify(m),'errs',errs.slice(0,2));
  const e=await p.$('.md'); const bb=await e.boundingBox();
  await p.screenshot({path:require('path').join(__dirname,'..','w-'+tag+'.png'),clip:{x:bb.x,y:bb.y,width:bb.width,height:Math.min(520,bb.height)}});
  await p.close();
 }
 await b.close();
})();
