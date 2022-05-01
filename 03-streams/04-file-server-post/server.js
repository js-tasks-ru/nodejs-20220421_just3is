const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

const logError = (err) => {
  if (err) {
    console.log(err.message);
  }
};

const downloadFile = (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const fileDir = path.join(__dirname, 'files');
  const filepath = path.join(fileDir, pathname);

  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.statusMessage = 'INCORRECT_NAME: doesnt support symbol "/" in name';
    return res.end();
  }

  const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});
  const limitStream = new LimitSizeStream({limit: 1e6});

  req.pipe(limitStream).pipe(writeStream).on('finish', () => {
    res.statusCode = 201;
    res.end();
  });

  limitStream.on('error', (err) => {
    if (err.code === 'LIMIT_EXCEEDED') {
      res.statusCode = 413;
      res.statusMessage = 'LIMIT_EXCEEDED: too big file';
      res.end();

      writeStream.end();
      fs.rm(filepath, logError);
    }
  });

  writeStream.on('error', (err) => {
    if (err.code === 'EEXIST') {
      res.statusCode = 409;
      res.statusMessage = 'EEXIST: file already exists';
      res.end();

      writeStream.end();
      fs.rm(filepath, logError);
    }
  });

  req.on('aborted', () => {
    writeStream.end();
    fs.rm(filepath, logError);
  });
};

server.on('request', (req, res) => {

  switch (req.method) {
    case 'POST':
      downloadFile(req, res);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
