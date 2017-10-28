# string-match-left-right

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> Do substrings match what's on the left or right of the given index?

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
- [The API](#the-api)
  - [Each of four functions' API:](#each-of-four-functions-api)
  - [Optional Options Object's API:](#optional-options-objects-api)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

**[⬆ &nbsp;back to top](#)**

## Install

```bash
$ npm i string-match-left-right
```

```js
// CommonJS way:
const { matchLeftIncl, matchRightIncl, matchLeft, matchRight } = require('string-match-left-right')
// ES  Modules way:
import { matchLeftIncl, matchRightIncl, matchLeft, matchRight } from 'string-match-left-right'
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled, contains `require` and `module.exports` | `main`                | `dist/string-match-left-right.cjs.js` | 3 KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/string-match-left-right.esm.js` | 3 KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/string-match-left-right.umd.js` | 17 KB

**[⬆ &nbsp;back to top](#)**

## The API

There are four methods; all have the same arguments of the same type.

**matchLeftIncl()**
**matchRightIncl()**
**matchLeft()**
**matchRight()**

----

**[⬆ &nbsp;back to top](#)**

### Each of four functions' API:

Input argument   | Type                       | Obligatory? | Description
-----------------|----------------------------|-------------|--------------
`str`            | String                     | yes         | Source string to work on
`position`       | Natural number incl. zero  | yes         | Starting index. Can be zero. Otherwise, a natural number.
`whatToMatch`    | String or array of strings | yes         | What should we look for on the particular side, left or right. If array is given, at one or more matches will yield in result `true`
`opts`           | Plain object               | no          | Optional options object. See below.

### Optional Options Object's API:

`options` object's key         | Type     | Obligatory? | Default     | Description
-------------------------------|----------|-------------|-------------|----------------------
{                              |          |             |             |
`i`                            | Boolean  | no          | `false`     | if `false`, it's case sensitive. If `true`, it's insensitive.
}                              |          |             |             |

**Options' defaults**:

```js
{
  i: false
}
```

Options object is sanitized by [check-types-mini](https://github.com/codsen/check-types-mini) which will `throw` if you set options' keys to wrong types or add unrecognized keys.

```js

// K E Y
// -----
// test string with character indexes to help you count:
//
// test string:  abcdefghi
// indexes:      012345678
//
// that is, c is number (term "number" further abbreviated as hash character "#") 2 or i is #8.
//
// we'll be using the same string "abcdefghi" below:

const { matchLeftIncl, matchRightIncl, matchLeft, matchRight } = require('string-match-left-right')

let res1 = matchLeftIncl('abcdefghi', 3, ['bcd']),
// 3rd character is "d" because indexes start from zero.
// We're checking the string to the left of it, "bcd", inclusive of current character ("d").
// This means, "bcd" has to end with existing character and the other chars to the left
// must match exactly:
console.log(`res1 = ${res1}`)
// => res1 = true

let res2 = matchLeft('abcdefghi', 3, ['ab', `zz`]),
// neither "ab" nor "zz" are to the left of 3rd index, "d":
console.log(`res2 = ${res2}`)
// => res2 = false

let res3 = matchRightIncl('abcdefghi', 3, ['def', `zzz`]),
// "def" is to the right of 3rd index (including it), "d":
console.log(`res3 = ${res3}`)
// => res3 = true

let res4 = matchRight('abcdefghi', 3, ['ef', `zz`]),
// One of values, "ef" is exactly to the right of 3rd index, "d":
console.log(`res4 = ${res4}`)
// => res4 = true
```

**[⬆ &nbsp;back to top](#)**

## Contributing

Hi! 99% of society are passive people, consumers. They wait for others to take action, they prefer to blend in. Rest 1% are proactive, vocal (usually also opinionated) citizens who will _do_ something rather than _wait_, hoping others will do it eventually. If you are one of that 1 %, you're in luck because I am the same and together we can make something happen.

* If you want a new feature in this package or you would like to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/string-match-left-right/issues). Also, you can [email me](mailto:roy@codsen.com).

* If you tried to use this library but it misbehaves, or you need an advice setting it up, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/string-match-left-right/issues). Alternatively, you can [email me](mailto:roy@codsen.com).

* If you don't like the code in here and would like to advise how something could be done better, please do. Same drill - [GitHub issues](https://github.com/codsen/string-match-left-right/issues) or [email](mailto:roy@codsen.com), your choice.

* If you would like to add or change some features, just fork it, hack away, and file a pull request. I'll do my best to merge it quickly. Code style is `airbnb`, just without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

## Licence

MIT License (MIT)

Copyright © 2017 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/string-match-left-right.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-match-left-right

[npm-img]: https://img.shields.io/npm/v/string-match-left-right.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/string-match-left-right

[travis-img]: https://img.shields.io/travis/codsen/string-match-left-right.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/string-match-left-right

[cov-img]: https://coveralls.io/repos/github/codsen/string-match-left-right/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/string-match-left-right?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/string-match-left-right.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/string-match-left-right

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/string-match-left-right.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/string-match-left-right/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-match-left-right

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/string-match-left-right.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/string-match-left-right/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/string-match-left-right/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/string-match-left-right

[downloads-img]: https://img.shields.io/npm/dm/string-match-left-right.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-match-left-right

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-match-left-right

[license-img]: https://img.shields.io/npm/l/string-match-left-right.svg?style=flat-square
[license-url]: https://github.com/codsen/string-match-left-right/blob/master/license.md
