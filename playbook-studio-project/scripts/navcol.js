const {chromium}=require('playwright');const fs=require('fs');
(async()=>{
 const body=fs.readFileSync(require('path').join(__dirname,'..','playbook-studio.html'),'utf8');
 fs.writeFileSync(require('path').join(__dirname,'..','preview.html'),'<!doctype html><html><head><meta charset="utf-8"><style>html{color-scheme:light}body{margin:0;background:#faf9f7;font:14px system-ui}[hidden]{display:none!important}</style></head><body>'+body+'</body></html>');
 const b=await chromium.launch(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:(require('fs').existsSync('/opt/pw-browsers/chromium')?{executablePath:'/opt/pw-browsers/chromium'}:{}));
 const p=await b.newPage({viewport:{width:1440,height:900}});
 await p.goto('file://'+require('path').join(__dirname,'..','preview.html')); await p.waitForTimeout(700);
 await p.hover('.rail-head'); await p.waitForTimeout(200);
 await p.click('#railToggle'); await p.waitForTimeout(600);
 await p.hover('#navPrimary .rail-item:nth-child(3)'); await p.waitForTimeout(250);
 const o=await p.evaluate(()=>{const e=document.querySelectorAll('#navPrimary .rail-item')[2];const b=e.getBoundingClientRect();return{l:b.left,r:b.right,w:b.width,h:b.height}});
 console.log(JSON.stringify(o));
 await p.screenshot({path:require('path').join(__dirname,'..','nav3.png'),clip:{x:0,y:0,width:120,height:420}});
 await b.close();
})();
