const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  let pathname = req.url.split('?')[0];
  if (pathname === '/' || pathname === '/cardapio' || pathname === '/admin') {
    pathname = '/index.html';
  }

  const file = path.join(root, pathname.replace(/^\//, ''));
  if (!file.startsWith(root) || !fs.existsSync(file)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Página não encontrada');
  }

  const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };
  res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

server.listen(port, () => console.log(`Doce Casa local: http://localhost:${port}/cardapio`));
