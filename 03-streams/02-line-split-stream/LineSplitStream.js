const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.ending = '';
  }

  _transform(chunk, encoding, callback) {
    let data = chunk.toString();

    if (data.includes(os.EOL)) {
      data = this.ending + data;
      this.ending = '';
      data.split(os.EOL).forEach((line, index, lines) => {
        const isLast = index === lines.length - 1;
        if (isLast) {
          this.ending = line;
        } else {
          this.push(line);
        }
      });
    } else {
      this.ending += data;
    }

    callback(null);
  }

  _flush(callback) {
    callback(null, this.ending);
  }
}

module.exports = LineSplitStream;
