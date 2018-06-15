# csv-sort

> Sorts double-entry bookkeeping CSV coming from internet banking

[![Minimum Node version required][node-img]][node-url]
[![Repository is on BitBucket][bitbucket-img]][bitbucket-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

Other siblings of this package:

- CLI (command-line app) version: [csv-sort-cli](https://bitbucket.org/codsen/csv-sort-cli)

## Table of Contents

- [Table of Contents](#markdown-header-markdown-header-table-of-contents)
- [Install](#markdown-header-markdown-header-install)
- [TLDR;](#markdown-header-markdown-header-tldr)
- [This library does two twings:](#markdown-header-markdown-header-this-library-does-two-twings)
- [Usage](#markdown-header-markdown-header-usage)
- [API](#markdown-header-markdown-header-api)
- [Contributing](#markdown-header-markdown-header-contributing)
- [Licence](#markdown-header-markdown-header-licence)

## Install

```bash
npm i csv-sort
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                   | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/csv-sort.cjs.js` | 19 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/csv-sort.esm.js` | 20 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/csv-sort.umd.js` | 66 KB |

**[⬆ back to top](#)**

## TLDR;

`csv-sort` can correct the order of rows of _any_ accounting CSV files that come in [double entry bookkeeping](https://en.wikipedia.org/wiki/Double-entry_bookkeeping_system) format:

![double bookkeeping example](https://bitbucket.org/codsen/csv-sort/raw/47683eb03fbe1fc254d7363f53ccc0b874e474b2/media/img1.png)

Currently (late 2017) Lloyds Bank website exports CSV files with some rows from the same day in a wrong order. This library is my attempt to to fix such CSV's.

**[⬆ back to top](#)**

## This library does two twings:

- Sorts rows in correct order that follows the double-entry format.
- Trims the empty columns and rows (so-called 2D-Trim^).

![2D trim of a CSV contents](https://bitbucket.org/codsen/csv-sort/raw/47683eb03fbe1fc254d7363f53ccc0b874e474b2/media/img2.png)

In later releases I would like to be able to recognise and fix any offset columns caused by misinterpreted commas as values.

^ 1D-Trim would be trim of a string. 3D-Trim would be some sort of spatial data trim.

**[⬆ back to top](#)**

## Usage

```js
const csvSort = require("csv-sort");
const input = `123456,Client #1 payment,,1000,1940
123456,Bought carpet,30,,950
123456,Bought table,10,,940
123456,Bought pens,10,,1000
123456,Bought chairs,20,,980
`;
const { res } = csvSort(input);
console.log(`${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${res}`);
// =>
// 123456,Client #1 payment,,1000,1940
// 123456,Bought table,10,,940
// 123456,Bought carpet,30,,950
// 123456,Bought chairs,20,,980
// 123456,Bought pens,10,,1000
//
```

## API

- Input - string
- Output - plain object:

| output object | Type   | Description                                                                        |
| ------------- | ------ | ---------------------------------------------------------------------------------- |
| {             |        |
| `res`         | Array  | Array of arrays, each containing a column's value.                                 |
| `msgContent`  | String | This application outputs the messages here.                                        |
| `msgType`     | String | Can be either `alert` or `info`. That's similar to an icon on the hypothetical UI. |
| }             |        |

If the input is anything else than a `string`, it will `throw`.
If the input is an empty string, the output object's `res` key will be equal to `[['']]`.

**[⬆ back to top](#)**

## Contributing

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/csv-sort/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/csv-sort/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

List of [currency signs](https://github.com/bengourley/currency-symbol-map) - Copyright © 2017 Ben Gourley - see its [BSD-2-Clause disclaimer](https://opensource.org/licenses/BSD-2-Clause)

[node-img]: https://img.shields.io/node/v/csv-sort.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/csv-sort
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/csv-sort
[cov-img]: https://coveralls.io/repos/bitbucket/codsen/csv-sort/badge.svg?style=flat-square&branch=master
[cov-url]: https://coveralls.io/bitbucket/codsen/csv-sort?branch=master
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/csv-sort
[downloads-img]: https://img.shields.io/npm/dm/csv-sort.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/csv-sort
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/csv-sort
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/csv-sort
