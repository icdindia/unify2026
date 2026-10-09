import http.server,functools,sys,os,re
D=sys.argv[1]
class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin','*'); self.send_header('Cache-Control','no-store'); super().end_headers()
    def do_POST(self):
        name=re.sub(r'[^A-Za-z0-9_.-]','',self.path.strip('/'))
        n=int(self.headers.get('Content-Length',0)); data=self.rfile.read(n)
        open(os.path.join(D,name),'wb').write(data)
        self.send_response(200); self.end_headers(); self.wfile.write(b'ok')
    def log_message(self,*a): pass
http.server.ThreadingHTTPServer(('127.0.0.1',9231),functools.partial(H,directory=D)).serve_forever()
