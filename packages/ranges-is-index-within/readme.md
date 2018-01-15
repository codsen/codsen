# ranges-is-index-within

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> Efficiently checks if index is within any of the given ranges

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

## Install

```bash
npm i ranges-is-index-within
```

```js
// consume via a CommonJS require:
const rangesIsIndexWithin = require('ranges-is-index-within')
// or as an ES Module:
import rangesIsIndexWithin from 'ranges-is-index-within'
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/ranges-is-index-within.cjs.js` | 9&nbsp;KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/ranges-is-index-within.esm.js` | 9&nbsp;KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/ranges-is-index-within.umd.js` | 22&nbsp;KB

**[⬆ &nbsp;back to top](#)**

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [What it does](#what-it-does)
- [Example](#example)
- [The algorithm](#the-algorithm)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## What it does

Imagine you have a natural number (let's call it `index`), for example, `79` and an array of ranges, let's say:

```js
[
  [5, 10],
  [15, 20],
  [25, 30],
  [35, 40],
  [45, 50],
  [55, 60],
  [65, 70],
  [75, 80],
  [85, 90],
  [95, 100],
  [105, 110],
  [115, 120],
  [125, 130],
]
```

This library would answer the question, is your index `79` within any of the ranges.

In the example above, yes, because `79` is within range `[75, 80]`. If you want range endings to be inclusive, set `options.inclusiveRangeEnds` to `true` because by default they are not inclusive (`75` would be not considered to be within range `[75, 80]`).

**[⬆ &nbsp;back to top](#)**

### API - Input

Input argument   | Type                          | Obligatory? | Description
-----------------|-------------------------------|-------------|-----------
`index`          | Natural number                | yes         | The natural number index you're checking
`rangesArr`      | Array of zero or more arrays | yes         | Array of ranges, for example, `[ [1, 5], [10, 20] ]`
`options`        | Plain object                  | no          | Optional options object. See below for its API.

A wrong type will cause `throw`s.

**[⬆ &nbsp;back to top](#)**

### Options object

options object's key              | Type of its value | Default     | Description
----------------------------------|-------------------|-------------|----------------------
{                                 |                   |             |
`inclusiveRangeEnds`              | Boolean           | `false`     | That is, do we consider `1` or `5` to be within range `[1, 5]`? The default answer is no, but if set to `true`, the answer would be yes.
`returnMatchedRangeInsteadOfTrue` | Boolean           | `false`     | If set to `true`, instead of result `true` it will return the matched range. `false` is still used as a negative answer. It's handy when you want to know **which** range it matched.
}                                 |                   |             |

Options object is "patrolled" using [check-types-mini](https://github.com/codsen/check-types-mini) so please behave: the settings' values have to match and settings object should not be customised with extra keys. Naughtiness will cause `throw`s.

Here is the options object in one place (in case you ever want to copy it):

```js
{
  inclusiveRangeEnds: false,
  returnMatchedRangeInsteadOfTrue: false,
}
```

**[⬆ &nbsp;back to top](#)**

### API - Output

Boolean `true`^ or `false`, answering the question, is the given `index` found within any of the ranges.

^ If `opts.returnMatchedRangeInsteadOfTrue` is set to `true`, positive result will be the range which was matched. Negative result would be still `false`.

**[⬆ &nbsp;back to top](#)**

## Example

Simple encoding using default settings:

```js
const rangesIsIndexWithin = require('ranges-is-index-within')
let res1 = rangesIsIndexWithin(
  79,
  [
    [5, 10],
    [15, 20],
    [25, 30],
    [35, 40],
    [45, 50],
    [55, 60],
    [65, 70],
    [75, 80], // <-- "true", - "79" would be within this range, answer is "true"
    [85, 90],
    [95, 100],
    [105, 110],
    [115, 120],
    [125, 130],
  ],
)
console.log(res1);
// > true

let res2 = rangesIsIndexWithin(
  31,
  [
    [5, 10],
    [15, 20],
    [25, 30], // <-- "false" because "31" falls in between this and next range. It's not within.
    [35, 40],
    [45, 50],
    [55, 60],
    [65, 70],
    [75, 80],
    [85, 90],
    [95, 100],
    [105, 110],
    [115, 120],
    [125, 130],
  ],
)
console.log(res2);
// > false

let res3 = rangesIsIndexWithin(
  30,
  [
    [5, 10],
    [15, 20],
    [25, 30], // <-- "true" because opts.inclusiveRangeEnds=true and "30" is on the edge of the range.
    [35, 40],
    [45, 50],
    [55, 60],
    [65, 70],
    [75, 80],
    [85, 90],
    [95, 100],
    [105, 110],
    [115, 120],
    [125, 130],
  ],
  { inclusiveRangeEnds: true },
)
console.log(res3);
// > true

let res4 = rangesIsIndexWithin(
  30,
  [
    [5, 10],
    [15, 20],
    [25, 30], // <-- "true" because opts.inclusiveRangeEnds=true and "30" is on the edge of the range.
    [35, 40],
    [45, 50],
    [55, 60],
    [65, 70],
    [75, 80],
    [85, 90],
    [95, 100],
    [105, 110],
    [115, 120],
    [125, 130],
  ],
  { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true },
)
console.log(res4);
// > [25, 30]  <------ ! not Boolean, but the range itself.
```

**[⬆ &nbsp;back to top](#)**

## The algorithm

I implemented the [binary search](https://en.wikipedia.org/wiki/Binary_search_algorithm) idea.

First, we check is the index not outside of the ranges. Then we pick the middle of the ranges and check, is index within, below or above it. We narrow down the ranges until there's nothing left to narrow-down.

For example, here's how the following function would perform the calculations:

```js
rangesIsIndexWithin(
  79, // <- index
  [   // <- ranges
    [5, 10],
    [15, 20],
    [25, 30],
    [35, 40],
    [45, 50],
    [55, 60],
    [65, 70],
    [75, 80],
    [85, 90],
    [95, 100],
    [105, 110],
    [115, 120],
    [125, 130],
  ]
)
```

Let's say we're checking index number `79`. Question: is it within any of the ranges above?

The first algorithm would pick the middle range, `[65,70]`. Index (`79`) is apparently above it. Narrow-down the ranges we work on to `[65,70]`-`[125,130]` (6th - 12th counting from zero).

Pick the middle range of `[65,70]`-`[125,130]`, which is 9th, `[95,100]`. Index (`79`) is apparently under it. Narrow-down the ranges we work on to `[65,70]`-`[95,100]` (6th - 9th, counting zero-inclusive).

Pick the middle range of `[65,70]`-`[95,100]`, which is `[75,80]`. Bob's your uncle, `79` is within that.

It took three iterations of a `while` loop to measure `13` ranges. Would could have checked it using `Array.some` but it would have been the less efficient, the more our index would be towards the end of the array. The most inefficient way would be `for` loop without `break`, checking all ranges even if one was detected.

In our example above, `for` loop with `break` or `Array.some` would have stopped after checking 8th range. Our algorithm did it in 3 checks. That's the meaning of "efficient" I'm talking about.

**[⬆ &nbsp;back to top](#)**

## Contributing

Hi! 99% of people in the society are passive - consumers. They wait for others to take action, they prefer to blend in. The remaining 1% are proactive citizens who will _do_ something rather than _wait_. If you are one of that 1%, you're in luck because I am the same and _together_ we can make something happen.

* If you **want a new feature** in this package or you would like to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/ranges-is-index-within/issues). Also, you can [email me](mailto:roy@codsen.com). Just let it out.

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/ranges-is-index-within/issues). Alternatively, you can [email me](mailto:roy@codsen.com).

* If you don't like the code in here and would like to **give advice** about how something could be done better, please do. Same drill - [GitHub issues](https://github.com/codsen/ranges-is-index-within/issues) or [email](mailto:roy@codsen.com), your choice.

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. I'll do my best to merge it quickly. Code style is `airbnb-base`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/ranges-is-index-within.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ranges-is-index-within

[npm-img]: https://img.shields.io/npm/v/ranges-is-index-within.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/ranges-is-index-within

[travis-img]: https://img.shields.io/travis/codsen/ranges-is-index-within.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/ranges-is-index-within

[cov-img]: https://coveralls.io/repos/github/codsen/ranges-is-index-within/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/ranges-is-index-within?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/ranges-is-index-within.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/ranges-is-index-within

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/ranges-is-index-within.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/ranges-is-index-within/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ranges-is-index-within

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/ranges-is-index-within.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/ranges-is-index-within/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/ranges-is-index-within/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/ranges-is-index-within

[downloads-img]: https://img.shields.io/npm/dm/ranges-is-index-within.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ranges-is-index-within

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ranges-is-index-within

[license-img]: https://img.shields.io/npm/l/ranges-is-index-within.svg?style=flat-square
[license-url]: https://github.com/codsen/ranges-is-index-within/blob/master/license.md
