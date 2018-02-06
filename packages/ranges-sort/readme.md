# ranges-sort

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> Sort natural number index ranges [ [5, 6], [1, 3] ] => [ [1, 3], [5, 6] ]

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

## Install

```bash
npm i ranges-sort
```

```js
// consume as CommonJS require:
const rangesSort = require('ranges-sort')
// or as a native ES module:
import rangesSort from 'ranges-sort'
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/ranges-sort.cjs.js` | 3&nbsp;KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/ranges-sort.esm.js` | 3&nbsp;KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/ranges-sort.umd.js` | 15&nbsp;KB

**[⬆ &nbsp;back to top](#)**

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Rationale](#rationale)
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Rationale

It sorts the array of index arrays, for example:

```js
[ [5, 6], [1, 3] ] => [ [1, 3], [5, 6] ]
[ [5, 6], [5, 3], [5, 0] ] => [ [5, 0], [5, 3], [5, 6] ]
[] => []

[[1, 2], []] => // throws, because there's at least one empty range
[['a']] => // throws, because range is not a range but a string
[[1], [2]] => // throws, because one index is not a range

// 3rd argument and onwards are ignored:
[[3, 4, 'aaa', 'bbb'], [1, 2, 'zzz']] => [[1, 2, 'zzz'], [3, 4, 'aaa', 'bbb']]
```

**[⬆ &nbsp;back to top](#)**

## API

**rangesSort(arr[, opts])**

Input argument   | Type         | Obligatory? | Description
-----------------|--------------|-------------|--------------
`arrOfRanges`    | Plain object | yes         | Array of zero or more arrays meaning natural number ranges (2 elements each)
`opts`           | Plain object | no          | Optional options go here.


For example,

```js
[ [5, 9], [5, 3] ] => [ [5, 3], [5, 9] ]
```

This package does not mutate the input array.

**[⬆ &nbsp;back to top](#)**

### Options object

`options` object's key             | Type     | Obligatory? | Default     | Description
-----------------------------------|----------|-------------|-------------|----------------------
{                                  |          |             |             |
`strictlyTwoElementsInRangeArrays` | Boolean  | no          | `false`     | If set to true, all ranges must have two and only elements, otherwise error is thrown. For example, input being `[ [1, 2, 'zzz'] ]` would throw (3 elements), as well as `[ ['a'] ]` (1 element).
}                                  |          |             |             |

**Output:** Sorted input array. First, we sort by the first argument of each child range array, then by second.

**[⬆ &nbsp;back to top](#)**

## Contributing

* If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/ranges-sort/issues).

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/ranges-sort/issues).

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. Code style is `airbnb-base`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt


[node-img]: https://img.shields.io/node/v/ranges-sort.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ranges-sort

[npm-img]: https://img.shields.io/npm/v/ranges-sort.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/ranges-sort

[travis-img]: https://img.shields.io/travis/codsen/ranges-sort.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/ranges-sort

[cov-img]: https://coveralls.io/repos/github/codsen/ranges-sort/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/ranges-sort?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/ranges-sort.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/ranges-sort

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/ranges-sort.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/ranges-sort/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ranges-sort

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/ranges-sort.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/ranges-sort/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/ranges-sort/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/ranges-sort

[downloads-img]: https://img.shields.io/npm/dm/ranges-sort.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ranges-sort

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ranges-sort

[license-img]: https://img.shields.io/npm/l/ranges-sort.svg?style=flat-square
[license-url]: https://github.com/codsen/ranges-sort/blob/master/license.md
