# array-of-arrays-sort-by-col

> sort array of arrays by column, rippling the sorting outwards from that column

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
npm i array-of-arrays-sort-by-col
```

```js
// consume as CommonJS require():
const sortByCol = require("array-of-arrays-sort-by-col");
// or as ES Module:
import sortByCol from "array-of-arrays-sort-by-col";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                                      | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ----------------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/array-of-arrays-sort-by-col.cjs.js` | 4 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/array-of-arrays-sort-by-col.esm.js` | 3 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/array-of-arrays-sort-by-col.umd.js` | 12 KB |

**[⬆ back to top](#markdown-header-array-of-arrays-sort-by-col)**

## Table of Contents

- [Install](#markdown-header-install)
- [What it does](#markdown-header-what-it-does)
- [Sorting by certain column](#markdown-header-sorting-by-certain-column)
- [API](#markdown-header-api)
- [Purpose of this library](#markdown-header-purpose-of-this-library)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

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

- When we compare two rows, first we compare by particular column (default is first, zero-index column). Then, if values are equal, we look around and compare by those values. First, compare left-side, then right-side. Then, if values are equal even there, we "ripple" outwards. First, compare left-side, then right-side. Then, if values are equal even there, we "ripple" outwards. ...
- We accept arrays, normalised into a matrix, with absent value fillings set to `null`. Same behaviour.

```
1 ---- 7 ---- 5
1 ---- 8 ---- 2
1 ---- 9 ---- 0
1 --- null - null
```

**[⬆ back to top](#markdown-header-array-of-arrays-sort-by-col)**

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

**[⬆ back to top](#markdown-header-array-of-arrays-sort-by-col)**

## API

**sortByCol (arr, [index])**

### API - Input

| Input argument | Type                                            | Obligatory? | Description                                                                                                      |
| -------------- | ----------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------- |
| `arr`          | Array of zero or more arrays                    | yes         | Source of data to put into an AST                                                                                |
| `index`        | Natural number or zero, like a number or string | no          | By which column should we match the subarrays (rows)? The default is `0` or the first element of each sub-array. |

**[⬆ back to top](#markdown-header-array-of-arrays-sort-by-col)**

### API - Output

| Type            | Description                                         |
| --------------- | --------------------------------------------------- |
| Array of arrays | Same thing as input but sorted (if given not empty) |

**[⬆ back to top](#markdown-header-array-of-arrays-sort-by-col)**

## Purpose of this library

It will be a cornerstone of [generate-ifs](https://github.com/codsen/generate-ifs). There we turn list of characters (for example, astral-ones, pieces of emoji) into JS code which checks, if particular index anywhere within any of given character sequences. All character variations (if "a" followed by "b" OR "b" preceded by "a") are gathered into a single matrix where "root" axis column is the index from which we start checking.

This library will sort according to that axis column.

Outside of this case, this library could be used to sort two-dimensional arrays of integers against certain column, with "rippling" comparison (as opposed to first match by certain column, but if they're equal, just iterate from zero-th to last, skipping "certain"-one).

Practically, in human terms, this library makes sure the values clump around the particular column and "float" to the top as much as possible.

**[⬆ back to top](#markdown-header-array-of-arrays-sort-by-col)**

## Contributing

- If you see an error, [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=array-of-arrays-sort-by-col%20package%20-%20put%20title%20here).
- If you want a new feature but can't code it up yourself, also [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=array-of-arrays-sort-by-col%20package%20-%20put%20title%20here). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=array-of-arrays-sort-by-col%20package%20-%20put%20title%20here). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://bitbucket.org/codsen/codsen/src/) via BitBucket, then write code, then file a pull request via BitBucket. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#markdown-header-array-of-arrays-sort-by-col)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/array-of-arrays-sort-by-col.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/array-of-arrays-sort-by-col
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/codsen/src/master/packages/array-of-arrays-sort-by-col
[cov-img]: https://img.shields.io/badge/coverage-100%-brightgreen.svg?style=flat-square
[cov-url]: https://bitbucket.org/codsen/codsen/src/master/packages/array-of-arrays-sort-by-col
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/array-of-arrays-sort-by-col
[downloads-img]: https://img.shields.io/npm/dm/array-of-arrays-sort-by-col.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/array-of-arrays-sort-by-col
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/array-of-arrays-sort-by-col
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/codsen/src/master/packages/array-of-arrays-sort-by-col
