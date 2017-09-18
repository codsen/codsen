# ranges-merge

> Merge arrays meaning string slice ranges

[![Link to npm page][npm-img]][npm-url]
[![Build Status][travis-img]][travis-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Coverage Status][cov-img]][cov-url]
[![Known Vulnerabilities][vulnerabilities-img]][vulnerabilities-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Test in browser][runkit-img]][runkit-url]

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [The Idea](#the-idea)
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
$ npm i -S ranges-merge
```

## The Idea

If, after sorting, two ranges in the vicinity have the same edge value (like `2` below), merge those ranges:

```js
const rangesMerge = require('ranges-merge')
rangesMerge([
  [1, 2], [2, 3], [9, 10]
])
// => [
//   [1, 3], [9, 10]
// ]
}
```

If ranges overlap, merge them too:

```js
const rangesMerge = require('ranges-merge')
rangesMerge([
  [1, 5], [2, 10]
])
// => [
//   [1, 10]
// ]
}
```

## API

**rangesMerge(arr)**

It returns a new array of arrays, with ranges merged where applicable.

## Contributing

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/codsen/ranges-merge/issues). If you file a pull request, I'll do my best to merge it quickly. If you have any comments on the code, including ideas how to improve something, don't hesitate to contact me by email.

If something doesn't work as you wished or you don't understand the inner workings of this library, _do raise an issue_. I'm happy to explain what's happening. Often some part of my README documentation is woolly, and I can't spot it myself. I need user feedback.

Also, if you miss a feature, request it by [raising](https://github.com/codsen/ranges-merge/issues) an issue as well.

I know it never happens, but if you would ever forked it and worked on a new feature, before filing a pull request, please make sure code is following the rules set in `.eslintrc` and `npm run test` passes fine. It's basically an `airbnb-base` rules preset of `eslint` with few exceptions: 1. No semicolons. 2. Allow plus-plus in `for` loops. See `./eslintrc`.

I dropped JS Standard because it misses many useful ESLint rules and has been neglected by its maintainers, using a half-year-old version of ESLint.

Cheers!

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

[npm-img]: https://img.shields.io/npm/v/ranges-merge.svg
[npm-url]: https://www.npmjs.com/package/ranges-merge

[travis-img]: https://travis-ci.org/codsen/ranges-merge.svg?branch=master
[travis-url]: https://travis-ci.org/codsen/ranges-merge

[cov-img]: https://coveralls.io/repos/github/codsen/ranges-merge/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/codsen/ranges-merge?branch=master

[overall-img]: https://www.bithound.io/github/codsen/ranges-merge/badges/score.svg
[overall-url]: https://www.bithound.io/github/codsen/ranges-merge

[deps-img]: https://www.bithound.io/github/codsen/ranges-merge/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/codsen/ranges-merge/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/codsen/ranges-merge/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/codsen/ranges-merge/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/ranges-merge.svg
[downloads-url]: https://www.npmjs.com/package/ranges-merge

[vulnerabilities-img]: https://snyk.io/test/github/codsen/ranges-merge/badge.svg
[vulnerabilities-url]: https://snyk.io/test/github/codsen/ranges-merge

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ranges-merge

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg
[runkit-url]: https://npm.runkit.com/ranges-merge
