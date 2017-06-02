# json-comb-core

<a href="https://standardjs.com" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Utility library for operations with JSON files

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
- [getKeyset()](#getkeyset)
  - [input](#input)
  - [ouput](#ouput)
- [enforceKeyset()](#enforcekeyset)
  - [input](#input-1)
  - [ouput](#ouput-1)
- [Unit testing and code coverage](#unit-testing-and-code-coverage)
- [Difference between Normalising JSON and JSON Schemas](#difference-between-normalising-json-and-json-schemas)
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

This function produces a reference object according to which you can normalise JSON files.

It reads an array of plain objects (parsed JSON files) and extracts a "schema keyset", a plain object, from them.

Technically speaking, a "schema keyset" is a superset of all objects. Two rules:

1. Each object of the same level between different JSON files should have same keys.
2. If array has objects, those objects should have exactly the same keys. If the array is a value and it is missing in a certain JSON, it gets filled with only one object.

The merging is done on a premise to retain [as much information](https://github.com/codsen/object-merge-advanced) after merging as possible.

### input

Input argument   | Type                   | Obligatory? | Description
-----------------|------------------------|-------------|--------------
`input`          | Array of plain objects | yes         | AST tree, or object or array or whatever. Can be deeply-nested.
`options`        | Object                 | no          | Options object. See below.

`options` object's key         | Type     | Obligatory? | Default         | Description
-------------------------------|----------|-------------|-----------------|----------------------
{                              |          |             |                 |
`placeholder`                  | Any      | no          | `false` (bool.) | Instructs to skip all and any checks on these keys.
}                              |          |             |                 |

For example, keeping placeholder the default:

```js
var schema = getKeyset([
  { // < plain object No.1
    a: 'a',
    b: 'c',
    c: {
      d: 'd',
      e: 'e'
    }
  },
  { // < plain object No.2
    a: 'a'
  },
  { // < plain object No.3
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

Reads an input plain object and a keyset schema object and normalises the input plain object

### input

Input argument | Type     | Obligatory? | Description
---------------|----------|-------------|--------------
`input`        | Object   | yes         | What should we normalise?
`schema`       | Object   | yes         | According to what schema should we normalise?

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

Unit tests use [AVA](https://github.com/avajs/ava) and [JS Standard](https://standardjs.com) notation. Unit test code coverage is calculated using [Istanbul CLI](https://www.npmjs.com/package/nyc).

## Difference between Normalising JSON and JSON Schemas

In short, JSON Schema concept is a way to define and enforce keys presence and/or their value types.

JSON file normalisation (what this library does, among other things) is making so that every JSON in a given set has exactly the same keys as all others. Missing values are simply set to a placeholder (normally Boolean `false`).

See the difference between the two concepts?

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://standardjs.com) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/codsen/json-comb-core/issues). If you file a pull request, I'll do my best to help you to get it merged as soon as possible. If you have any comments on the code, including ideas how to improve something, don't hesitate to contact me by email.

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

[travis-img]: https://travis-ci.org/codsen/json-comb-core.svg?branch=master
[travis-url]: https://travis-ci.org/codsen/json-comb-core

[cov-img]: https://coveralls.io/repos/github/codsen/json-comb-core/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/codsen/json-comb-core?branch=master

[bithound-img]: https://www.bithound.io/github/codsen/json-comb-core/badges/score.svg
[bithound-url]: https://www.bithound.io/github/codsen/json-comb-core

[deps-img]: https://www.bithound.io/github/codsen/json-comb-core/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/codsen/json-comb-core/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/codsen/json-comb-core/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/codsen/json-comb-core/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/json-comb-core.svg
[downloads-url]: https://www.npmjs.com/package/json-comb-core
