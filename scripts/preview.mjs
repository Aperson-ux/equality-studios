import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../dist');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8' };
const server = http.createServer(async (request, response) => {
  try {
    let pathname;
    try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
    catch { response.writeHead(400).end('Bad request'); return; }
    const requested = path.resolve(root, '.' + pathname);
    if (requested !== root && !requested.startsWith(root + path.sep)) {
      response.writeHead(403).end('Forbidden'); return;
    }
    let file = requested;
    try { if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html'); }
    catch {
      if (path.extname(pathname)) { response.writeHead(404).end('Not found'); return; }
      file = path.join(root, 'index.html');
    }
    const content = await readFile(file);
    response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    response.end(content);
  } catch { response.writeHead(500).end('Unable to load page'); }
});
server.listen(4317, '127.0.0.1', () => console.log('Local: http://127.0.0.1:4317'));
for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => server.close());
