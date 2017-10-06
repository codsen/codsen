# json-comb-core

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding-bottom: 30px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="110" align="right"></a>

> Utility library to maintain a set of JSON files

[![Minimum Node version required][node-img]][node-url]
[![Link to npm page][npm-img]][npm-url]
[![Build Status][travis-img]][travis-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Known Vulnerabilities][vulnerabilities-img]][vulnerabilities-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![MIT License][license-badge]][license]

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Idea](#idea)
- [`getKeyset()`](#getkeyset)
  - [input](#input)
  - [output](#output)
  - [example](#example)
- [`enforceKeyset()`](#enforcekeyset)
  - [input](#input-1)
  - [output](#output-1)
  - [example](#example-1)
- [`noNewKeys()`](#nonewkeys)
  - [input](#input-2)
  - [output](#output-2)
  - [example](#example-2)
- [`findUnused()`](#findunused)
  - [input](#input-3)
  - [output](#output-3)
  - [example](#example-3)
- [`sortIfObject()`](#sortifobject)
  - [input](#input-4)
  - [output](#output-4)
  - [example](#example-4)
- [Difference between Normalising JSON and JSON Schemas](#difference-between-normalising-json-and-json-schemas)
- [Testing and Contributing](#testing-and-contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
$ npm i json-comb-core
```

**What you'll get:**

type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
main export - **CommonJS version**, transpiled, contains `require` and `module.exports`  | `main`                | `dist/json-comb-core.cjs.js` | 9KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/json-comb-core.esm.js` | 9KB
**UMD build** for browsers, transpiled and minified, containing `iife`'s and has all dependencies transpiled, baked-in | `browser`             | `dist/json-comb-core.umd.js` | 52KB

## Idea

Imagine, you have a set of JSON files. `json-comb-core` helps to maintain and manage it:

**Normalise those JSON files:**

* Each object should have the same key set - missing keys should be added to each object.
* If an object has nested array, and there are plain objects within, each of those objects should have the same key set as its siblings within the same array.
* For the sake of completeness, let's sort each resulting object's keys too.

For that, we'll need tools to [extract](#getkeyset) a keyset and [enforce](#enforcekeyset) it.

**Alert when JSON's have unique keys**

It's when we can't/won't normalise files, yet we need some insurance. It would be nice to get an alert if my objects contain unique keys that none of the other objects have.

**Find unused keys in a set of JSONs**

A set of JSON files might be normalised, but certain keys can have placeholder values on every single JSON. That means the particular key is unused and probably can be deleted.

## `getKeyset()`

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

### output

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

## `enforceKeyset()`

Reads an input plain object and a keyset schema object and normalises the input plain object, adding any missing keys.

### input

Input argument | Type     | Obligatory? | Description
---------------|----------|-------------|--------------
`input`        | Object   | yes         | What should we normalise?
`schema`       | Object   | yes         | According to what schema should we normalise?

### output

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

## `noNewKeys()`

Reads an array and a reference keyset object, returns an array of zero or more keys that are in the array, but not in keyset.

Practically this is handy to tame the JSON's that we don't/can't normalise. At least we can ensure there are no new keys. For example, all data mapping files could be validated through `noNewKeys()`.

### input

Input argument | Type     | Obligatory? | Description
---------------|----------|-------------|--------------
`input`        | Object   | yes         | What should we check?
`schema`       | Object   | yes         | According to what schema should we normalise?

### output

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

## `findUnused()`

Reads a set of objects (array of plain objects, probably parsed JSON files) and tells, are there any keys throughout the whole set that have only the placeholder values. You can customise the placeholder value via an optional options object.

Practically it is useful to identify unused keys to reduce the JSON data file size. Also, it can help to identify misspelt keys.

### input

Input argument | Type                                | Obligatory? | Description
---------------|-------------------------------------|-------------|--------------
`input`        | Array of zero or more plain objects | yes         | Array of parsed JSON files.
`options`      | Object                              | no          | Options object. See below.

`options` object's key         | Type     | Obligatory? | Default       | Description
-------------------------------|----------|-------------|---------------|----------------------
{                              |          |             |               |
`placeholder`                  | any      | no          | `false`       | What value is being used to mark unused key?
`comments`                     | string (to mark "turned on") or anything falsey (to mark "turned off") | no          | `__comment__` | If any key name in JSON contains this piece of string, it will not be reported as unused (even if it actually was unused). Set it to any falsey value to turn it off.
}                              |          |             |               |

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

## `sortIfObject()`

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

## Difference between Normalising JSON and JSON Schemas

In simple terms, a _JSON Schema_ is a description of all keys and their value types. We're concerned, does all the values have the same types as values in schema. We're not particularly concerned about the **existence** of the keys, we're more concerned is all we've got match the schema.

When you choose to separate email content from templates, content is put into JSON files. When you add a new field in one file, you want that field added on all other files. Same way, if a field has placeholder (normally a Boolean value `false`) on every file, you want to be informed about that. Maybe that key/value pair is unused across all JSON files. You are not concerned very much what _type_ the particular value is in your JSON - normally they're `string`, `number` or `Boolean` anyway - you're more concerned about the **consistence** of the set of your JSON files.

So, normalisation is a process of making bunch of JSON files to have the same keys. JSON Schema is a description of all keys and their value types within a JSON.

When performing a normalisation, all JSON files are read and internally a schema is created, so algorithm knows what keys are missing on a particular file of a set of JSON's. However, that schema is concerned only about keys - its values are set to placeholder.

## Testing and Contributing

```bash
$ npm test
```

If you want to contribute, don't hesitate. If it's a code contribution, please supplement `test.js` with tests covering your code. This library uses `airbnb-base` rules preset of `eslint` with few exceptions^ and follows the Semver rules.

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/codsen/string-collapse-white-space/issues). If you file a pull request, I'll do my best to help you to get it quickly. If you have any comments on the code, including ideas how to improve things, just email me.

<small>^ 1. No semicolons. 2. Allow plus-plus in `for` loops. See `./eslintrc`</small>

## Licence

MIT License (MIT)

Copyright (c) 2017 Codsen Ltd, Roy Revelt

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[node-img]: https://img.shields.io/node/v/json-comb-core.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/json-comb-core

[npm-img]: https://img.shields.io/npm/v/json-comb-core.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/json-comb-core

[travis-img]: https://img.shields.io/travis/codsen/json-comb-core.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/json-comb-core

[cov-img]: https://coveralls.io/repos/github/codsen/json-comb-core/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/json-comb-core?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/json-comb-core.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/json-comb-core

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/json-comb-core.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/json-comb-core/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/json-comb-core

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/json-comb-core.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/json-comb-core/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/json-comb-core.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/json-comb-core

[vulnerabilities-img]: https://snyk.io/test/github/codsen/json-comb-core/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/json-comb-core


[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/json-comb-core

[license-badge]: https://img.shields.io/npm/l/json-comb-core.svg?style=flat-square
[license]: https://github.com/codsen/json-comb-core/blob/master/license.md
