# string-replace-slices-array

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> Delete or replace an array of slices in string

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
- [API](#api)
- [Usage](#usage)
- [The algorithm](#the-algorithm)
- [In my case](#in-my-case)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
npm i string-replace-slices-array
```

```js
// consume as CommonJS require:
const replaceSlicesArr = require('string-replace-slices-array')
// or as ES Module:
import replaceSlicesArr from 'string-replace-slices-array'
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/string-replace-slices-array.cjs.js` | 3&nbsp;KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/string-replace-slices-array.esm.js` | 3&nbsp;KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/string-replace-slices-array.umd.js` | 3&nbsp;KB

**[⬆ &nbsp;back to top](#)**

## Idea

Let's say you want to delete bunch of characters from a string and also to replace some. Technically this means you need to mark the indexes of the characters where you start deletion and where you end. That's two numbers to put into an array. They mark a _slice_ of string. Let's add a third element into that array - what to put instead. If it's blank, nothing will be added (it becomes a deletion operation), if it's a non-empty string, it will be inserted insted of the deleted characters (it becomes a replacement operation).

```js
[
  [10, 15], // <-- delete this string slice range
  [18, 20, 'replace with this'] // <-- delete from 18th to 20th, then insert string there
]
```

Now what happens when you have a few slices? You put them into a _parent array_.

This library consumes such parent array and does the actual job crunching your string according to the list of _slices_.

Now, let's do it practically.

First, make sure you found the exact boundaries of the slice - preview each using `String.slice`:

```js
console.log('>>>' + someString.slice(sliceFrom, sliceTo) + '<<<') // <--- make sure what you see is exactly what you want deleted/replaced or the place where it starts is exactly where you want string inserted
```

**PSST.** Check out [string-slices-array-push](https://github.com/codsen/string-slices-array-push) which helps to manage the `rangesArray`. It has methods to add and retrieve the slices. Also, it helps in cases where slices overlap and helps to maintain the order of index ranges (it always goes from smallest to largest index, everywhere).

**[⬆ &nbsp;back to top](#)**

## API

```js
stringReplaceSlicesArray(inputString, rangesArray) // options will come in later releases
```

Returns a string with requested slices deleted/replaced.

#### inputString

**Type**: `string` - the string we want to work on.

#### rangesArray

**Type**: `array` - the array of zero or more arrays containing a range and an optional replacement string.

For example,

```js
[
  [10, 15], // <-- deletion
  [18, 20, 'replace with this'] // <-- replacement
]
```

**[⬆ &nbsp;back to top](#)**

## Usage

```js
const repl = require('string-replace-slices-array')
let str = 'aaa delete me bbb and me too ccc'
// we preview the slice #1 - we're happy to replace it:
console.log('slice 1: >>>' + str.slice(4, 13) + '<<<')
// slice #2 will be replaced too:
console.log('slice 2: >>>' + str.slice(18, 28) + '<<<\n')
//
str = repl(
  str,
  [
    [4, 13, 'zzz'],
    [18, 28, 'yyy']
  ]
)
console.log('str = ' + str)
// => 'aaa zzz bbb yyy ccc',
```

To insert a piece of string into a string pass the index where you want the string inserted as both "from" and "to" values:

```js
const repl = require('string-replace-slices-array')
let str = 'aaa  ccc'
//
str = repl(
  str,
  [
    [4, 4, 'bbb']
  ]
)
console.log('str = ' + str)
// 'aaa bbb ccc'
```

**[⬆ &nbsp;back to top](#)**

## The algorithm

The plan is simple - we `array.reduce` your given ranges array, slicing the input string accordingly.

The main thing is unit tests and edge case scenarios. Also, fancy optional features (upcoming) like using character enumeration counting emoji as one character.

**[⬆ &nbsp;back to top](#)**

## In my case

Originally this library was part of [email-remove-unused-css](https://github.com/codsen/email-remove-unused-css/), where I traversed HTML as a string and compiled an array of things to delete or replace later, in one go. The performance was important, so it was not a good idea to delete/replace things on the spot because each deletion slowed down the process. Instead, I traversed the string, compiled this _to-do_ array, then did the deletion/replacement on the whole thing, **once**. This appears to be the fastest way.

I'm going to use this library in all my HTML processing libraries who work on HTML as on string, without parsing it.

**[⬆ &nbsp;back to top](#)**

## Contributing

Hi! 99% of people in the society are passive - consumers. They wait for others to take action, they prefer to blend in. The remaining 1% are proactive citizens who will _do_ something rather than _wait_. If you are one of that 1%, you're in luck because I am the same and _together_ we can make something happen.

* If you **want a new feature** in this package or you would like to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/string-replace-slices-array/issues). Also, you can [email me](mailto:roy@codsen.com). Just let it out.

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/string-replace-slices-array/issues). Alternatively, you can [email me](mailto:roy@codsen.com).

* If you don't like the code in here and would like to **give advice** about how something could be done better, please do. Same drill - [GitHub issues](https://github.com/codsen/string-replace-slices-array/issues) or [email](mailto:roy@codsen.com), your choice.

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. I'll do my best to merge it quickly. Code style is `airbnb-base`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2017 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/string-replace-slices-array.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-replace-slices-array

[npm-img]: https://img.shields.io/npm/v/string-replace-slices-array.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/string-replace-slices-array

[travis-img]: https://img.shields.io/travis/codsen/string-replace-slices-array.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/string-replace-slices-array

[cov-img]: https://coveralls.io/repos/github/codsen/string-replace-slices-array/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/string-replace-slices-array?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/string-replace-slices-array.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/string-replace-slices-array

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/string-replace-slices-array.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/string-replace-slices-array/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-replace-slices-array

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/string-replace-slices-array.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/string-replace-slices-array/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/string-replace-slices-array/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/string-replace-slices-array

[downloads-img]: https://img.shields.io/npm/dm/string-replace-slices-array.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-replace-slices-array

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-replace-slices-array

[license-img]: https://img.shields.io/npm/l/string-replace-slices-array.svg?style=flat-square
[license-url]: https://github.com/codsen/string-replace-slices-array/blob/master/license.md
