# csv-sort

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> Sorts double-entry bookkeeping CSV coming from internet banking

[![Minimum Node version required][node-img]][node-url]
[![Link to npm page][npm-img]][npm-url]
[![Build Status][travis-img]][travis-url]
[![Coverage][cov-img]][cov-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Known Vulnerabilities][vulnerabilities-img]][vulnerabilities-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![MIT License][license-img]][license-url]

Other siblings of this package:
<!-- * Front end: [csvpony.com](https://csvpony.com) -->
* CLI (command-line app) version: [csv-sort-cli](https://github.com/codsen/csv-sort-cli)

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [TLDR;](#tldr)
- [This lib does two twings:](#this-lib-does-two-twings)
- [Usage](#usage)
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
npm i csv-sort
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/csv-sort.cjs.js` | 19&nbsp;KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/csv-sort.esm.js` | 19&nbsp;KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/csv-sort.umd.js` | 54&nbsp;KB

**[⬆ &nbsp;back to top](#)**

## TLDR;

`csv-sort` can correct the order of rows of _any_ accounting CSV files that come in [double entry bookkeeping](https://en.wikipedia.org/wiki/Double-entry_bookkeeping_system) format:

![double bookkeeping example](https://cdn.rawgit.com/codsen/csv-sort/e273cf48/media/img1.png)

Currently (late 2017) Lloyds Bank website exports CSV files with some rows from the same day in a wrong order. This library is my attempt to to fix such CSV's.

**[⬆ &nbsp;back to top](#)**

## This lib does two twings:

* Sorts rows in correct order that follows the double-entry format.
* Trims the empty columns and rows (so-called 2D-Trim^).

![2D trim of a CSV contents](https://cdn.rawgit.com/codsen/csv-sort/2bdf5256/media/img2.png)

In later releases I would like to be able to recognise and fix any offset columns caused by misinterpreted commas as values.

<small>^ 1D-Trim would be trim of a string. 3D-Trim would be some sort of spatial data trim.</small>

**[⬆ &nbsp;back to top](#)**

## Usage

```js
const csvSort = require('csv-sort')
// ...
```

## API

* Input - string
* Output - plain object:

output object                  | Type     | Description
-------------------------------|----------|----------------------
{                              |          |
`res`                          | Array    | Array of arrays, each containing a column's value.
`msgContent`                   | String   | This application outputs the messages here.
`msgType`                      | String   | Can be either `alert` or `info`. That's similar to an icon on the hypothetical UI.
}                              |          |

If the input is anything else than a `string`, it will `throw`.
If the input is an empty string, the output object's `res` key will be equal to `[['']]`.

**[⬆ &nbsp;back to top](#)**

## Contributing

* If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/csv-sort/issues).

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/csv-sort/issues).

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. Code style is `airbnb-base`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt
List of [currency signs](https://github.com/bengourley/currency-symbol-map) - Copyright © 2017 Ben Gourley - see its [BSD-2-Clause disclaimer](https://opensource.org/licenses/BSD-2-Clause)

[node-img]: https://img.shields.io/node/v/csv-sort.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/csv-sort

[npm-img]: https://img.shields.io/npm/v/csv-sort.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/csv-sort

[travis-img]: https://img.shields.io/travis/codsen/csv-sort.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/csv-sort

[cov-img]: https://coveralls.io/repos/github/codsen/csv-sort/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/csv-sort?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/csv-sort.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/csv-sort

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/csv-sort.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/csv-sort/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/csv-sort

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/csv-sort.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/csv-sort/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/csv-sort/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/csv-sort

[downloads-img]: https://img.shields.io/npm/dm/csv-sort.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/csv-sort

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/csv-sort

[license-img]: https://img.shields.io/npm/l/csv-sort.svg?style=flat-square
[license-url]: https://github.com/codsen/csv-sort/blob/master/license.md
