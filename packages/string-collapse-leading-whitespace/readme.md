# string-collapse-leading-whitespace

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> Collapse the leading and trailing whitespace of a string

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
- [Purpose](#purpose)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
npm i string-collapse-leading-whitespace
```

```js
// consume via a CommonJS require:
const collapseLeadingWhitespace = require('string-collapse-leading-whitespace')
// or as an ES Module:
import collapseLeadingWhitespace from 'string-collapse-leading-whitespace'
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/string-collapse-leading-whitespace.cjs.js` | 1&nbsp;KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/string-collapse-leading-whitespace.esm.js` | 1&nbsp;KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/string-collapse-leading-whitespace.umd.js` | 603&nbsp;B

**[⬆ &nbsp;back to top](#)**

## Idea

```js
// does nothing to trimmed strings:
'aaa' => 'aaa'
// if leading or trailing whitespace doesn't contain \n, collapse to a single space
'  aaa   ' => ' aaa '
// otherwise, collapse to a single \n
'     \n\n   aaa  \n\n\n    ' => '\naaa\n'
```

**[⬆ &nbsp;back to top](#)**

## API

API is simple: `string` in, `string` out.

If input is not a string, it will be just returned back, untouched.

## Purpose

I'm going to use it in [string-slices-array-push](https://github.com/codsen/string-slices-array-push).

## Contributing

Hi! 99% of people in the society are passive - consumers. They wait for others to take action, they prefer to blend in. The remaining 1% are proactive citizens who will _do_ something rather than _wait_. If you are one of that 1%, you're in luck because I am the same and _together_ we can make something happen.

* If you **want a new feature** in this package or you would like to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/string-collapse-leading-whitespace/issues). Also, you can [email me](mailto:roy@codsen.com). Just let it out.

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/string-collapse-leading-whitespace/issues). Alternatively, you can [email me](mailto:roy@codsen.com).

* If you don't like the code in here and would like to **give advice** about how something could be done better, please do. Same drill - [GitHub issues](https://github.com/codsen/string-collapse-leading-whitespace/issues) or [email](mailto:roy@codsen.com), your choice.

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. I'll do my best to merge it quickly. Code style is `airbnb-base`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/string-collapse-leading-whitespace.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-collapse-leading-whitespace

[npm-img]: https://img.shields.io/npm/v/string-collapse-leading-whitespace.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/string-collapse-leading-whitespace

[travis-img]: https://img.shields.io/travis/codsen/string-collapse-leading-whitespace.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/string-collapse-leading-whitespace

[cov-img]: https://coveralls.io/repos/github/codsen/string-collapse-leading-whitespace/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/string-collapse-leading-whitespace?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/string-collapse-leading-whitespace.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/string-collapse-leading-whitespace

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/string-collapse-leading-whitespace.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/string-collapse-leading-whitespace/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-collapse-leading-whitespace

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/string-collapse-leading-whitespace.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/string-collapse-leading-whitespace/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/string-collapse-leading-whitespace/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/string-collapse-leading-whitespace

[downloads-img]: https://img.shields.io/npm/dm/string-collapse-leading-whitespace.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-collapse-leading-whitespace

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-collapse-leading-whitespace

[license-img]: https://img.shields.io/npm/l/string-collapse-leading-whitespace.svg?style=flat-square
[license-url]: https://github.com/codsen/string-collapse-leading-whitespace/blob/master/license.md
