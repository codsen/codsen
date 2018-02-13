# string-trim-spaces-only

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> Like String.trim() but trims only spaces

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
- [Usage](#usage)
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
npm i string-trim-spaces-only
```

```js
// consume via a CommonJS require:
const trimSpaces = require('string-trim-spaces-only')
// or as an ES Module:
import trimSpaces from 'string-trim-spaces-only'
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/string-trim-spaces-only.cjs.js` | 871&nbsp;B
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/string-trim-spaces-only.esm.js` | 854&nbsp;B
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/string-trim-spaces-only.umd.js` | 514&nbsp;B

**[⬆ &nbsp;back to top](#)**

## Usage

```js
const trimSpaces = require('string-trim-spaces-only')
const res = trimSpaces('  aaa   ')
console.log('res = ' + JSON.stringify(res1, null, 4))
// => "aaa"

// trimming stops at first non-space:
const res2 = trimSpaces('   \t  zz   \n    ')
console.log('res2 = ' + JSON.stringify(res2, null, 4))
// => "\t  zz   \n"

// the API is friendly like a panda - it bypasses everything else than a string:
const res3 = trimSpaces(true)
console.log('res3 = ' + JSON.stringify(res3, null, 4))
// => true
const res4 = trimSpaces({a: 'zzz'})
console.log('res4 = ' + JSON.stringify(res4, null, 4))
// => {a: 'zzz'}
```

I also tested it with emoji, it copes fine.

**[⬆ &nbsp;back to top](#)**

## API

API is simple: `string` in, `string` out.

You can pass non-strings too (including `undefined`), they will be returned and no action will be taken. You could also call it with no arguments at all — the API is deliberately friendly. After all, this function will be used within other code and it would be tedious to check are values always `string`s.

**[⬆ &nbsp;back to top](#)**

## Contributing

* If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/string-trim-spaces-only/issues).

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/string-trim-spaces-only/issues).

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. Code style is `airbnb-base`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt


[node-img]: https://img.shields.io/node/v/string-trim-spaces-only.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-trim-spaces-only

[npm-img]: https://img.shields.io/npm/v/string-trim-spaces-only.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/string-trim-spaces-only

[travis-img]: https://img.shields.io/travis/codsen/string-trim-spaces-only.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/string-trim-spaces-only

[cov-img]: https://coveralls.io/repos/github/codsen/string-trim-spaces-only/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/string-trim-spaces-only?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/string-trim-spaces-only.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/string-trim-spaces-only

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/string-trim-spaces-only.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/string-trim-spaces-only/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-trim-spaces-only

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/string-trim-spaces-only.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/string-trim-spaces-only/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/string-trim-spaces-only/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/string-trim-spaces-only

[downloads-img]: https://img.shields.io/npm/dm/string-trim-spaces-only.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-trim-spaces-only

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-trim-spaces-only

[license-img]: https://img.shields.io/npm/l/string-trim-spaces-only.svg?style=flat-square
[license-url]: https://github.com/codsen/string-trim-spaces-only/blob/master/license.md
