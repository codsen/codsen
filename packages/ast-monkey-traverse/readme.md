# ast-monkey-traverse

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> Utility library to traverse parsed HTML (AST's) or anything nested (plain objects within arrays within plain objects)

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

* Check out the parent library which does even more: [ast-monkey](https://github.com/codsen/ast-monkey/)

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Idea](#idea)
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
npm i ast-monkey-traverse
```

Then, consume either in CommonJS format (`require`) or as an ES Module (`import`):

```js
// as CommonJS require:
const traverse = require('ast-monkey-traverse')
// or as ES Module:
import traverse from 'ast-monkey-traverse'
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/ast-monkey-traverse.cjs.js` | 2&nbsp;KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/ast-monkey-traverse.esm.js` | 2&nbsp;KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/ast-monkey-traverse.umd.js` | 10&nbsp;KB

**[⬆ &nbsp;back to top](#)**

## Idea

Walk through every single element of an array or key of an object or every string in the given input, use familiar callback function interface (just like `Array.forEach` or `Array.map`).

## API

`traverse()` is an inner method meant to be used by other functions. It does the actual traversal of the AST tree (or whatever input you gave, from simplest string to most complex spaghetti of nested arrays and plain objects). This ~method~ function is used via a callback function, similarly to `Array.forEach()`.

```js
const traverse = require('ast-monkey-traverse')
var ast = [{a: 'a', b: 'b'}]
ast = traverse(ast, function (key, val, innerObj) {
  let current = (val !== undefined) ? val : key
  // if you are traversing and "stumbled" upon an object, it will have both "key" and "val"
  // if you are traversing and "stumbled" upon an array, it will have only "key"
  // you can detect either using the principle above.
  // you can also now change "current" - what you return will be overwritten.
  // return `NaN` to give instruction to delete currently traversed piece of AST.
  return current // #1 <------ it's obligatory to return it, unless you want to assign it to "undefined"
})
```

It's very important to **return the value of the callback function** (point marked `#1` above) because otherwise whatever you return will be written over the current AST piece being iterated.

If you want to delete, return `NaN`.

**[⬆ &nbsp;back to top](#)**

#### innerObj in the callback

When you call `traverse()` like this:

```js
input = traverse(input, function (key, val, innerObj) {
  ...
})
```

you get three variables:

- `key`
- `val`
- `innerObj`

If `traverse()` is currently traversing a plain object, going each key/value pair, `key` will be the object's current key and `val` will be the value.
If `traverse()` is currently traversing an array, going through all elements, a `key` will be the current element and `val` will be `null`.

`innerObj` object's key | Type           | Description
------------------------|----------------|----------------------
`{`                     |                |
`depth`                 | Integer number | Zero is root, topmost level. Every level deeper increments `depth` by `1`.
`path`                  | String         | The path to the current value. The path uses exactly the same notation as the popular [object-path](https://www.npmjs.com/package/object-path) package. For example, `a.1.b` would be: input object's key `a` > value is array, take `1`st index (second element in a row, since indexes start from zero) > value is object, take it's key `b`.
`topmostKey`            | String         | When you are very deep, this is the topmost parent's key.
`parent`                | Type of the parent of current element being traversed | A whole parent (array or a plain object) which contains the current element. Its purpose is to allow you to query the **siblings** of the current element.
`}`                     |                |

**[⬆ &nbsp;back to top](#)**

## Contributing

* If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/ast-monkey-traverse/issues).

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/ast-monkey-traverse/issues).

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. Code style is `airbnb-base`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt


[node-img]: https://img.shields.io/node/v/ast-monkey-traverse.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ast-monkey-traverse

[npm-img]: https://img.shields.io/npm/v/ast-monkey-traverse.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/ast-monkey-traverse

[travis-img]: https://img.shields.io/travis/codsen/ast-monkey-traverse.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/ast-monkey-traverse

[cov-img]: https://coveralls.io/repos/github/codsen/ast-monkey-traverse/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/ast-monkey-traverse?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/ast-monkey-traverse.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/ast-monkey-traverse

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/ast-monkey-traverse.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/ast-monkey-traverse/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ast-monkey-traverse

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/ast-monkey-traverse.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/ast-monkey-traverse/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/ast-monkey-traverse/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/ast-monkey-traverse

[downloads-img]: https://img.shields.io/npm/dm/ast-monkey-traverse.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ast-monkey-traverse

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ast-monkey-traverse

[license-img]: https://img.shields.io/npm/l/ast-monkey-traverse.svg?style=flat-square
[license-url]: https://github.com/codsen/ast-monkey-traverse/blob/master/license.md
