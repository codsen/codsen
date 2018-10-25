# ranges-regex

> Perform a regex search on string and get a ranges array of findings (or null)

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
npm i ranges-regex
```

```js
// consume as CommonJS require:
const rangesRegex = require("ranges-regex");
// or as a native ES module:
import rangesRegex from "ranges-regex";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                       | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/ranges-regex.cjs.js` | 2 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/ranges-regex.esm.js` | 2 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/ranges-regex.umd.js` | 30 KB |

**[⬆ back to top](#markdown-header-ranges-regex)**

## Table of Contents

- [Install](#markdown-header-install)
- [Purpose](#markdown-header-purpose)
- [API](#markdown-header-api)
- [Examples](#markdown-header-examples)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Purpose

It takes a string, matches the given regex on it and returns an array of ranges (or null).

This is handy when using _range_-class libraries, for both deletion and/or insertion of character ranges [later](https://www.npmjs.com/package/ranges-apply), down the line.

Similarly to `String.prototype.match()`, a no results case will yield `null`.

**[⬆ back to top](#markdown-header-ranges-regex)**

## API

**rangesRegex(regexp, str, \[replacement])**

| Input argument | Type               | Obligatory? | Description                                                                                       |
| -------------- | ------------------ | ----------- | ------------------------------------------------------------------------------------------------- |
| `regexp`       | Regular expression | yes         | Provide the regexp to apply onto a string                                                         |
| `str`          | String             | yes         | Provide a string upon which to match the regex                                                    |
| `replacement`  | String or `null`   | no          | If you want to add a third argument on every of the finding's third argument values, put it here. |

**Output**: array of zero or more arrays (so-called _ranges_) where each consists of two or more natural number (or zero) indexes OR `null`.

This package does not mutate its inputs.

If the input arguments' types are incorrect or absent, library will `throw` an error.

**[⬆ back to top](#markdown-header-ranges-regex)**

## Examples

Nothing to find:

```js
// nothing to find:
console.log(rare(/yyy/g, "zzzzzzzz"));
// => null

// stick `null` to add onto every of the findings:
const res = rare(/def/g, "abcdefghij_abcdefghij", null);
console.log(JSON.stringify(res, null, 4));
// => [[3, 6, null], [14, 17, null]]
```

Notice, you can use all the features of regexes: global, case insensitive flags and so on.

PS. Be careful not to signify the intention to omit the third argument by setting it to `null`. The `null` is a valid value in _ranges_ [ecosystem](https://bitbucket.org/account/user/codsen/projects/RNG) and it is used in ranges to "kill off" any present insertion values. For example, you merge two ranges and one says "add this" (in a form of third argument) and second says, disregard all that content to add, here's `null` to defuse them for good.

**[⬆ back to top](#markdown-header-ranges-regex)**

## Contributing

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/ranges-regex/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/ranges-regex/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ back to top](#markdown-header-ranges-regex)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/ranges-regex.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ranges-regex
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/ranges-regex
[cov-img]: https://coveralls.io/repos/bitbucket/codsen/ranges-regex/badge.svg?style=flat-square&branch=master
[cov-url]: https://coveralls.io/bitbucket/codsen/ranges-regex?branch=master
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ranges-regex
[downloads-img]: https://img.shields.io/npm/dm/ranges-regex.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ranges-regex
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ranges-regex
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/ranges-regex
