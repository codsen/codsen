# string-find-heads-tails

> Search for string pairs. A special case of string search algorithm.

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
- [Purpose](#markdown-header-purpose)
- [Context](#markdown-header-context)
- [Usage](#markdown-header-usage)
- [API](#markdown-header-api)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Install

```bash
npm i string-find-heads-tails
```

```js
// consume via a require():
const strFindHeadsTails = require("string-find-heads-tails");
// or as an ES Module:
import strFindHeadsTails from "string-find-heads-tails";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                                  | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-find-heads-tails.cjs.js` | 13 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-find-heads-tails.esm.js` | 13 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-find-heads-tails.umd.js` | 44 KB |

**[⬆ back to top](#markdown-header-string-find-heads-tails)**

## Idea

This package helps to find self-created **variables** within a string. _Variables_ are marked with _heads_ and _tails_. For example:

```
Hello %%-first_name-%%!
```

Now, if you know heads (`%%-`) and tails (`-%%`), you want to find out, where are they located in a given string.

The algorithm goes like this:

Take a string, search for a **pair** of strings in it. Let's call the first-one **heads** and second-one **tails**. Finding is the index of the first character of a found string.

There are few rules:

- Each finding must be in sequence: _heads_ - _tails_ - _heads_ - _tails_.
- When one _heads_ is found, no new heads findings will be accepted into the results until there's a new _tails_ finding. Same goes the opposite way, for _tails_.
- Both _heads_ and _tails_ can be supplied either as a single string or array of strings. Findings are prioritised by their order in the array.

**[⬆ back to top](#markdown-header-string-find-heads-tails)**

## Purpose

It will be used in JSON [pre-processing](https://bitbucket.org/codsen/json-variables), replacing the dumb string search being used currently.

## Context

Different programming languages, templating languages and even proprietary notations (such as used by Email Service Providers) use different `heads` and `tails` to mark variable names.

For example,

- Nunjucks templating language would use `{%` and `%}`, then `{{` and `}}` (among others).
- Java JSP's would use `${` and `}` (among others).
- Oracle Responsys, ESP, would use `$(` and `)`.
- ex-eDialog/ex-eBay Enterprise/Zeta Interactive ESP use `_` and `__`.

This library enables to build tools which process such code. All processing starts with searching for variables in a string and `string-find-heads-tails` will help you here.

**[⬆ back to top](#markdown-header-string-find-heads-tails)**

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
```

**[⬆ back to top](#markdown-header-string-find-heads-tails)**

## API

**strFindHeadsTails(str, heads, tails, \[fromIndex])**

**IMPORTANT**
The index is based on native JavaScript string indexing where each astral character's length will be counted as two. If you wish to convert the index system to be based on _Unicode character count_, use `nativeToUnicode()` method of [string-convert-indexes](https://bitbucket.org/codsen/string-convert-indexes). It can convert the whole nested array output of this library (not to mention number indexes).

**[⬆ back to top](#markdown-header-string-find-heads-tails)**

### API - Input

| Input argument | Type                       | Obligatory? | Description                                                                    |
| -------------- | -------------------------- | ----------- | ------------------------------------------------------------------------------ |
| `str`          | String                     | yes         | The string in which you want to perform a search                               |
| `heads`        | String or Array of strings | yes         | One or more string, the first half of the set. For example, `['%%-', '%%_']`.  |
| `tails`        | String or Array of strings | yes         | One or more string, the second half of the set. For example, `['-%%', '_%%']`. |
| `opts`         | Plain object               | no          | An Optional Options Object. See its API below.                                 |

PS. Input arguments are not mutated.

**[⬆ back to top](#markdown-header-string-find-heads-tails)**

### Optional Options Object

| options object's key                            | Type of its value                          | Default                   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ----------------------------------------------- | ------------------------------------------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| {                                               |                                            |                           |
| `fromIndex`                                     | Natural number or zero as number or string | `0`                       | If you want to start the search later, only from a certain index, set it here. Same as 2nd argument `position` in `String.includes`.                                                                                                                                                                                                                                                                                                                                                                                |
| `throwWhenSomethingWrongIsDetected`             | Boolean                                    | `true`                    | By default, if anything wrong is detected, error will be thrown. For example, tails precede heads. Or two conescutive heads or tails are detected. If you want to turn this functionality off, set to `false`. Turning this off automatically sets the `allowWholeValueToBeOnlyHeadsOrTails` (see below) to `true`, that is, error won't be thrown when whole input is equal to one of heads or tails. This setting does not concern wrong input types. To allow input in wrong types, set `relaxedAPI`, see below. |
| `allowWholeValueToBeOnlyHeadsOrTails`           | Boolean                                    | `true`                    | If whole input `str` is equal to one of `heads` or `tails` AND `opts.throwWhenSomethingWrongIsDetected` is `true`, THEN error won't be thrown and that input will not be processed. But if you set this to `false` AND error throwing is on (`opts.throwWhenSomethingWrongIsDetected` is `true`), error will be thrown. This feature is activated only when `opts.throwWhenSomethingWrongIsDetected` is `true`.                                                                                                     |
| `source`                                        | String                                     | `string-find-heads-tails` | Packages that consume this package as a dependency might rely on some of our error `throw`ing functionality. Since `throw`n message mentions the name of the `throw`ee, you can override it, setting to parent package's name.                                                                                                                                                                                                                                                                                      |
| `matchHeadsAndTailsStrictlyInPairsByTheirOrder` | Boolean                                    | `false`                   | If it's set to `true`, the index numbers of heads and tails in their input arrays must match. Different pairs can have different indexes, as long as they match between the pair. For example, `%%_test-%%` or `%%-test_%%`.                                                                                                                                                                                                                                                                                        |
| `relaxedAPI`                                    | Boolean                                    | `false`                   | If it's set to `true`, wrong inputs will instantly yield `[]`. If it's default setting, `false`, it would `throw` an error. This only concerns the checks **before** any real work is done on the input, where error-throwing is controlled by `throwWhenSomethingWrongIsDetected` (see above).                                                                                                                                                                                                                     |

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

**[⬆ back to top](#markdown-header-string-find-heads-tails)**

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

If you want to use Unicode-character-count-based indexing, first convert the output of this library using [string-convert-indexes](https://bitbucket.org/codsen/string-convert-indexes), then use Unicode-character-count-based string slice libraries, for example: [string-slice](https://www.npmjs.com/package/string-slice).

**[⬆ back to top](#markdown-header-string-find-heads-tails)**

## Contributing

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/string-find-heads-tails/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/string-find-heads-tails/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ back to top](#markdown-header-string-find-heads-tails)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/string-find-heads-tails.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-find-heads-tails
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/string-find-heads-tails
[cov-img]: https://coveralls.io/repos/bitbucket/codsen/string-find-heads-tails/badge.svg?style=flat-square&branch=master
[cov-url]: https://coveralls.io/bitbucket/codsen/string-find-heads-tails?branch=master
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-find-heads-tails
[downloads-img]: https://img.shields.io/npm/dm/string-find-heads-tails.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-find-heads-tails
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-find-heads-tails
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/string-find-heads-tails
