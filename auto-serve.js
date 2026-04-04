const http = require('http');
const fs = require('fs');
const path = require('path');

const APP_DIR = '/home/z/my-project/.next/server/app';
const STATIC_DIR = '/home/z/my-project/.next/static';
const PUB_DIR = '/home/z/my-project/public';
const MIME = {'.html':'text/html;charset=utf-8','.css':'text/css','.js':'application/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon','.webp':'image/webp','.avif':'image/avif','.woff2':'font/woff2','.woff':'font/woff','.mp4':'video/mp4'};

function serveFile(res, filePath, immutable) {
  try {
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) return false;
    const h = {'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream'};
    if (immutable) h['Cache-Control'] = 'public, max-age=31536000, immutable';
    res.writeHead(200, h);
    fs.createReadStream(filePath).pipe(res);
    return true;
  } catch(e) { return false; }
}

let srv;
function startServer() {
  if (srv) { try { srv.close(); } catch(e){} }
  
  srv = http.createServer((req, res) => {
    try {
      const u = new URL(req.url, 'http://x');
      const p = decodeURIComponent(u.pathname);
      
      if (p.startsWith('/_next/static/')) {
        if (serveFile(res, path.join(STATIC_DIR, p.slice(14)), true)) return;
      }
      
      // Public dir
      const pubPath = path.join(PUB_DIR, p);
      try { if (fs.statSync(pubPath).isFile()) { if (serveFile(res, pubPath, false)) return; } } catch(e) {}
      
      // HTML pages
      const htmlCandidates = [
        path.join(APP_DIR, p, 'index.html'),
        path.join(APP_DIR, p + '.html'),
      ];
      for (const c of htmlCandidates) {
        if (serveFile(res, c, false)) return;
      }
      
      // RSC
      const rsc = path.join(APP_DIR, p + '.rsc');
      try { if (fs.statSync(rsc).isFile()) { res.writeHead(200,{'Content-Type':'text/plain'}); fs.createReadStream(rsc).pipe(res); return; } } catch(e) {}
      
      // Fallback to homepage
      if (serveFile(res, path.join(APP_DIR, 'index.html'), false)) return;
      
      res.writeHead(404);
      res.end('404');
    } catch(e) {
      res.writeHead(500);
      res.end('Error');
    }
  });

  srv.on('error', (e) => {
    console.log('Error:', e.message);
    setTimeout(startServer, 2000);
  });

  srv.listen(3000, '0.0.0.0', () => console.log('OK:3000'));
}

startServer();

// Keep process alive with setInterval
setInterval(() => {}, 60000);
