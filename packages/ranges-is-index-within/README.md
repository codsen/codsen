# ranges-is-index-within

> Efficiently checks if index is within any of the given ranges

[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![no dependencies][no-deps-img]][no-deps-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Install

```bash
npm i ranges-is-index-within
```
The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`isIndexWithin`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const isIndexWithin = require("ranges-is-index-within");
```

or as an ES Module:

```js
import isIndexWithin from "ranges-is-index-within";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/ranges-is-index-within/dist/ranges-is-index-within.umd.js"></script>
```

```js
// in which case you get a global variable "rangesIsIndexWithin" which you consume like this:
const isIndexWithin = rangesIsIndexWithin;
```

This package has three builds in `dist/` folder:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/ranges-is-index-within.cjs.js` | 1 KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/ranges-is-index-within.esm.js` | 1 KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/ranges-is-index-within.umd.js` | 830 B

**[⬆ back to top](#)**

## Table of Contents

- [Install](#install)
- [What it does](#what-it-does)
- [Example](#example)
- [The algorithm](#the-algorithm)
- [Benchmark](#benchmark)
- [Contributing](#contributing)
- [Licence](#licence)

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
];
```

This library would answer the question, is your index `79` within any of the ranges.

In the example above, yes, because `79` is within range `[75, 80]`. If you want range endings to be inclusive, set `options.inclusiveRangeEnds` to `true` because by default they are not inclusive (`75` would be not considered to be within range `[75, 80]`).

**[⬆ back to top](#)**

### API - Input

| Input argument | Type                                 | Obligatory? | Description                                          |
| -------------- | ------------------------------------ | ----------- | ---------------------------------------------------- |
| `index`        | Natural number                       | yes         | The natural number index you're checking             |
| `rangesArr`    | Array of zero or more arrays or null | yes         | Array of ranges, for example, `[ [1, 5], [10, 20] ]` |
| `options`      | Plain object                         | no          | Optional options object. See below for its API.      |

A wrong type will cause `throw`s.

**[⬆ back to top](#)**

### Options object

<!-- prettier-ignore-start -->

| options object's key              | Type of its value | Default | Description |
| --------------------------------- | ----------------- | ------- | ----------- |
| {                                 |                   |         |
| `inclusiveRangeEnds`              | Boolean           | `false` | That is, do we consider `1` or `5` to be within range `[1, 5]`? The default answer is no, but if set to `true`, the answer would be yes. |
| `returnMatchedRangeInsteadOfTrue` | Boolean           | `false` | If set to `true`, instead of result `true` it will return the matched range. `false` is still used as a negative answer. It's handy when you want to know **which** range it matched. |
| }                                 |                   |         |

<!-- prettier-ignore-end -->

**[⬆ back to top](#)**

### API - Output

Boolean `true`^ or `false`, answering the question, is the given `index` found within any of the ranges.

^ If `opts.returnMatchedRangeInsteadOfTrue` is set to `true`, positive result will be the range which was matched. Negative result would be still `false`.

**[⬆ back to top](#)**

## Example

Simple encoding using default settings:

```js
const isIndexWithin = require("ranges-is-index-within");
let res1 = isIndexWithin(79, [
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
]);
console.log(res1);
// > true

let res2 = isIndexWithin(31, [
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
]);
console.log(res2);
// > false

let res3 = isIndexWithin(
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
  { inclusiveRangeEnds: true }
);
console.log(res3);
// > true

let res4 = isIndexWithin(
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
  { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true }
);
console.log(res4);
// > [25, 30]  <------ ! not Boolean, but the range itself.
```

**[⬆ back to top](#)**

## The algorithm

Sugarcoated `Array.some` / `Array.find` — no dependencies. This program is slightly slower than raw `Array` methods but it gives you insurance when ranges are `null` (returns `false` while raw `Array` methods would throw).

By the way, [Binary Search algorithm](https://en.wikipedia.org/wiki/Binary_search_algorithm) would be 85 times slower than `Array.some`/`Array.find`, which I tried in previous versions of this package.

**[⬆ back to top](#)**

## Benchmark

```bash
node benchmark.js
```

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ranges-is-index-within%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aranges-is-index-within%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ranges-is-index-within%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aranges-is-index-within%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ranges-is-index-within%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aranges-is-index-within%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-is-index-within
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-is-index-within
[no-deps-img]: https://img.shields.io/badge/-no%20dependencies-brightgreen?style=flat-square
[no-deps-url]: https://www.npmjs.com/package/ranges-is-index-within?activeTab=dependencies
[downloads-img]: https://img.shields.io/npm/dm/ranges-is-index-within.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ranges-is-index-within
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ranges-is-index-within
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
