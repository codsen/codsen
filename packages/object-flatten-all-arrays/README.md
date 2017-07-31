# object-flatten-all-arrays

<a href="https://standardjs.com" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Recursively flatten any arrays found in all values within plain objects

[![Build Status][travis-img]][travis-url]
[![Coverage Status][cov-img]][cov-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Downloads/Month][downloads-img]][downloads-url]

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Purpose](#purpose)
- [For example](#for-example)
- [API](#api)
  - [API - Input](#api---input)
- [Testing](#testing)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```sh
$ npm install --save object-flatten-all-arrays
```

## Purpose

Recursively traverse the cloned input and merge all plain objects within each array.

## For example

```js
var flatten = require('object-flatten-all-arrays')
var object = {
  a: 'a',
  b: 'b',
  c: [
    {
      b: 'b',
      a: 'a'
    },
    {
      d: 'd',
      c: 'c'
    }
  ]
}
var flattened = flatten(object)
console.log('flattened = ' + JSON.stringify(flattened, null, 4))
// => {
// a: 'a',
// b: 'b',
// c: [
//   {
//     a: 'a',
//     b: 'b',
//     c: 'c',
//     d: 'd'
//   }
// ]}
```

## API

```js
flatten(input[, options])
```

Returns the same type thing as given input, only with arrays (recursively) flattened.

### API - Input

None of the input arguments are mutated. Their clones are being used instead.

Input argument           | Type           | Obligatory? | Description
-------------------------|----------------|-------------|-------------
`input`                  | Whatever       | yes         | AST tree, or object or array or whatever. Can be deeply-nested. Hopefully contains some plain objects.
`options`                | Plain object   | no          | Set the options in this object. See below for keys.


`options` object's key                     | Type     | Obligatory? | Default     | Description
-------------------------------------------|----------|-------------|-------------|----------------------
{                                          |          |             |             |
`flattenArraysContainingStringsToBeEmpty`  | Boolean  | no          | `false`     | If any arrays contain strings, flatten them to be empty thing. This is turned off by default, but it's what you actually need most of the time.
}                                          |          |             |             |

## Testing

```bash
$ npm test
```

For unit tests we use [AVA](https://github.com/avajs/ava), [Istanbul CLI](https://github.com/istanbuljs/nyc) and [JS Standard](https://standardjs.com) notation.

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://standardjs.com) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/codsen/object-flatten-all-arrays/issues). If you file a pull request, I'll do my best to help you to get it merged in a timely manner. If you have any comments on the code, including ideas how to improve things, don't hesitate to contact me by email.

## Licence

> MIT License (MIT)

> Copyright (c) 2017 Codsen Ltd, Roy Revelt

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

[travis-img]: https://travis-ci.org/codsen/object-flatten-all-arrays.svg?branch=master
[travis-url]: https://travis-ci.org/codsen/object-flatten-all-arrays

[cov-img]: https://coveralls.io/repos/github/codsen/object-flatten-all-arrays/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/codsen/object-flatten-all-arrays?branch=master

[overall-img]: https://www.bithound.io/github/codsen/object-flatten-all-arrays/badges/score.svg
[overall-url]: https://www.bithound.io/github/codsen/object-flatten-all-arrays

[deps-img]: https://www.bithound.io/github/codsen/object-flatten-all-arrays/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/codsen/object-flatten-all-arrays/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/codsen/object-flatten-all-arrays/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/codsen/object-flatten-all-arrays/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/object-flatten-all-arrays.svg
[downloads-url]: https://www.npmjs.com/package/object-flatten-all-arrays
