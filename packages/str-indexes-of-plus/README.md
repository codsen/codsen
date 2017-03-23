# str-indexes-of-plus

<a href="https://github.com/feross/standard" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Search for a string in another string. Get array of indexes. Full Unicode support.

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
- [The algorithm](#the-algorithm)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
$ npm i -S str-indexes-of-plus
```

## Idea

Search for a string in another string. Return the array of indexes of any findings. Astral character-friendly. Allows to optionally offset the starting point of the search (3rd argument).

## Usage

```js
const indx = require('str-indexes-of-plus')
var res1 = indx('abczabc', 'abc')
console.log('res1 = ' + JSON.stringify(res1, null, 4))
// => [0, 4]

// works with strings containing emoji too:
var res2 = indx('ab🦄', '🦄')
console.log('res2 = ' + JSON.stringify(res2, null, 4))
// => [2]

// you can offset the starting point, from which the checking commences.
// observe the third input argument:
var res3 = indx('abczabc', 'abc', 3)
console.log('res3 = ' + JSON.stringify(res3, null, 4))
// => [4]
```

## API

### indx(str, searchValue\[, fromIndex])

Returns an array of zero or more numbers, each indicating the index of each finding's first character. Unicode astral characters are counted correctly, as one character-long.

#### str

Type: `string`

First input argument — the string in which you want to perform a search.

#### searchValue

Type: `string`

Second input argument — the string you're looking for.

#### fromIndex

Type: A natural number or zero. `number` or `string`.

An optional third argument - offset index from which to start searching.

## The algorithm

I came up with my own algorithm. It follows the way how I would search for strings myself: iterate through the given string, looking for the first letter. If found, check does second letter match second finding's letter. If it matches, continue matching each consecutive letter. In anything mismatches, start from new, continuing to iterate along the input string.

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://github.com/feross/standard) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/code-and-send/str-indexes-of-plus/issues). If you file a pull request, I'll do my best to help you to get it merged as soon as possible. If you have any comments on the code, including ideas how to improve something, don't hesitate to contact me by email.

## Licence

> MIT License (MIT)

> Copyright (c) 2017 Codsen Ltd, Roy Reveltas

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

[travis-img]: https://travis-ci.org/code-and-send/str-indexes-of-plus.svg?branch=master
[travis-url]: https://travis-ci.org/code-and-send/str-indexes-of-plus

[cov-img]: https://coveralls.io/repos/github/code-and-send/str-indexes-of-plus/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/code-and-send/str-indexes-of-plus?branch=master

[bithound-img]: https://www.bithound.io/github/code-and-send/str-indexes-of-plus/badges/score.svg
[bithound-url]: https://www.bithound.io/github/code-and-send/str-indexes-of-plus

[deps-img]: https://www.bithound.io/github/code-and-send/str-indexes-of-plus/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/code-and-send/str-indexes-of-plus/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/code-and-send/str-indexes-of-plus/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/code-and-send/str-indexes-of-plus/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/str-indexes-of-plus.svg
[downloads-url]: https://www.npmjs.com/package/str-indexes-of-plus
