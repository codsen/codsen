# ranges-merge

> Merge and sort arrays which mean string slice ranges

[![Minimum Node version required][node-img]][node-url]
[![Build Status][travis-img]][travis-url]
[![Coverage][cov-img]][cov-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Known Vulnerabilities][vulnerabilities-img]][vulnerabilities-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

<!-- prettier-ignore-start -->

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [The Idea](#the-idea)
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<!-- prettier-ignore-end -->

## Install

```bash
npm i ranges-merge
```

```js
// consume as a CommonJS require:
const mergeRanges = require("ranges-merge");
// or as native ES Module:
import mergeRanges from "ranges-merge";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                       | Size       |
| ------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------- | ---------- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/ranges-merge.cjs.js` | 2&nbsp;KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/ranges-merge.esm.js` | 1&nbsp;KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/ranges-merge.umd.js` | 16&nbsp;KB |

**[⬆ &nbsp;back to top](#)**

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

**[⬆ &nbsp;back to top](#)**

## API

**rangesMerge(arr)**

It returns a new array of arrays, with ranges merged (where applicable).

## Contributing

* If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/ranges-merge/issues).

* If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/ranges-merge/issues).

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/ranges-merge.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ranges-merge
[travis-img]: https://img.shields.io/travis/codsen/ranges-merge.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/ranges-merge
[cov-img]: https://coveralls.io/repos/github/codsen/ranges-merge/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/ranges-merge?branch=master
[overall-img]: https://img.shields.io/bithound/code/github/codsen/ranges-merge.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/ranges-merge
[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/ranges-merge.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/ranges-merge/master/dependencies/npm
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ranges-merge
[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/ranges-merge.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/ranges-merge/master/dependencies/npm
[vulnerabilities-img]: https://snyk.io/test/github/codsen/ranges-merge/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/ranges-merge
[downloads-img]: https://img.shields.io/npm/dm/ranges-merge.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ranges-merge
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ranges-merge
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://github.com/prettier/prettier
[license-img]: https://img.shields.io/npm/l/ranges-merge.svg?style=flat-square
[license-url]: https://github.com/codsen/ranges-merge/blob/master/license.md
