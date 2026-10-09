const {chromium}=require('playwright');const fs=require('fs');
(async()=>{
 const body=fs.readFileSync(require('path').join(__dirname,'..','playbook-studio.html'),'utf8');
 fs.writeFileSync(require('path').join(__dirname,'..','preview.html'),'<!doctype html><html><head><meta charset="utf-8"><style>html{color-scheme:light}body{margin:0;background:#faf9f7;font:14px system-ui}[hidden]{display:none!important}</style></head><body>'+body+'</body></html>');
 const b=await chromium.launch(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:(require('fs').existsSync('/opt/pw-browsers/chromium')?{executablePath:'/opt/pw-browsers/chromium'}:{}));
 const p=await b.newPage({viewport:{width:1440,height:900}});
 await p.goto('file://'+require('path').join(__dirname,'..','preview.html')); await p.waitForTimeout(700);
 const o=await p.evaluate(()=>{
  const g=(s)=>{const e=document.querySelector(s);const b=e.getBoundingClientRect();return {l:+b.left.toFixed(1),r:+b.right.toFixed(1),t:+b.top.toFixed(1),bo:+b.bottom.toFixed(1),w:+b.width.toFixed(1)}};
  const items=[...document.querySelectorAll('#navPrimary .rail-item')];
  const last=items[items.length-1].getBoundingClientRect();
  const div=document.querySelectorAll('.rail-div')[0].getBoundingClientRect();
  const sub=document.querySelector('.rail-section-agents .rail-section-head').getBoundingClientRect();
  return {rail:g('.rail'), item:g('#navPrimary .rail-item'), head:g('.rail-head'),
    lastItemBottom:+last.bottom.toFixed(1), divTop:+div.top.toFixed(1), divL:+div.left.toFixed(1), divR:+div.right.toFixed(1), divW:+div.width.toFixed(1),
    agentsHeadTop:+sub.top.toFixed(1)};
 });
 console.log(JSON.stringify(o,null,1));
 await p.hover('#navPrimary .rail-item:nth-child(3)'); await p.waitForTimeout(250);
 await p.screenshot({path:require('path').join(__dirname,'..','nav2.png'),clip:{x:0,y:0,width:300,height:520}});
 await b.close();
})();
