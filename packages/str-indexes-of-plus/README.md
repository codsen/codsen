# str-indexes-of-plus

> Search for a string in another string. Get array of indexes. Full Unicode support.

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
- [Idea](#idea)
- [Usage](#usage)
- [API](#api)
- [The algorithm](#the-algorithm)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<!-- prettier-ignore-end -->

## Install

```bash
npm i str-indexes-of-plus
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                              | Size      |
| ------------------------------------------------------------------------------------------------------- | --------------------- | --------------------------------- | --------- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/str-indexes-of-plus.cjs.js` | 3&nbsp;KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/str-indexes-of-plus.esm.js` | 2&nbsp;KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/str-indexes-of-plus.umd.js` | 6&nbsp;KB |

**[⬆ &nbsp;back to top](#)**

## Idea

Search for a string in another string. Return the array of indexes of any findings. Astral character-friendly. Allows to optionally offset the starting point of the search (3rd argument).

## Usage

```js
const indx = require("str-indexes-of-plus");
var res1 = indx("abczabc", "abc");
console.log("res1 = " + JSON.stringify(res1, null, 4));
// => [0, 4]

// works with strings containing emoji too:
var res2 = indx("ab🦄", "🦄");
console.log("res2 = " + JSON.stringify(res2, null, 4));
// => [2]

// you can offset the starting point, from which the checking commences.
// observe the third input argument:
var res3 = indx("abczabc", "abc", 3);
console.log("res3 = " + JSON.stringify(res3, null, 4));
// => [4]
```

**[⬆ &nbsp;back to top](#)**

## API

**indx(str, searchValue\[, fromIndex])**

Returns an array of zero or more numbers, each indicating the index of each finding's first character. Unicode astral characters are counted correctly, as one character-long.

**[⬆ &nbsp;back to top](#)**

#### str

Type: `string`

First input argument — the string in which you want to perform a search.

#### searchValue

Type: `string`

Second input argument — the string you're looking for.

#### fromIndex

Type: A natural number or zero. `number` or `string`.

An optional third argument - offset index from which to start searching.

## The algorithm

I came up with my own algorithm. It follows the way how I would search for strings myself: iterate through the given string, looking for the first letter. If found, check does second letter match second finding's letter. If it matches, continue matching each consecutive letter. In anything mismatches, start from new, continuing to iterate along the input string.

**[⬆ &nbsp;back to top](#)**

## Contributing

* If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/str-indexes-of-plus/issues).

* If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/str-indexes-of-plus/issues).

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/str-indexes-of-plus.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/str-indexes-of-plus
[travis-img]: https://img.shields.io/travis/codsen/str-indexes-of-plus.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/str-indexes-of-plus
[cov-img]: https://coveralls.io/repos/github/codsen/str-indexes-of-plus/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/str-indexes-of-plus?branch=master
[overall-img]: https://img.shields.io/bithound/code/github/codsen/str-indexes-of-plus.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/str-indexes-of-plus
[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/str-indexes-of-plus.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/str-indexes-of-plus/master/dependencies/npm
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/str-indexes-of-plus
[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/str-indexes-of-plus.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/str-indexes-of-plus/master/dependencies/npm
[vulnerabilities-img]: https://snyk.io/test/github/codsen/str-indexes-of-plus/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/str-indexes-of-plus
[downloads-img]: https://img.shields.io/npm/dm/str-indexes-of-plus.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/str-indexes-of-plus
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/str-indexes-of-plus
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://github.com/prettier/prettier
[license-img]: https://img.shields.io/npm/l/str-indexes-of-plus.svg?style=flat-square
[license-url]: https://github.com/codsen/str-indexes-of-plus/blob/master/license.md
