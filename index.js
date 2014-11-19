/*!
 * read-multiple-files | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/read-multiple-files
*/

'use strict';

var fs = require('graceful-fs');
var runParalell = require('run-parallel');

module.exports = function readMultipleFiles(filePaths, options, cb) {
  if (cb === undefined) {
    cb = options;
    options = null;
  }

  if (typeof cb !== 'function') {
    throw new TypeError(cb + ' is not a function. Last argument must be a function.');
  }

  if (!Array.isArray(filePaths)) {
    throw new TypeError(filePaths + ' is not an array. First Argument must be an array.');
  }

  runParalell(filePaths.map(function(filePath) {
    return fs.readFile.bind(fs, filePath, options);
  }), function(err, result) {
    if (err) {
      cb(err);
      return;
    }
    cb(err, result);
  });
};
