# string-convert-indexes

> Convert string character indexes from JS native index-based to Unicode character-count-based and backwards.

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
- [Practical use](#practical-use)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<!-- prettier-ignore-end -->

## Install

```bash
npm i string-convert-indexes
```

```js
// consume via a require():
const { nativeToUnicode, unicodeToNative } = require("string-convert-indexes");
// or as a ES Module:
import { nativeToUnicode, unicodeToNative } from "string-convert-indexes";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                                 | Size       |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------ | ---------- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-convert-indexes.cjs.js` | 10&nbsp;KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-convert-indexes.esm.js` | 10&nbsp;KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-convert-indexes.umd.js` | 37&nbsp;KB |

**[⬆ &nbsp;back to top](#)**

## Idea

We are talking about indexes, the numbers used in, for example, `String.slice`.

Some libraries use JS native indexing where emoji counts as two characters.
Some libraries use indexing based on character-count where one emoji counts as one character.

This is a converter that converts between the two systems.

Highlights:

* Efficient algorithm - input string is traversed only once.
* No regexes - no potential security issues.
* Input can be a number or a numeric string or it can be **nested tree of them**. This library will convert _any_ natural numbers (set as numbers or strings). For example, `1` is fine, just like `[["1", "5"], ["5", "7"]]`.
* Untranspiled ES Modules build is wired up to `module` key in `package.json` - WebPack and Rollup will recognise and consume it.
* The main export is transpiled to ES5 (wired up to `main` key in `package.json`). You'll have no issues with `create-react-app`.

**[⬆ &nbsp;back to top](#)**

## Usage

```js
const { nativeToUnicode, unicodeToNative } = require("string-convert-indexes");
// or
import { nativeToUnicode, unicodeToNative } from "string-convert-indexes";

// CONVERTING NATIVE JS INDEXES TO UNICODE-CHAR-COUNT-BASED

// convert the index of the character at index zero, to Unicode-character-count-based index:
const res1 = nativeToUnicode("\uD834\uDF06aa", 0);
console.log(`res1 = ${JSON.stringify(res1, null, 4)}`);
// => 0

// at index #1 we have second surrogate of Unicode astral symbol which has index number #0
const res2 = nativeToUnicode("\uD834\uDF06aa", "1");
console.log(`res2 = ${JSON.stringify(res2, null, 4)}`);
// => '0' <--- notice it's retained as string. Same type as input is kept!

// at position index #2 we have first letter a
// its Unicode-based index, character count starting at zero, would be 1:
const res3 = nativeToUnicode("\uD834\uDF06aa", 2);
console.log(`res3 = ${JSON.stringify(res3, null, 4)}`);
// => 1

// at index #1 we have second surrogate of Unicode astral symbol which has index number #0
const res4 = nativeToUnicode("\uD834\uDF06aa", 3);
console.log(`res4 = ${JSON.stringify(res4, null, 4)}`);
// => 0

// convert many indexes at once - any nested data structure is fine:
const res5 = nativeToUnicode("\uD834\uDF06aa", [1, 0, 2, 3]);
console.log(`res5 = ${JSON.stringify(res5, null, 4)}`);
// => [0, 0, 1, 2]

// Also, works with numeric strings, as long as they are natural numbers or zeros.
// Observe how nested array is retained and string values are given back as strings:
const res6 = nativeToUnicode("\uD834\uDF06aa", [1, "0", [[[2]]], 3]);
console.log(`res6 = ${JSON.stringify(res6, null, 4)}`);
// => ['0', 0, [[[1]]], 2]

// CONVERTING UNICODE-CHAR-COUNT-BASED TO NATIVE JS INDEXES

const res7 = unicodeToNative("\uD834\uDF06aa", [0, 1, 2]);
console.log(`res7 = ${JSON.stringify(res7, null, 4)}`);
// => [0, 2, 3]

const res8 = unicodeToNative("\uD834\uDF06aa", [1, 0, 2]);
console.log(`res8 = ${JSON.stringify(res8, null, 4)}`);
// => [2, 0, 3],

const res9 = unicodeToNative("\uD834\uDF06aa", [1, 0, 2, 3]);
// throws an error!
// that's because there's no character (counting Unicode characters) with index 3
// we have only three Unicode characters, so indexes go only up until 2, not reaching 3 we need
```

**[⬆ &nbsp;back to top](#)**

## API

Two methods:

**nativeToUnicode(str, indexes\[, opts])**

Converts JS native indexes to indexes (used in let's say `String.slice()`), based on Unicode character count.

---

**unicodeToNative(str, indexes\[, opts])**

Converts Unicode character count-based indexes to JS native indexes.

**[⬆ &nbsp;back to top](#)**

### API - Input

API for both methods is the same:

| Input argument | Type         | Obligatory? | Description                                                                                                                                                                                     |
| -------------- | ------------ | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `str`          | String       | yes         | The string in which you want to perform a search                                                                                                                                                |
| `indexes`      | Whatever     | yes         | It can be anything: from numbers to nested arrays or arrays of numeric strings. Only natural numbers (incl. zero) in number or string shape will be compiled and replaced with converted value. |
| `opts`         | Plain object | no          | Options object. See its API below in a separate table.                                                                                                                                          |

**[⬆ &nbsp;back to top](#)**

### Optional Options Object

| Optional Options Object's key                          | Type of its value | Default | Description                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------------ | ----------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| {                                                      |                   |         |
| `throwIfAnyOfTheIndexesAreOutsideOfTheReferenceString` | Boolean           | `true`  | If some index is not covered by Unicode character at that index (`unicodeToNative` conversion) or by native JS string index (`nativeToUnicode` conversion), we can't reliably convert that index. We don't know how many astral characters lead to it (or not). If you want to turn off error throwing in such cases and make this package leave those uncovered indexes alone, set it to `false`. |
| }                                                      |                   |         |

Here are all the defaults in one place:

```js
{
  throwIfAnyOfTheIndexesAreOutsideOfTheReferenceString: true,
}
```

**[⬆ &nbsp;back to top](#)**

## Practical use

I have created quite a few string processing libraries, and some are using native JS indexes, while some are using Unicode character count-based indexing. This library will make them all more universal.

**[⬆ &nbsp;back to top](#)**

## Contributing

* If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/string-convert-indexes/issues).

* If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/string-convert-indexes/issues).

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/string-convert-indexes.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-convert-indexes
[travis-img]: https://img.shields.io/travis/codsen/string-convert-indexes.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/string-convert-indexes
[cov-img]: https://coveralls.io/repos/github/codsen/string-convert-indexes/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/string-convert-indexes?branch=master
[overall-img]: https://img.shields.io/bithound/code/github/codsen/string-convert-indexes.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/string-convert-indexes
[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/string-convert-indexes.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/string-convert-indexes/master/dependencies/npm
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-convert-indexes
[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/string-convert-indexes.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/string-convert-indexes/master/dependencies/npm
[vulnerabilities-img]: https://snyk.io/test/github/codsen/string-convert-indexes/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/string-convert-indexes
[downloads-img]: https://img.shields.io/npm/dm/string-convert-indexes.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-convert-indexes
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-convert-indexes
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://github.com/prettier/prettier
[license-img]: https://img.shields.io/npm/l/string-convert-indexes.svg?style=flat-square
[license-url]: https://github.com/codsen/string-convert-indexes/blob/master/license.md
