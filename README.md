# read-multiple-files 

[![NPM version](https://img.shields.io/npm/v/read-multiple-files.svg)](https://www.npmjs.com/package/read-multiple-files)
[![Build Status](https://travis-ci.org/shinnn/read-multiple-files.svg?branch=master)](https://travis-ci.org/shinnn/read-multiple-files)
[![Build status](https://ci.appveyor.com/api/projects/status/ia3h5bcsy84vgfpc?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/read-multiple-files)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/read-multiple-files.svg)](https://coveralls.io/r/shinnn/read-multiple-files)
[![Dependency Status](https://img.shields.io/david/shinnn/read-multiple-files.svg?label=deps)](https://david-dm.org/shinnn/read-multiple-files)
[![devDependency Status](https://img.shields.io/david/dev/shinnn/read-multiple-files.svg?label=devDeps)](https://david-dm.org/shinnn/read-multiple-files#info=devDependencies)

A [Node](https://nodejs.org/) module to read multiple files asynchronously

```javascript
const readMultipleFiles = require('read-multiple-files');

readMultipleFiles(['one.txt', 'another.txt'], (err, bufs) => {
  if (err) {
    throw err;
  }

  bufs; //=> [<Buffer ... >, <Buffer ... >]
});
```

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```
npm install read-multiple-files
```

## API

```javascript
const readMultipleFiles = require('read-multiple-files');
```

### readMultipleFiles(*paths* [, *options*], *callback*)

*paths*: `Array` of `String` (file paths)  
*options*: `Object` ([fs.readFile] options) or `String` (encoding)  
*callback*: `Function`

#### callback(*error*, *contents*)

*error*: `Error` if it fails to read at least one of the files, otherwise `null`  
*contents*: `Array` of `Buffer` or `String` (according to `encoding` option)

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

* [read-files-promise](https://github.com/shinnn/read-files-promise) ([Promises/A+](https://promisesaplus.com/) version)

## License

Copyright (c) 2014 - 2015 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).

[fs.readFile]: https://iojs.org/api/fs.html#fs_fs_readfile_filename_options_callback
