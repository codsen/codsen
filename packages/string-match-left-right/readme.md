# string-match-left-right

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> Do substrings match what's on the left or right of the given index?

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
- [The API](#the-api)
  - [Optional Options Object's API:](#optional-options-objects-api)
- [`opts.cbLeft` and `opts.cbRight`](#optscbleft-and-optscbright)
- [`opts.trimBeforeMatching`](#optstrimbeforematching)
- [Why my code coverage ~~sucks~~ is not perfect](#why-my-code-coverage-sucks-is-not-perfect)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
$ npm i string-match-left-right
```

```js
// CommonJS way:
const { matchLeftIncl, matchRightIncl, matchLeft, matchRight } = require('string-match-left-right')
// ES  Modules way:
import { matchLeftIncl, matchRightIncl, matchLeft, matchRight } from 'string-match-left-right'
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled, contains `require` and `module.exports` | `main`                | `dist/string-match-left-right.cjs.js` | 5&nbsp;KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/string-match-left-right.esm.js` | 5&nbsp;KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/string-match-left-right.umd.js` | 23&nbsp;KB

**[⬆ &nbsp;back to top](#)**

## The API

There are four methods; all have the same API's:

* **`matchLeftIncl`** — at least one of given substrings has to match what's on the **left** and including character at a given index
* **`matchRightIncl`** — at least one of given substrings has to match what's on the **right** and including character at a given index
* **`matchLeft`** — at least one of given substrings has to match what's on the **left** of the given index
* **`matchRight`** — at least one of given substrings has to match what's on the **right** of the given index

Input argument   | Type                       | Obligatory? | Description
-----------------|----------------------------|-------------|--------------
`str`            | String                     | yes         | Source string to work on
`position`       | Natural number incl. zero  | yes         | Starting index. Can be zero. Otherwise, a natural number.
`whatToMatch`    | String or array of strings | yes         | What should we look for on the particular side, left or right. If array is given, at one or more matches will yield in result `true`
`opts`           | Plain object               | no          | Optional options object. See below.

**[⬆ &nbsp;back to top](#)**

### Optional Options Object's API:

`options` object's key         | Type     | Obligatory? | Default     | Description
-------------------------------|----------|-------------|-------------|----------------------
{                              |          |             |             |
`i`                            | Boolean  | no          | `false`     | If `false`, it's case sensitive. If `true`, it's insensitive.
`cbLeft`                       | Function | no          | `undefined` | If you feed this library a function under `cbLeft` key, in turn, it will be fed the next character outside to the thing being matched. If it's left-side method (`matchLeftIncl`/`matchLeft`), that will be the next character to the left of what's being matched. Function's Boolean result will be used with "AND" logical operator to calculate the final result. I use `cbLeft` mainly to check for whitespace.
`cbRight`                      | Function | no          | `undefined` | Same as `cbLeft`, it's a function you supply that gets fed the first character that's outside on the right of the string being matched. Function has to return a Boolean and it will be "AND" logically chained with the result of string matching.
`trimBeforeMatching`           | Boolean  | no          | `false`     | If set to `true`, there can be whitespace before what's being checked starts. Basically, this means, substring can begin (when using right side methods) or end (when using left side methods) with a whitespace.
}                              |          |             |             |

**Options' defaults**:

```js
{
  i: false
}
```

Options object is sanitized by [check-types-mini](https://github.com/codsen/check-types-mini) which will `throw` if you set options' keys to wrong types or add unrecognized keys.

```js

// K E Y
// -----
// test string with character indexes to help you count:
//
// test string:  abcdefghi
// indexes:      012345678
//
// that is, c is number (term "number" further abbreviated as hash character "#") 2 or i is #8.
//
// we'll be using the same string "abcdefghi" below:

const { matchLeftIncl, matchRightIncl, matchLeft, matchRight } = require('string-match-left-right')

let res1 = matchLeftIncl('abcdefghi', 3, ['bcd']),
// 3rd character is "d" because indexes start from zero.
// We're checking the string to the left of it, "bcd", inclusive of current character ("d").
// This means, "bcd" has to end with existing character and the other chars to the left
// must match exactly:
console.log(`res1 = ${res1}`)
// => res1 = true

let res2 = matchLeft('abcdefghi', 3, ['ab', `zz`]),
// neither "ab" nor "zz" are to the left of 3rd index, "d":
console.log(`res2 = ${res2}`)
// => res2 = false

let res3 = matchRightIncl('abcdefghi', 3, ['def', `zzz`]),
// "def" is to the right of 3rd index (including it), "d":
console.log(`res3 = ${res3}`)
// => res3 = true

let res4 = matchRight('abcdefghi', 3, ['ef', `zz`]),
// One of values, "ef" is exactly to the right of 3rd index, "d":
console.log(`res4 = ${res4}`)
// => res4 = true
```

**[⬆ &nbsp;back to top](#)**

## `opts.cbLeft` and `opts.cbRight`

Often you need not only to match what's on the left/right of the given index within string, but also to perform checks on what's outside.

For example, if you are traversing the string and want to match the `class` attribute, you traverse backwards, "catch" equals character `=`, then check, what's on the left of it using method `matchLeft`. That's not enough, because you also need to check, is the next character outside it is a space, or in algorithm terms, "trims to length zero", that is `(trim(char).length === 0)`. How do you apply this check?

Using `opts.cbLeft`/`opts.cbRight` callbacks ("cb" in it's name stands for CallBack):

```js
const { matchLeftIncl, matchRightIncl, matchLeft, matchRight } = require('string-match-left-right')
// imagine you looped the string and wanted to catch where does attribute "class" start
// and end (not to mention to ensure that it's a real attribute, not something ending with this
// string "class").
// You catch "=", index number 8.
// This library can check, is "class" to the left of it and feed what's to the left of it
// to your supplied callback function, which happens to be a checker "is it a space":
function isSpace(char) {
  return (typeof char === 'string') && (char.trim() === '')
}
let res = matchLeft('<a class="something">', 8, 'class', { cbLeft: isSpace }),
console.log(`res = ${JSON.stringify(res, null, 4)}`)
// => res = true
```

**[⬆ &nbsp;back to top](#)**

## `opts.trimBeforeMatching`

For example, [string-strip-html](https://github.com/codsen/string-strip-html) is using this library to check, is there a known HTML tag name to the right of the opening bracket character (`<`). Like `<div` or `<img`. Now, we want to allow dirty code cases when there's whitespace after the bracket, like `< div`, just in case somebody would sneak in `< script` and some browser would "patch it up". In `string-strip-html`, we want to be able to detect and strip even `<\n\n\nscript>`. That's easy, we set `opts.trimBeforeMatching` to `true`. When matching is performed, substring on the right of `<`, the `\n\n\nscript`, is trimmed into `script`, then matched.

By the way it's not on by default because such scenarios are rare. Default comparison should be a strict-one.

**[⬆ &nbsp;back to top](#)**

## Why my code coverage ~~sucks~~ is not perfect

You may ask: why is the [coverage](https://coveralls.io/github/codsen/string-match-left-right?branch=master) not proper 100%?

I will answer: it's because the source is in ES Modules (`import`/`export`) and because Node (and together with it, AVA, natively) does not support ES modules yet, I have to _transpile_ the code (using Rollup + Babel). This means, we run unit tests not against the _source code_, but against _what Babel generated out of it_. Since Babel adds more stuff and that stuff can change (since we're using "floating" preset `babel-preset-env`), I can't 100% guarantee that unit tests will cover transpiled code 100%.

At least we cover 100% of the lines:

![current coverage situation](https://cdn.rawgit.com/codsen/string-match-left-right/45b3724d/media/coverage.png)

**[⬆ &nbsp;back to top](#)**

## Contributing

Hi! 99% of people in the society are passive - consumers. They wait for others to take action, they prefer to blend in. The remaining 1% are proactive citizens who will _do_ something rather than _wait_. If you are one of that 1%, you're in luck because I am the same and _together_ we can make something happen.

* If you **want a new feature** in this package or you would like to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/string-match-left-right/issues). Also, you can [email me](mailto:roy@codsen.com). Just let it out.

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/string-match-left-right/issues). Alternatively, you can [email me](mailto:roy@codsen.com).

* If you don't like the code in here and would like to **give an advice** about how something could be done better, please do. Same drill - [GitHub issues](https://github.com/codsen/string-match-left-right/issues) or [email](mailto:roy@codsen.com), your choice.

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. I'll do my best to merge it quickly. Code style is `airbnb`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2017 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/string-match-left-right.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-match-left-right

[npm-img]: https://img.shields.io/npm/v/string-match-left-right.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/string-match-left-right

[travis-img]: https://img.shields.io/travis/codsen/string-match-left-right.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/string-match-left-right

[cov-img]: https://coveralls.io/repos/github/codsen/string-match-left-right/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/string-match-left-right?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/string-match-left-right.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/string-match-left-right

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/string-match-left-right.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/string-match-left-right/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-match-left-right

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/string-match-left-right.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/string-match-left-right/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/string-match-left-right/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/string-match-left-right

[downloads-img]: https://img.shields.io/npm/dm/string-match-left-right.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-match-left-right

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-match-left-right

[license-img]: https://img.shields.io/npm/l/string-match-left-right.svg?style=flat-square
[license-url]: https://github.com/codsen/string-match-left-right/blob/master/license.md
