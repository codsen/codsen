# array-pull-all-with-glob

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> pullAllWithGlob - like _.pullAll but pulling stronger, with globs

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

## Install

```bash
npm i array-pull-all-with-glob
```

```js
// consume as CommonJS require():
const pullAllWithGlob = require('array-pull-all-with-glob')
// or as ES Module:
import pullAllWithGlob from 'array-pull-all-with-glob'
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/array-pull-all-with-glob.cjs.js` | 3&nbsp;KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/array-pull-all-with-glob.esm.js` | 2&nbsp;KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/array-pull-all-with-glob.umd.js` | 3&nbsp;KB

**[⬆ &nbsp;back to top](#)**

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Pulling](#pulling)
- [API](#api)
- [Test](#test)
- [Contributing](#contributing)
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

**[⬆ &nbsp;back to top](#)**

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

**[⬆ &nbsp;back to top](#)**

### API - Output

Type     | Description
---------|---------------------------------------
Array    | Array of strings with elements removed

## Test

```bash
$ npm test
```

For unit tests we use [AVA](https://github.com/avajs/ava), [Istanbul CLI](https://github.com/istanbuljs/nyc) and [JS Standard](https://standardjs.com) notation.

## Contributing

Hi! 99% of people in the society are passive - consumers. They wait for others to take action, they prefer to blend in. The remaining 1% are proactive citizens who will _do_ something rather than _wait_. If you are one of that 1%, you're in luck because I am the same and _together_ we can make something happen.

* If you **want a new feature** in this package or you would like to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/array-pull-all-with-glob/issues). Also, you can [email me](mailto:roy@codsen.com). Just let it out.

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/array-pull-all-with-glob/issues). Alternatively, you can [email me](mailto:roy@codsen.com).

* If you don't like the code in here and would like to **give advice** about how something could be done better, please do. Same drill - [GitHub issues](https://github.com/codsen/array-pull-all-with-glob/issues) or [email](mailto:roy@codsen.com), your choice.

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. I'll do my best to merge it quickly. Code style is `airbnb-base`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/array-pull-all-with-glob.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/array-pull-all-with-glob

[npm-img]: https://img.shields.io/npm/v/array-pull-all-with-glob.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/array-pull-all-with-glob

[travis-img]: https://img.shields.io/travis/codsen/array-pull-all-with-glob.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/array-pull-all-with-glob

[cov-img]: https://coveralls.io/repos/github/codsen/array-pull-all-with-glob/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/array-pull-all-with-glob?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/array-pull-all-with-glob.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/array-pull-all-with-glob

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/array-pull-all-with-glob.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/array-pull-all-with-glob/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/array-pull-all-with-glob

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/array-pull-all-with-glob.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/array-pull-all-with-glob/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/array-pull-all-with-glob/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/array-pull-all-with-glob

[downloads-img]: https://img.shields.io/npm/dm/array-pull-all-with-glob.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/array-pull-all-with-glob

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/array-pull-all-with-glob

[license-img]: https://img.shields.io/npm/l/array-pull-all-with-glob.svg?style=flat-square
[license-url]: https://github.com/codsen/array-pull-all-with-glob/blob/master/license.md
