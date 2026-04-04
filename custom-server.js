const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const STATIC_DIR = path.join(__dirname, '.next', 'static');
const SERVER_DIR = path.join(__dirname, '.next', 'server');

const MIME = {
  '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  let filePath;

  // Serve static assets: /_next/static/...
  if (url.pathname.startsWith('/_next/static/')) {
    filePath = path.join(STATIC_DIR, url.pathname.replace('/_next/static/', ''));
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': 'public, max-age=31536000, immutable' });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
  }

  // Serve images from /public
  const publicPaths = ['/logo.png', '/logo.svg', '/favicon.ico', '/og-image.jpg', '/hero-mysuru.jpg', '/mysuru-palace.jpg'];
  const publicDir = path.join(__dirname, 'public');
  if (publicPaths.some(p => url.pathname === p) || url.pathname.startsWith('/gallery-') || url.pathname.startsWith('/states/') || url.pathname.startsWith('/avatar-') || url.pathname.startsWith('/sedan-') || url.pathname.startsWith('/swift-') || url.pathname.startsWith('/innova-') || url.pathname.startsWith('/tempo-') || url.pathname.startsWith('/mini-bus') || url.pathname.startsWith('/bus-') || url.pathname.startsWith('/urbania-') || url.pathname.startsWith('/testimonial-') || url.pathname.startsWith('/blog-') || url.pathname.startsWith('/destination-') || url.pathname.startsWith('/vehicle-') || url.pathname.startsWith('/ai-')) {
    filePath = path.join(publicDir, url.pathname);
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
  }

  // Serve pre-rendered pages
  const pageMap = {
    '/': 'index.html',
    '/about': 'about.html',
    '/contact': 'contact.html',
    '/login': 'login.html',
    '/signup': 'signup.html',
    '/reviews': 'reviews.html',
    '/blog': 'blog.html',
    '/vehicles': 'vehicles.html',
    '/trip-planner': 'trip-planner.html',
    '/smart-deals': 'smart-deals.html',
    '/ai-recommendations': 'ai-recommendations.html',
    '/route-planner': 'route-planner.html',
    '/review-analyzer': 'review-analyzer.html',
  };

  const htmlFile = pageMap[url.pathname];
  if (htmlFile) {
    filePath = path.join(SERVER_DIR, 'app', htmlFile);
    if (fs.existsSync(filePath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
  }

  // Check for state/destination pre-rendered pages
  const statePagePath = path.join(SERVER_DIR, 'app', url.pathname + '.html');
  if (fs.existsSync(statePagePath)) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    fs.createReadStream(statePagePath).pipe(res);
    return;
  }

  // Fallback to index for SPA-like routing
  filePath = path.join(SERVER_DIR, 'app', 'index.html');
  if (fs.existsSync(filePath)) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end('<h1>404 Not Found</h1>');
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Custom server listening on http://127.0.0.1:${PORT}`);
});
