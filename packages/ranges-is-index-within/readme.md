# ranges-is-index-within

> Efficiently checks if index is within any of the given ranges

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

## Install

```bash
$ npm install ranges-is-index-within
```

You'll get a transpiled `index.js` served from `/es5/` folder. Original ES6 source sits in the root.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [What it does](#what-it-does)
  - [API - Input](#api---input)
  - [Options object](#options-object)
  - [API - Output](#api---output)
- [Example](#example)
- [The algorithm](#the-algorithm)
- [Contributing & testing](#contributing--testing)
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

In the example above, yes, because `79` is within a range `[75, 80]`. If you want range ends to be inclusive, set `options.inclusiveRangeEnds` to `true` because by default they are not inclusive (`75` would be not considered to be within range `[75, 80]`).

### API - Input

Input argument   | Type                          | Obligatory? | Description
-----------------|-------------------------------|-------------|-----------
`index`          | Natural number                | yes         | The natural number index you're checking
`rangesArr`      | Array of zero ore more arrays | yes         | Array of ranges, for example, `[ [1, 5], [10, 20] ]`
`options`        | Plain object                  | no          | Optional options object. See below for its API.

Wrong type will cause `throw`s.

### Options object

options object's key    | Type of its value | Default     | Description
------------------------|-------------------|-------------|----------------------
{                       |                   |             |
`inclusiveRangeEnds`    | Boolean           | `false`     | That is, do we consider `1` or `5` to be within range `[1, 5]`? Default answer is "no", but if set to `true`, answer would be "yes."
}                       |                   |             |

Options object is "patrolled" using [check-types-mini](https://github.com/codsen/check-types-mini) so please behave: the settings' values have to match and settings object should not be customised with extra keys. Naughtiness will cause `throw`s.

Here is the options object in one place (in case you ever want to copy it):

```js
wthn(
  index, rangesArr,
  {
    inclusiveRangeEnds: false
  }
);
```

### API - Output

Boolean `true` or `false`, answering the question, is the given `index` found within any of the ranges.

## Example

Simple encoding using default settings:

```js
const wthn = require('ranges-is-index-within')
let res1 = wthn(
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

let res2 = wthn(
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

let res3 = wthn(
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
```

## The algorithm

I implemented the [binary search](https://en.wikipedia.org/wiki/Binary_search_algorithm) idea.

First, we check is the index not outside of the ranges. Then we pick the middle of the ranges and check, is index within, below or above it. We narrow down the ranges until there's nothing left to narrow-down.

For example, here's how the following function would perform the calculations:

```js
wthn(
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

First algorithm would pick the middle range, `[65,70]`. Index (`79`) is apparently above it. Narrow-down the ranges we work on to `[65,70]`-`[125,130]` (6th - 12th counting from zero).

Pick the middle range of `[65,70]`-`[125,130]`, which is 9th, `[95,100]`. Index (`79`) is apparently under it. Narrow-down the ranges we work on to `[65,70]`-`[95,100]` (6th - 9th, counting zero-inclusive).

Pick the middle range of `[65,70]`-`[95,100]`, which is `[75,80]`. Bob's your uncle, `79` is within that.

It took three iterations of a `while` loop to measure `13` ranges. Would could have checked it using `Array.some` but it would have been the less efficient the more our index would be towards the end of the array. The most inefficient way would be `for` loop without `break`, checking all ranges even if one was detected.

In our example above, `for` loop with `break` or `Array.some` would have stopped after checking 8th range. Our algorithm did it in 3 checks. That's the meaning of "efficient" I'm talking about.

## Contributing & testing

If you want to contribute, don't hesitate. If it's a code contribution, please supplement `test.js` with tests covering your code. This library uses `airbnb-base` rules preset of `eslint` with few exceptions^ and follows the Semver rules.

<small>^ 1. No semicolons. 2. Allow plus-plus in `for` loops. See `./eslintrc`</small>

## Licence

> MIT License (MIT)

> Copyright (c) 2017 Codsen Ltd, Roy Revelt

> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[npm-img]: https://img.shields.io/npm/v/ranges-is-index-within.svg
[npm-url]: https://www.npmjs.com/package/ranges-is-index-within

[travis-img]: https://travis-ci.org/codsen/ranges-is-index-within.svg?branch=master
[travis-url]: https://travis-ci.org/codsen/ranges-is-index-within

[cov-img]: https://coveralls.io/repos/github/codsen/ranges-is-index-within/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/codsen/ranges-is-index-within?branch=master

[overall-img]: https://www.bithound.io/github/codsen/ranges-is-index-within/badges/score.svg
[overall-url]: https://www.bithound.io/github/codsen/ranges-is-index-within

[deps-img]: https://www.bithound.io/github/codsen/ranges-is-index-within/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/codsen/ranges-is-index-within/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/codsen/ranges-is-index-within/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/codsen/ranges-is-index-within/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/ranges-is-index-within.svg
[downloads-url]: https://npm-stat.com/charts.html?package=ranges-is-index-within

[vulnerabilities-img]: https://snyk.io/test/github/codsen/ranges-is-index-within/badge.svg
[vulnerabilities-url]: https://snyk.io/test/github/codsen/ranges-is-index-within

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ranges-is-index-within

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg
[runkit-url]: https://npm.runkit.com/ranges-is-index-within
