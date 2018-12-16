# read-multiple-files

[![npm version](https://img.shields.io/npm/v/read-multiple-files.svg)](https://www.npmjs.com/package/read-multiple-files)
[![Build Status](https://travis-ci.com/shinnn/read-multiple-files.svg?branch=master)](https://travis-ci.com/shinnn/read-multiple-files)
[![Build status](https://ci.appveyor.com/api/projects/status/ia3h5bcsy84vgfpc?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/read-multiple-files)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/read-multiple-files.svg)](https://coveralls.io/github/shinnn/read-multiple-files)

Read multiple files [Observable](https://github.com/tc39/proposal-observable) way

```javascript
const readMultipleFiles = require('read-multiple-files');

readMultipleFiles(new Set([
  'one.txt',    // 'a'
  'another.txt' // 'b'
])).subscribe({
  next(result) {
    if (result.path === 'one.txt') {
      result.contents; // Buffer.from('a')
    } else if (result.path === 'another.txt') {
      result.contents; // Buffer.from('b')
    }
  },
  complete() {
    console.log('Successfully read all files.');
  }
});
```

## Installation

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/about-npm/).

```
npm install read-multiple-files
```

## API

```javascript
const readMultipleFiles = require('read-multiple-files');
```

### readMultipleFiles(*paths* [, *options*])

*paths*: `<Array|Set<string|Buffer|URL|integer>>` (file paths)  
*options*: `Object` ([`fs.readFile`](https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback) options) or `string` (encoding)  
Return: [`Observable`](https://tc39.github.io/proposal-observable/#observable) ([Kevin Smith's implementation](https://github.com/zenparsing/zen-observable))

When the `Observable` is [subscribe](https://tc39.github.io/proposal-observable/#observable-prototype-subscribe)d, it starts to read files in parallel, successively send each result to its [`Observer`](https://github.com/tc39/proposal-observable#observer) as an `Object`: `{path: <string|Buffer|URL|integer>, contents: <string:Buffer>}`

```javascript
readMultipleFiles([
  'foo.txt', // 'Hello'
  'bar.txt'  // 'World'
], 'utf8').subscribe({
  next({path, contents}) {
    if (path === 'one.txt') {
      contents; // 'Hello'
    } else if (path === 'another.txt') {
      contents; // 'World'
    }
  }
});
```

The `Observer` receives an error when it fails to read at least one of the files.

```javascript
const readMultipleFiles = require('read-multiple-files');

readMultipleFiles([
  'foo.txt', // exists
  'bar.txt'  // doesn't exist
]).subscribe({
  error(err) {
    err.code; //=> ENOENT
  },
  complete() {
    // `complete` callback will never be called.
  }
});
```

## Related project

* [read-files-promise](https://github.com/shinnn/read-files-promise) — `Promise` interface version

## License

[ISC License](./LICENSE) © 2017 - 2018 Shinnosuke Watanabe
