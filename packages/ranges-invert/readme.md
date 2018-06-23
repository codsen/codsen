# ranges-invert

> Invert natural number string index ranges [ [1, 3] ] => [ [0, 1], [3, ...] ]

[![Minimum Node version required][node-img]][node-url]
[![Repository is on BitBucket][bitbucket-img]][bitbucket-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Install

```bash
npm i ranges-invert
```

```js
// consume as CommonJS require:
const rangesSort = require("ranges-invert");
// or as a native ES module:
import rangesSort from "ranges-invert";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                        | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | --------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/ranges-invert.cjs.js` | 5 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/ranges-invert.esm.js` | 5 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/ranges-invert.umd.js` | 18 KB |

**[⬆ back to top](#markdown-header-ranges-invert)**

## Table of Contents

- [Install](#markdown-header-install)
- [Purpose](#markdown-header-purpose)
- [API](#markdown-header-api)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Purpose

Range is an array of two natural numbers. It signifies `String.slice()` arguments - a chunk of string.

For example, range `[1, 3]` of string "testing" would be "es". Starting index is inclusive (includes character at index number "1" in this case), ending index is not (does not include character at index number "3", or "t", in this case).

**This library inverts ranges.**

For example, in previous case, `[1, 3]` of string "testing" = "es" would be inverted as two ranges — `[[0, 1], [3, 7]]`.

As you noticed the input string is used for reference - to find, how far does the ending range go. If we didn't know what string does `[1, 3]` apply to, we'd get this: `[[0, 1], [3, ???]]`. That's why if the reference string is missing, an error is thrown.

There is possibility that string will not cover the inverted range. For example, if reference string was "abc" but range-to-invert was `[1,10]`. The result in such case would be `[0, 1]`.

**[⬆ back to top](#markdown-header-ranges-invert)**

## API

**rangesSort(arr[, opts])**

| Input argument | Type                         | Obligatory? | Description                                                                                                                                                                   |
| -------------- | ---------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `arrOfRanges`  | Array of zero or more arrays | yes         | Provide an array of ranges to invert. Ranges does not have to be [sorted](https://bitbucket.org/codsen/ranges-sort/) or [merged](https://bitbucket.org/codsen/ranges-merge/). |
| `opts`         | Plain object                 | no          | Optional options go here.                                                                                                                                                     |

**Output**: array of zero or more arrays (so-called _ranges_) where each consists of two or more natural number (or zero) indexes.

This package does not mutate the input array, instead it creates and returns a new array with ranges inverted.

**[⬆ back to top](#markdown-header-ranges-invert)**

### Options object

| `options` object's key             | Type    | Obligatory? | Default | Description                                                                                                                                                                                                              |
| ---------------------------------- | ------- | ----------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| {                                  |         |             |         |
| `strictlyTwoElementsInRangeArrays` | Boolean | no          | `false` | If set to true, all ranges must have two and only two elements, otherwise an error will be thrown. For example, input being `[ [1, 2, 'zzz'] ]` would throw (because of 3 elements), as well as `[ ['a'] ]` (1 element). |
| }                                  |         |             |         |

**[⬆ back to top](#markdown-header-ranges-invert)**

## Contributing

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/ranges-invert/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/ranges-invert/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ back to top](#markdown-header-ranges-invert)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/ranges-invert.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ranges-invert
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/ranges-invert
[cov-img]: https://coveralls.io/repos/bitbucket/codsen/ranges-invert/badge.svg?style=flat-square&branch=master
[cov-url]: https://coveralls.io/bitbucket/codsen/ranges-invert?branch=master
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ranges-invert
[downloads-img]: https://img.shields.io/npm/dm/ranges-invert.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ranges-invert
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ranges-invert
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/ranges-invert
