const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
http.createServer((req,res)=>{
  let target;try{target=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));}catch(e){res.writeHead(400);res.end();return;}
  if(target!==root&&!target.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  if(target===root)target=path.join(root,'index.html');
  fs.readFile(target,(e,buf)=>{if(e){res.writeHead(404);res.end('Not found');return;}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript','.png':'image/png','.json':'application/json'}[path.extname(target)]||'application/octet-stream'));res.setHeader('Cache-Control','no-store');res.end(buf);});
}).listen(4173,'127.0.0.1',()=>console.log('Foundry development preview: http://127.0.0.1:4173'));
