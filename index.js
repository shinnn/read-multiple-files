/*!
 * read-multiple-files | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/read-multiple-files
*/
'use strict';

const readFile = require('graceful-fs').readFile;
const runParalell = require('run-parallel');
const stripBom = require('strip-bom');
const stripBomBuf = require('strip-bom-buf');

module.exports = function readMultipleFiles(filePaths, options, cb) {
  if (cb === undefined) {
    cb = options;
    options = null;
  }

  if (typeof cb !== 'function') {
    throw new TypeError(String(cb) +
      ' is not a function. Last argument to read-multiple-files must be a callback function.');
  }

  if (!Array.isArray(filePaths)) {
    throw new TypeError(String(filePaths) +
      ' is not an array. First Argument to read-multiple-files must be an array of file paths.');
  }

  runParalell(filePaths.map(filePath => done => readFile(filePath, options, done)), (err, results) => {
    if (err) {
      cb(err);
      return;
    }

    if (results.length === 0) {
      cb(null, results);
      return;
    }

    if (Buffer.isBuffer(results[0])) {
      cb(null, results.map(stripBomBuf));
      return;
    }

    cb(null, results.map(stripBom));
  });
};
