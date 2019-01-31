# ranges-sort

> Sort natural number index ranges [ [5, 6], [1, 3] ] => [ [1, 3], [5, 6] ]

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
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
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/ranges-sort.umd.js` | 29 KB |

**[⬆ back to top](#)**

## Table of Contents

- [Install](#markdown-header-install)
- [What it does](#markdown-header-what-it-does)
- [API](#markdown-header-api)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## What it does

Background: strings in JavaScript consist of characters. For example, `abc` is a string. Each character has an index number and the numbering starts from zero. For example, in "abc", "a" has index `0`, "b" has index `1` and so on.

We use arrays to **mark what to delete** from a string, from example, deletion from index `0` to index `5` would be `[0, 5]`. If we added a third element, that would mean we want to **insert it**, replacing the given index range. For example, if a string is `abc` and we want to delete "b", that would be range `[1, 2]`. If we wanted to replace "b" with "x", that would be range `[1, 2, "x"]`.

Now, if you have _an array_ of such ranges (that's an _array of arrays_), this library can **sort them**. For example:

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

This is a specialised library to sort these types of arrays, not any type of arrays. We expect first two elements in each array to be a natural number and there can be optional third argument (of any type).

The purpose of string index ranges is to avoid changing a string many times but instead, track the changes (ranges of indexes), compiling them in an array, and later perform all changes in one go. This guarantees the original characters in the string retain the original positions throughout the whole operation. It's easier and faster to process strings this way.

The purpose of _range sorting_ is to make life easier for other range-processing libraries.

**[⬆ back to top](#)**

## API

**rangesSort(arr[, opts])** — in other words, this library gives you a _function_ and you must feed an array into its first argument and also if you wish, you can feed a second argument, the _Optional Options Object_ (bracket in `[, opts]` means "optional").

| Input argument | Type         | Obligatory? | Description                                                                  |
| -------------- | ------------ | ----------- | ---------------------------------------------------------------------------- |
| `arrOfRanges`  | Array        | yes         | Array of zero or more arrays meaning natural number ranges (2 elements each) |
| `opts`         | Plain object | no          | Optional options go here.                                                    |

For example,

```js
[ [5, 9], [5, 3] ] => [ [5, 3], [5, 9] ]
```

This library does not mutate the inputs. In theory, a function in JavaScript could mutate its arguments, but only if they are on an "object" primitive type (an array or a plain object, for example).

**[⬆ back to top](#)**

### Options object

| `options` object's key             | Type     | Obligatory? | Default | Description                                                                                                                                                                                         |
| ---------------------------------- | -------- | ----------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| {                                  |          |             |         |
| `strictlyTwoElementsInRangeArrays` | Boolean  | no          | `false` | If set to `true`, all ranges must have two and only elements, otherwise error is thrown. For example, input being `[ [1, 2, 'zzz'] ]` would throw (3 elements), as well as `[ ['a'] ]` (1 element). |
| `progressFn`                       | Function | no          | `null`  | If a function is given, it will be called with natural number meaning percentage of the total work done. It's approximate and used in worker setups.                                                |
| }                                  |          |             |         |

**Output:** Sorted input array. First, we sort by the first argument of each child range array, then by second.

Here is whole Optional Options Object in one place, with all defaults, in case you want to copy it:

```js
{
  strictlyTwoElementsInRangeArrays: false,
  progressFn: null
}
```

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](https:/gitlab.com/codsen/codsen/issues/new?title=ranges-sort%20package%20-%20put%20title%20here).
- If you want a new feature but can't code it up yourself, also [raise an issue](https:/gitlab.com/codsen/codsen/issues/new?title=ranges-sort%20package%20-%20put%20title%20here). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](https:/gitlab.com/codsen/codsen/issues/new?title=ranges-sort%20package%20-%20put%20title%20here). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/ranges-sort.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ranges-sort
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-sort
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-sort
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ranges-sort
[downloads-img]: https://img.shields.io/npm/dm/ranges-sort.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ranges-sort
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ranges-sort
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
