// Serves a built site directory the way GitHub Pages does: under the base path, directory URLs
// redirect to a trailing slash, and unknown paths get 404.html with status 404.
// Usage: node scripts/serve.mjs <dir> <port> <base>
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const [dirArg = 'dist', portArg = '4321', baseArg = '/'] = process.argv.slice(2);
const root = path.resolve(dirArg);
const port = Number(portArg);
const base = `/${baseArg.replace(/^\/+|\/+$/g, '')}`.replace(/\/$/, '');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
};

function send(res, status, file) {
  res.writeHead(status, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}

function notFound(res) {
  const page = path.join(root, '404.html');
  if (fs.existsSync(page)) return send(res, 404, page);
  res.writeHead(404).end('Not found');
}

if (!fs.existsSync(root)) {
  console.error(`serve: ${root} does not exist; run the build first`);
  process.exit(1);
}

http
  .createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    let pathname = decodeURIComponent(url.pathname);
    if (base) {
      if (pathname === base) {
        res.writeHead(301, { Location: `${base}/` }).end();
        return;
      }
      if (!pathname.startsWith(`${base}/`)) return notFound(res);
      pathname = pathname.slice(base.length);
    }
    const target = path.join(root, pathname);
    if (!target.startsWith(root)) return notFound(res);
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
      if (!pathname.endsWith('/')) {
        res.writeHead(301, { Location: `${base}${pathname}/${url.search}` }).end();
        return;
      }
      const index = path.join(target, 'index.html');
      return fs.existsSync(index) ? send(res, 200, index) : notFound(res);
    }
    if (fs.existsSync(target)) return send(res, 200, target);
    if (fs.existsSync(`${target}.html`)) return send(res, 200, `${target}.html`);
    return notFound(res);
  })
  .listen(port, '127.0.0.1', () => {
    console.log(`serve: ${root} at http://127.0.0.1:${port}${base}/`);
  });
