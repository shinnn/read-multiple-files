/*!
 * read-multiple-files | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/read-multiple-files
*/
'use strict';

const inspectWithKind = require('inspect-with-kind');
const {readFile} = require('graceful-fs');
const runParalell = require('run-parallel');
const stripBom = require('strip-bom');
const stripBomBuf = require('strip-bom-buf');

const ARG_ERR = 'Expected 2 or 3 arguments (paths: <Array|Set>[, options: <Object>], callback: <Function>)';

module.exports = function readMultipleFiles(...args) {
  const argLen = args.length;

  if (argLen !== 2 && argLen !== 3) {
    throw new RangeError(`${ARG_ERR}, but got ${
      argLen === 1 ? '1 argument' : `${argLen || 'no'} arguments`
    } instead.`);
  }

  const [filePaths, options, cb] = argLen === 3 ? args : [args[0], {}, args[1]];

  if (typeof cb !== 'function') {
    throw new TypeError(inspectWithKind(cb) +
      ' is not a function. Last argument to read-multiple-files must be a callback function.');
  }

  if (!Array.isArray(filePaths) && !(filePaths instanceof Set)) {
    throw new TypeError(inspectWithKind(filePaths) +
      ' is neither Array nor Set. First Argument to read-multiple-files must be file paths (<Array> or <Set>).');
  }

  runParalell([...filePaths].map(filePath => done => readFile(filePath, options, done)), (err, results) => {
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
