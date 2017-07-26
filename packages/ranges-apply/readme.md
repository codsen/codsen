# string-replace-slices-array

<a href="https://standardjs.com" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Delete or replace an array of slices in string

[![Build Status][travis-img]][travis-url]
[![Coverage Status][cov-img]][cov-url]
[![bitHound Score][bithound-img]][bithound-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Downloads/Month][downloads-img]][downloads-url]

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Idea](#idea)
- [API](#api)
    - [inputString](#inputstring)
    - [rangesArray](#rangesarray)
- [Usage](#usage)
- [The algorithm](#the-algorithm)
- [In my case](#in-my-case)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
$ npm i -S string-replace-slices-array
```

```js
const replaceSlicesArr = require('string-replace-slices-array')
```

## Idea

You compile an array of string slices, feed it to this library, and it deletes/replaces them for you.

First, make sure you found the exact boundaries of the slice - preview each using `String.slice`:

```js
console.log('>>>' + someString.slice(sliceFrom, sliceTo) + '<<<') // <--- make sure what you see is exactly what you want deleted/replaced or the place where it starts is exactly where you want string inserted
```

Now that you have "from" index, `sliceFrom` and "to" index `sliceTo`, put them into an array and push them into another array. You can push many such "from"-"to" arrays into it.

For replacement, set the new value as a third element in the ranges array: `[sliceFrom, sliceTo, replaceWith]`

That's it. Feed that array of ranges into this package, together with your source string and your deletion/replacement will be done for you.

## API

```js
stringReplaceSlicesArray(inputString, rangesArray[, opts])
```

Returns a string.

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

## The algorithm

The plan is simple - we `array.reduce` your given ranges array, slicing the input string accordingly.

The main thing is unit tests and edge case scenarios. Also, fancy optional features (upcoming) like using character enumeration counting emoji as one character.

## In my case

Originally this library was part of [email-remove-unused-css](https://github.com/codsen/email-remove-unused-css/), where I traversed HTML as a string and compiled an array of things to delete or replace later, in one go. The performance was important, so it was not a good idea to delete/replace things on the spot because each deletion slowed down the process. Instead, I traversed the string, compiled this _to-do_ array, then did the deletion/replacement on the whole thing, **once**. This appears to be the fastest way.

I'm going to use this library in all my HTML processing libraries who work on HTML as on string, without parsing it.

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://standardjs.com) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/codsen/string-replace-slices-array/issues). If you file a pull request, I'll do my best to help you to get it merged as soon as possible. If you have any comments on the code, including ideas how to improve something, don't hesitate to contact me by email.

## Licence

> MIT License (MIT)

> Copyright (c) 2017 Codsen Ltd, Roy Revelt

> Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

> The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[travis-img]: https://travis-ci.org/codsen/string-replace-slices-array.svg?branch=master
[travis-url]: https://travis-ci.org/codsen/string-replace-slices-array

[cov-img]: https://coveralls.io/repos/github/codsen/string-replace-slices-array/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/codsen/string-replace-slices-array?branch=master

[bithound-img]: https://www.bithound.io/github/codsen/string-replace-slices-array/badges/score.svg
[bithound-url]: https://www.bithound.io/github/codsen/string-replace-slices-array

[deps-img]: https://www.bithound.io/github/codsen/string-replace-slices-array/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/codsen/string-replace-slices-array/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/codsen/string-replace-slices-array/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/codsen/string-replace-slices-array/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/string-replace-slices-array.svg
[downloads-url]: https://www.npmjs.com/package/string-replace-slices-array
