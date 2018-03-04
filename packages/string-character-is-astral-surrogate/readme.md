# string-character-is-astral-surrogate

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> Tells, is given character a part of astral character, specifically, a high and low surrogate

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

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Idea](#idea)
- [Usage](#usage)
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
npm i string-character-is-astral-surrogate
```

```js
// consume via a CommonJS require:
const { isHighSurrogate, isLowSurrogate } = require('string-character-is-astral-surrogate')
// or as an ES Module:
import { isHighSurrogate, isLowSurrogate } from 'string-character-is-astral-surrogate'
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/string-character-is-astral-surrogate.cjs.js` | 2&nbsp;KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/string-character-is-astral-surrogate.esm.js` | 1&nbsp;KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/string-character-is-astral-surrogate.umd.js` | 1018&nbsp;B

**[⬆ &nbsp;back to top](#)**

## Idea

When you traverse the string the most efficient way, index-by-index, using a `for` loop, you might stumble upon astral character low and high surrogates. Basically, first and second part of the astral character (like emoji).

This library helps to identify low and high surrogates.

No other library seems to be able to do that.

For example, [astral-regex](https://www.npmjs.com/package/astral-regex) can tell you, does a string contain astral characters or does the given character comprise of two surrogates. But it won't help you identify them _separately_.

I need to be able to identify **surrogates separately** to be able to cover cases such as surrogates without second counterpart. Basically, this library will give tool to cater for all cases of messed up astral characters.

In itself, this library is very simple, two functions:

**isHighSurrogate (char)**
**isLowSurrogate (char)**

It reads the character at first index (the first Unicode code point) and evaluates its `charcode`. That's it.

In theory, high surrogate goes first, low surrogate goes second [source](https://unicodebook.readthedocs.io/unicode_encodings.html#surrogates).

**[⬆ &nbsp;back to top](#)**

## Usage

```js
const { isHighSurrogate, isLowSurrogate } = require('string-character-is-astral-surrogate')
// 🧢 = \uD83E\uDDE2
console.log(isHighSurrogate('\uD83E'))
// => true
// the first character, high surrogate of the cap is indeed a high surrogate

console.log(isHighSurrogate('\uDDE2'))
// => false
// the second character, low surrogate of the cap is NOT a high surrogate

console.log(isLowSurrogate('\uD83E'))
// => false
// the first character, high surrogate of the cap is NOT a low surrogate
// it's high surrogate

console.log(isLowSurrogate('\uDDE2'))
// => true
// the second character, low surrogate of the cap is indeed a low surrogate

// PS.
// undefined yields false, doesn't throw
console.log(isHighSurrogate(undefined))
// => false

console.log(isLowSurrogate(undefined))
// => false
```

**[⬆ &nbsp;back to top](#)**

## API

Two functions, same API:
**isHighSurrogate(str)**
**isLowSurrogate(str)**

**Input**: zero or more characters, where `charCodeAt(0)` will be evaluated.
**Output**: Boolean

* If input is empty string or undefined, `false` is returned.
* If input is anything other than the string or undefined, type error is thrown.
* If input consists of more characters, everything beyond `.charCodeAt(0)` is ignored.

We return false to make life easier when traversing the string. When you check "next" character, if it doesn't exist, as far as astral-ness is concerned, we're fine, so it yields `false`. Otherwise, you'd have to check the input before feeding into this library and that's is tedious. This is a low-level library and it doesn't have to be picky.

**[⬆ &nbsp;back to top](#)**

## Contributing

* If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/string-character-is-astral-surrogate/issues).

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/string-character-is-astral-surrogate/issues).

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. Code style is `airbnb-base`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt


[node-img]: https://img.shields.io/node/v/string-character-is-astral-surrogate.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-character-is-astral-surrogate

[npm-img]: https://img.shields.io/npm/v/string-character-is-astral-surrogate.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/string-character-is-astral-surrogate

[travis-img]: https://img.shields.io/travis/codsen/string-character-is-astral-surrogate.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/string-character-is-astral-surrogate

[cov-img]: https://coveralls.io/repos/github/codsen/string-character-is-astral-surrogate/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/string-character-is-astral-surrogate?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/string-character-is-astral-surrogate.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/string-character-is-astral-surrogate

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/string-character-is-astral-surrogate.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/string-character-is-astral-surrogate/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-character-is-astral-surrogate

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/string-character-is-astral-surrogate.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/string-character-is-astral-surrogate/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/string-character-is-astral-surrogate/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/string-character-is-astral-surrogate

[downloads-img]: https://img.shields.io/npm/dm/string-character-is-astral-surrogate.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-character-is-astral-surrogate

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-character-is-astral-surrogate

[license-img]: https://img.shields.io/npm/l/string-character-is-astral-surrogate.svg?style=flat-square
[license-url]: https://github.com/codsen/string-character-is-astral-surrogate/blob/master/license.md
