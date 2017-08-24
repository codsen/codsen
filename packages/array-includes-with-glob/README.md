# array-includes-with-glob

<a href="https://standardjs.com" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> like Lodash _.includes but with wildcards

[![Link to npm page][npm-img]][npm-url]
[![Build Status][travis-img]][travis-url]
[![bitHound Overall Score][bithound-img]][bithound-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Coverage Status][cov-img]][cov-url]
[![Known Vulnerabilities][vulnerabilities-img]][vulnerabilities-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Test in browser][runkit-img]][runkit-url]

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
    - [Options object examples](#options-object-examples)
  - [Practical usage](#practical-usage)
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

This library will tolerate non-string values in the source array; it will skip those values.

This library is astral-character friendly, supports all Unicode characters (including emoji) and doesn't mutate the input.

You can also query multiple values and request that ANY (default behaviour) or ALL (optional setting) should be found in the source, to yield a result "`true`". See examples [below](#options-object-examples).

## API

```js
includesWithGlob (
  source,      // input - an array of strings or a single string
  whatToFind,  // what to look for - can contain wildcards, "*"'s, can be array of strings or a single string
  options
)
```

### API - Input

Input argument   | Type                         | Obligatory? | Description
-----------------|------------------------------|-------------|--------------------
`source`         | A string or array of strings | yes         | Source string or array of strings
`whatToFind`     | A string or array of strings | yes         | What to look for. Can contain wildcards. Can be one string or array of strings
`options`        | Plain object                 | no          | Options object. See below for its API.

None of the input arguments is mutated.

Options object's key          | Value          | Default | Description
------------------------------|----------------|---------|-------------
`{`                           |                |         |
`arrayVsArrayAllMustBeFound`  | `any` or `all` | `any`   | When a source (the first argument) is array, and what to look for (the second argument) is also array, you can have the match performed two ways: `any` setting will return true if _any_ of the second argument array's elements are found in the source array. `all` setting will return `true` only if _all_ elements within the second argument are found within the source array.
`}`                           |                |         |

#### Options object examples

```js
var arrayIncludesWithGlob = require('array-includes-with-glob')
var source = ['aaa', 'bbb', 'ccc']
var whatToLookFor = ['a*', 'd*']

var res1 = arrayIncludesWithGlob(source, whatToLookFor)
console.log('res1 = ' + res1)
// => res1 = true, because at one element, 'a*' was found in source (it was its first element)

var res2 = arrayIncludesWithGlob(source, whatToLookFor, {arrayVsArrayAllMustBeFound: 'all'})
console.log('res2 = ' + res2)
// => res2 = false, because not all elements were found in source: 'd*' was not present in source!
```

### Practical usage

I need this library for my other libraries when I'm working with plain objects, and I want to let users whitelist certain keys of those objects. For example, [object-merge-advanced](https://github.com/codsen/object-merge-advanced) can skip the overwrite of any keys upon request. That request technically, is an array, like `['*thing']` in the example below:

```js
mergeAdvanced(
  { // first object to merge
    something: 'a',
    anything: 'b',
    everything: 'c'
  },
  { // second object to merge
    something: ['a'],
    anything: ['b'],
    everything: 'd'
  },
  {
    ignoreKeys: ['*thing']
  }
)
```

In the example above, we need to run a check through all keys of the first object and check, are any covered by the `ignoreKeys` array. If so, those keys would not get merged and keep their values.

### API - Output

Type     | Description
---------|---------------------------------------
Boolean  | Returns `true` if at least one `stringToFind` is found, else `false`.

## Conditions when this library will throw

This library will throw an error if:

* any of inputs are missing
* any of inputs are of the wrong type

Also, if first input argument, a source array, is an empty array or empty string, the result will always be `false`.

## Test

```bash
$ npm test
```

For unit tests we use [AVA](https://github.com/avajs/ava), [Istanbul CLI](https://github.com/istanbuljs/nyc) and [JS Standard](https://standardjs.com) notation.

## Contributing & testing

All contributions are welcome. Please stick to [Standard JavaScript](https://standardjs.com) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/codsen/array-includes-with-glob/issues). If you file a pull request, I'll do my best to help you to get it merged promptly. If you have any comments on the code, including ideas how to improve things, don't hesitate to contact me by email. Everybody belong to Open Source community.

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

[npm-img]: https://img.shields.io/npm/v/array-includes-with-glob.svg
[npm-url]: https://www.npmjs.com/package/array-includes-with-glob

[travis-img]: https://travis-ci.org/codsen/array-includes-with-glob.svg?branch=master
[travis-url]: https://travis-ci.org/codsen/array-includes-with-glob

[bithound-img]: https://www.bithound.io/github/codsen/array-includes-with-glob/badges/score.svg
[bithound-url]: https://www.bithound.io/github/codsen/array-includes-with-glob

[deps-img]: https://www.bithound.io/github/codsen/array-includes-with-glob/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/codsen/array-includes-with-glob/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/codsen/array-includes-with-glob/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/codsen/array-includes-with-glob/master/dependencies/npm

[cov-img]: https://coveralls.io/repos/github/codsen/array-includes-with-glob/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/codsen/array-includes-with-glob?branch=master

[downloads-img]: https://img.shields.io/npm/dm/array-includes-with-glob.svg
[downloads-url]: https://www.npmjs.com/package/array-includes-with-glob

[vulnerabilities-img]: https://snyk.io/test/github/codsen/array-includes-with-glob/badge.svg
[vulnerabilities-url]: https://snyk.io/test/github/codsen/array-includes-with-glob

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg
[deps2d-url]: http://npm.anvaka.com/#/view/2d/array-includes-with-glob

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-ff9900.svg
[runkit-url]: https://npm.runkit.com/array-includes-with-glob
