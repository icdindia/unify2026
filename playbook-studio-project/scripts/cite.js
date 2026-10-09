const {chromium}=require('playwright');const fs=require('fs');
(async()=>{
 const body=fs.readFileSync(require('path').join(__dirname,'..','playbook-studio.html'),'utf8');
 fs.writeFileSync(require('path').join(__dirname,'..','preview.html'),'<!doctype html><html><head><meta charset="utf-8"><style>html{color-scheme:light}body{margin:0;background:#faf9f7;font:14px system-ui}[hidden]{display:none!important}</style></head><body>'+body+'</body></html>');
 const b=await chromium.launch(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:(require('fs').existsSync('/opt/pw-browsers/chromium')?{executablePath:'/opt/pw-browsers/chromium'}:{}));
 const p=await b.newPage({viewport:{width:1600,height:950}});
 const errs=[];p.on('pageerror',e=>errs.push(String(e).slice(0,200)));
 await p.goto('file://'+require('path').join(__dirname,'..','preview.html')); await p.waitForTimeout(700);
 await p.click('[data-type="msa"]'); await p.waitForTimeout(400);
 await p.click('[data-perm="docsource"][data-v="always"]'); await p.waitForTimeout(300);
 await p.click('[data-perm="redlines"][data-v="once"]'); await p.waitForTimeout(5200);
 await p.click('.qc-opt'); await p.waitForTimeout(300);
 await p.click('.qc-opt'); await p.waitForTimeout(300);
 await p.click('.qc-opt'); await p.waitForTimeout(2800);
 const d=await p.evaluate(()=>{
   const aps=[...document.querySelectorAll('.tier-ap')].map(e=>e.textContent.trim());
   const rec=document.querySelector('.pdet-foot .sm')?.textContent.trim();
   return {aps,rec};
 });
 console.log(JSON.stringify(d,null,1),'errs',errs.slice(0,3));
 const el=await p.$('.pdet'); const bb=await el.boundingBox();
 await p.screenshot({path:require('path').join(__dirname,'..','cite.png'),clip:{x:bb.x,y:bb.y+120,width:bb.width,height:520}});
 await b.close();
})();
