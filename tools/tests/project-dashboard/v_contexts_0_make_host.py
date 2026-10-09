#!/usr/bin/env python3
"""Writes v_contexts_0_host.html: dist/project-dashboard.html inside <iframe sandbox="allow-scripts" srcdoc>,
the same way run_checks.py --ctx srcdoc does, plus a log of iframe loads/messages so a REAL (trusted) click can be
observed in a browser. Only tiny reporters are added; the product page is otherwise unmodified."""
import html as H, pathlib
HERE = pathlib.Path(__file__).resolve().parent
page = (HERE.parents[2] / 'dist' / 'project-dashboard.html').read_text()
rep = ('<script>try{parent.postMessage("inner-loaded:"+location.href,"*")}catch(e){};'
       'addEventListener("pagehide",function(){try{parent.postMessage("inner-pagehide","*")}catch(e){}});</script>')
page = page.replace('<head>', '<head>' + rep, 1)
host = ('<!doctype html><meta charset="utf-8"><title>v_contexts_0 host</title>'
        '<style>html,body{margin:0;height:100%}iframe{border:0;width:100%;height:calc(100% - 60px);display:block}'
        '#log{height:60px;margin:0;font:11px monospace;overflow:auto;background:#ffe}</style>'
        '<pre id="log"></pre><iframe id="f" sandbox="allow-scripts" srcdoc="' + H.escape(page, quote=True) + '"></iframe>'
        '<script>window.__loads=0;window.__msgs=[];var L=document.getElementById("log");'
        'function log(s){window.__msgs.push(s);L.textContent+=s+"\\n"}'
        'if(window!==top){try{parent.postMessage("HOST-PAGE-LOADED-INSIDE-THE-PROTOTYPE-IFRAME:"+location.href,"*")}catch(e){}}'
        'document.getElementById("f").addEventListener("load",function(){window.__loads++;log("iframe load #"+window.__loads)});'
        'addEventListener("message",function(e){log("msg: "+e.data)});</script>')
(HERE / 'v_contexts_0_host.html').write_text(host)
print('wrote', HERE / 'v_contexts_0_host.html', len(host))
