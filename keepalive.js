/**
 * RRM Holidays - Keepalive Production Server
 * 
 * A lightweight Node.js HTTP server that serves the pre-built Next.js static output.
 * Auto-restarts on crash. Designed to stay alive in containerized environments.
 * 
 * Serves from .next/server/app/ (pre-rendered HTML) and .next/static/ (chunks).
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const HOST = '0.0.0.0';

// Paths
const APP_DIR = path.join(__dirname, '.next', 'server', 'app');
const STATIC_DIR = path.join(__dirname, '.next', 'static');
const PUB_DIR = path.join(__dirname, 'public');

// MIME types
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
    else headers['Cache-Control'] = 'no-cache';
    res.writeHead(200, headers);
    fs.createReadStream(filePath).pipe(res);
    return true;
  } catch (e) {
    return false;
  }
}

function isFile(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (e) {
    return false;
  }
}

function handleRequest(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = decodeURIComponent(url.pathname);

    // 1. Next.js static chunks: /_next/static/...
    if (pathname.startsWith('/_next/static/')) {
      if (sendFile(res, path.join(STATIC_DIR, pathname.slice(14)), true)) return;
    }

    // 2. Public directory (images, favicons, etc.)
    const pubPath = path.join(PUB_DIR, pathname);
    if (isFile(pubPath)) {
      if (sendFile(res, pubPath, false)) return;
    }

    // 3. Pre-rendered HTML pages
    const htmlCandidates = [
      path.join(APP_DIR, pathname, 'index.html'),      // /blog/index.html
      path.join(APP_DIR, pathname + '.html'),           // /reviews.html
      path.join(APP_DIR, pathname.replace(/\/$/, '') + '.html'),  // /reviews -> reviews.html
    ];
    for (const candidate of htmlCandidates) {
      if (sendFile(res, candidate, false)) return;
    }

    // 4. RSC data files
    const rscPath = path.join(APP_DIR, pathname + '.rsc');
    if (isFile(rscPath)) {
      res.writeHead(200, { 'Content-Type': 'text/plain', 'RSC-Content-Type': 'text/x-component' });
      fs.createReadStream(rscPath).pipe(res);
      return;
    }

    // 5. Fallback to homepage (SPA-like)
    if (sendFile(res, path.join(APP_DIR, 'index.html'), false)) return;

    // 6. 404
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
    const msg = `[${new Date().toISOString()}] Server error: ${err.message} - restarting in 2s`;
    console.error(msg);
    fs.appendFileSync('/tmp/keepalive-errors.log', msg + '\n');
    setTimeout(startServer, 2000);
  });

  server.listen(PORT, HOST, () => {
    const msg = `[${new Date().toISOString()}] RRM Holidays server listening on http://${HOST}:${PORT}`;
    console.log(msg);
    fs.appendFileSync('/tmp/keepalive-errors.log', msg + '\n');
  });

  return server;
}

// Start the server
let server = startServer();

// Self-healing: monitor server every 10 seconds
setInterval(() => {
  const req = http.get(`http://127.0.0.1:${PORT}/`, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      // Server is healthy
    });
  });
  req.on('error', (err) => {
    console.error(`[${new Date().toISOString()}] Health check failed: ${err.message} - restarting`);
    try { server.close(); } catch (e) { /* ignore */ }
    server = startServer();
  });
  req.setTimeout(5000, () => { req.destroy(); });
}, 10000);

// Prevent process from exiting
process.on('uncaughtException', (err) => {
  console.error(`[${new Date().toISOString()}] Uncaught exception: ${err.message}`);
  try { server.close(); } catch (e) { /* ignore */ }
  server = startServer();
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, ignoring');
});

process.on('SIGINT', () => {
  console.log('SIGINT received, ignoring');
});
