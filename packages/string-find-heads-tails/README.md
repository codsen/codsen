# string-find-heads-tails

> Search for string pairs. A special case of string search algorithm.

[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#install)
- [Idea](#idea)
- [Purpose](#purpose)
- [Context](#context)
- [Usage](#usage)
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i string-find-heads-tails
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`strFindHeadsTails`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const strFindHeadsTails = require("string-find-heads-tails");
```

or as an ES Module:

```js
import strFindHeadsTails from "string-find-heads-tails";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/string-find-heads-tails/dist/string-find-heads-tails.umd.js"></script>
```

```js
// in which case you get a global variable "stringFindHeadsTails" which you consume like this:
const strFindHeadsTails = stringFindHeadsTails;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                                  | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-find-heads-tails.cjs.js` | 12 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-find-heads-tails.esm.js` | 12 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-find-heads-tails.umd.js` | 13 KB |

**[⬆ back to top](#)**

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

**[⬆ back to top](#)**

## Purpose

It will be used in JSON [pre-processing](https://gitlab.com/codsen/codsen/tree/master/packages/json-variables), replacing the dumb string search being used currently.

## Context

Different programming languages, templating languages and even proprietary notations (such as used by Email Service Providers) use different `heads` and `tails` to mark variable names.

For example,

- Nunjucks templating language would use `{%` and `%}`, then `{{` and `}}` (among others).
- Java JSP's would use `${` and `}` (among others).
- Oracle Responsys, ESP, would use `$(` and `)`.
- ex-eDialog/ex-eBay Enterprise/Zeta Interactive ESP use `_` and `__`.

This library enables to build tools which process such code. All processing starts with searching for variables in a string and `string-find-heads-tails` will help you here.

**[⬆ back to top](#)**

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

**[⬆ back to top](#)**

## API

**strFindHeadsTails(str, heads, tails, \[fromIndex])**

**IMPORTANT**
The index is based on native JavaScript string indexing where each astral character's length will be counted as two. If you wish to convert the index system to be based on _Unicode character count_, use `nativeToUnicode()` method of [string-convert-indexes](https://gitlab.com/codsen/codsen/tree/master/packages/string-convert-indexes). It can convert the whole nested array output of this library (not to mention number indexes).

**[⬆ back to top](#)**

### API - Input

| Input argument | Type                       | Obligatory? | Description                                                                    |
| -------------- | -------------------------- | ----------- | ------------------------------------------------------------------------------ |
| `str`          | String                     | yes         | The string in which you want to perform a search                               |
| `heads`        | String or Array of strings | yes         | One or more string, the first half of the set. For example, `['%%-', '%%_']`.  |
| `tails`        | String or Array of strings | yes         | One or more string, the second half of the set. For example, `['-%%', '_%%']`. |
| `opts`         | Plain object               | no          | An Optional Options Object. See its API below.                                 |

PS. Input arguments are not mutated.

**[⬆ back to top](#)**

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

**[⬆ back to top](#)**

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

If you want to use Unicode-character-count-based indexing, first convert the output of this library using [string-convert-indexes](https://gitlab.com/codsen/codsen/tree/master/packages/string-convert-indexes), then use Unicode-character-count-based string slice libraries, for example: [string-slice](https://www.npmjs.com/package/string-slice).

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-find-heads-tails%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-find-heads-tails%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-find-heads-tails%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-find-heads-tails%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-find-heads-tails%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-find-heads-tails%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-find-heads-tails
[cov-img]: https://img.shields.io/badge/coverage-98.71%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-find-heads-tails
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-find-heads-tails
[downloads-img]: https://img.shields.io/npm/dm/string-find-heads-tails.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-find-heads-tails
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-find-heads-tails
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
