# object-fill-missing-keys

<a href="https://github.com/feross/standard" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Add missing keys into plain objects, according to a provided schema object

[![Build Status][travis-img]][travis-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Downloads/Month][downloads-img]][downloads-url]

## Install

```sh
$ npm install --save object-fill-missing-keys
```

## Purpose

Imagine you parsed two JSON files and got two objects. Each has few keys that another one doesn't. How do you make so that each has the same set of keys, in alphabetical order? I call that _normalising_. Mind you; each JSON file can be nested spaghetti of plain objects within arrays within plain objects and contain gazillion of string values too. Normalising involves Abstract Syntax Tree (AST) traversal, what requires recursive operations.

This library performs this **normalising part**. Feed an input object and a schema object and it will fill any keys that are in the schema but not in the input.

Now, you may ask, how do you generate a _schema object_?

Flatten and merge all arrays, then set all key values of it to the default value you want schema to bear.

For that you'll need few other libraries:

* [object-flatten-all-arrays](https://github.com/code-and-send/object-flatten-all-arrays)
* [object-merge-advanced](https://github.com/code-and-send/object-merge-advanced)
* [object-set-all-values-to](https://github.com/code-and-send/object-set-all-values-to)

But let's get back to the main subject.

## Use

```js
var fillMissingKeys = require('object-fill-missing-keys')
var f = fillMissingKeys(
  {
    b: 'b'
  },
  {
    a: false,
    b: false,
    c: false
  }
)
console.log('f = ' + JSON.stringify(f, null, 4))
// => {
//      a: false,
//      b: 'b',
//      c: false
//    }
```

## API

```js
fillMissingKeys(incompleteObj, schemaObj)
```

### API - Input

Input argument           | Type           | Obligatory? | Description
-------------------------|----------------|-------------|-------------
`incompleteObj`          | Plain object   | yes         | Plain object. Can have nested values.
`schemaObj`              | Plain object   | yes         | Schema object which contains a desired set of values. Can be nested or hold arrays of things.

## Testing

```bash
$ npm test
```

Unit tests use [AVA](https://github.com/avajs/ava) and [JS Standard](https://github.com/feross/standard) notation.

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://github.com/feross/standard) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/code-and-send/object-fill-missing-keys/issues). If you file a pull request, I'll do my best to help you to get it merged promptly. If you have any comments on the code, including ideas how to improve things, don't hesitate to contact me by email.

## Licence

> MIT License (MIT)

> Copyright (c) 2016 Code and Send Ltd, Roy Reveltas

> Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

> The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[travis-img]: https://travis-ci.org/code-and-send/object-fill-missing-keys.svg?branch=master
[travis-url]: https://travis-ci.org/code-and-send/object-fill-missing-keys

[overall-img]: https://www.bithound.io/github/code-and-send/object-fill-missing-keys/badges/score.svg
[overall-url]: https://www.bithound.io/github/code-and-send/object-fill-missing-keys

[deps-img]: https://www.bithound.io/github/code-and-send/object-fill-missing-keys/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/code-and-send/object-fill-missing-keys/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/code-and-send/object-fill-missing-keys/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/code-and-send/object-fill-missing-keys/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/object-fill-missing-keys.svg
[downloads-url]: https://www.npmjs.com/package/object-fill-missing-keys
