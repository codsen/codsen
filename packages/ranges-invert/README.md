# ranges-invert

> Invert string index ranges [ [1, 3] ] => [ [0, 1], [3, ...] ]

[![Repository is on GitLab][gitlab-img]][gitlab-url]
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

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`invert`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const invert = require("ranges-invert");
```

or as an ES Module:

```js
import invert from "ranges-invert";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/ranges-invert/dist/ranges-invert.umd.js"></script>
```

```js
// in which case you get a global variable "rangesInvert" which you consume like this:
const invert = rangesInvert;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                        | Size |
| ------------------------------------------------------------------------------------------------------- | --------------------- | --------------------------- | ---- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/ranges-invert.cjs.js` | 6 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/ranges-invert.esm.js` | 4 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/ranges-invert.umd.js` | 8 KB |

**[⬆ back to top](#)**

## Table of Contents

- [Install](#install)
- [Purpose](#purpose)
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

## Purpose

Range is an array of two natural numbers. It signifies `String.slice()` arguments - a chunk of string.

For example, range `[1, 3]` of string "testing" would be "es". Starting index is inclusive (includes character at index number "1" in this case), ending index is not (does not include character at index number "3", or "t", in this case).

**This library inverts ranges.**

For example, in previous case, `[1, 3]` of string "testing" = "es" would be inverted as two ranges — `[[0, 1], [3, 7]]`.

As you noticed the input string is used for reference - to find, how far does the ending range go. If we didn't know what string does `[1, 3]` apply to, we'd get this: `[[0, 1], [3, ???]]`. That's why if the reference string is missing, an error is thrown.

There is possibility that string will not cover the inverted range. For example, if reference string was "abc" but range-to-invert was `[1,10]`. The result in such case would be `[0, 1]`.

**[⬆ back to top](#)**

## API

**rangesInvert(arr, strLen [, opts])**

| Input argument | Type                         | Obligatory? | Description                                                                                                                                                                                                                 |
| -------------- | ---------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `arrOfRanges`  | Array of zero or more arrays | yes         | Provide an array of ranges to invert. Ranges do not have to be [sorted](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-sort) or [merged](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-merge). |
| `strLen`       | Integer number               | yes         | Algorithm needs to know the length of the reference string to calculate the inverted last slice's ending index.                                                                                                             |
| `opts`         | Plain object                 | no          | Optional options go here.                                                                                                                                                                                                   |

**Output**: array of zero or more arrays (so-called _ranges_) where each consists of two or more natural number (or zero) indexes.

This package does not mutate the input array, instead it creates and returns a new array with ranges inverted.

**[⬆ back to top](#)**

### Options object

| `options` object's key             | Type    | Obligatory? | Default | Description                                                                                                                                                                                                              |
| ---------------------------------- | ------- | ----------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| {                                  |         |             |         |
| `strictlyTwoElementsInRangeArrays` | Boolean | no          | `false` | If set to true, all ranges must have two and only two elements, otherwise an error will be thrown. For example, input being `[ [1, 2, 'zzz'] ]` would throw (because of 3 elements), as well as `[ ['a'] ]` (1 element). |
| `skipChecks`                       | Boolean | no          | `false` | If set to true, no checks will be performed. It's handy to cut corners for perf reasons when you know input ranges are clean.                                                                                            |
| }                                  |         |             |         |

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ranges-invert%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aranges-invert%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ranges-invert%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aranges-invert%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ranges-invert%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aranges-invert%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-invert
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-invert
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ranges-invert
[downloads-img]: https://img.shields.io/npm/dm/ranges-invert.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ranges-invert
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ranges-invert
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
