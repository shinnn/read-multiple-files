'use strict';

var noop = require('nop');
var readMultipleFiles = require('./');
var test = require('tape');

test('readMultipleFiles()', function(t) {
  t.plan(11);

  readMultipleFiles(['.gitignore', '.gitattributes'], 'hex', function(err, contents) {
    t.deepEqual(
      contents, [
        new Buffer('node_modules\ncoverage\n').toString('hex'),
        new Buffer('* text=auto\n').toString('hex')
      ],
      'should reflect file encoding to the result.'
    );
    t.strictEqual(err, null, 'should read all files without any errors.');
  });

  readMultipleFiles(['./.gitignore'], {encoding: 'base64'}, function(err, contents) {
    t.deepEqual(
      contents, [new Buffer('node_modules\ncoverage\n').toString('base64')],
      'should reflect fs.readFile options to the result.'
    );
    t.strictEqual(err, null, 'should read a file without any errors.');
  });

  readMultipleFiles([], function(err, contents) {
    t.deepEqual(
      contents, [],
      'should pass an empty array to the callback when it takes an empty array.'
    );
    t.strictEqual(
      err, null,
      'should not pass any errors to the callback even if it takes an empty array.'
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
    readMultipleFiles.bind(null, []), /TypeError.*Last argument/,
    'should throw a type error when the last argument is not a function.'
  );

  t.throws(
    readMultipleFiles.bind(null, 'test.js', noop), /TypeError.*must be an array/,
    'should throw a type error when the first argument is not an array.'
  );

  t.throws(
    readMultipleFiles.bind(null, ['test.js', ['index.js']], noop), /TypeError.*path/,
    'should throw a type error when the first argument contains non-string values.'
  );
});
