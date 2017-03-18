# json-comb-core

<a href="https://github.com/feross/standard" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Enforce multiple JSON files have the same keys

[![Build Status][travis-img]][travis-url]
[![Coverage Status][cov-img]][cov-url]
[![bitHound Score][bithound-img]][bithound-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Downloads/Month][downloads-img]][downloads-url]

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Idea](#idea)
- [API](#api)
  - [.find()](#find)
  - [.get()](#get)
  - [.set()](#set)
  - [.drop()](#drop)
  - [.info()](#info)
  - [.del()](#del)
  - [.flatten()](#flatten)
- [Unit testing and code coverage](#unit-testing-and-code-coverage)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
$ npm i -S json-comb-core
```

## Idea

Imagine, we have a set of objects (we just read few JSON files). We want to normalise those JSON files:

* Each object should have the same key set — missing keys should be added to each object.
* If an object has nested array, and there are plain objects within, each of those objects should have the same key set as its siblings within the same array.
* For the sake of completeness, let's sort each resulting object's keys too.

This library is meant to be used as a core for other libraries: plugins, front-end web apps or whatnot. It's DRY'er this way.

## getKeyset()

Reads an array of plain objects and extracts a schema keyset from them.

### input

Input argument   | Type                   | Obligatory? | Description
-----------------|------------------------|-------------|--------------
`input`          | Array of plain objects | yes         | AST tree, or object or array or whatever. Can be deeply-nested.
`options`        | Object                 | no          | Options object. See below.

Input argument   | Value's type | Obligatory? | Default value   | Description
-----------------|--------------|-------------|-----------------|--------------
{                |              |             |                 |
`placeholder`    | anything     | no          | `false` (bool.) | When we add a key, what its value should be? If you set here anything, it will be used. Otherwise, Boolean `false` will be set.
}                |              |             |                 |

For example, keeping placeholder the default:

```js
var schema = getKeyset([
  {
    a: 'a',
    b: 'c',
    c: {
      d: 'd',
      e: 'e'
    }
  },
  {
    a: 'a'
  },
  {
    c: {
      f: 'f'
    }
  }
])
console.log('schema = ' + JSON.stringify(schema, null, 4))
// => {
//      a: false,
//      b: false,
//      c: {
//        d: false,
//        e: false,
//        f: false
//      }
//    }
```

Customising the placeholder:

```js
var schema = getKeyset([
    {
      a: 'a',
      b: 'c',
      c: {
        d: 'd',
        e: 'e'
      }
    },
    {
      a: 'a'
    },
    {
      c: {
        f: 'f'
      }
    }
  ],
  { placeholder: '' }
)
console.log('schema = ' + JSON.stringify(schema, null, 4))
// => {
//      a: '',
//      b: '',
//      c: {
//        d: '',
//        e: '',
//        f: ''
//      }
//    }
```

### ouput

A plain object, which can be used in `enforceKeyset()`. See below.

## enforceKeyset()

Reads an input plain object and a keyset schema object and normalises the input object

### input

Input argument | Type     | Obligatory? | Description
---------------|----------|-------------|--------------
`input`        | Object   | yes         | What to normalise?
`schema`       | Object   | yes         | According to what schema to normalise?

### ouput

A clone of an input object, with exactly the same key set as the `schema` object.

For example,

```js
var inputObj = {
  a: 'ccc'
}
var anotherObj = {
  a: 'aaa',
  b: 'bbb'
}
var schema = getKeyset([ inputObj, anotherObj ]) // <= notice both are fed via an array

inputObj = enforceKeyset( inputObj, schema )
console.log('inputObj = ' + JSON.stringify(inputObj, null, 4))
// => {
//      a: 'ccc',
//      b: false
//    }
```

## Unit testing and code coverage

```bash
$ npm test
```

Unit tests use [AVA](https://github.com/avajs/ava) and [JS Standard](https://github.com/feross/standard) notation. Unit test code coverage is calculated using [Istanbul CLI](https://www.npmjs.com/package/nyc).

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://github.com/feross/standard) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/code-and-send/json-comb-core/issues). If you file a pull request, I'll do my best to help you to get it merged as soon as possible. If you have any comments on the code, including ideas how to improve something, don't hesitate to contact me by email.

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

[travis-img]: https://travis-ci.org/code-and-send/json-comb-core.svg?branch=master
[travis-url]: https://travis-ci.org/code-and-send/json-comb-core

[cov-img]: https://coveralls.io/repos/github/code-and-send/json-comb-core/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/code-and-send/json-comb-core?branch=master

[bithound-img]: https://www.bithound.io/github/code-and-send/json-comb-core/badges/score.svg
[bithound-url]: https://www.bithound.io/github/code-and-send/json-comb-core

[deps-img]: https://www.bithound.io/github/code-and-send/json-comb-core/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/code-and-send/json-comb-core/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/code-and-send/json-comb-core/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/code-and-send/json-comb-core/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/json-comb-core.svg
[downloads-url]: https://www.npmjs.com/package/json-comb-core
