# array-includes-with-glob

<a href="https://github.com/feross/standard" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> like Lodash _.includes but with wildcards

[![Build Status][travis-img]][travis-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Coverage Status][cov-img]][cov-url]
[![Downloads/Month][downloads-img]][downloads-url]

## Install

```bash
$ npm install --save array-includes-with-glob
```

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [How it works](#how-it-works)
- [API](#api)
  - [API - Input](#api---input)
  - [API - Output](#api---output)
- [Conditions when this library will throw](#conditions-when-this-library-will-throw)
- [Test](#test)
- [Contributing & testing](#contributing--testing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## How it works

Lodash `_.includes` can tell, does an array contain given string among its elements:

```js
_.includes(['abcd', 'aaa', 'bbb'], 'bc')
// => true

_.includes(['abcd', 'aaa', 'bbb'], 'zzz')
// => false
```

This library is a supercharged version of the Lodash `_.includes`, letting you to put _wildcards_:

```js
includesWithGlob(['xc', 'yc', 'zc'], '*c')
// => true (all 3)

includesWithGlob(['xc', 'yc', 'zc'], '*a')
// => false (none found)

includesWithGlob(['something', 'anything', 'zzz'], 'some*')
// => true (1 hit)
```

**Wildcard means zero or more Unicode characters.**

You can also do fancy things like a wildcard in the middle of a string, or multiple wildcards in a string:

```js
includesWithGlob(['something', 'zzz', 'soothing'], 'so*ing')
// => true (2 hits)
```

This library will tolerate non-string values in the source array, it will skip those values.

This library is astral-character friendly, supports all Unicode characters (including emoji) and doesn't mutate the input.

## API

```js
includesWithGlob (
  sourceArray,   // input array of strings
  stringToFind   // string to look for. Can contain wildcards, "*"'s
)
```

### API - Input

Input argument   | Type     | Obligatory? | Description
-----------------|----------|-------------|--------------------
`sourceArray`    | Array    | yes         | Source array of strings
`stringToFind`   | String   | yes         | What to look for. Can contain wildcards.

None of the input arguments are mutated.

### API - Output

Type     | Description
---------|---------------------------------------
Boolean  | Returns `true` if at least one `stringToFind` is found, else `false`.

## Conditions when this library will throw

This library will throw an error if:

* any of inputs is missing
* any of inputs are of the wrong type (first-one must be an array and second must be string)

Also, if first input argument, a source array, is an empty array, the result will always be `false`.

## Test

```bash
$ npm test
```

For unit tests we use [AVA](https://github.com/avajs/ava), [Istanbul CLI](https://github.com/istanbuljs/nyc) and [JS Standard](https://github.com/feross/standard) notation.

## Contributing & testing

All contributions are welcome. Please stick to [Standard JavaScript](https://github.com/feross/standard) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/code-and-send/array-includes-with-glob/issues). If you file a pull request, I'll do my best to help you to get it merged in a timely manner. If you have any comments on the code, including ideas how to improve things, don't hesitate to contact me by email. Everybody belong to Open Source community.

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

[travis-img]: https://travis-ci.org/code-and-send/array-includes-with-glob.svg?branch=master
[travis-url]: https://travis-ci.org/code-and-send/array-includes-with-glob

[overall-img]: https://www.bithound.io/github/code-and-send/array-includes-with-glob/badges/score.svg
[overall-url]: https://www.bithound.io/github/code-and-send/array-includes-with-glob

[deps-img]: https://www.bithound.io/github/code-and-send/array-includes-with-glob/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/code-and-send/array-includes-with-glob/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/code-and-send/array-includes-with-glob/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/code-and-send/array-includes-with-glob/master/dependencies/npm

[cov-img]: https://coveralls.io/repos/github/code-and-send/array-includes-with-glob/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/code-and-send/array-includes-with-glob?branch=master

[downloads-img]: https://img.shields.io/npm/dm/array-includes-with-glob.svg
[downloads-url]: https://www.npmjs.com/package/array-includes-with-glob
