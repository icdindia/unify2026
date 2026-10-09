const {chromium}=require('playwright');const fs=require('fs');
(async()=>{
 const body=fs.readFileSync(require('path').join(__dirname,'..','playbook-studio.html'),'utf8');
 fs.writeFileSync(require('path').join(__dirname,'..','preview.html'),'<!doctype html><html><head><meta charset="utf-8"><style>html{color-scheme:light}body{margin:0;background:#faf9f7;font:14px system-ui}[hidden]{display:none!important}</style></head><body>'+body+'</body></html>');
 const b=await chromium.launch(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:(require('fs').existsSync('/opt/pw-browsers/chromium')?{executablePath:'/opt/pw-browsers/chromium'}:{}));
 const p=await b.newPage({viewport:{width:1600,height:950}});
 const errs=[];p.on('pageerror',e=>errs.push(String(e).slice(0,200)));
 await p.goto('file://'+require('path').join(__dirname,'..','preview.html')); await p.waitForTimeout(700);
 await p.click('#railToggle'); await p.waitForTimeout(400);
 await p.click('[data-type="msa"]'); await p.waitForTimeout(400);
 await p.click('[data-perm="docsource"][data-v="always"]'); await p.waitForTimeout(300);
 await p.click('[data-perm="redlines"][data-v="once"]'); await p.waitForTimeout(5200);
 await p.click('.qc-opt'); await p.waitForTimeout(300);
 await p.click('.qc-opt'); await p.waitForTimeout(300);
 await p.click('.qc-opt'); await p.waitForTimeout(2800);
 await p.evaluate(()=>{const d=document.querySelector('.pdet-scroll'); if(d) d.scrollTop=700;});
 await p.waitForTimeout(300);
 const d2=await p.$('.pdet'); const b2=await d2.boundingBox();
 await p.screenshot({path:require('path').join(__dirname,'..','l3.png'),clip:b2});
 // counterparty tab uses .pos
 await p.click('[data-tab="cp"]'); await p.waitForTimeout(500);
 await p.click('.prov-row'); await p.waitForTimeout(500);
 const e3=await p.$('#canvasDoc'); const b3=await e3.boundingBox();
 await p.screenshot({path:require('path').join(__dirname,'..','l4.png'),clip:{x:b3.x,y:b3.y,width:b3.width,height:Math.min(820,b3.height)}});
 console.log('errs',errs.slice(0,3));
 await b.close();
})();
