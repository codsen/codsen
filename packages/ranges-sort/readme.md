# ranges-sort

> Sort natural number index ranges [ \[5, 6], \[1, 3] ] => [ \[1, 3], \[5, 6] ]

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
$ npm install --save ranges-sort
```

```js
const rangesSort = require('ranges-sort')
```

We are serving code transpiled down to ES5.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Rationale](#rationale)
- [API](#api)
  - [Options object](#options-object)
- [Contributing & testing](#contributing--testing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Rationale

It sorts the array of index arrays, for example:

```js
[ [5, 6], [1, 3] ] => [ [1, 3], [5, 6] ]
[ [5, 6], [5, 3], [5, 0] ] => [ [5, 0], [5, 3], [5, 6] ]
[] => []

[[1, 2], []] => // throws, because there's at least one empty range
[['a']] => // throws, because range is given as string
[[1], [2]] => // throws, because one index is not a range

// 3rd argument and onwards are ignored:
[[3, 4, 'aaa', 'bbb'], [1, 2, 'zzz']] => [[1, 2, 'zzz'], [3, 4, 'aaa', 'bbb']]
```

## API

**rangesSort(arr[, opts])**

Input argument   | Type         | Obligatory? | Description
-----------------|--------------|-------------|--------------
`arrOfRanges`    | Plain object | yes         | Array of zero or more arrays meaning natural number ranges (2 elements each)
`opts`           | Plain object | no          | Optional options go here.

This package does not mutate the input array.

For example,

```js
[ [5, 9], [5, 3] ] => [ [5, 3], [5, 9] ]
```

### Options object

`options` object's key             | Type     | Obligatory? | Default     | Description
-----------------------------------|----------|-------------|-------------|----------------------
{                                  |          |             |             |
`strictlyTwoElementsInRangeArrays` | Boolean  | no          | `false`     | If set to true, when there are more or less than 3 elements in any of the ranges, it will `throw`. For example, input being `[ [1, 2, 'zzz'] ]` would throw.
}                                  |          |             |             |

**Output:** Sorted input array. First, we sort by the first argument of each child range array, then by second.

## Contributing & testing

If you want to contribute, don't hesitate. If it's a code contribution, please supplement `test.js` with tests covering your code. This library uses `airbnb-base` rules preset of `eslint` with two exceptions^ and follows the Semver rules.

<small>^ 1. No semicolons. 2. Allow plus-plus in `for` loops. See `./eslintrc`</small>

## Licence

> MIT License (MIT)

> Copyright (c) 2017 Codsen Ltd, Roy Revelt

> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[npm-img]: https://img.shields.io/npm/v/ranges-sort.svg
[npm-url]: https://www.npmjs.com/package/ranges-sort

[travis-img]: https://travis-ci.org/codsen/ranges-sort.svg?branch=master
[travis-url]: https://travis-ci.org/codsen/ranges-sort

[cov-img]: https://coveralls.io/repos/github/codsen/ranges-sort/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/codsen/ranges-sort?branch=master

[overall-img]: https://www.bithound.io/github/codsen/ranges-sort/badges/score.svg
[overall-url]: https://www.bithound.io/github/codsen/ranges-sort

[deps-img]: https://www.bithound.io/github/codsen/ranges-sort/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/codsen/ranges-sort/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/codsen/ranges-sort/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/codsen/ranges-sort/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/ranges-sort.svg
[downloads-url]: https://npm-stat.com/charts.html?package=ranges-sort

[vulnerabilities-img]: https://snyk.io/test/github/codsen/ranges-sort/badge.svg
[vulnerabilities-url]: https://snyk.io/test/github/codsen/ranges-sort

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ranges-sort

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg
[runkit-url]: https://npm.runkit.com/ranges-sort
