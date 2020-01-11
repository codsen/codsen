# ranges-merge

> Merge and sort arrays which mean string slice ranges

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#install)
- [The Idea](#the-idea)
- [API](#api)
- [`opts.progressFn`](#optsprogressfn)
- [`opts.mergeType`](#optsmergetype)
- [`opts.mergeType` example](#optsmergetype-example)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i ranges-merge
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`mergeRanges`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const mergeRanges = require("ranges-merge");
```

or as an ES Module:

```js
import mergeRanges from "ranges-merge";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/ranges-merge/dist/ranges-merge.umd.js"></script>
```

```js
// in which case you get a global variable "rangesMerge" which you consume like this:
const mergeRanges = rangesMerge;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                       | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/ranges-merge.cjs.js` | 5 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/ranges-merge.esm.js` | 5 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/ranges-merge.umd.js` | 14 KB |

**[⬆ back to top](#)**

## The Idea

If, after sorting, two ranges in the vicinity have the same edge value (like `2` below), merge those ranges:

```js
const rangesMerge = require('ranges-merge')
rangesMerge([
  [1, 2], [2, 3], [9, 10]
])
// => [
//   [1, 3], [9, 10]
// ]
}
```

If ranges overlap, merge them too:

```js
const rangesMerge = require('ranges-merge')
rangesMerge([
  [1, 5], [2, 10]
])
// => [
//   [1, 10]
// ]
}
```

**[⬆ back to top](#)**

## API

**rangesMerge(arrOfRanges\[, opts])** — in other words, this library gives you a _function_, and you must feed _an array_ into its first argument and also if you wish, you can feed a second argument, a plain object (bracket in `[, opts]` means "optional").

It returns a new array of zero or more arrays, with ranges merged (where applicable). Original input is not mutated.

| Input argument | Type         | Obligatory? | Description                                                                  |
| -------------- | ------------ | ----------- | ---------------------------------------------------------------------------- |
| `arrOfRanges`  | Array        | yes         | Array of zero or more arrays meaning natural number ranges (2 elements each) |
| `opts`         | Plain object | no          | Optional Options Object. See its API below.                                  |

**[⬆ back to top](#)**

### Optional Options Object

| Options Object's key       | The type of its value                   | Default | Description                                                                                                                                                                                                                                                        |
| -------------------------- | --------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| {                          |                                         |         |
| `mergeType`                | number                                  | `1`     | The type of merge. See below for explanation.                                                                                                                                                                                                                      |
| `progressFn`               | `null` or Boolean `false` or `function` | `null`  | If you supply a function here, it will be called, and an argument will be given to it, a natural number, which means percentage complete at that moment. Values will range from `1` to `99`, and finally, the main function will return the result's plain object. |
| `joinRangesThatTouchEdges` | boolean                                 | `true`  | By default, if two ranges "touch", `[[1, 2], [2, 3]]` they are joined. Set this option to `false` to stop that. Handy when reporting [separate issues](https://gitlab.com/codsen/codsen/tree/master/packages/string-fix-broken-named-entities).                    |
| }                          |                                         |         |

Here it is, in one place, in case you want to copy-paste it somewhere:

```js
{
  mergeType: 1,
  progressFn: null,
  joinRangesThatTouchEdges: true
}
```

**[⬆ back to top](#)**

## `opts.progressFn`

Consider this example (notice an arrow function in the second input argument):

```js
console.log(
  mergeRanges(
    [
      [1, 5],
      [11, 15],
      [6, 10],
      [16, 20],
      [10, 30]
    ],
    {
      progressFn: perc => {
        console.log(`done: ${perc}`);
      }
    }
  )
);
//
// done: 0
// done: 1
// done: 2
// done: 3
// done: 4
// done: 4
// done: 5
// done: 21
// done: 40
// done: 60
// done: 79
// done: 99
// [[1, 5], [6, 30]]
```

Imagine, instead of `console.log`, this function could sit in a worker and report its progress, then, finally, ping the last value - result.

Whatever function you give in `opts.progressFn`, it will be called with percentage done so far. Grab that argument (`perc` in the example above) and do whatever you want with it in your function.

**[⬆ back to top](#)**

## `opts.mergeType`

When merging, ranges are sorted first. Then, pairs starting from the end of the sorted array are merged. Last two becomes one, last two becomes one and so on.

The challenge is, what to do with values to add, third range array's element.

For example,

```js
const range1 = [1, 2, "a"];
const range2 = [1, 2, "b"];
```

The above ranges are "saying": replace characters in a string from index `1` to `2` with `"a"`, replace characters in string from index `1` to `2` with `"b"`.

Do we end up with `"ab"` or `"b"` or something else?

`opts.mergeType` let's you customise this behaviour:

- In default mode, opts.mergeType === `1`, clashing "to insert" values will always be concatenated (`"ab"` in example above)
- In mode opts.mergeType === `2`, if "to insert" values clash and **starting indexes are the same** — the latter value overrides the former (`"b"` in example above).

In all other aspects, `opts.mergeType` modes `1` and `2` are the same.

**[⬆ back to top](#)**

## `opts.mergeType` example

Imagine a messed up piece of code: `<div>&nbbsp;</div>`. Let's say our imaginary cleaning program detected two issues with it:

- Unencoded ampersand at position `5`
- Malformed `&nbsp;` where `b` is duplicated

Range-wise, it could look like this:

```js
[
  {
    name: "bad-character-unencoded-ampersand",
    position: [[5, 6, "&amp;"]]
  },
  {
    name: "malformed &nbsp;",
    position: [[5, 12, "&nbsp;"]]
  }
];
```

Notice we have two ranges' "insert" values clashing, `[5, 6]` and `[5, 12]`, but we want latter to discard the former. That's where `opts.mergeType` setting `2` come in.

Mode `2` is the same to `1` except clashing "insert" values are resolved by deleting value on the left and keeping one on the right, in the order of sorted ranges array.

For example,

```js
const res1 = mergeRanges(
  [
    [3, 4, "aaa"],
    [3, 12, "zzz"]
  ],
  { mergeType: 1 }
);
console.log(res1);
// => [[3, 12, "aaazzz"]]

const res2 = mergeRanges(
  [
    [3, 4, "aaa"],
    [3, 12, "zzz"]
  ],
  { mergeType: 2 }
);
console.log(res2);
// => [[3, 12, "zzz"]]
```

In the example above, notice how ranges got sorted. The sorting algorithm first sorted by first element (`3` which was the same on both) then on a second (`4` vs `12`). The range `[3, 12, "zzz"]` came second, its third element, "what to insert", `"zzz"` clashed with first one's `"aaa"`, wiping it.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ranges-merge%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aranges-merge%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ranges-merge%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aranges-merge%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ranges-merge%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aranges-merge%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/ranges-merge.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ranges-merge
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-merge
[cov-img]: https://img.shields.io/badge/coverage-96.83%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-merge
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ranges-merge
[downloads-img]: https://img.shields.io/npm/dm/ranges-merge.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ranges-merge
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ranges-merge
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
