function sum(a, b) {
  if (!(typeof a === 'number' && typeof b === 'number')) {
    throw new TypeError('Arguments should be type of number.');
  } else {
    return a + b;
  }
}

module.exports = sum;
