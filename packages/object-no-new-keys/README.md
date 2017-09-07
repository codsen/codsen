# object-no-new-keys

<a href="https://standardjs.com" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Check is a plain object (AST) has no unique keys, not present in a reference object (another AST)

[![Link to npm page][npm-img]][npm-url]
[![Build Status][travis-img]][travis-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Coverage Status][cov-img]][cov-url]
[![Known Vulnerabilities][vulnerabilities-img]][vulnerabilities-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Test in browser][runkit-img]][runkit-url]

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Idea](#idea)
- [API](#api)
  - [options](#options)
- [Two modes](#two-modes)
- [For example](#for-example)
- [Competition](#competition)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
$ npm i -S object-no-new-keys
```

## Idea

Check, does a `given thing` (probably a nested plain object) have any keys, not present in a `reference thing` (probably an another nested plain object). I'm using a term "thing" because this library uses recursive algorithm which means both inputs can be _whatever_-type (string, plain object or an array).

This library will try to perform a **deep, recursive traversal** of both inputs and will not mutate the input arguments.

It is meant for work with AST's, parsed HTML or JSON, the cases where there are _objects within arrays within objects_.

Personally, I use this library to look for any rogue keys in email template content files, in JSON format.

## API

**objectNoNewKeys(input, reference\[, opts])**

Returns zero or more long array of the paths to each key/element in the `input` which does not exist in `reference`.

### options

Type: `object` - an optional options object.

**Defaults**:

```js
    {
      mode: 2
    }
```

`options` object's key | Type           | Obligatory? | Default     | Description
-----------------------|----------------|-------------|-------------|----------------------
{                      |                |             |             |
`mode`                 | Integer number | no          | `2`         | Choose mode: `1` or `2`. See below.
{                      |                |             |             |

## Two modes

This library has two modes:

1. Strict comparing, having no assumptions about the `reference`.
2. Comparing, assuming that the `reference` will be NORMALISED.

By _normalised_ I mean if any arrays have object children, those objects have the same keys.

These two modes mainly concern the case when both `input` and `reference` have an array, but `reference` has less elements and there's nothing to compare the `input` element to:

```js
var input = {
  a: [
    { // object number 1
      b: 'b1',
      c: 'c1'
    },
    { // object number 2
      b: 'b2',
      c: 'c2',
      x: 'y'
    }
  ]
}

var reference = {
  a: [
    { // << just one object!
      b: 'b3',
      c: 'c3'
    }
  ]
}
```

First mode will report that `a[1].b` and `a[1].c` and `a[1].x` are all rogue keys, not present in `reference.`

Second mode will anticipate that `reference` will be normalised, that is, we can **compare input array elements to the first element of array in reference**. We'll get the same thing — all objects within an array should have the same keys. This means, `input` has only one rogue key — `a[1].x`. And algotithm will identify it by comparing `input` object `a[1]` to `reference` object `a[0]` — second/third/whatever element in the `input` to **ALWAYS THE FIRST ELEMENT IN REFERENCE**, `a[0]`.

I need the second mode, but I give people chance to use first mode as well. Maybe somebody will find it useful.

## For example

```js
const nnk = require('object-no-new-keys')
var res = nnk(
  {
    a: 'a',
    b: 'b',
    c: 'c'
  },
  {
    c: 'z'
  }
)
console.log('nnk = ' + JSON.stringify(nnk, null, 4))
// => ['a', 'b']
```

works with arrays too:

```js
const nnk = require('object-no-new-keys')
var res = nnk(
  { //<<< input
    a: [
      {
        b: 'aaa',
        d: 'aaa', // rogue key, record it
        f: 'fff'  // another rogue key, record it
      },
      {
        c: 'aaa',
        k: 'kkk' // yet another rogue key, record it
      }
    ],
    x: 'x' // rogue too
  },
  { // <<< reference
    a: [
      {
        b: 'bbb',
        c: 'ccc'
      },
      {
        b: 'yyy',
        c: 'zzz'
      }
    ]
  }
)
console.log('res = ' + JSON.stringify(res, null, 4))
// => ['a[0].d', 'a[0].f', 'a[1].k', 'x']
```

## Competition

You could try to use a [missing-deep-keys](https://github.com/vladgolubev/missing-deep-keys) but it won't work if your inputs have **arrays**. For posterity, the algorithm of it is quite wise: run `lodash.difference` against [deep-keys](https://www.npmjs.com/package/deep-keys)-flattened, stringified key schemas of both object and reference. However, `deep-keys` does not support **arrays**, so it's not that easy.

In short, `missing-deep-keys` is for cases when you have only objects-within-objects. `object-no-new-keys` is for work with parsed HTML (AST's) or JSON. Higher-end.

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://standardjs.com) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/codsen/object-no-new-keys/issues). If you file a pull request, I'll do my best to help you to get it merged as soon as possible. If you have any comments on the code, including ideas how to improve something, don't hesitate to contact me by email.

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

[npm-img]: https://img.shields.io/npm/v/object-no-new-keys.svg
[npm-url]: https://www.npmjs.com/package/object-no-new-keys

[travis-img]: https://travis-ci.org/codsen/object-no-new-keys.svg?branch=master
[travis-url]: https://travis-ci.org/codsen/object-no-new-keys

[cov-img]: https://coveralls.io/repos/github/codsen/object-no-new-keys/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/codsen/object-no-new-keys?branch=master

[overall-img]: https://www.bithound.io/github/codsen/object-no-new-keys/badges/score.svg
[overall-url]: https://www.bithound.io/github/codsen/object-no-new-keys

[deps-img]: https://www.bithound.io/github/codsen/object-no-new-keys/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/codsen/object-no-new-keys/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/codsen/object-no-new-keys/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/codsen/object-no-new-keys/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/object-no-new-keys.svg
[downloads-url]: https://www.npmjs.com/package/object-no-new-keys

[vulnerabilities-img]: https://snyk.io/test/github/codsen/object-no-new-keys/badge.svg
[vulnerabilities-url]: https://snyk.io/test/github/codsen/object-no-new-keys

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg
[deps2d-url]: http://npm.anvaka.com/#/view/2d/object-no-new-keys

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg
[runkit-url]: https://npm.runkit.com/object-no-new-keys
