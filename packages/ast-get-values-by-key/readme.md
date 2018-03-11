# ast-get-values-by-key

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> Read or edit parsed HTML (or AST in general)

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
- [Use](#use)
- [Purpose](#purpose)
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```sh
npm i ast-get-values-by-key
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/ast-get-values-by-key.cjs.js` | 1&nbsp;KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/ast-get-values-by-key.esm.js` | 1&nbsp;KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/ast-get-values-by-key.umd.js` | 12&nbsp;KB

**[⬆ &nbsp;back to top](#)**

## Use

Tag getter in parsed HTML:

```js
// get
const get = require('ast-get-values-by-key')
var res = get(
  {
    tag: 'html'
  },
  'tag' // < tag to look for
)
console.log('res = ' + JSON.stringify(res, null, 4))
// => res = ["html"]
```

Tag setter in parsed HTML — just pass array of values to write as a third argument:

```js
// set
const get = require('ast-get-values-by-key')
var res = get(
  {
    tag: 'html'
  },
  'tag',
  ['style']
)
console.log('res = ' + JSON.stringify(res, null, 4))
// res = {
//         tag: "style"
//       }
```

**[⬆ &nbsp;back to top](#)**

## Purpose

When you parse some HTML using [posthtml-parser](https://github.com/posthtml/posthtml-parser), you get an array which contains an AST — a nested [tree](https://github.com/posthtml/posthtml-parser#posthtml-ast-format) of strings, objects and arrays. This library lets you query that tree — you can get an array of all the key values you want. Later, if you amend and feed this query result again into the `getAllValuesByKey` as a third argument, you can overwrite all the values.

Two arguments triggers GET mode; three arguments is SET (or write over) mode.

**[⬆ &nbsp;back to top](#)**

## API

```js
getAllValuesByKey(
  input,        // PLAIN OBJECT OR ARRAY. Can be nested.
  whatToFind,   // STRING OR ARRAY OF STRINGS. The name of the key to find. We'll put its value into results array. You can use wildcards (uses Matcher.js).
  replacement   // (OPTIONAL) ARRAY. The amended output of the previous call to getAllValuesByKey() if you want to write.
)
```

- If two arguments are given, an **array zero or more of values** from matched key-value pairs within objects will be returned.
- If three arguments are given, an amended clone of your input will be returned.

This library does not mutate any input arguments.

**[⬆ &nbsp;back to top](#)**

## Contributing

* If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/ast-get-values-by-key/issues).

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/ast-get-values-by-key/issues).

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. Code style is `airbnb-base`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt


[node-img]: https://img.shields.io/node/v/ast-get-values-by-key.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ast-get-values-by-key

[npm-img]: https://img.shields.io/npm/v/ast-get-values-by-key.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/ast-get-values-by-key

[travis-img]: https://img.shields.io/travis/codsen/ast-get-values-by-key.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/ast-get-values-by-key

[cov-img]: https://coveralls.io/repos/github/codsen/ast-get-values-by-key/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/ast-get-values-by-key?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/ast-get-values-by-key.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/ast-get-values-by-key

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/ast-get-values-by-key.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/ast-get-values-by-key/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ast-get-values-by-key

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/ast-get-values-by-key.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/ast-get-values-by-key/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/ast-get-values-by-key/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/ast-get-values-by-key

[downloads-img]: https://img.shields.io/npm/dm/ast-get-values-by-key.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ast-get-values-by-key

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ast-get-values-by-key

[license-img]: https://img.shields.io/npm/l/ast-get-values-by-key.svg?style=flat-square
[license-url]: https://github.com/codsen/ast-get-values-by-key/blob/master/license.md
