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
- [Context](#context)
- [Usage](#usage)
- [API](#api)
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
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/string-find-heads-tails.cjs.js` | 15&nbsp;KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/string-find-heads-tails.esm.js` | 15&nbsp;KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/string-find-heads-tails.umd.js` | 39&nbsp;KB

**[⬆ &nbsp;back to top](#)**

## Idea

This package helps to find self-created **variables** within a string. _Variables_ are marked with _heads_ and _tails_. For example:

```
Hello %%-first_name-%%!
```

Now, if you know heads (`%%-`) and tails (`-%%`), you want to find out, where are they located in a given string.

The algorithm goes like this:

Take a string, search for a **pair** of strings in it. Let's call the first-one **heads** and second-one **tails**. Finding is the index of the first character of a found string.

There are few rules:

* Each finding must be in sequence: heads - tails - heads - tails.
* When one heads is found, no new heads findings will be accepted into the results until there's a new _tails_ finding. Same goes the opposite way for tails.
* Both heads and tails can be supplied either as a single string or array of strings. Findings are prioritised by their order in the array.

**[⬆ &nbsp;back to top](#)**

## Purpose

It will be used in JSON [pre-processing](https://github.com/codsen/json-variables), replacing the dumb string search being used currently.

## Context

Different programming languages, templating languages and even proprietary notations (such as used by Email Service Providers) use different `heads` and `tails` to mark variable names.

For example,

* Nunjucks templating language would use `{%` and `%}`, then `{{` and `}}` (among others).
* Java JSP's would use `${` and `}` (among others).
* Oracle Responsys, ESP, would use `$(` and `)`.
* ex-eDialog/ex-eBay Enterprise/Zeta Interactive ESP use `_` and `__`.

This library enables to build tools which process such code. All processing starts with searching for variables in a string and `string-find-heads-tails` will help you here.

## Usage

```js

const strFindHeadsTails = require('string-find-heads-tails')
const res1 = strFindHeadsTails('abcdef', 'b', 'e'),
console.log('res1 = ' + JSON.stringify(res1, null, 4))
// => [{
//      headsStartAt: 1,
//      headsEndAt: 2,
//      tailsStartAt: 4,
//      tailsEndAt: 5,
//    }]
]
```

**[⬆ &nbsp;back to top](#)**

## API

**strFindHeadsTails(str, heads, tails, \[fromIndex])**

**IMPORTANT**
The index is based on native JavaScript string indexing where each astral character's length will be counted as two. If you wish to convert the index system to be based on _Unicode character count_, use `nativeToUnicode()` method of [string-convert-indexes](https://github.com/codsen/string-convert-indexes). It can convert the whole nested array output of this library (not to mention number indexes).

**[⬆ &nbsp;back to top](#)**

### API - Input

Input argument   | Type                       | Obligatory? | Description
-----------------|----------------------------|-------------|-----------
`str`            | String                     | yes         | The string in which you want to perform a search
`heads`          | String or Array of strings | yes         | One or more string, the first half of the set. For example, `['%%-', '%%_']`.
`tails`          | String or Array of strings | yes         | One or more string, the second half of the set. For example, `['-%%', '_%%']`.
`opts`           | Plain object               | no          | An Optional Options Object. See its API below.

PS. Input arguments are not mutated.

**[⬆ &nbsp;back to top](#)**

### Optional Options Object

options object's key                               | Type of its value                          | Default                   | Description
---------------------------------------------------|--------------------------------------------|---------------------------|----------------------
{                                                  |                                            |                           |
`fromIndex`                                        | Natural number or zero as number or string | `0`                       | If you want to start the search later, only from a certain index, set it here. Same as 2nd argument `position` in `String.includes`.
`throwWhenSomethingWrongIsDetected`                | Boolean                                    | `true`                    | By default, if anything wrong is detected, error will be thrown. For example, tails precede heads. Or two conescutive heads or tails are detected. If you want to turn this functionality off, set to `false`. Turning this off automatically sets the `allowWholeValueToBeOnlyHeadsOrTails` (see below) to `true`, that is, error won't be thrown when whole input is equal to one of heads or tails. This setting does not concern wrong input types. To allow input in wrong types, set `relaxedAPI`, see below.
`allowWholeValueToBeOnlyHeadsOrTails`              | Boolean                                    | `true`                    | If whole input `str` is equal to one of `heads` or `tails` AND `opts.throwWhenSomethingWrongIsDetected` is `true`, THEN error won't be thrown and that input will not be processed. But if you set this to `false` AND error throwing is on (`opts.throwWhenSomethingWrongIsDetected` is `true`), error will be thrown. This feature is activated only when `opts.throwWhenSomethingWrongIsDetected` is `true`.
`source`                                           | String                                     | `string-find-heads-tails` | Packages that consume this package as a dependency might rely on some of our error `throw`ing functionality. Since `throw`n message mentions the name of the `throw`ee, you can override it, setting to parent package's name.
`matchHeadsAndTailsStrictlyInPairsByTheirOrder`    | Boolean                                    | `false`                   | If it's set to `true`, the index numbers of heads and tails in their input arrays must match. Different pairs can have different indexes, as long as they match between the pair. For example, `%%_test-%%` or `%%-test_%%`.
`relaxedAPI`                                       | Boolean                                    | `false`                   | If it's set to `true`, wrong inputs will instantly yield `[]`. If it's default setting, `false`, it would `throw` an error. This only concerns the checks **before** any real work is done on the input, where error-throwing is controlled by `throwWhenSomethingWrongIsDetected` (see above).
}

Here is the Optional Options Object in one place with all default settings:

```js
{
  fromIndex: 0,
  throwWhenSomethingWrongIsDetected: true,
  allowWholeValueToBeOnlyHeadsOrTails: true,
  source: 'string-find-heads-tails',
  matchHeadsAndTailsStrictlyInPairsByTheirOrder: false,
  relaxedAPI: false
}
```

**[⬆ &nbsp;back to top](#)**

### API - Output

Returns an array of zero or more plain objects, each having format:

```js
{
  headsStartAt: 1,
  headsEndAt: 2,
  tailsStartAt: 4,
  tailsEndAt: 5,
}
```

The whole idea is that you should be able to get the `heads` if you put `str.slice(headsStartAt, headsEndAt)`.

If you want to use Unicode-character-count-based indexing, first convert the output of this library using [string-convert-indexes](https://github.com/codsen/string-convert-indexes), then use Unicode-character-count-based string slice libraries, for example: [string-slice](https://www.npmjs.com/package/string-slice).

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

Copyright © 2018 Codsen Ltd, Roy Revelt

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
