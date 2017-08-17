# array-pull-all-with-glob

<a href="https://standardjs.com" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> pullAllWithGlob - like _.pullAll but pulling stronger, with globs

[![Build Status][travis-img]][travis-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Coverage Status][cov-img]][cov-url]
[![Known Vulnerabilities][vulnerabilities-img]][vulnerabilities-url]
[![Downloads/Month][downloads-img]][downloads-url]

## Install

```bash
$ npm install --save array-pull-all-with-glob
```

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Pulling](#pulling)
- [API](#api)
  - [API - Input](#api---input)
  - [API - Output](#api---output)
- [Test](#test)
- [Contributing & testing](#contributing--testing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Pulling

Let's say you have an array of strings and another array of strings to remove from the aforementioned array. That's easy to achieve with Lodash's [_.pullAll](https://lodash.com/docs/#pullAll). However, what if you are not sure what _to-be-removed_ strings exactly look like and know only how their names _begin_, or there are too many of them to type manually, yet all begin with the same letters? What if you need to remove 99 elements: `module-1`, `module-2`, ... `module-99` from an array?

You need be able to put a _glob_ in a search query, that is, a _string pattern_ (`*`), which means _any character from here on_.

Check it out how easy it is to achieve that using this library:

```js
var pullAllWithGlob = require('array-pull-all-with-glob')
sourceArray = ['keep_me', 'name-1', 'name-2', 'name-jhkgdhgkhdfghdkghfdk']
removeThese = ['name-*']
console.dir(pullAllWithGlob(sourceArray, removeThese))
// => ['keep_me']
```

Personally, I needed this library for another library, [email-remove-unused-css](https://github.com/codsen/email-remove-unused-css), where I had to _whitelist_ certain CSS classes (array of strings), removing them from another array.

## API

```js
pullAllWithGlob (
  sourceArray,   // input array of strings
  removeThese    // array of strings to pull
);
```

### API - Input

Input argument   | Type     | Obligatory? | Description
-----------------|----------|-------------|--------------------
`sourceArray`    | Array    | yes         | Source array of strings
`removeThese`    | Array    | yes         | Array of strings to remove from the source array

None of the input arguments are mutated. That's checked by unit tests from group 4.x

### API - Output

Type     | Description
---------|---------------------------------------
Array    | Array of strings with elements removed

## Test

```bash
$ npm test
```

For unit tests we use [AVA](https://github.com/avajs/ava), [Istanbul CLI](https://github.com/istanbuljs/nyc) and [JS Standard](https://standardjs.com) notation.

## Contributing & testing

All contributions are welcome. Please stick to [Standard JavaScript](https://standardjs.com) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/codsen/array-pull-all-with-glob/issues). If you file a pull request, I'll do my best to help you to get it merged in a timely manner. If you have any comments on the code, including ideas how to improve things, don't hesitate to contact me by email. Everybody belong to Open Source community.

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

[travis-img]: https://travis-ci.org/codsen/array-pull-all-with-glob.svg?branch=master
[travis-url]: https://travis-ci.org/codsen/array-pull-all-with-glob

[overall-img]: https://www.bithound.io/github/codsen/array-pull-all-with-glob/badges/score.svg
[overall-url]: https://www.bithound.io/github/codsen/array-pull-all-with-glob

[deps-img]: https://www.bithound.io/github/codsen/array-pull-all-with-glob/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/codsen/array-pull-all-with-glob/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/codsen/array-pull-all-with-glob/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/codsen/array-pull-all-with-glob/master/dependencies/npm

[cov-img]: https://coveralls.io/repos/github/codsen/array-pull-all-with-glob/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/codsen/array-pull-all-with-glob?branch=master

[downloads-img]: https://img.shields.io/npm/dm/array-pull-all-with-glob.svg
[downloads-url]: https://www.npmjs.com/package/array-pull-all-with-glob

[vulnerabilities-img]: https://snyk.io/test/github/codsen/array-pull-all-with-glob/badge.svg
[vulnerabilities-url]: https://snyk.io/test/github/codsen/array-pull-all-with-glob
