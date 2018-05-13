# array-of-arrays-sort-by-col

> sort array of arrays by column, rippling the sorting outwards from that column

[![Minimum Node version required][node-img]][node-url]
[![Build Status][travis-img]][travis-url]
[![Coverage][cov-img]][cov-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Known Vulnerabilities][vulnerabilities-img]][vulnerabilities-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Install

```bash
npm i array-of-arrays-sort-by-col
```

```js
// consume as CommonJS require():
const sortByCol = require("array-of-arrays-sort-by-col");
// or as ES Module:
import sortByCol from "array-of-arrays-sort-by-col";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                                      | Size       |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ----------------------------------------- | ---------- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/array-of-arrays-sort-by-col.cjs.js` | 5&nbsp;KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/array-of-arrays-sort-by-col.esm.js` | 4&nbsp;KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/array-of-arrays-sort-by-col.umd.js` | 12&nbsp;KB |

**[⬆ &nbsp;back to top](#)**

## Table of Contents

<!-- prettier-ignore-start -->

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [What it does](#what-it-does)
- [Sorting by certain column](#sorting-by-certain-column)
- [API](#api)
- [Purpose of this library](#purpose-of-this-library)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<!-- prettier-ignore-end -->

## What it does

Sorts array of arrays by any column (default is first element, zero'th column index).

The algorithm is tailored for integer-only values.

Consider this input:

```
1 --- 9 --- 0
1 -----------
1 --- 8 --- 2
1 --- 7 --- 5
```

In JS code, that's:

```js
[[1, 9, 0], [1], [1, 8, 2], [1, 7, 5]];
```

Default sorting is against first column (zero'th index), so result would be:

```
1 --- 7 --- 5
1 --- 8 --- 2
1 --- 9 --- 0
1 -----------
```

Output in JS code:

```js
[[1, 7, 5], [1, 8, 2], [1, 9, 0], [1]];
```

Rules:

* When we compare two rows, first we compare by particular column (default is first, zero-index column). Then, if values are equal, we look around and compare by those values. First, compare left-side, then right-side. Then, if values are equal even there, we "ripple" outwards. First, compare left-side, then right-side. Then, if values are equal even there, we "ripple" outwards. ...
* We accept arrays, normalised into a matrix, with absent value fillings set to `null`. Same behaviour.

```
1 ---- 7 ---- 5
1 ---- 8 ---- 2
1 ---- 9 ---- 0
1 --- null - null
```

**[⬆ &nbsp;back to top](#)**

## Sorting by certain column

For example, let's sort this array by second element (column index = `1`):

```js
const sortByCol = require("array-of-arrays-sort-by-col");
const input = [[1, 9, 0], [1], [1, 8, 2], [1, 7, 5]];
const result = sortByCol(input, 1);
console.log(
  `${`\u001b[${33}m${`input`}\u001b[${39}m`} = ${JSON.stringify(
    input,
    null,
    0
  )}`
);
// => input = [[1, 7, 5], [1, 8, 2], [1, 9, 0], [1]],
```

**[⬆ &nbsp;back to top](#)**

## API

**sortByCol (arr, [index])**

### API - Input

| Input argument | Type                                            | Obligatory? | Description                                                                                                      |
| -------------- | ----------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------- |
| `arr`          | Array of zero or more arrays                    | yes         | Source of data to put into an AST                                                                                |
| `index`        | Natural number or zero, like a number or string | no          | By which column should we match the subarrays (rows)? The default is `0` or the first element of each sub-array. |

**[⬆ &nbsp;back to top](#)**

### API - Output

| Type            | Description                                         |
| --------------- | --------------------------------------------------- |
| Array of arrays | Same thing as input but sorted (if given not empty) |

**[⬆ &nbsp;back to top](#)**

## Purpose of this library

It will be a cornerstone of [generate-ifs](https://github.com/codsen/generate-ifs). There we turn list of characters (for example, astral-ones, pieces of emoji) into JS code which checks, if particular index anywhere within any of given character sequences. All character variations (if "a" followed by "b" OR "b" preceded by "a") are gathered into a single matrix where "root" axis column is the index from which we start checking.

This library will sort according to that axis column.

Outside of this case, this library could be used to sort two-dimensional arrays of integers against certain column, with "rippling" comparison (as opposed to first match by certain column, but if they're equal, just iterate from zero-th to last, skipping "certain"-one).

Practically, in human terms, this library makes sure the values clump around the particular column and "float" to the top as much as possible.

**[⬆ &nbsp;back to top](#)**

## Contributing

* If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/array-of-arrays-sort-by-col/issues).

* If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/array-of-arrays-sort-by-col/issues).

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/array-of-arrays-sort-by-col.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/array-of-arrays-sort-by-col
[travis-img]: https://img.shields.io/travis/codsen/array-of-arrays-sort-by-col.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/array-of-arrays-sort-by-col
[cov-img]: https://coveralls.io/repos/github/codsen/array-of-arrays-sort-by-col/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/array-of-arrays-sort-by-col?branch=master
[overall-img]: https://img.shields.io/bithound/code/github/codsen/array-of-arrays-sort-by-col.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/array-of-arrays-sort-by-col
[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/array-of-arrays-sort-by-col.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/array-of-arrays-sort-by-col/master/dependencies/npm
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/array-of-arrays-sort-by-col
[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/array-of-arrays-sort-by-col.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/array-of-arrays-sort-by-col/master/dependencies/npm
[vulnerabilities-img]: https://snyk.io/test/github/codsen/array-of-arrays-sort-by-col/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/array-of-arrays-sort-by-col
[downloads-img]: https://img.shields.io/npm/dm/array-of-arrays-sort-by-col.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/array-of-arrays-sort-by-col
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/array-of-arrays-sort-by-col
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://github.com/prettier/prettier
[license-img]: https://img.shields.io/npm/l/array-of-arrays-sort-by-col.svg?style=flat-square
[license-url]: https://github.com/codsen/array-of-arrays-sort-by-col/blob/master/license.md
