#!/usr/bin/env python3
"""RRM Holidays - Keepalive Static Server with React hydration support."""
import http.server, os, signal, sys, time
from urllib.parse import urlparse, parse_qs

MIME = {
    '.html':'text/html;charset=utf-8', '.css':'text/css;charset=utf-8',
    '.js':'application/javascript;charset=utf-8', '.json':'application/json',
    '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg',
    '.svg':'image/svg+xml', '.ico':'image/x-icon', '.webp':'image/webp',
    '.avif':'image/avif', '.woff2':'font/woff2', '.woff':'font/woff',
    '.mp4':'video/mp4', '.webmanifest':'application/manifest+json',
}

class Handler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        # Image optimization proxy - serve original directly
        if path.startswith('/_next/image'):
            url = parse_qs(parsed.query).get('url', [''])[0]
            if url and url.startswith('/'):
                self._serve_file('public' + url)
                return
            self.send_error(404)
            return

        # Next.js static chunks
        if path.startswith('/_next/static/'):
            self._serve_file('.next/static/' + path[14:])
            return

        # Public directory files (images, favicons, etc.)
        if self._serve_file('public' + path):
            return

        # HTML pages with __next div injection for React hydration
        app_dir = '.next/server/app'
        for candidate in [
            os.path.join(app_dir, path, 'index.html'),
            os.path.join(app_dir, path + '.html'),
            os.path.join(app_dir, path.replace('/','') + '.html') if path != '/' else None,
            os.path.join(app_dir, 'index.html'),
        ]:
            if candidate and os.path.isfile(candidate):
                try:
                    with open(candidate, 'r', errors='replace') as f:
                        html = f.read()
                    if 'id="__next"' not in html:
                        html = html.replace('</body>', '<div id="__next"></div></body>')
                    self.send_response(200)
                    self.send_header('Content-Type', 'text/html; charset=utf-8')
                    self.send_header('Cache-Control', 'no-cache')
                    self.end_headers()
                    self.wfile.write(html.encode())
                except Exception as e:
                    self.send_error(500, str(e))
                return

        self.send_error(404)

    def _serve_file(self, fpath):
        if not os.path.isfile(fpath):
            return False
        try:
            ext = os.path.splitext(fpath)[1].lower()
            ct = MIME.get(ext, 'application/octet-stream')
            with open(fpath, 'rb') as f:
                data = f.read()
            self.send_response(200)
            self.send_header('Content-Type', ct)
            self.send_header('Cache-Control', 'public, max-age=3600')
            self.send_header('Content-Length', str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return True
        except Exception:
            return False

    def log_message(self, fmt, *args):
        print('[%s] %s' % (self.log_date_time_string(), fmt % args))

os.chdir('/home/z/my-project')
signal.signal(signal.SIGTERM, lambda s, f: None)
signal.signal(signal.SIGINT, lambda s, f: None)
server = http.server.HTTPServer(('0.0.0.0', 3000), Handler)
print('RRM Holidays server running on http://0.0.0.0:3000', flush=True)
sys.stdout.flush()
server.serve_forever()
