# charcode-is-valid-xml-name-character

> Does a given character belong to XML spec's "Production 4 OR 4a" type (is acceptable for XML element's name)

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
- [What is does](#what-is-does)
- [In practice](#in-practice)
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<!-- prettier-ignore-end -->

## Install

```bash
npm i charcode-is-valid-xml-name-character
```

```js
// consume via a CommonJS require:
const {
  isProduction4,
  isProduction4a
} = require("charcode-is-valid-xml-name-character");

// or as an ES Module:
import {
  isProduction4,
  isProduction4a
} from "charcode-is-valid-xml-name-character";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                                               | Size       |
| ------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------------------------------- | ---------- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/charcode-is-valid-xml-name-character.cjs.js` | 2&nbsp;KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/charcode-is-valid-xml-name-character.esm.js` | 2&nbsp;KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/charcode-is-valid-xml-name-character.umd.js` | 20&nbsp;KB |

**[⬆ &nbsp;back to top](#)**

## What is does

It returns a Boolean, is the given character the [Production 4a](https://www.w3.org/TR/REC-xml/#NT-NameStartChar) of XML spec, or in human terms, a possible ending character of an XML element.

This library is used to detect where (X)HTML element names end.

This article contains a very thorough explanation of the spec terminology: https://www.xml.com/pub/a/2001/07/25/namingparts.html — it helped me to get up to speed on this subject.

**[⬆ &nbsp;back to top](#)**

## In practice

Let's say you are iterating through string, character-by-character and it contains (X)HTML code source. This library will evaluate any given character and tell, is it a valid character for an element name. You use this library to detect where element names end.

In the most simple scenario:

```
<img class="">
    ^     ^
    1     2
```

Characters `space` (1) and `=` (2) in the example above mark the ending of the element names (`img` and `class`). OK, so we know spaces and equals' are not allowed as element names and therefore mark their ending. Are there more of such characters? Oh yes. Actually quite a lot according to [spec](https://www.w3.org/TR/REC-xml/#NT-NameChar) what warrants a proper library dedicated only for that.

**[⬆ &nbsp;back to top](#)**

## API

Two functions - one to check requirements for **first character**, another to check requirements for **second character** and onwards. Both functions return a Boolean.

### `isProduction4()` - requirements for 1st char

XML spec [production 4](https://www.w3.org/TR/REC-xml/#NT-NameStartChar) - the requirements for the first character of the XML element. It's more strict than requirements for the subsequent characters, see [production 4a]() below.

Pass any character (including astral-one) into function `isProduction4()` and it will respond with a Boolean, is it acceptable as first XML character (or not).

```js
const {
  isProduction4
  // isProduction4a,
} = require("charcode-is-valid-xml-name-character");

const res1 = isProduction4("-");
console.log("res1 = " + res1);
// => 'res1 = false <---- minus is not allowed for first character

const res2 = isProduction4("z");
console.log("res2 = " + res2);
// => 'res2 = true
```

It **consumes** a single character (can be any Unicode character, including astral-one, comprising of two surrogates).
**Returns** Boolean - is it acceptable as the first character in XML element's name.

**[⬆ &nbsp;back to top](#)**

### `isProduction4a()` - requirements for 2st char onwards

XML spec [production 4a](https://www.w3.org/TR/REC-xml/#NT-NameChar) - the requirements for the second character onwards in XML element's name.

Pass any character (including astral-one) into function `isProduction4a()` and it will respond with a Boolean, is it acceptable as second XML character and onwards (or not). Requirements are same as for the first character but a bit more lax.

```js
const {
  // isProduction4,
  isProduction4a
} = require("charcode-is-valid-xml-name-character");

const res1 = isProduction4a("-");
console.log("res1 = " + res1);
// => 'res1 = true <---- minus is allowed for second character-onwards

const res2 = isProduction4a("z");
console.log("res2 = " + res2);
// => 'res2 = true
```

It **consumes** a single character (can be any Unicode character, including astral-one, comprising of two surrogates).
**Returns** Boolean - is it acceptable as the second or subsequent character in XML element's name.

**[⬆ &nbsp;back to top](#)**

## Contributing

* If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/charcode-is-valid-xml-name-character/issues).

* If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/charcode-is-valid-xml-name-character/issues).

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/charcode-is-valid-xml-name-character.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/charcode-is-valid-xml-name-character
[travis-img]: https://img.shields.io/travis/codsen/charcode-is-valid-xml-name-character.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/charcode-is-valid-xml-name-character
[cov-img]: https://coveralls.io/repos/github/codsen/charcode-is-valid-xml-name-character/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/charcode-is-valid-xml-name-character?branch=master
[overall-img]: https://img.shields.io/bithound/code/github/codsen/charcode-is-valid-xml-name-character.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/charcode-is-valid-xml-name-character
[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/charcode-is-valid-xml-name-character.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/charcode-is-valid-xml-name-character/master/dependencies/npm
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/charcode-is-valid-xml-name-character
[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/charcode-is-valid-xml-name-character.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/charcode-is-valid-xml-name-character/master/dependencies/npm
[vulnerabilities-img]: https://snyk.io/test/github/codsen/charcode-is-valid-xml-name-character/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/charcode-is-valid-xml-name-character
[downloads-img]: https://img.shields.io/npm/dm/charcode-is-valid-xml-name-character.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/charcode-is-valid-xml-name-character
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/charcode-is-valid-xml-name-character
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://github.com/prettier/prettier
[license-img]: https://img.shields.io/npm/l/charcode-is-valid-xml-name-character.svg?style=flat-square
[license-url]: https://github.com/codsen/charcode-is-valid-xml-name-character/blob/master/license.md
