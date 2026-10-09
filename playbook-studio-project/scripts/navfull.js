const {chromium}=require('playwright');const fs=require('fs');
(async()=>{
 const body=fs.readFileSync(require('path').join(__dirname,'..','playbook-studio.html'),'utf8');
 fs.writeFileSync(require('path').join(__dirname,'..','preview.html'),'<!doctype html><html><head><meta charset="utf-8"><style>html{color-scheme:light}body{margin:0;background:#faf9f7;font:14px system-ui}[hidden]{display:none!important}</style></head><body>'+body+'</body></html>');
 const b=await chromium.launch(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:(require('fs').existsSync('/opt/pw-browsers/chromium')?{executablePath:'/opt/pw-browsers/chromium'}:{}));
 const p=await b.newPage({viewport:{width:1440,height:960}});
 await p.goto('file://'+require('path').join(__dirname,'..','preview.html')); await p.waitForTimeout(700);
 const o=await p.evaluate(()=>{
  const R=e=>{const b=e.getBoundingClientRect();return{l:+b.left.toFixed(1),r:+b.right.toFixed(1),t:+b.top.toFixed(1),bo:+b.bottom.toFixed(1),h:+b.height.toFixed(1)}};
  const prim=[...document.querySelectorAll('#navPrimary .rail-item')].map(R);
  const ag=[...document.querySelectorAll('#navAgents .rail-item')].map(R);
  const hi=[...document.querySelectorAll('#navHistory .rail-item')].map(R);
  const divs=[...document.querySelectorAll('.rail-div')].map(R);
  const heads=[...document.querySelectorAll('.rail-section-head')].map(R);
  const cs=e=>{const c=getComputedStyle(e);return{fs:c.fontSize,fw:c.fontWeight,col:c.color}};
  return {prim,ag,hi,divs,heads,
    histLabel:cs(document.querySelector('#navHistory .rail-item-label')),
    histMeta:cs(document.querySelector('#navHistory .rail-item-meta')),
    head:cs(document.querySelector('.rail-section-head')),
    foot:R(document.querySelector('.rail-user'))};
 });
 console.log(JSON.stringify(o));
 await p.hover('#navHistory .rail-item:nth-child(2)'); await p.waitForTimeout(250);
 const hv=await p.evaluate(()=>{const e=document.querySelectorAll('#navHistory .rail-item')[1];return getComputedStyle(e,'::before').backgroundColor});
 console.log('histHover',hv);
 await p.screenshot({path:require('path').join(__dirname,'..','nav4.png'),clip:{x:0,y:0,width:290,height:960}});
 await b.close();
})();
