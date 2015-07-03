'use strict';

var readMultipleFiles = require('./');
var test = require('tape');

var expected = [
  new Buffer('node_modules\ncoverage\n'),
  new Buffer('* text=auto\n')
];

test('readMultipleFiles()', function(t) {
  t.plan(11);

  t.equal(readMultipleFiles.name, 'readMultipleFiles', 'should have a function name.');

  readMultipleFiles(['.gitignore', '.gitattributes'], function(err, contents) {
    t.deepEqual([err, contents], [null, expected], 'should read multiple files.');
  });

  readMultipleFiles(['.gitattributes'], 'hex', function(err, contents) {
    t.deepEqual(
      [err, contents],
      [null, [expected[1].toString('hex')]],
      'should reflect file encoding to the result.'
    );
  });

  readMultipleFiles(['./.gitignore'], {encoding: 'base64'}, function(err, contents) {
    t.deepEqual(
      [err, contents],
      [null, [expected[0].toString('base64')]],
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
      err.code,
      'EISDIR',
      'should pass an error to the callback when it fails to read files.'
    );
    t.equal(
      arguments.length,
      1,
      'should not pass any buffers to the callback when it fails to read files.'
    );
  });

  t.throws(
    readMultipleFiles.bind(null, []),
    /TypeError.* is not a function.*Last argument/,
    'should throw a type error when the last argument is not a function.'
  );

  t.throws(
    readMultipleFiles.bind(null, 'test.js', t.fail),
    /TypeError.* is not an array.*must be an array/,
    'should throw a type error when the first argument is not an array.'
  );

  t.throws(
    readMultipleFiles.bind(null, ['test.js', ['index.js']], t.fail),
    /TypeError.*path/,
    'should throw a type error when the array contains non-string values.'
  );

  t.throws(
    readMultipleFiles.bind(null, ['test.js'], {encoding: 'utf7'}, t.fail),
    /Unknown encoding/,
    'should throw an error when it takes an invalid fs.readFile option.'
  );
});
