# arrayiffy-if-string

> Put non-empty strings into arrays, turn empty-ones into empty arrays. Bypass everything else.

[![Minimum Node version required][node-img]][node-url]
[![Repository is on BitBucket][bitbucket-img]][bitbucket-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#markdown-header-install)
- [Idea](#markdown-header-idea)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Install

```bash
npm i arrayiffy-if-string
```

```js
// consume as CommonJS require:
const arrayiffy = require("require arrayiffy-if-string");
// or as an ES module:
import arrayiffy from "arrayiffy-if-string";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                              | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | --------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/arrayiffy-if-string.cjs.js` | 303 B |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/arrayiffy-if-string.esm.js` | 286 B |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/arrayiffy-if-string.umd.js` | 257 B |

**[⬆ back to top](#markdown-header-arrayiffy-if-string)**

## Idea

- If it's a non-empty string, put it into an array and return it.
- If it's empty string, return an empty array.
- If it's anything else, just return it.

```js
const arrayiffy = require("arrayiffy-if-string");
var res = arrayiffy("aaa");
console.log("res = " + JSON.stringify(res, null, 4));
// => ['aaa']
```

```js
const arrayiffy = require("arrayiffy-if-string");
var res = arrayiffy("");
console.log("res = " + JSON.stringify(res, null, 4));
// => []
```

```js
const arrayiffy = require("arrayiffy-if-string");
var res = arrayiffy(true);
console.log("res = " + JSON.stringify(res, null, 4));
// => true
```

It's main purpose is to prepare the input argument options' objects. Check out [check-types-mini](https://bitbucket.org/codsen/check-types-mini).

**[⬆ back to top](#markdown-header-arrayiffy-if-string)**

## Contributing

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/arrayiffy-if-string/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/arrayiffy-if-string/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ back to top](#markdown-header-arrayiffy-if-string)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/arrayiffy-if-string.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/arrayiffy-if-string
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/arrayiffy-if-string
[cov-img]: https://coveralls.io/repos/bitbucket/codsen/arrayiffy-if-string/badge.svg?style=flat-square&branch=master
[cov-url]: https://coveralls.io/bitbucket/codsen/arrayiffy-if-string?branch=master
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/arrayiffy-if-string
[downloads-img]: https://img.shields.io/npm/dm/arrayiffy-if-string.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/arrayiffy-if-string
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/arrayiffy-if-string
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/arrayiffy-if-string
