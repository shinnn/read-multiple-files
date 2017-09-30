# read-multiple-files

[![npm version](https://img.shields.io/npm/v/read-multiple-files.svg)](https://www.npmjs.com/package/read-multiple-files)
[![Build Status](https://travis-ci.org/shinnn/read-multiple-files.svg?branch=master)](https://travis-ci.org/shinnn/read-multiple-files)
[![Build status](https://ci.appveyor.com/api/projects/status/ia3h5bcsy84vgfpc?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/read-multiple-files)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/read-multiple-files.svg)](https://coveralls.io/r/shinnn/read-multiple-files)

A [Node.js](https://nodejs.org/) module to read multiple files asynchronously

```javascript
const readMultipleFiles = require('read-multiple-files');

readMultipleFiles(new Set(['one.txt', 'another.txt']), (err, bufs) => {
  if (err) {
    throw err;
  }

  bufs; //=> [<Buffer ... >, <Buffer ... >]
});
```

## Installation

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/getting-started/what-is-npm).

```
npm install read-multiple-files
```

## API

```javascript
const readMultipleFiles = require('read-multiple-files');
```

### readMultipleFiles(*paths* [, *options*], *callback*)

*paths*: `<Array|Set<string|Buffer|URL|integer>>` (file paths)  
*options*: `Object` ([fs.readFile] options) or `string` (encoding)  
*callback*: `Function`

#### callback(*error*, *contents*)

*error*: `Error` if it fails to read at least one of the files, otherwise `null`  
*contents*: `Array<Buffer>` or `Array<string>` (according to `encoding` option)

The second argument will be an array of file contents. The order of contents follows the order of file paths.

It automatically strips [UTF-8 byte order mark](https://en.wikipedia.org/wiki/Byte_order_mark#UTF-8) from results.

```javascript
const readMultipleFiles = require('read-multiple-files');

// foo.txt: Hello
// bar.txt: World

readMultipleFiles(['foo.txt', 'bar.txt'], 'utf8', (err, contents) => {
  if (err) {
    throw err;
  }

  contents; //=> ['Hello', 'World']
});
```

If it fails to read at least one of the files, it passes an error to the first argument and doesn't pass any values to the second argument.

```javascript
const readMultipleFiles = require('read-multiple-files');

// foo.txt: exists
// bar.txt: doesn't exist
// baz.txt: exists

readMultipleFiles(['foo.txt', 'bar.txt', 'baz.txt'], (err, contents) => {
  err.code; //=> 'ENOENT'
  contents; //=> undefined
  arguments.length; //=> 1
});
```

## Related project

* [read-files-promise](https://github.com/shinnn/read-files-promise) ([Promises](https://promisesaplus.com/) version)

## License

[ISC License](./LICENSE) © 2017 Shinnosuke Watanabe
