# object-flatten-all-arrays

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> Merge and flatten any arrays found in all values within plain objects

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
- [Purpose](#purpose)
- [For example](#for-example)
- [API](#api)
  - [API - Input](#api---input)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```sh
$ npm i object-flatten-all-arrays
```

```js
// consume as a CommonJS require:
const flattenAllArrays = require('object-flatten-all-arrays')
// or as an ES Module:
import flattenAllArrays from 'object-flatten-all-arrays'
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled, contains `require` and `module.exports` | `main`                | `dist/object-flatten-all-arrays.cjs.js` | 2&nbsp;KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/object-flatten-all-arrays.esm.js` | 2&nbsp;KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/object-flatten-all-arrays.umd.js` | 35&nbsp;KB

**[⬆ &nbsp;back to top](#)**

## Purpose

Recursively traverse the cloned input and merge all plain objects within each array.

## For example

```js
const flattenAllArrays = require('object-flatten-all-arrays')
const object = {
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
    },
  ]
}
const flattened = flattenAllArrays(object)
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

**[⬆ &nbsp;back to top](#)**

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

**[⬆ &nbsp;back to top](#)**

## Contributing

Hi! 99% of people in the society are passive - consumers. They wait for others to take action, they prefer to blend in. The remaining 1% are proactive citizens who will _do_ something rather than _wait_. If you are one of that 1%, you're in luck because I am the same and _together_ we can make something happen.

* If you **want a new feature** in this package or you would like to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/object-flatten-all-arrays/issues). Also, you can [email me](mailto:roy@codsen.com). Just let it out.

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/object-flatten-all-arrays/issues). Alternatively, you can [email me](mailto:roy@codsen.com).

* If you don't like the code in here and would like to **give an advice** about how something could be done better, please do. Same drill - [GitHub issues](https://github.com/codsen/object-flatten-all-arrays/issues) or [email](mailto:roy@codsen.com), your choice.

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. I'll do my best to merge it quickly. Code style is `airbnb`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2017 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/object-flatten-all-arrays.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/object-flatten-all-arrays

[npm-img]: https://img.shields.io/npm/v/object-flatten-all-arrays.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/object-flatten-all-arrays

[travis-img]: https://img.shields.io/travis/codsen/object-flatten-all-arrays.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/object-flatten-all-arrays

[cov-img]: https://coveralls.io/repos/github/codsen/object-flatten-all-arrays/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/object-flatten-all-arrays?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/object-flatten-all-arrays.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/object-flatten-all-arrays

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/object-flatten-all-arrays.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/object-flatten-all-arrays/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/object-flatten-all-arrays

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/object-flatten-all-arrays.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/object-flatten-all-arrays/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/object-flatten-all-arrays/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/object-flatten-all-arrays

[downloads-img]: https://img.shields.io/npm/dm/object-flatten-all-arrays.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/object-flatten-all-arrays

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/object-flatten-all-arrays

[license-img]: https://img.shields.io/npm/l/object-flatten-all-arrays.svg?style=flat-square
[license-url]: https://github.com/codsen/object-flatten-all-arrays/blob/master/license.md
