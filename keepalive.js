/**
 * RRM Holidays - Keepalive Static Server
 * Serves pre-built Next.js output with proper React hydration support.
 * Auto-restarts on crash.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const HOST = '0.0.0.0';

const APP_DIR = path.join(__dirname, '.next', 'server', 'app');
const STATIC_DIR = path.join(__dirname, '.next', 'static');
const PUB_DIR = path.join(__dirname, 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.mp4': 'video/mp4',
  '.webmanifest': 'application/manifest+json',
};

function sendFile(res, filePath, immutable) {
  try {
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) return false;
    const headers = { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' };
    if (immutable) headers['Cache-Control'] = 'public, max-age=31536000, immutable';
    else headers['Cache-Control'] = 'public, max-age=3600';
    res.writeHead(200, headers);
    fs.createReadStream(filePath).pipe(res);
    return true;
  } catch (e) {
    return false;
  }
}

function isFile(filePath) {
  try { return fs.statSync(filePath).isFile(); } catch (e) { return false; }
}

function injectNextDiv(html) {
  // Inject <div id="__next"></div> before the closing </body> if not present
  if (!html.includes('id="__next"')) {
    html = html.replace('</body>', '<div id="__next"></div></body>');
  }
  return html;
}

function handleRequest(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = decodeURIComponent(url.pathname);

    // 1. Next.js static chunks: /_next/static/...
    if (pathname.startsWith('/_next/static/')) {
      if (sendFile(res, path.join(STATIC_DIR, pathname.slice(14)), true)) return;
      // 404 for missing chunks - don't fallback to HTML
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }

    // 2. Image optimization - serve original image directly
    if (pathname.startsWith('/_next/image')) {
      const imgUrl = url.searchParams.get('url');
      if (imgUrl && imgUrl.startsWith('/')) {
        const imgPath = path.join(PUB_DIR, imgUrl);
        if (isFile(imgPath)) {
          if (sendFile(res, imgPath, false)) return;
        }
      }
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Image Not Found');
      return;
    }

    // 3. Public directory (images, favicons, etc.)
    const pubPath = path.join(PUB_DIR, pathname);
    if (isFile(pubPath)) {
      if (sendFile(res, pubPath, false)) return;
    }

    // 4. Pre-rendered HTML pages
    const htmlCandidates = [
      path.join(APP_DIR, pathname, 'index.html'),
      path.join(APP_DIR, pathname + '.html'),
      path.join(APP_DIR, pathname.replace(/\/$/, '') + '.html'),
    ];
    for (const candidate of htmlCandidates) {
      if (isFile(candidate)) {
        try {
          let html = fs.readFileSync(candidate, 'utf-8');
          html = injectNextDiv(html);
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
          res.end(html);
          return;
        } catch (e) { /* continue */ }
      }
    }

    // 5. RSC data files
    const rscPath = path.join(APP_DIR, pathname + '.rsc');
    if (isFile(rscPath)) {
      res.writeHead(200, { 'Content-Type': 'text/plain', 'RSC-Content-Type': 'text/x-component' });
      fs.createReadStream(rscPath).pipe(res);
      return;
    }

    // 6. Fallback to homepage with injected div
    const indexPath = path.join(APP_DIR, 'index.html');
    if (isFile(indexPath)) {
      try {
        let html = fs.readFileSync(indexPath, 'utf-8');
        html = injectNextDiv(html);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
        res.end(html);
        return;
      } catch (e) { /* continue */ }
    }

    // 7. 404
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<!DOCTYPE html><html><head><meta charset="utf-8"><title>404</title></head><body style="background:#0a0a0a;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif"><div style="text-align:center"><h1 style="font-size:4rem;color:#f59e0b">404</h1><p style="color:#a8a29e">Page not found</p><a href="/" style="color:#f59e0b">Go Home</a></div></body></html>');
  } catch (e) {
    res.writeHead(500);
    res.end('Server Error');
  }
}

function startServer() {
  const server = http.createServer(handleRequest);
  server.on('error', (err) => {
    console.error(`[${new Date().toISOString()}] Server error: ${err.message} - restarting`);
    fs.appendFileSync('/tmp/keepalive-errors.log', `Error: ${err.message}\n`);
    setTimeout(startServer, 2000);
  });
  server.listen(PORT, HOST, () => {
    console.log(`[${new Date().toISOString()}] RRM Holidays server on http://${HOST}:${PORT}`);
  });
  return server;
}

let server = startServer();

// Health check
setInterval(() => {
  const req = http.get(`http://127.0.0.1:${PORT}/`, (res) => { res.resume(); });
  req.on('error', () => {
    try { server.close(); } catch(e) {}
    server = startServer();
  });
  req.setTimeout(5000, () => req.destroy());
}, 10000);

process.on('uncaughtException', (e) => { console.error('Uncaught:', e.message); });
process.on('SIGTERM', () => {});
process.on('SIGINT', () => {});
