const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Serve from the pre-built output
const APP_DIR = '/home/z/my-project/.next/server/app';
const STATIC_DIR = '/home/z/my-project/.next/static';
const PUB_DIR = '/home/z/my-project/public';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
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
};

function serve(res, filePath, immutable) {
  if (!fs.existsSync(filePath)) return false;
  const stat = fs.statSync(filePath);
  if (stat.isDirectory()) return false;
  const headers = { 'Content-Type': MIME_TYPES[path.extname(filePath)] || 'application/octet-stream' };
  if (immutable) headers['Cache-Control'] = 'public, max-age=31536000, immutable';
  res.writeHead(200, headers);
  fs.createReadStream(filePath).pipe(res);
  return true;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(url.pathname);

  // Next.js static chunks
  if (pathname.startsWith('/_next/static/')) {
    if (serve(res, path.join(STATIC_DIR, pathname.slice(14)), true)) return;
  }

  // Try public directory (images, favicons, etc.)
  if (serve(res, path.join(PUB_DIR, pathname), false)) return;

  // Try .next/server/app/ routes
  const candidates = [
    path.join(APP_DIR, pathname, 'index.html'),
    path.join(APP_DIR, pathname + '.html'),
  ];
  // Handle paths like /destinations/karnataka -> destinations/karnataka.html
  if (pathname.endsWith('/')) {
    candidates.push(path.join(APP_DIR, pathname.slice(0, -1) + '.html'));
  }
  
  for (const c of candidates) {
    if (serve(res, c, false)) return;
  }

  // RSC data
  const rscFile = path.join(APP_DIR, pathname + '.rsc');
  if (fs.existsSync(rscFile)) {
    res.writeHead(200, { 'Content-Type': 'text/plain', 'RSC-Content-Type': 'text/x-component' });
    fs.createReadStream(rscFile).pipe(res);
    return;
  }

  // Fallback to index.html
  serve(res, path.join(APP_DIR, 'index.html'), false);
  
  if (!res.writableEnded) {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Static server on http://${HOST}:${PORT}`);
});
