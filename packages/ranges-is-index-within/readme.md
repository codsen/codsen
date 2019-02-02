# ranges-is-index-within

> Efficiently checks if index is within any of the given ranges

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
npm i ranges-is-index-within
```

```js
// consume via a CommonJS require:
const rangesIsIndexWithin = require("ranges-is-index-within");
// or as an ES Module:
import rangesIsIndexWithin from "ranges-is-index-within";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                                 | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------ | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/ranges-is-index-within.cjs.js` | 8 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/ranges-is-index-within.esm.js` | 7 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/ranges-is-index-within.umd.js` | 32 KB |

**[⬆ back to top](#)**

## Table of Contents

- [Install](#install)
- [What it does](#what-it-does)
- [Example](#example)
- [The algorithm](#the-algorithm)
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
  [125, 130]
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
| `skipIncomingRangeSorting`        | Boolean           | `false` | If you know the input ranges are already sorted, turn off the sorting using this flag. |
| }                                 |                   |         |

<!-- prettier-ignore-end -->

Options object is "patrolled" using [check-types-mini](https://bitbucket.org/codsen/check-types-mini) so please behave: the settings' values have to match and settings object should not be customised with extra keys. Naughtiness will cause `throw`s.

Here is the options object in one place (in case you ever want to copy it):

```js
{
  inclusiveRangeEnds: false,
  returnMatchedRangeInsteadOfTrue: false,
  skipIncomingRangeSorting: false,
}
```

**[⬆ back to top](#)**

### API - Output

Boolean `true`^ or `false`, answering the question, is the given `index` found within any of the ranges.

^ If `opts.returnMatchedRangeInsteadOfTrue` is set to `true`, positive result will be the range which was matched. Negative result would be still `false`.

**[⬆ back to top](#)**

### `opts.skipIncomingRangeSorting`

If you use this library as an internal dependency and you know the ranges upfront, it makes sense to sort them upfront, before feeding into this library and turn off the sorting here.

You can wire up temporary `console.log` and use [ranges-sort](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-sort), then copy-paste the sorted result into your code, as a constant ranges.

Now you can save users' resources and turn off range sorting in this library using `opts.skipIncomingRangeSorting`.

For example, in my library [charcode-is-valid-xml-name-character](https://bitbucket.org/codsen/charcode-is-valid-xml-name-character) I'm checking is the character a valid to be XML element's name. I know Unicode ranges upfront, so I sorted them, console-logg'ed and pasted as constant. Then, when checking user input character's index, is it among my ranges, I use this library, `ranges-is-index-within`, with sorting turned off.

**[⬆ back to top](#)**

## Example

Simple encoding using default settings:

```js
const rangesIsIndexWithin = require("ranges-is-index-within");
let res1 = rangesIsIndexWithin(79, [
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
  [125, 130]
]);
console.log(res1);
// > true

let res2 = rangesIsIndexWithin(31, [
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
  [125, 130]
]);
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
    [125, 130]
  ],
  { inclusiveRangeEnds: true }
);
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
    [125, 130]
  ],
  { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true }
);
console.log(res4);
// > [25, 30]  <------ ! not Boolean, but the range itself.
```

**[⬆ back to top](#)**

## The algorithm

I implemented the [binary search](https://en.wikipedia.org/wiki/Binary_search_algorithm) idea.

First, we check is the index not outside of the ranges. Then we pick the middle of the ranges and check, is index within, below or above it. We narrow down the ranges until there's nothing left to narrow-down.

For example, here's how the following function would perform the calculations:

```js
rangesIsIndexWithin(
  79, // <- index
  [
    // <- ranges
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
    [125, 130]
  ]
);
```

Let's say we're checking index number `79`. Question: is it within any of the ranges above?

The first algorithm would pick the middle range, `[65,70]`. Index (`79`) is apparently above it. Narrow-down the ranges we work on to `[65,70]`-`[125,130]` (6th - 12th counting from zero).

Pick the middle range of `[65,70]`-`[125,130]`, which is 9th, `[95,100]`. Index (`79`) is apparently under it. Narrow-down the ranges we work on to `[65,70]`-`[95,100]` (6th - 9th, counting zero-inclusive).

Pick the middle range of `[65,70]`-`[95,100]`, which is `[75,80]`. Bob's your uncle, `79` is within that.

It took three iterations of a `while` loop to measure `13` ranges. Would could have checked it using `Array.some` but it would have been the less efficient, the more our index would be towards the end of the array. The most inefficient way would be `for` loop without `break`, checking all ranges even if one was detected.

In our example above, the `for` loop with `break` or `Array.some` would have stopped after checking 8th range. Our algorithm did it in 3 checks. That's the meaning of "efficient" I'm talking about.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](https:/gitlab.com/codsen/codsen/issues/new?title=ranges-is-index-within%20package%20-%20put%20title%20here).
- If you want a new feature but can't code it up yourself, also [raise an issue](https:/gitlab.com/codsen/codsen/issues/new?title=ranges-is-index-within%20package%20-%20put%20title%20here). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](https:/gitlab.com/codsen/codsen/issues/new?title=ranges-is-index-within%20package%20-%20put%20title%20here). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/ranges-is-index-within.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ranges-is-index-within
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-is-index-within
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-is-index-within
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ranges-is-index-within
[downloads-img]: https://img.shields.io/npm/dm/ranges-is-index-within.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ranges-is-index-within
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ranges-is-index-within
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
