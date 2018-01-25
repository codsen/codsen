# object-no-new-keys

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> Check, does a plain object (AST/JSON) has any unique keys, not present in a reference object (another AST/JSON)

[![Minimum Node version required][node-img]][node-url]
[![Link to npm page][npm-img]][npm-url]
[![Build Status][travis-img]][travis-url]
[![Coverage][cov-img]][cov-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Known Vulnerabilities][vulnerabilities-img]][vulnerabilities-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![MIT License][license-img]][license-url]

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Idea](#idea)
- [API](#api)
- [Two modes](#two-modes)
- [For example](#for-example)
- [Competition](#competition)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
npm i object-no-new-keys
```

```js
// consume as a CommonJS require:
const objectNoNewKeys = require('object-no-new-keys')
// or as an ES Module:
import objectNoNewKeys from 'object-no-new-keys'
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/object-no-new-keys.cjs.js` | 4&nbsp;KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/object-no-new-keys.esm.js` | 4&nbsp;KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/object-no-new-keys.umd.js` | 17&nbsp;KB

**[⬆ &nbsp;back to top](#)**

## Idea

Check, does a `given thing` (probably a nested plain object) have any keys, not present in a `reference thing` (probably an another nested plain object). I'm using a term "thing" because this library uses a recursive algorithm which means both inputs can be _whatever_-type (string, plain object or an array).

This library will try to perform a **deep, recursive traversal** of both inputs and will not mutate the input arguments.

It is meant for work with AST's, parsed HTML or JSON, the cases where there are _objects within arrays within objects_.

Personally, I use this library to look for any rogue keys in email template content files, in JSON format.

**[⬆ &nbsp;back to top](#)**

## API

**objectNoNewKeys(input, reference\[, opts])**

Returns zero or more long array of the paths to each key/element in the `input` which does not exist in `reference`.

### `opts` - an Optional Options Object

**Defaults**:

```js
  {
    mode: 2
  }
```

Optional Options Object's key | Type           | Obligatory? | Default     | Description
------------------------------|----------------|-------------|-------------|----------------------
{                             |                |             |             |
`mode`                        | Integer number | no          | `2`         | Choose mode: `1` or `2`. See below.
{                             |                |             |             |

**[⬆ &nbsp;back to top](#)**

## Two modes

This library has two modes:

1. Strict comparing, having no assumptions about the `reference`.
2. Comparing, assuming that the `reference` will be NORMALISED.

By "_normalised_" I mean if any arrays have object children, those objects have the same keys.

These two modes mainly concern the case when both `input` and `reference` have an array, but `reference` has fewer elements and there's nothing to compare the `input` element to:

```js
const input = {
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

const reference = {
  a: [
    { // << just one object!
      b: 'b3',
      c: 'c3'
    }
  ]
}
```

First mode will report that `a[1].b` and `a[1].c` and `a[1].x` are all rogue keys, not present in `reference.`

The second mode will anticipate that `reference` will be normalised, that is, we can **compare input array elements to the first element of an array in reference**. We'll get the same thing — all objects within an array should have the same keys. This means, `input` has only one rogue key — `a[1].x`. And algorithm will identify it by comparing `input` object `a[1]` to `reference` object `a[0]` — second/third/whatever element in the `input` to **ALWAYS THE FIRST ELEMENT IN REFERENCE**, `a[0]`.

I need the second mode, but I give people chance to use the first mode as well. Maybe somebody will find it useful.

**[⬆ &nbsp;back to top](#)**

## For example

```js
const nnk = require('object-no-new-keys')
const res = nnk(
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
const res = nnk(
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

**[⬆ &nbsp;back to top](#)**

## Competition

You could try to use a [missing-deep-keys](https://github.com/vladgolubev/missing-deep-keys), but it won't work if your inputs have **arrays**. For posterity, the algorithm of it is quite wise: run `lodash.difference` against [deep-keys](https://www.npmjs.com/package/deep-keys)-flattened stringified key schemas of both object and reference. However, `deep-keys` does not support **arrays**, so it's not that easy.

In short, `missing-deep-keys` is for cases when you have only objects-within-objects. `object-no-new-keys` is for work with parsed HTML (AST's) or JSON. Higher-end.

**[⬆ &nbsp;back to top](#)**

## Contributing

* If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/object-no-new-keys/issues).

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/object-no-new-keys/issues).

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. Code style is `airbnb-base`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt


[node-img]: https://img.shields.io/node/v/object-no-new-keys.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/object-no-new-keys

[npm-img]: https://img.shields.io/npm/v/object-no-new-keys.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/object-no-new-keys

[travis-img]: https://img.shields.io/travis/codsen/object-no-new-keys.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/object-no-new-keys

[cov-img]: https://coveralls.io/repos/github/codsen/object-no-new-keys/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/object-no-new-keys?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/object-no-new-keys.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/object-no-new-keys

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/object-no-new-keys.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/object-no-new-keys/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/object-no-new-keys

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/object-no-new-keys.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/object-no-new-keys/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/object-no-new-keys/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/object-no-new-keys

[downloads-img]: https://img.shields.io/npm/dm/object-no-new-keys.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/object-no-new-keys

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/object-no-new-keys

[license-img]: https://img.shields.io/npm/l/object-no-new-keys.svg?style=flat-square
[license-url]: https://github.com/codsen/object-no-new-keys/blob/master/license.md
