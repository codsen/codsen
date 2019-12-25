# csv-sort

> Sorts double-entry bookkeeping CSV coming from internet banking

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

Other siblings of this package:

- CLI for it: `csv-sort-cli` [on npm](https://www.npmjs.com/package/csv-sort-cli), [on GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/csv-sort-cli)

## Table of Contents

- [Install](#install)
- [TLDR;](#tldr)
- [This library does two twings:](#this-library-does-two-twings)
- [Usage](#usage)
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i csv-sort
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`cSort`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const cSort = require("csv-sort");
```

or as an ES Module:

```js
import cSort from "csv-sort";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/csv-sort/dist/csv-sort.umd.js"></script>
```

```js
// in which case you get a global variable "csvSort" which you consume like this:
const cSort = csvSort;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                   | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/csv-sort.cjs.js` | 13 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/csv-sort.esm.js` | 14 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/csv-sort.umd.js` | 34 KB |

**[⬆ back to top](#)**

## TLDR;

`csv-sort` can correct the order of rows of _any_ accounting CSV files that come in [double entry bookkeeping](https://en.wikipedia.org/wiki/Double-entry_bookkeeping_system) format:

![double bookkeeping example](https://glcdn.githack.com/codsen/codsen/raw/63d7dc7cee9c957d3dc51d14af99b557c081a250/packages/csv-sort/media/img1.png)

Currently (late 2017) Lloyds Bank website exports CSV files with some rows from the same day in a wrong order. This library is my attempt to to fix such CSV's.

**[⬆ back to top](#)**

## This library does two twings:

- Sorts rows in correct order that follows the double-entry format.
- Trims the empty columns and rows (so-called 2D-Trim^).

![2D trim of a CSV contents](https://glcdn.githack.com/codsen/codsen/raw/63d7dc7cee9c957d3dc51d14af99b557c081a250/packages/csv-sort/media/img2.png)

In later releases I would like to be able to recognise and fix any offset columns caused by misinterpreted commas as values.

^ 1D-Trim would be trim of a string. 3D-Trim would be some sort of spatial data trim.

**[⬆ back to top](#)**

## Usage

```js
const cSort = require("csv-sort");
const input = `123456,Client #1 payment,,1000,1940
123456,Bought carpet,30,,950
123456,Bought table,10,,940
123456,Bought pens,10,,1000
123456,Bought chairs,20,,980
`;
const { res } = cSort(input)
  .join(",")
  .join("\n");
console.log(`${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${res}`);
// =>
// 123456,Client #1 payment,,1000,1940
// 123456,Bought table,10,,940
// 123456,Bought carpet,30,,950
// 123456,Bought chairs,20,,980
// 123456,Bought pens,10,,1000
```

**[⬆ back to top](#)**

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

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=csv-sort%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Acsv-sort%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=csv-sort%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Acsv-sort%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=csv-sort%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Acsv-sort%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

List of [currency signs](https://github.com/bengourley/currency-symbol-map) - Copyright © 2017 Ben Gourley - see its [BSD-2-Clause disclaimer](https://opensource.org/licenses/BSD-2-Clause)

[node-img]: https://img.shields.io/node/v/csv-sort.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/csv-sort
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/csv-sort
[cov-img]: https://img.shields.io/badge/coverage-97.92%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/csv-sort
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/csv-sort
[downloads-img]: https://img.shields.io/npm/dm/csv-sort.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/csv-sort
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/csv-sort
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
