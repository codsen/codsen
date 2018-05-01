# ast-is-empty

> Find out, is nested array/object/string/AST tree is empty

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
- [Rationale](#rationale)
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<!-- prettier-ignore-end -->

## Install

```bash
npm i ast-is-empty
```

```js
// consume as CommonJS require:
const isEmpty = require("ast-is-empty");
// or as a ES Module:
import isEmpty from "ast-is-empty";
// then, for example, feed a parsed HTML tree into it:
console.log(isEmpty(htmlAstObj));
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                       | Size       |
| ------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------- | ---------- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/ast-is-empty.cjs.js` | 1&nbsp;KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/ast-is-empty.esm.js` | 893&nbsp;B |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/ast-is-empty.umd.js` | 1&nbsp;KB  |

**[⬆ &nbsp;back to top](#)**

## Rationale

Imagine, that you have a nested array which contains plain objects, arrays and strings. Huge tree. This library can tell if it consists of only empty things, by which I mean:

* Arrays or objects with no keys, or
* Arrays or objects that have all keys equal to zero-length strings
* Arrays or objects that have all keys equal to strings that `.trim()` to zero-length
* Zero-length strings
* Or strings that would `.trim()` to zero-length (this includes tabs, line breaks, spaces or mix thereof)

These are empty things, for example:

```js
{
  a: "";
}
```

or

```js
{
  a: [""];
  b: {
    c: {
      d: "";
    }
  }
}
```

or

```js
[
  {
    a: ['']
    b: {c: {d: ''}}
  },
  '',
  ['', '', '']
]
```

Practically speaking, when you work with AST's, all the mentioned empty things are a noise which probably doesn't need to be processed (or needs to be removed altogether).

Functions are not considered to be empty and this library will return `null` if it encounters one anywhere within the `input`. Same with as `undefined` or `null` inputs — both will yield `null`.

**[⬆ &nbsp;back to top](#)**

## API

Anything-in, Boolean-out.
Also, when inappropriate things are given that don't belong to AST's, `null`-out.

```js
isEmpty(
  input // AST tree, or object or array or whatever. Can be deeply-nested.
);
// => true||false
```

**[⬆ &nbsp;back to top](#)**

## Contributing

* If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/ast-is-empty/issues).

* If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/ast-is-empty/issues).

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/ast-is-empty.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ast-is-empty
[travis-img]: https://img.shields.io/travis/codsen/ast-is-empty.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/ast-is-empty
[cov-img]: https://coveralls.io/repos/github/codsen/ast-is-empty/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/ast-is-empty?branch=master
[overall-img]: https://img.shields.io/bithound/code/github/codsen/ast-is-empty.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/ast-is-empty
[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/ast-is-empty.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/ast-is-empty/master/dependencies/npm
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ast-is-empty
[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/ast-is-empty.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/ast-is-empty/master/dependencies/npm
[vulnerabilities-img]: https://snyk.io/test/github/codsen/ast-is-empty/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/ast-is-empty
[downloads-img]: https://img.shields.io/npm/dm/ast-is-empty.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ast-is-empty
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ast-is-empty
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://github.com/prettier/prettier
[license-img]: https://img.shields.io/npm/l/ast-is-empty.svg?style=flat-square
[license-url]: https://github.com/codsen/ast-is-empty/blob/master/license.md
