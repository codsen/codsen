# object-flatten-all-arrays

<a href="https://github.com/feross/standard" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Merge and flatten any arrays found in all values within plain objects

[![Build Status][travis-img]][travis-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Downloads/Month][downloads-img]][downloads-url]

## Install

```sh
$ npm install --save object-flatten-all-arrays
```

## Purpose

This library recursively walks through the input (nested or not nested array, object, whatever) and look for arrays which are values in plain objects. Then it will scan contents of those arrays. If there are multiple plain objects inside, it will merge them.

In practice this library is used to extract the schema from a set of JSON files. The so called "schema" is the object which is has a superset of keys taken from one or many objects. Schema then can be matched across a set of JSON files — missing key/value pairs filled and all keys sorted.

## Use

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
flatten(input)
```

### API - Input

Input argument           | Type           | Obligatory? | Description
-------------------------|----------------|-------------|-------------
`input`                  | Whatever       | yes         | AST tree, or object or array or whatever. Can be deeply-nested. Hopefully contains some plain objects.

## Testing

```bash
$ npm test
```

Unit tests use [AVA](https://github.com/avajs/ava) and [JS Standard](https://github.com/feross/standard) notation.

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://github.com/feross/standard) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/code-and-send/object-flatten-all-arrays/issues). If you file a pull request, I'll do my best to help you to get it merged in a timely manner. If you have any comments on the code, including ideas how to improve things, don't hesitate to contact me by email.

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

[travis-img]: https://travis-ci.org/code-and-send/object-flatten-all-arrays.svg?branch=master
[travis-url]: https://travis-ci.org/code-and-send/object-flatten-all-arrays

[overall-img]: https://www.bithound.io/github/code-and-send/object-flatten-all-arrays/badges/score.svg
[overall-url]: https://www.bithound.io/github/code-and-send/object-flatten-all-arrays

[deps-img]: https://www.bithound.io/github/code-and-send/object-flatten-all-arrays/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/code-and-send/object-flatten-all-arrays/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/code-and-send/object-flatten-all-arrays/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/code-and-send/object-flatten-all-arrays/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/object-flatten-all-arrays.svg
[downloads-url]: https://www.npmjs.com/package/object-flatten-all-arrays
