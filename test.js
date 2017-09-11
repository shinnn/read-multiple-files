'use strict';

const readMultipleFiles = require('.');
const test = require('tape');

const expected = [
  Buffer.from('.nyc_output\nnode_modules\ncoverage\n'),
  Buffer.from('* text=auto\n')
];

test('readMultipleFiles()', t => {
  t.plan(14);

  t.equal(readMultipleFiles.name, 'readMultipleFiles', 'should have a function name.');

  readMultipleFiles(['.gitignore', '.gitattributes'], (err, contents) => {
    t.deepEqual([err, contents], [null, expected], 'should read multiple files.');
  });

  readMultipleFiles(['.gitattributes'], 'hex', (err, contents) => {
    t.deepEqual(
      [err, contents],
      [null, [expected[1].toString('hex')]],
      'should reflect file encoding to the result.'
    );
  });

  readMultipleFiles(['./.gitignore'], {encoding: 'base64'}, (err, contents) => {
    t.deepEqual(
      [err, contents],
      [null, [expected[0].toString('base64')]],
      'should support fs.readFile options.'
    );
  });

  readMultipleFiles([], (err, contents) => {
    t.deepEqual(
      [err, contents],
      [null, []],
      'should pass an empty array to the callback when it takes an empty array.'
    );
  });

  readMultipleFiles(['.gitattributes', 'node_modules', 'index.js'], ({code}, ...restArgs) => {
    t.equal(
      code,
      'EISDIR',
      'should pass an error to the callback when it fails to read files.'
    );
    t.equal(
      restArgs.length,
      0,
      'should not pass any buffers to the callback when it fails to read files.'
    );
  });

  t.throws(
    () => readMultipleFiles([], new Set()),
    /TypeError.*Set {} is not a function.*Last argument/,
    'should throw an error when the last argument is not a function.'
  );

  t.throws(
    () => readMultipleFiles('test.js', t.fail),
    /TypeError.*'test\.js' \(string\) is not an array.*must be an array/,
    'should throw an error when the first argument is not an array.'
  );

  t.throws(
    () => readMultipleFiles(['test.js', ['index.js']], t.fail),
    /TypeError.*path/,
    'should throw an error when the array contains non-string values.'
  );

  t.throws(
    () => readMultipleFiles(['test.js'], {encoding: 'utf7'}, t.fail),
    /Unknown encoding/,
    'should throw an error when it takes an invalid fs.readFile option.'
  );

  t.throws(
    () => readMultipleFiles(),
    /^RangeError: Expected 2 or 3 arguments .*, but got no arguments instead\./,
    'should throw an error when it takes no arguments.'
  );

  t.throws(
    () => readMultipleFiles('a'),
    /^RangeError: Expected 2 or 3 arguments .*, but got 1 argument instead\./,
    'should throw an error when it takes a single arguments.'
  );

  t.throws(
    () => readMultipleFiles('a', 'b', 'c', 'd'),
    /^RangeError: Expected 2 or 3 arguments .*, but got 4 arguments instead\./,
    'should throw an error when it takes too many arguments.'
  );
});
