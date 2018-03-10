# ast-contains-only-empty-space

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> Returns Boolean depending if passed AST contain only empty space

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

> This is not a PostHTML plugin but a regular JS library. It is meant to work with anything, including nested array/object trees, like parsed HTML, that is, AST (abstract syntax trees) that come out of the PostHTML-parser. Hence the name, `posthtml-ast-`.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Use](#use)
- [Rationale](#rationale)
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
npm i ast-contains-only-empty-space
```

```js
// consume via CommonJS require():
const containsOnlyEmptySpace = require('ast-contains-only-empty-space')
// or as an ES Module:
import containsOnlyEmptySpace from 'ast-contains-only-empty-space'
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/ast-contains-only-empty-space.cjs.js` | 917&nbsp;B
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/ast-contains-only-empty-space.esm.js` | 724&nbsp;B
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/ast-contains-only-empty-space.umd.js` | 13&nbsp;KB

**[⬆ &nbsp;back to top](#)**

## Use

```js
const empty = require('ast-contains-only-empty-space')
...
// All values are empty, this means this object contains only empty space.
// Notice it's nested in an array, it does not matter.
console.log(empty([{ 'content': {} }]))
// => true

console.log(empty([{ 'tag': 'style' }]))
// => false

// Works on simple arrays as well:
console.log(empty(['   ', ' ']))
// => true

// Works on strings as well:
console.log(empty('   '))
// => true

// Object keys that have values as null are considered empty:
console.log(empty({a: null}))
// => true

// Works no matter how deeply nested input is:
console.log(empty(
  {
    a: [{
      x: {
        y: [
          {
            z: [
              '\n'
            ]
          }
        ]
      }
    }],
    b: ['\t\t\t  '],
    c: ['\n \n\n'],
    d: ['\t   ']
  }
))
// => true
```

**[⬆ &nbsp;back to top](#)**

## Rationale

Working with parsed HTML is always a battle against white space. Often you need to know, does certain AST piece (object/array/whatever) contain anything real, or just an empty space. That's what this library is for.

In real life, parsed HTML trees will have many levels of nested arrays, objects and strings. While it's easy to check does a plain object contain only empty space (`\n`, ` `, `\t`, line break or a mix of thereof), it's not so easy when your object has arrays of empty objects. I want a solid, tested library which can identify emptiness (or lack of) in anything, nested or not nested.

By the way, weird things (like functions, which don't belong to parsed HTML structures) will yield cause result `false`.

**[⬆ &nbsp;back to top](#)**

## API

Input - anything. Output - Boolean.

```js
empty (input); // array, object or string — normally AST (which is array of nested objects/strings/arrays)
// => true/false
```

This library does not mutate the input arguments.

**[⬆ &nbsp;back to top](#)**

## Contributing

* If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/ast-contains-only-empty-space/issues).

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/ast-contains-only-empty-space/issues).

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. Code style is `airbnb-base`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt


[node-img]: https://img.shields.io/node/v/ast-contains-only-empty-space.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ast-contains-only-empty-space

[npm-img]: https://img.shields.io/npm/v/ast-contains-only-empty-space.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/ast-contains-only-empty-space

[travis-img]: https://img.shields.io/travis/codsen/ast-contains-only-empty-space.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/ast-contains-only-empty-space

[cov-img]: https://coveralls.io/repos/github/codsen/ast-contains-only-empty-space/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/ast-contains-only-empty-space?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/ast-contains-only-empty-space.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/ast-contains-only-empty-space

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/ast-contains-only-empty-space.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/ast-contains-only-empty-space/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ast-contains-only-empty-space

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/ast-contains-only-empty-space.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/ast-contains-only-empty-space/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/ast-contains-only-empty-space/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/ast-contains-only-empty-space

[downloads-img]: https://img.shields.io/npm/dm/ast-contains-only-empty-space.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ast-contains-only-empty-space

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ast-contains-only-empty-space

[license-img]: https://img.shields.io/npm/l/ast-contains-only-empty-space.svg?style=flat-square
[license-url]: https://github.com/codsen/ast-contains-only-empty-space/blob/master/license.md
