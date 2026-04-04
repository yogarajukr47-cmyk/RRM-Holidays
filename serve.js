const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 3000;
const STATIC_DIR = path.join(__dirname, '.next', 'static');
const APP_DIR = path.join(__dirname, '.next', 'server', 'app');
const PUB_DIR = path.join(__dirname, 'public');
const MIME = {'.html':'text/html;charset=utf-8','.js':'application/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon','.webp':'image/webp','.avif':'image/avif','.woff2':'font/woff2','.woff':'font/woff','.mp4':'video/mp4'};
function send(res, fp, imm) {
  try {
    if (!fs.existsSync(fp)) return false;
    const h = {'Content-Type': MIME[path.extname(fp)]||'application/octet-stream'};
    if (imm) h['Cache-Control']='public,max-age=31536000,immutable';
    res.writeHead(200, h);
    fs.createReadStream(fp).pipe(res);
    return true;
  } catch(e) { return false; }
}
http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  const p = u.pathname;
  if (p.startsWith('/_next/static/')) { if(send(res, path.join(STATIC_DIR, p.slice(14)), true)) return; }
  // Try public dir
  if (send(res, path.join(PUB_DIR, p), false)) return;
  // Try various HTML locations
  const tryHtml = [path.join(APP_DIR, p, 'index.html'), path.join(APP_DIR, p+'.html'), path.join(APP_DIR, p.replace(/\/$/,'')+'.html')];
  for (const f of tryHtml) { if (send(res, f, false)) return; }
  // RSC
  const rsc = path.join(APP_DIR, p+'.rsc');
  if (fs.existsSync(rsc)) { res.writeHead(200,{'Content-Type':'text/plain'}); fs.createReadStream(rsc).pipe(res); return; }
  // Fallback
  send(res, path.join(APP_DIR, 'index.html'), false) || (res.writeHead(404), res.end('404'));
}).listen(PORT, '0.0.0.0', () => console.log('OK:'+PORT));
