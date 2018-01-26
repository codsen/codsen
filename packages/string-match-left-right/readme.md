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
- [`opts.cb`](#optscb)
- [`opts.trimBeforeMatching`](#optstrimbeforematching)
- [`opts.trimCharsBeforeMatching`](#optstrimcharsbeforematching)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
npm i string-match-left-right
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
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/string-match-left-right.cjs.js` | 10&nbsp;KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/string-match-left-right.esm.js` | 10&nbsp;KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/string-match-left-right.umd.js` | 21&nbsp;KB

**[⬆ &nbsp;back to top](#)**

## The API

### Input

There are four methods; all have the same API's:

* **`matchLeftIncl`** — at least one of given substrings has to match what's on the **left** and including character at the given index
* **`matchRightIncl`** — at least one of given substrings has to match what's on the **right** and including character at the given index
* **`matchLeft`** — at least one of given substrings has to match what's on the **left** of the given index
* **`matchRight`** — at least one of given substrings has to match what's on the **right** of the given index

Input argument   | Type                       | Obligatory? | Description
-----------------|----------------------------|-------------|--------------
`str`            | String                     | yes         | Source string to work on
`position`       | Natural number incl. zero  | yes         | Starting index. Can be zero. Otherwise, a natural number.
`whatToMatch`    | String or array of strings | yes         | What should we look for on the particular side, left or right. If array is given, at one or more matches will yield in result `true`
`opts`           | Plain object               | no          | The Optional Options Object. See below.

**[⬆ &nbsp;back to top](#)**

### Output

Returns Boolean `false` or value of the string that was matched, that is,

* if `whatToMatch` was a string, then returns it, OR
* if `whatToMatch` was an array, then returns the first match from this array's elements.

**[⬆ &nbsp;back to top](#)**

### Optional Options Object's API:

`options` object's key         | Type     | Obligatory? | Default     | Description
-------------------------------|----------|-------------|-------------|----------------------
{                              |          |             |             |
`i`                            | Boolean  | no          | `false`     | If `false`, it's case sensitive. If `true`, it's insensitive.
`cb`                           | Function | no          | `undefined` | If you feed a function to this key, that function will be called with the remainder of the string. Which side, it depends on which side method (left side for `matchLeft` and `matchLeftIncl` and others for right accordingly) is being called. The result of this callback will be joined using "AND" logical operator to calculate the final result. I use `cb` mainly to check for whitespace.
`trimBeforeMatching`           | Boolean  | no          | `false`     | If set to `true`, there can be whitespace before what's being checked starts. Basically, this means, substring can begin (when using right side methods) or end (when using left side methods) with a whitespace.
`trimCharsBeforeMatching`      | String or Array of zero or more strings, each 1 character-long | no          | `[]`     | If set to `true`, similarly like `trimBeforeMatching` will remove whitespace, this will remove any characters you provide in an array. For example, useful when checking for tag names to the right of `<`, with or without closing slash, `<div` or `</div`.
}                              |          |             |             |

Here it is with defaults, in one place, ready for copying:

```js
{
  i: false,
  cb: undefined,
  trimBeforeMatching: false,
  trimCharsBeforeMatching: []
}
```

The Optional Options Object is sanitized by [check-types-mini](https://github.com/codsen/check-types-mini) which will `throw` if you set options' keys to wrong types or add any unrecognized keys.

```js

// K E Y
// -----
// test string with character indexes to help you count:
//
// test string:                a  b  c  d  e  f  g  h  i
// indexes of letters above:   0  1  2  3  4  5  6  7  8
//
// a is #0, b is #1 and so on. Look the digit under letter above.
//
// that is, c is number (term "number" further abbreviated as hash character "#") 2 or i is #8.
//
// we'll be using the same string "abcdefghi" below:

const { matchLeftIncl, matchRightIncl, matchLeft, matchRight } = require('string-match-left-right')

let res1 = matchLeftIncl('abcdefghi', 3, ['bcd'])
// 3rd character is "d" because indexes start from zero.
// We're checking the string to the left of it, "bcd", inclusive of current character ("d").
// This means, "bcd" has to end with existing character and the other chars to the left
// must match exactly:
console.log(`res1 = ${res1}`)
// => res1 = 'bcd'

let res2 = matchLeft('abcdefghi', 3, ['ab', `zz`])
// neither "ab" nor "zz" are to the left of 3rd index, "d":
console.log(`res2 = ${res2}`)
// => res2 = false

let res3 = matchRightIncl('abcdefghi', 3, ['def', `zzz`])
// "def" is to the right of 3rd index (including it), "d":
console.log(`res3 = ${res3}`)
// => res3 = 'def'

let res4 = matchRight('abcdefghi', 3, ['ef', `zz`])
// One of values, "ef" is exactly to the right of 3rd index, "d":
console.log(`res4 = ${res4}`)
// => res4 = 'ef'
```

**[⬆ &nbsp;back to top](#)**

## `opts.cb`

Often you need not only to match what's on the left/right of the given index within string, but also to perform checks on what's outside.

For example, if you are traversing the string and want to match the `class` attribute, you traverse backwards, "catch" equals character `=`, then check, what's on the left of it using method `matchLeft`. That's not enough, because you also need to check, is the next character outside it is a space, or in algorithm terms, "trims to length zero", that is `(trim(char).length === 0)`. How do you apply this check?

Using `opts.cb` callbacks ("cb" stands for CallBack):

```js
const { matchLeftIncl, matchRightIncl, matchLeft, matchRight } = require('string-match-left-right')
// imagine you looped the string and wanted to catch where does attribute "class" start
// and end (not to mention to ensure that it's a real attribute, not something ending with this
// string "class").
// You catch "=", an index number 8.
// This library can check, is "class" to the left of it and feed what's to the left of it
// to your supplied callback function, which happens to be a checker "is it a space":
function isSpace(char) {
  return (typeof char === 'string') && (char.trim() === '')
}
let res = matchLeft('<a class="something">', 8, 'class', { cb: isSpace })
console.log(`res = ${JSON.stringify(res, null, 4)}`)
// => res = 'class'
```

The callback function will receive three arguments:

* first argument - the character on the left/right side (depending which side method this is)
* second argment - whole substring that begins or ends with first argument. This might come handy if you want to perform check on more than one character outside of the matched characters.
* third argment - the index of the character that was given at the first argument.

For example:

```js
const { matchLeftIncl, matchRightIncl, matchLeft, matchRight } = require('string-match-left-right')

function startsWithZ(firstCharacter, wholeSubstring, index) {
  // console.log(`firstCharacter = ${JSON.stringify(firstCharacter, null, 4)}`)
  // console.log(`wholeSubstring = ${JSON.stringify(wholeSubstring, null, 4)}`)
  // console.log(`index = ${JSON.stringify(index, null, 4)}`)
  return wholeSubstring.startsWith('z')
}

// "zzz" and "yyy" are dummies to show there can be multiple values to match against

const test01 = matchLeft('<div><b>aaa</b></div>', 5, ['zzz', 'yyy', '<div>'])
console.log(`test01 = ${JSON.stringify(test01, null, 4)}`)
// => '<div>', // the 5th index is left bracket of <b>. Yes, <div> is on the left.

const test02 = matchLeft('z<div ><b>aaa</b></div>', 7, ['zzz', 'yyy', '<div>'])
console.log(`test02 = ${JSON.stringify(test02, null, 4)}`)
// => false, // the 7th index is left bracket of <b>. Yes, <div> is on the left.

const test03 = matchLeft('z<div ><b>aaa</b></div>', 7, ['zzz', 'yyy', '<div'], { trimCharsBeforeMatching: ['>', ' '] })
console.log(`test03 = ${JSON.stringify(test03, null, 4)}`)
// => '<div', // the 7th index is left bracket of <b>. Yes, <div> is on the left.

const test04 = matchLeft('z<div ><b>aaa</b></div>', 7, ['zzz', 'yyy', '<div'], { cb: startsWithZ, trimCharsBeforeMatching: ['>', ' '] })
console.log(`test04 = ${JSON.stringify(test04, null, 4)}`)
// => '<div', // the 7th index is left bracket of <b>. Yes, <div> is on the left.

const test05 = matchLeft('<div ><b>aaa</b></div>', 6, ['zzz', 'yyy', '<div'], { cb: startsWithZ, trimCharsBeforeMatching: ['>', ' '] }),
console.log(`test05 = ${JSON.stringify(test05, null, 4)}`)
// => false, // deliberately making the second arg of cb to be blank and fail startsWithZ
```

Notice how the first matched element is being returned (or Boolean `false`).

**VERY IMPORTANT**

Callback's returned value will be used to calculate the final result.

Final result = Boolean value of **matching** AND Boolean value of **callback**

This means, if you set a callback and forget to return a truthy value from it, even if there was a match, return would be `false`, because both match comparison AND the callback have to be _truthy_ to yield _truthy_ output (which is output not as `true` but as matched string value).

You can also use the callback inline:

```js
const res = matchRightIncl('ab      cdef', 2, 'cd', {
  trimBeforeMatching: true,
  cb: (char, theRemainderOfTheString, index) => {
    t.is(
      char,
      'e',
      '04.01.07',
    )
    t.is(
      theRemainderOfTheString,
      'ef',
      '04.01.08',
    )
    t.is(
      index,
      10,
      '04.01.09',
    )
  },
})
console.log(`res = ${JSON.stringify(res, null, 4)}`)
// res = false,
// because callback didn't return anything (so returned undefined), even
// though the "cd" was matched!
```

**[⬆ &nbsp;back to top](#)**

## `opts.trimBeforeMatching`

For example, [string-strip-html](https://github.com/codsen/string-strip-html) is using this library to check, is there a known HTML tag name to the right of the opening bracket character (`<`). Like `<div` or `<img`. Now, we want to allow dirty code cases when there's whitespace after the bracket, like `< div`, just in case somebody would sneak in `< script` and some browser would "patch it up". In `string-strip-html`, we want to be able to detect and strip even `<\n\n\nscript>`. That's easy, we set `opts.trimBeforeMatching` to `true`. When matching is performed, substring on the right of `<`, the `\n\n\nscript`, is trimmed into `script`, then matched.

By the way it's not on by default because such scenarios are rare. Default comparison should be a strict-one.

**[⬆ &nbsp;back to top](#)**

## `opts.trimCharsBeforeMatching`

For example, [string-strip-html](https://github.com/codsen/string-strip-html) will look for opening and closing tags. First it will locate opening bracket `<`. Then it will check, is there a known tag name to the right, but trimming any `/`'s, to account for closing slashes.

**[⬆ &nbsp;back to top](#)**

## Contributing

* If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/string-match-left-right/issues).

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/string-match-left-right/issues).

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. Code style is `airbnb-base`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt


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
