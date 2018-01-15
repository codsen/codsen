# arrayiffy-if-string

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> Put non-empty strings into arrays, turn empty-ones into empty arrays. Bypass everything else.

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
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
npm i arrayiffy-if-string
```

```js
// consume as CommonJS require:
const arrayiffy = require('require arrayiffy-if-string')
// or as an ES module:
import arrayiffy from 'arrayiffy-if-string'
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/arrayiffy-if-string.cjs.js` | 303&nbsp;B
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/arrayiffy-if-string.esm.js` | 286&nbsp;B
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/arrayiffy-if-string.umd.js` | 257&nbsp;B

**[⬆ &nbsp;back to top](#)**

## Idea

- If it's a non-empty string, put it into an array and return it.
- If it's empty string, return an empty array.
- If it's anything else, just return it.

```js
const arrayiffy = require('arrayiffy-if-string')
var res = arrayiffy('aaa')
console.log('res = ' + JSON.stringify(res, null, 4))
// => ['aaa']
```

```js
const arrayiffy = require('arrayiffy-if-string')
var res = arrayiffy('')
console.log('res = ' + JSON.stringify(res, null, 4))
// => []
```

```js
const arrayiffy = require('arrayiffy-if-string')
var res = arrayiffy(true)
console.log('res = ' + JSON.stringify(res, null, 4))
// => true
```

It's meant for working with settings objects. Check out [check-types-mini](https://github.com/codsen/check-types-mini).

**[⬆ &nbsp;back to top](#)**

## Contributing

Hi! 99% of people in the society are passive - consumers. They wait for others to take action, they prefer to blend in. The remaining 1% are proactive citizens who will _do_ something rather than _wait_. If you are one of that 1%, you're in luck because I am the same and _together_ we can make something happen.

* If you **want a new feature** in this package or you would like to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/arrayiffy-if-string/issues). Also, you can [email me](mailto:roy@codsen.com). Just let it out.

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/arrayiffy-if-string/issues). Alternatively, you can [email me](mailto:roy@codsen.com).

* If you don't like the code in here and would like to **give advice** about how something could be done better, please do. Same drill - [GitHub issues](https://github.com/codsen/arrayiffy-if-string/issues) or [email](mailto:roy@codsen.com), your choice.

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. I'll do my best to merge it quickly. Code style is `airbnb-base`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/arrayiffy-if-string.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/arrayiffy-if-string

[npm-img]: https://img.shields.io/npm/v/arrayiffy-if-string.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/arrayiffy-if-string

[travis-img]: https://img.shields.io/travis/codsen/arrayiffy-if-string.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/arrayiffy-if-string

[cov-img]: https://coveralls.io/repos/github/codsen/arrayiffy-if-string/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/arrayiffy-if-string?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/arrayiffy-if-string.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/arrayiffy-if-string

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/arrayiffy-if-string.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/arrayiffy-if-string/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/arrayiffy-if-string

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/arrayiffy-if-string.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/arrayiffy-if-string/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/arrayiffy-if-string/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/arrayiffy-if-string

[downloads-img]: https://img.shields.io/npm/dm/arrayiffy-if-string.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/arrayiffy-if-string

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/arrayiffy-if-string

[license-img]: https://img.shields.io/npm/l/arrayiffy-if-string.svg?style=flat-square
[license-url]: https://github.com/codsen/arrayiffy-if-string/blob/master/license.md
