const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.size = 0;
    this.limit = options.limit;
  }

  _transform(chunk, encoding, callback) {
    let error = null;
    this.size += chunk.byteLength;
    if (this.size > this.limit) {
      error = new LimitExceededError();
    }
    callback(error, chunk);
  }
}

module.exports = LimitSizeStream;
