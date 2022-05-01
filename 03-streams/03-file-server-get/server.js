const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      const file = fs.createReadStream(filepath);
      file.pipe(res);

      file.on('open', () => console.log('open'));
      file.on('close', () => console.log('close'));

      file.on('error', (error) => {
        if (error.code === 'ENOENT') {
          if (pathname.includes('/')) {
            res.statusCode = 400;
            res.end('Not support directory - 400\n');
          } else {
            res.statusCode = 404;
            res.end('File not found - 404\n');
          }
        } else {
          res.statusCode = 500;
          res.end('Internal error - 500\n');
        }
      });

      req.on('aborted', () => {
        console.log('aborted');
        file.destroy();
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
