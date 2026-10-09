const {chromium}=require('playwright');const fs=require('fs');
(async()=>{
 const body=fs.readFileSync(require('path').join(__dirname,'..','playbook-studio.html'),'utf8');
 fs.writeFileSync(require('path').join(__dirname,'..','preview.html'),'<!doctype html><html><head><meta charset="utf-8"><style>html{color-scheme:light}body{margin:0;background:#faf9f7;font:14px system-ui}[hidden]{display:none!important}</style></head><body>'+body+'</body></html>');
 const b=await chromium.launch(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:(require('fs').existsSync('/opt/pw-browsers/chromium')?{executablePath:'/opt/pw-browsers/chromium'}:{}));
 const p=await b.newPage({viewport:{width:1500,height:950}});
 const errs=[];p.on('pageerror',e=>errs.push(String(e).slice(0,300)));
 await p.goto('file://'+require('path').join(__dirname,'..','preview.html')); await p.waitForTimeout(700);
 await p.click('#railToggle'); await p.waitForTimeout(400);
 await p.click('[data-type="msa"]'); await p.waitForTimeout(400);
 await p.click('[data-perm="docsource"][data-v="always"]'); await p.waitForTimeout(300);
 await p.click('[data-perm="redlines"][data-v="once"]'); await p.waitForTimeout(5200);
 await p.click('.qc-opt'); await p.waitForTimeout(300);
 await p.click('.qc-opt'); await p.waitForTimeout(300);
 await p.click('.qc-opt'); await p.waitForTimeout(2800);
 console.log('errs',errs.slice(0,3),'scrollW',await p.evaluate(()=>document.documentElement.scrollWidth));
 const e=await p.$('.deck-view'); const bb=await e.boundingBox();
 await p.screenshot({path:require('path').join(__dirname,'..','hdr2.png'),clip:{x:bb.x,y:bb.y,width:bb.width,height:300}});
 // toggle the provision off
 await p.click('[data-provoff]'); await p.waitForTimeout(400);
 await p.screenshot({path:require('path').join(__dirname,'..','hdr3.png'),clip:{x:bb.x,y:bb.y,width:bb.width,height:300}});
 await b.close();
})();
