# array-includes-with-glob

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> like _.includes but with wildcards

[![Minimum Node version required][node-img]][node-url]
[![Link to npm page][npm-img]][npm-url]
[![Build Status][travis-img]][travis-url]
[![Coverage][cov-img]][cov-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![greenkeeper][greenkeeper-img]][greenkeeper-url]
[![Known Vulnerabilities][vulnerabilities-img]][vulnerabilities-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![MIT License][license-img]][license-url]

## Install

```bash
npm i array-includes-with-glob
```

Consume:

```js
// Consume as CommonJS require:
const arrayIncludesWithGlob = require('array-includes-with-glob')
// or tap the original ES Modules source:
import arrayIncludesWithGlob from 'array-includes-with-glob'
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/array-includes-with-glob.cjs.js` | 3&nbsp;KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/array-includes-with-glob.esm.js` | 3&nbsp;KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/array-includes-with-glob.umd.js` | 2&nbsp;KB

**[⬆ &nbsp;back to top](#)**

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [How it works](#how-it-works)
- [API](#api)
- [Conditions when this library will throw](#conditions-when-this-library-will-throw)
- [Contributing](#contributing)
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

**[⬆ &nbsp;back to top](#)**

## API

```js
includesWithGlob (
  source,      // input - an array of strings or a single string
  whatToFind,  // what to look for - can contain wildcards, "*"'s, can be array of strings or a single string
  options
)
```

**[⬆ &nbsp;back to top](#)**

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

**[⬆ &nbsp;back to top](#)**

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

**[⬆ &nbsp;back to top](#)**

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

**[⬆ &nbsp;back to top](#)**

### API - Output

Type     | Description
---------|---------------------------------------
Boolean  | Returns `true` if at least one `stringToFind` is found, else `false`.

## Conditions when this library will throw

This library will throw an error if:

* any of inputs are missing
* any of inputs are of the wrong type

Also, if first input argument, a source array, is an empty array or empty string, the result will always be `false`.

**[⬆ &nbsp;back to top](#)**

## Contributing

Hi! 99% of people in the society are passive - consumers. They wait for others to take action, they prefer to blend in. The remaining 1% are proactive citizens who will _do_ something rather than _wait_. If you are one of that 1%, you're in luck because I am the same and _together_ we can make something happen.

* If you **want a new feature** in this package or you would like to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/array-includes-with-glob/issues). Also, you can [email me](mailto:roy@codsen.com). Just let it out.

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/array-includes-with-glob/issues). Alternatively, you can [email me](mailto:roy@codsen.com).

* If you don't like the code in here and would like to **give advice** about how something could be done better, please do. Same drill - [GitHub issues](https://github.com/codsen/array-includes-with-glob/issues) or [email](mailto:roy@codsen.com), your choice.

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. I'll do my best to merge it quickly. Code style is `airbnb-base`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/array-includes-with-glob.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/array-includes-with-glob

[npm-img]: https://img.shields.io/npm/v/array-includes-with-glob.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/array-includes-with-glob

[travis-img]: https://img.shields.io/travis/codsen/array-includes-with-glob.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/array-includes-with-glob

[cov-img]: https://coveralls.io/repos/github/codsen/array-includes-with-glob/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/array-includes-with-glob?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/array-includes-with-glob.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/array-includes-with-glob

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/array-includes-with-glob.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/array-includes-with-glob/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/array-includes-with-glob

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/array-includes-with-glob.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/array-includes-with-glob/master/dependencies/npm

[greenkeeper-img]: https://badges.greenkeeper.io/codsen/array-includes-with-glob.svg
[greenkeeper-url]: https://greenkeeper.io/

[vulnerabilities-img]: https://snyk.io/test/github/codsen/array-includes-with-glob/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/array-includes-with-glob

[downloads-img]: https://img.shields.io/npm/dm/array-includes-with-glob.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/array-includes-with-glob

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/array-includes-with-glob

[license-img]: https://img.shields.io/npm/l/array-includes-with-glob.svg?style=flat-square
[license-url]: https://github.com/codsen/array-includes-with-glob/blob/master/license.md
