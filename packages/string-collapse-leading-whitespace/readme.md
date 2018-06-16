# string-collapse-leading-whitespace

> Collapse the leading and trailing whitespace of a string

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
- [API](#markdown-header-api)
- [Purpose](#markdown-header-purpose)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Install

```bash
npm i string-collapse-leading-whitespace
```

```js
// consume via a CommonJS require:
const collapseLeadingWhitespace = require("string-collapse-leading-whitespace");
// or as an ES Module:
import collapseLeadingWhitespace from "string-collapse-leading-whitespace";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                                             | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------------------ | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-collapse-leading-whitespace.cjs.js` | 1 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-collapse-leading-whitespace.esm.js` | 1 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-collapse-leading-whitespace.umd.js` | 603 B |

**[⬆ back to top](#markdown-header-string-collapse-leading-whitespace)**

## Idea

```js
// does nothing to trimmed strings:
'aaa' => 'aaa'
// if leading or trailing whitespace doesn't contain \n, collapse to a single space
'  aaa   ' => ' aaa '
// otherwise, collapse to a single \n
'     \n\n   aaa  \n\n\n    ' => '\naaa\n'
```

**[⬆ back to top](#markdown-header-string-collapse-leading-whitespace)**

## API

API is simple: `string` in, `string` out.

If input is not a string, it will be just returned back, untouched.

## Purpose

I'm going to use it in [string-slices-array-push](https://bitbucket.org/codsen/string-slices-array-push).

## Contributing

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/string-collapse-leading-whitespace/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/string-collapse-leading-whitespace/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ back to top](#markdown-header-string-collapse-leading-whitespace)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/string-collapse-leading-whitespace.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-collapse-leading-whitespace
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/string-collapse-leading-whitespace
[cov-img]: https://coveralls.io/repos/bitbucket/codsen/string-collapse-leading-whitespace/badge.svg?style=flat-square&branch=master
[cov-url]: https://coveralls.io/bitbucket/codsen/string-collapse-leading-whitespace?branch=master
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-collapse-leading-whitespace
[downloads-img]: https://img.shields.io/npm/dm/string-collapse-leading-whitespace.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-collapse-leading-whitespace
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-collapse-leading-whitespace
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/string-collapse-leading-whitespace
