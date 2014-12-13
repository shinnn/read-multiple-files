'use strict';

var noop = require('nop');
var readMultipleFiles = require('./');
var test = require('tape');

function toHex(str) {
  return new Buffer(str).toString('hex');
}

test('readMultipleFiles()', function(t) {
  t.plan(9);

  t.equal(readMultipleFiles.name, 'readMultipleFiles', 'should have a function name.');

  readMultipleFiles(['.gitignore', '.gitattributes'], 'hex', function(err, contents) {
    t.deepEqual(
      [err, contents],
      [null, [toHex('node_modules\ncoverage\n'), toHex('* text=auto\n')]],
      'should reflect file encoding to all results.'
    );
  });

  readMultipleFiles(['./.gitignore'], {encoding: 'base64'}, function(err, contents) {
    t.deepEqual(
      [err, contents],
      [null, [new Buffer('node_modules\ncoverage\n').toString('base64')]],
      'should support fs.readFile options.'
    );
  });

  readMultipleFiles([], function(err, contents) {
    t.deepEqual(
      [err, contents],
      [null, []],
      'should pass an empty array to the callback when it takes an empty array.'
    );
  });

  readMultipleFiles(['.gitattributes', 'node_modules', 'index.js'], function(err) {
    t.equal(
      err.code, 'EISDIR',
      'should pass an error to the callback when it fails to read files.'
    );
    t.equal(
      arguments.length, 1,
      'should not pass any buffers to the callback when it fails to read files.'
    );
  });

  t.throws(
    readMultipleFiles.bind(null, []),
    /TypeError.*Last argument/,
    'should throw a type error when the last argument is not a function.'
  );

  t.throws(
    readMultipleFiles.bind(null, 'test.js', noop),
    /TypeError.*must be an array/,
    'should throw a type error when the first argument is not an array.'
  );

  t.throws(
    readMultipleFiles.bind(null, ['test.js', ['index.js']], noop),
    /TypeError.*path/,
    'should throw a type error when the array contains non-string values.'
  );
});
