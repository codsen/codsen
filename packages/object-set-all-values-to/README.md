# object-set-all-values-to

<a href="https://github.com/feross/standard" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Recursively walk the input and set all found values in plain objects to something

[![Build Status][travis-img]][travis-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Coverage Status][cov-img]][cov-url]
[![Downloads/Month][downloads-img]][downloads-url]

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Purpose](#purpose)
- [Use](#use)
- [API](#api)
  - [API - Input](#api---input)
- [Testing](#testing)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```sh
$ npm install --save object-set-all-values-to
```

## Purpose

Take any input: nested array, nested plain object or whatever really, no matter how deeply nested. Walk through it recursively and if you find any plain objects, assign **all their keys** to a given second input's argument OR default, `false`.

I needed this library to overwrite all values to be `false` on JSON schema objects, so that later when I copy from key/value pairs from schema, values are equal to `false` and I don't need to prep them further.

This library is well-tested and is being used in commercial projects.

## Use

```js
var setAllValuesTo = require('object-set-all-values-to')

console.log(setAllValuesTo({a: 'b', c: 'd'}))
// => {a: false, c: false}

console.log(setAllValuesTo({a: 'b', c: 'd'}, 'x'))
// => {a: 'x', c: 'x'}

console.log(setAllValuesTo({a: 'b', c: 'd'}, ['x']))
// => {a: ['x'], c: ['x']}
```

## API

```js
setAllValuesTo(input, value)
```

### API - Input

Input argument           | Type           | Obligatory? | Default     | Description
-------------------------|----------------|-------------|-------------|-------------
`input`                  | Whatever       | yes         | `undefined` | AST tree, or object or array or whatever. Can be deeply-nested. Hopefully contains some plain objects.
`value`                  | Whatever       | no          | `false`     | Assign all found plain object values to this

## Testing

```bash
$ npm test
```

For unit tests we use [AVA](https://github.com/avajs/ava), [Istanbul CLI](https://github.com/istanbuljs/nyc) and [JS Standard](https://github.com/feross/standard) notation.

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://github.com/feross/standard) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/code-and-send/object-set-all-values-to/issues). If you file a pull request, I'll do my best to help you to get it merged in a timely manner. If you have any comments on the code, including ideas how to improve things, don't hesitate to contact me by email.

## Licence

> MIT License (MIT)

> Copyright (c) 2017 Codsen Ltd, Roy Reveltas

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

[travis-img]: https://travis-ci.org/code-and-send/object-set-all-values-to.svg?branch=master
[travis-url]: https://travis-ci.org/code-and-send/object-set-all-values-to

[overall-img]: https://www.bithound.io/github/code-and-send/object-set-all-values-to/badges/score.svg
[overall-url]: https://www.bithound.io/github/code-and-send/object-set-all-values-to

[deps-img]: https://www.bithound.io/github/code-and-send/object-set-all-values-to/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/code-and-send/object-set-all-values-to/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/code-and-send/object-set-all-values-to/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/code-and-send/object-set-all-values-to/master/dependencies/npm

[cov-img]: https://coveralls.io/repos/github/code-and-send/object-set-all-values-to/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/code-and-send/object-set-all-values-to?branch=master

[downloads-img]: https://img.shields.io/npm/dm/object-set-all-values-to.svg
[downloads-url]: https://www.npmjs.com/package/object-set-all-values-to
