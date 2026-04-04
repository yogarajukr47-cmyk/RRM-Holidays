// RRM Holidays - Self-healing server with keepalive pings
const http = require('http'), fs = require('fs'), path = require('path');
const MIME = {'.html':'text/html;charset=utf-8','.css':'text/css;charset=utf-8','.js':'application/javascript;charset=utf-8','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon','.webp':'image/webp','.avif':'image/avif','.woff2':'font/woff2','.woff':'font/woff','.mp4':'video/mp4'};

const APP = path.join(__dirname, '.next/server/app');
const STA = path.join(__dirname, '.next/static');
const PUB = path.join(__dirname, 'public');

function sendFile(res, fp, immutable) {
  try {
    const data = fs.readFileSync(fp);
    const ct = MIME[path.extname(fp)] || 'application/octet-stream';
    const cc = immutable ? 'public,max-age=31536000,immutable' : 'public,max-age=3600';
    res.writeHead(200, { 'Content-Type': ct, 'Cache-Control': cc, 'Content-Length': data.length });
    res.end(data);
    return true;
  } catch (e) { return false; }
}

function sendHtml(res, html) {
  if (!html.includes('id="__next"')) html = html.replace('</body>', '<div id="__next"></div></body>');
  res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'no-cache' });
  res.end(html);
}

function send404(res) {
  if (!res.headersSent) { res.writeHead(404); res.end('Not Found'); }
}

const server = http.createServer((req, res) => {
  try {
    const url = new URL(req.url, 'http://x');
    const p = decodeURIComponent(url.pathname);

    // Health ping
    if (p === '/ping') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('pong');
      return;
    }

    // Next.js static chunks
    if (p.startsWith('/_next/static/')) {
      if (sendFile(res, path.join(STA, p.slice(14)), true)) return;
      send404(res);
      return;
    }

    // Image optimization proxy
    if (p.startsWith('/_next/image')) {
      const imgUrl = url.searchParams.get('url');
      if (imgUrl && imgUrl.startsWith('/')) {
        if (sendFile(res, path.join(PUB, imgUrl), false)) return;
      }
      send404(res);
      return;
    }

    // Public files
    if (sendFile(res, path.join(PUB, p), false)) return;

    // HTML pages
    const candidates = [
      path.join(APP, p, 'index.html'),
      path.join(APP, p + '.html'),
      path.join(APP, p.replace(/\/$/, '') + '.html'),
      path.join(APP, 'index.html'),
    ];
    for (const c of candidates) {
      if (fs.existsSync(c)) {
        try {
          const html = fs.readFileSync(c, 'utf-8');
          sendHtml(res, html);
        } catch (e) {
          if (!res.headersSent) { res.writeHead(500); res.end('Error'); }
        }
        return;
      }
    }

    send404(res);
  } catch (e) {
    if (!res.headersSent) { res.writeHead(500); res.end('Server Error'); }
  }
});

server.listen(3000, '0.0.0.0', () => {
  console.log('RRM Holidays server on :3000', new Date().toISOString());
  // Self-ping every 5 seconds
  setInterval(() => {
    http.get('http://127.0.0.1:3000/ping', { timeout: 2000 }).on('error', () => {});
  }, 5000);
});

server.on('error', () => { setTimeout(() => process.exit(1), 1000); });
process.on('SIGTERM', () => {});
process.on('SIGINT', () => {});
