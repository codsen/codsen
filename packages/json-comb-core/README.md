# json-comb-core

<a href="https://standardjs.com" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Utility library to maintain a set of JSON files

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
  - [example](#example)
- [enforceKeyset()](#enforcekeyset)
  - [input](#input-1)
  - [ouput](#ouput-1)
  - [example](#example-1)
- [noNewKeys()](#nonewkeys)
  - [input](#input-2)
  - [ouput](#ouput-2)
  - [example](#example-2)
- [findUnused()](#findunused)
  - [input](#input-3)
  - [output](#output)
  - [example](#example-3)
- [sortIfObject()](#sortifobject)
  - [input](#input-4)
  - [output](#output-1)
  - [example](#example-4)
- [Unit testing and code coverage](#unit-testing-and-code-coverage)
- [Difference between Normalising JSON and JSON Schemas](#difference-between-normalising-json-and-json-schemas)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
$ npm i json-comb-core
```

## Idea

Imagine, you have a set of JSON files. `json-comb-core` helps to maintain and manage it:

**Normalise those JSON files:**

* Each object should have the same key set - missing keys should be added to each object.
* If an object has nested array, and there are plain objects within, each of those objects should have the same key set as its siblings within the same array.
* For the sake of completeness, let's sort each resulting object's keys too.

For that, we'll need tools to [extract](#getkeyset) a keyset and [enforce](#enforcekeyset) it.

**Alert when JSON's have unique keys**

It's when we can't/won't normalise files, yet we need some insurance. It would be nice to get an alert if my objects contain unique keys that none of the other objects has.

**Find unused keys in a set of JSONs**

A set of JSON files might be normalised, but certain keys can have placeholder values on every single JSON. That means the particular key is unused and probably can be deleted.

## getKeyset()

This function produces a reference object according to which you can normalise JSON files.

It reads an array of plain objects (parsed JSON files) and extracts a "schema keyset", a plain object, from them.

Technically speaking, a "schema keyset" is a superset of all objects. Two rules:

1. Each object of the same level between different JSON files should have same keys.
2. If an array has objects, those objects should have the same keys. If the array is a value and it is missing in a certain JSON, it gets filled with only one object.

The merging is done on a premise to retain [as much information](https://github.com/codsen/object-merge-advanced) after merging as possible.

### input

Input argument   | Type                   | Obligatory? | Description
-----------------|------------------------|-------------|--------------
`input`          | Array of plain objects | yes         | AST tree, or object or array or whatever. Can be deeply-nested.
`options`        | Object                 | no          | Options object. See below.

`options` object's key | Type  | Obligatory? | Default   | Description
-----------------------|-------|-------------|-----------|----------------------
{                      |       |             |           |
`placeholder`          | Any   | no          | `false`   | When adding a missing key, this will be assigned to its value.
}                      |       |             |           |

### ouput

A plain object, which can be used in `enforceKeyset()`. See below.

### example

For example, keeping placeholder the default:

```js
const getKeyset = require('json-comb-core').getKeyset
let schema = getKeyset([
  { // <- object #1
    a: 'a',
    b: 'c',
    c: {
      d: 'd',
      e: 'e'
    }
  },
  { // <- object #2
    a: 'a'
  },
  { // <- object #3
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
const getKeyset = require('json-comb-core').getKeyset
let schema = getKeyset([
    { // <- object #1
      a: 'a',
      b: 'c',
      c: {
        d: 'd',
        e: 'e'
      }
    },
    { // <- object #2
      a: 'a'
    },
    { // <- object #3
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

## enforceKeyset()

Reads an input plain object and a keyset schema object and normalises the input plain object, adding any missing keys.

### input

Input argument | Type     | Obligatory? | Description
---------------|----------|-------------|--------------
`input`        | Object   | yes         | What should we normalise?
`schema`       | Object   | yes         | According to what schema should we normalise?

### ouput

A clone of an input object, with the same key set as the `schema` object.

### example

```js
const getKeyset = require('json-comb-core').getKeyset
const enforceKeyset = require('json-comb-core').enforceKeyset
let inputObj = {
  a: 'ccc'
}
let anotherObj = {
  a: 'aaa',
  b: 'bbb'
}
let schema = getKeyset([ inputObj, anotherObj ]) // <= notice both are fed via an array

inputObj = enforceKeyset( inputObj, schema )
console.log('inputObj = ' + JSON.stringify(inputObj, null, 4))
// => {
//      a: 'ccc',
//      b: false
//    }
```

## noNewKeys()

Reads an array and a reference keyset object, returns an array of zero or more keys that are in the array, but not in keyset.

Practically this is handy to tame the JSON's that we don't/can't normalise. At least we can ensure there are no new keys. For example, all data mapping files could be validated through `noNewKeys()`.

### input

Input argument | Type     | Obligatory? | Description
---------------|----------|-------------|--------------
`input`        | Object   | yes         | What should we check?
`schema`       | Object   | yes         | According to what schema should we normalise?

### ouput

An array of zero or more paths.

### example

We are going to catch the rogue key `b`:

```js
const noNewKeys = require('json-comb-core').noNewKeys
let res = noNewKeys(
  { // <- input we're checking
    a: 'a',
    b: 'b',
    c: 'c'
  },
  { // <- reference keyset
    a: 'aaa',
    c: 'ccc'
  }
)
console.log('res = ' + JSON.stringify(res, null, 4))
// => ['b']
```

More advanced example:

```js
const noNewKeys = require('json-comb-core').noNewKeys
let res = noNewKeys(
  { // <- input we're checking
    z: [
      {
        a: 'a',
        b: 'b',
        c: 'c'
      },
      {
        a: false,
        b: false,
        c: 'c'
      }
    ]
  },
  { // <- reference keyset
    z: [
      {
        a: 'a',
        b: 'b'
      },
      {
        a: false,
        b: false
      }
    ]
  }
)
console.log('res = ' + JSON.stringify(res, null, 4))
// => ['z[0].c', 'z[1].c']
```

## findUnused()

Reads a set of objects (array of plain objects, probably parsed JSON files) and tells, are there any keys throughout the whole set that have only the placeholder values. You can customise the placeholder value via an optional options object.

Practically it is useful to identify unused keys to reduce the JSON data file size. Also, it can help to identify misspelt keys.

As a rule, it will flag up all comments, because they are always equal to a placeholder (`false` in my case), so take it with a grain of salt. Also, sometimes you want to keep keys even if they are unused for consistency purposes. Sometimes modules are repeated, and it's handy to see all the available keys.

### input

Input argument | Type                                | Obligatory? | Description
---------------|-------------------------------------|-------------|--------------
`input`        | Array of zero or more plain objects | yes         | Array of parsed JSON files.
`options`      | Object                              | no          | Options object. See below.

`options` object's key         | Type     | Obligatory? | Default   | Description
-------------------------------|----------|-------------|-----------|----------------------
{                              |          |             |           |
`placeholder`                  | Any      | no          | `false`   | What value is being used to mark unused key?
}                              |          |             |           |

### output

An array of zero or more paths leading to keys which are either missing or have values equal to `opts.placeholder`.

### example

```js
const findUnused = require('json-comb-core').findUnused
let res = findUnused(
  [
    { // <- object #1
      a: false,
      b: 'bbb1',
      c: false
    },
    { // <- object #2
      a: 'aaa',
      b: 'bbb2',
      c: false
    },
    {} // <- object #3
  ]
)
console.log('res = ' + JSON.stringify(res, null, 4))
// => ['c']
```

This function will work on arrays of both normalised and not normalised object sets.

More complex example:

```js
const findUnused = require('json-comb-core').findUnused
let res = findUnused(
  [
    {
      a: [
        {
          k: false,
          l: false,
          m: false
        },
        {
          k: 'k',
          l: false,
          m: 'm'
        }
      ],
      b: 'bbb1',
      c: false
    },
    {
      a: [
        {
          k: 'k',
          l: false,
          m: 'm'
        },
        {
          k: 'k',
          l: false,
          m: 'm'
        }
      ],
      b: 'bbb2',
      c: false
    },
    {b: false},
    {c: false}
  ]
)
console.log('res = ' + JSON.stringify(res, null, 4))
// => ['c', 'a[0].l']
```

## sortIfObject()

This is an auxiliary function to help with sorting object keys. Yes, object keys can be sorted. This function is flexible if non-object is passed, it's returned without messing it up. You can freely assign things to the result of this function.

### input

Input argument | Type     | Obligatory? | Description
---------------|----------|-------------|--------------
`input`        | Whatever | no          | If it's an object, its keys will get sorted

It is not recursive or deep function. Only topmost level keys will get sorted.

### output

If the input were a plain object, the output would be a clone of it, with keys sorted. Otherwise, it will be the same input, returned.

### example

```js
const sortIfObject = require('json-comb-core').sortIfObject
let res = sortIfObject(
  {
    a: 'a',
    c: 'c',
    b: 'b'
  }
)
console.log('res = ' + JSON.stringify(res, null, 4))
// => {
//      a: 'a',
//      b: 'b',
//      c: 'c'
//    }
```

## Unit testing and code coverage

```bash
$ npm test
```

Unit tests use [AVA](https://github.com/avajs/ava) and [JS Standard](https://standardjs.com) notation. Unit test code coverage is calculated using [Istanbul CLI](https://www.npmjs.com/package/nyc).

## Difference between Normalising JSON and JSON Schemas

In simple terms, a _JSON Schema_ is a way to define and enforce key presence and their value types. It is used when dealing with reading/writing objects to network sources.

JSON file normalisation (what this library does, among other things) is making so that every JSON in a given set has the same keys as all others. Missing values are simply set to a placeholder (normally Boolean `false`).

See the difference between the two concepts?

JSON Schema is usually set. You've agreed on the API and now enforce it. Data files, on the other hand, have evolving API - new keys are added (and removed) regularly, and we're concerned only to keep the keysets the same.

Schemas are used when dealing with API's and network. Normalisation is used when dealing with local files on a hard drive.

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
