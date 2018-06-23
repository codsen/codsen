# ranges-sort

> Sort natural number index ranges [ [5, 6], [1, 3] ] => [ [1, 3], [5, 6] ]

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
npm i ranges-sort
```

```js
// consume as CommonJS require:
const rangesSort = require("ranges-sort");
// or as a native ES module:
import rangesSort from "ranges-sort";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                      | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/ranges-sort.cjs.js` | 3 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/ranges-sort.esm.js` | 3 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/ranges-sort.umd.js` | 15 KB |

**[⬆ back to top](#markdown-header-ranges-sort)**

## Table of Contents

- [Install](#markdown-header-install)
- [Rationale](#markdown-header-rationale)
- [API](#markdown-header-api)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Rationale

It sorts the array of index arrays, for example:

```js
[ [5, 6], [1, 3] ] => [ [1, 3], [5, 6] ]
[ [5, 6], [5, 3], [5, 0] ] => [ [5, 0], [5, 3], [5, 6] ]
[] => []

[[1, 2], []] => // throws, because there's at least one empty range
[['a']] => // throws, because range is not a range but a string
[[1], [2]] => // throws, because one index is not a range

// 3rd argument and onwards are ignored:
[[3, 4, 'aaa', 'bbb'], [1, 2, 'zzz']] => [[1, 2, 'zzz'], [3, 4, 'aaa', 'bbb']]
```

**[⬆ back to top](#markdown-header-ranges-sort)**

## API

**rangesSort(arr[, opts])**

| Input argument | Type         | Obligatory? | Description                                                                  |
| -------------- | ------------ | ----------- | ---------------------------------------------------------------------------- |
| `arrOfRanges`  | Plain object | yes         | Array of zero or more arrays meaning natural number ranges (2 elements each) |
| `opts`         | Plain object | no          | Optional options go here.                                                    |

For example,

```js
[ [5, 9], [5, 3] ] => [ [5, 3], [5, 9] ]
```

This package does not mutate the input array.

**[⬆ back to top](#markdown-header-ranges-sort)**

### Options object

| `options` object's key             | Type    | Obligatory? | Default | Description                                                                                                                                                                                       |
| ---------------------------------- | ------- | ----------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| {                                  |         |             |         |
| `strictlyTwoElementsInRangeArrays` | Boolean | no          | `false` | If set to true, all ranges must have two and only elements, otherwise error is thrown. For example, input being `[ [1, 2, 'zzz'] ]` would throw (3 elements), as well as `[ ['a'] ]` (1 element). |
| }                                  |         |             |         |

**Output:** Sorted input array. First, we sort by the first argument of each child range array, then by second.

**[⬆ back to top](#markdown-header-ranges-sort)**

## Contributing

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/ranges-sort/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/ranges-sort/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ back to top](#markdown-header-ranges-sort)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/ranges-sort.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ranges-sort
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/ranges-sort
[cov-img]: https://coveralls.io/repos/bitbucket/codsen/ranges-sort/badge.svg?style=flat-square&branch=master
[cov-url]: https://coveralls.io/bitbucket/codsen/ranges-sort?branch=master
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ranges-sort
[downloads-img]: https://img.shields.io/npm/dm/ranges-sort.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ranges-sort
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ranges-sort
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/ranges-sort
