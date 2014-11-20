# read-multiple-files 

[![Build Status](https://travis-ci.org/shinnn/read-multiple-files.svg?branch=master)](https://travis-ci.org/shinnn/read-multiple-files)
[![Build status](https://ci.appveyor.com/api/projects/status/ia3h5bcsy84vgfpc?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/read-multiple-files)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/read-multiple-files.svg)](https://coveralls.io/r/shinnn/read-multiple-files)
[![Dependency Status](https://david-dm.org/shinnn/read-multiple-files.svg)](https://david-dm.org/shinnn/read-multiple-files)
[![devDependency Status](https://david-dm.org/shinnn/read-multiple-files/dev-status.svg)](https://david-dm.org/shinnn/read-multiple-files#info=devDependencies)

A [Node](http://nodejs.org/) module to read multiple files asynchronously

```javascript
var readMultipleFiles = require('read-multiple-files');

readMultipleFiles(['one.txt', 'another.txt'], function(err, bufs) {
  if (err) {
    throw err;
  }

  bufs; //=> [<Buffer ... >, <Buffer ... >]
});
```

## Installation

[![NPM version](https://badge.fury.io/js/read-multiple-files.svg)](http://badge.fury.io/js/read-multiple-files)

[Use npm.](https://www.npmjs.org/doc/cli/npm-install.html)

```
npm install read-multiple-files
```

## API

```javascript
var readMultipleFiles = require('read-multiple-files');
```

### readMultipleFiles(*paths* [, *options*], *callback*)

*paths*: `Array` of `String`  
*options*: `Object` ([fs.readFile] options) or `String` (encoding)  
*callback*: `Function`

It is similar to [fs.readFile]. The only deference is that it takes an array of multiple file paths as its first argument.

#### callback(*error*, *contents*)

*error*: `Error` if it fails to read the file, otherwise `null`  
*contents*: `Array` of `Buffer` or `String` (according to `encoding` option)

The second argument will be an array of file contents. The order of contents follows the order of file paths. 

```javascript
var readMultipleFiles = require('read-multiple-files');

// foo.txt: Hello
// bar.txt: World

readMultipleFiles(['foo.txt', 'bar.txt'], 'utf8', function(err, contents) {
  if (err) {
    throw err;
  }

  contents; //=> ['Hello', 'World']
});
```

If it fails to read at least one file, it passes an error to the first argument and doesn't pass any values to the second argument.

```javascript
var readMultipleFiles = require('read-multiple-files');

// foo.txt: exists
// bar.txt: doesn't exist
// baz.txt: exists

readMultipleFiles(['foo.txt', 'bar.txt', 'baz.txt'], function(err, contents) {
  err.code; //=> 'ENOENT'
  contents; //=> undefined
  arguments.length; //=> 1
});
```

## Related project

* [read-files-promise](https://github.com/shinnn/read-files-promise) ([Promise](https://promisesaplus.com/) version)

## License

Copyright (c) 2014 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).

[fs.readFile]: http://nodejs.org/api/fs.html#fs_fs_readfile_filename_options_callback
