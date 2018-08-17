# ranges-merge

> Merge and sort arrays which mean string slice ranges

[![Minimum Node version required][node-img]][node-url]
[![Repository is on BitBucket][bitbucket-img]][bitbucket-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#markdown-header-install)
- [The Idea](#markdown-header-the-idea)
- [API](#markdown-header-api)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

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

| Type                                                                                                    | Key in `package.json` | Path                       | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/ranges-merge.cjs.js` | 1 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/ranges-merge.esm.js` | 1 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/ranges-merge.umd.js` | 27 KB |

**[⬆ back to top](#markdown-header-ranges-merge)**

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

**[⬆ back to top](#markdown-header-ranges-merge)**

## API

**rangesMerge(arr)**

It returns a new array of arrays, with ranges merged (where applicable). Original input is not mutated.

## Contributing

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/ranges-merge/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/ranges-merge/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ back to top](#markdown-header-ranges-merge)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/ranges-merge.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ranges-merge
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/ranges-merge
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ranges-merge
[downloads-img]: https://img.shields.io/npm/dm/ranges-merge.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ranges-merge
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ranges-merge
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/ranges-merge
