# string-find-heads-tails

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> Search for string pairs. A special case of string search algorithm.

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
- [Purpose](#purpose)
- [Usage](#usage)
- [API](#api)
  - [API - Input](#api---input)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
npm i string-find-heads-tails
```

```js
// consume via a require():
const strFindHeadsTails = require('string-find-heads-tails')
// or as an ES Module:
import strFindHeadsTails from 'string-find-heads-tails'
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/string-find-heads-tails.cjs.js` | 8&nbsp;KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/string-find-heads-tails.esm.js` | 7&nbsp;KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/string-find-heads-tails.umd.js` | 37&nbsp;KB

**[⬆ &nbsp;back to top](#)**

## Idea

Take a string, search for a **pair** of strings in it. Let's call the first-one **heads** and second-one **tails**. Finding is the index of the first character of a found string.

There are few rules:

* Each finding must be in sequence: heads - tails - heads - tails.
* When one heads is found, no new heads findings will be accepted into the results until there's a new _tails_ finding. Same goes the opposite way for tails.
* Both heads and tails can be supplied either as a single string or array of strings. Findings are prioritised by their order in the array.

**[⬆ &nbsp;back to top](#)**

## Purpose

It will be used in JSON [pre-processing](https://github.com/codsen/json-variables), replacing the dumb string search being used currently.

## Usage

```js
const strFindHeadsTails = require('string-find-heads-tails')
const res1 = strFindHeadsTails('abcdef', 'b', 'e'),
console.log('res1 = ' + JSON.stringify(res1, null, 4))
// => [[1], [4]]
```

## API

**strFindHeadsTails(str, heads, tails\[, fromIndex])**

Returns an array which has two arrays inside, each containing zero or more natural numbers which indicate the index of each finding's first character.

**IMPORTANT**
The index is based on native JavaScript string indexing where each astral character's length will be counted as two. If you wish to convert the index system to be based on _Unicode character count_, use `nativeToUnicode()` method of [string-convert-indexes](https://github.com/codsen/string-convert-indexes). It can convert the whole nested array output of this library (not to mention number indexes).

**[⬆ &nbsp;back to top](#)**

### API - Input

Input argument   | Type                                       | Obligatory? | Description
-----------------|--------------------------------------------|-------------|-----------
`str`            | String                                     | yes         | The string in which you want to perform a search
`heads`          | String or Array of strings                 | yes         | One or more string, the first half of the set. For example, `['%%-', '%%_']`.
`tails`          | String or Array of strings                 | yes         | One or more string, the second half of the set. For example, `['-%%', '_%%']`.
`fromIndex`      | Natural number or zero as number or string | no          | If you want to start the search later, only from a certain index, set it here. Same as 2nd argument `position` in `String.includes`.

**[⬆ &nbsp;back to top](#)**

## Contributing

Hi! 99% of people in the society are passive - consumers. They wait for others to take action, they prefer to blend in. The remaining 1% are proactive citizens who will _do_ something rather than _wait_. If you are one of that 1%, you're in luck because I am the same and _together_ we can make something happen.

* If you **want a new feature** in this package or you would like to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/string-find-heads-tails/issues). Also, you can [email me](mailto:roy@codsen.com). Just let it out.

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/string-find-heads-tails/issues). Alternatively, you can [email me](mailto:roy@codsen.com).

* If you don't like the code in here and would like to **give advice** about how something could be done better, please do. Same drill - [GitHub issues](https://github.com/codsen/string-find-heads-tails/issues) or [email](mailto:roy@codsen.com), your choice.

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. I'll do my best to merge it quickly. Code style is `airbnb-base`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2017 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/string-find-heads-tails.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-find-heads-tails

[npm-img]: https://img.shields.io/npm/v/string-find-heads-tails.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/string-find-heads-tails

[travis-img]: https://img.shields.io/travis/codsen/string-find-heads-tails.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/string-find-heads-tails

[cov-img]: https://coveralls.io/repos/github/codsen/string-find-heads-tails/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/string-find-heads-tails?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/string-find-heads-tails.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/string-find-heads-tails

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/string-find-heads-tails.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/string-find-heads-tails/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-find-heads-tails

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/string-find-heads-tails.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/string-find-heads-tails/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/string-find-heads-tails/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/string-find-heads-tails

[downloads-img]: https://img.shields.io/npm/dm/string-find-heads-tails.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-find-heads-tails

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-find-heads-tails

[license-img]: https://img.shields.io/npm/l/string-find-heads-tails.svg?style=flat-square
[license-url]: https://github.com/codsen/string-find-heads-tails/blob/master/license.md
