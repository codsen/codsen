# ranges-crop

> Crop array of ranges when they go beyond the reference string's length

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
npm i ranges-crop
```

```js
// consume as CommonJS require:
const rangesCrop = require("ranges-crop");
// or as a native ES module:
import rangesCrop from "ranges-crop";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                      | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/ranges-crop.cjs.js` | 4 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/ranges-crop.esm.js` | 3 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/ranges-crop.umd.js` | 31 KB |

**[⬆ back to top](#markdown-header-ranges-crop)**

## Table of Contents

- [Install](#markdown-header-install)
- [Purpose](#markdown-header-purpose)
- [API](#markdown-header-api)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Purpose

Let's say you have an array of string index ranges, for example, `[[1, 4], [5, 10], [15, 99]]`.

Now, string ranges mean that you either want to delete something (string character indexes from the 1st to the 2nd range's argument) and, optionally, add something (3rd argument in the range).

What if the string upon which you want to perform those operations is shorter than the ranges "cover"?

That would mean that some of the "instructions" (ranges) are redundant.

What if your string is only `8` characters-long and range instructs to delete from 15th to 99th character (range `[15, 99]` in the example above)?

You might want to "crop" the array of ranges, turning the example above into: `[[1, 4], [5, 8]]`.

That's what this library does - it takes an **array of ranges** and the **length of a reference string** and crops some ranges if necessary.

**[⬆ back to top](#markdown-header-ranges-crop)**

## API

**rangesCrop(arr, strLen)**

| Input argument | Type                         | Obligatory? | Description                                                                                                                                                                                                                     |
| -------------- | ---------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `arrOfRanges`  | Array of zero or more arrays | yes         | Provide an array of ranges to invert. Ranges do not have to be [sorted](https://bitbucket.org/codsen/codsen/src/master/packages/ranges-sort) or [merged](https://bitbucket.org/codsen/codsen/src/master/packages/ranges-merge). |
| `strLen`       | Integer number               | yes         | Algorithm needs to know the length of the reference string to calculate the inverted last slice's ending index.                                                                                                                 |

**Output**: array of zero or more arrays (so-called _ranges_) where each consists of two or more natural number (or zero) indexes.

This package does not mutate the input array. It creates and **returns a new array** with ranges cropped.

**[⬆ back to top](#markdown-header-ranges-crop)**

## Contributing

- If you see an error, [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=ranges-crop%20package%20-%20put%20title%20here).
- If you want a new feature but can't code it up yourself, also [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=ranges-crop%20package%20-%20put%20title%20here). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=ranges-crop%20package%20-%20put%20title%20here). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://bitbucket.org/codsen/codsen/src/) via BitBucket, then write code, then file a pull request via BitBucket. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#markdown-header-ranges-crop)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/ranges-crop.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ranges-crop
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/codsen/src/master/packages/ranges-crop
[cov-img]: https://img.shields.io/badge/coverage-100%-brightgreen.svg?style=flat-square
[cov-url]: https://bitbucket.org/codsen/codsen/src/master/packages/ranges-crop
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ranges-crop
[downloads-img]: https://img.shields.io/npm/dm/ranges-crop.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ranges-crop
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ranges-crop
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/codsen/src/master/LICENSE
