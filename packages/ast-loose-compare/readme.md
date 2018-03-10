# ast-loose-compare

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> Compare anything: AST, objects, arrays and strings

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
- [Purpose](#purpose)
- [Difference from `posthtml-ast-compare`](#difference-from-posthtml-ast-compare)
- [Differences from _.isMatch](#differences-from-_ismatch)
- [Competition](#competition)
- [API](#api)
- [More examples](#more-examples)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
npm i ast-loose-compare
```

```js
// consume via a CommonJS require:
const looseCompare = require('ast-loose-compare')
// or as an ES Module:
import looseCompare from 'ast-loose-compare'
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/ast-loose-compare.cjs.js` | 3&nbsp;KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/ast-loose-compare.esm.js` | 3&nbsp;KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/ast-loose-compare.umd.js` | 14&nbsp;KB

**[⬆ &nbsp;back to top](#)**

## Purpose

To find out, does an object/array/string/nested-mix is a subset or equal to another input:

```js
compare(
  {
    a: {
      b: 'd',
      c: [],
      e: 'f',
      g: 'h'
    }
  },
  {
    a: {
      b: 'd',
      c: []
    }
  }
)
// => true
```

Any plain object, array or string or nested tree of thereof that contains only space characters, tabs or line breaks is considered as "containing only empty space".

If this library will encounter two things that contain only _empty space_, it will report them as equal.

For example these two are equal:

```js
compare(
  {
    a: 'a',
    b: '\n \n\n'
  },
  {
    a: 'a',
    b: '\t\t \t'
  }
)
// => true
```

Second input argument can be subset of first-one, notice `b` values are of a different type, yet both contain only _empty space_:

```js
compare(
  {
    a: 'a',
    b: [[['\n \n\n']]],
    c: 'c'
  },
  {
    a: 'a',
    b: {c: {d: '   \t\t \t'}}
  }
)
// => true
```

Main purpose of this library is to compare parsed HTML/CSS trees when deleting empty [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) branches. This library is a dependency for [posthtml-ast-delete-object](https://github.com/codsen/posthtml-ast-delete-object) — library which can delete elements from [parsed](https://github.com/posthtml/posthtml-parser) HTML/CSS objects.

**[⬆ &nbsp;back to top](#)**

## Difference from `posthtml-ast-compare`

There is another similarly-named library, [posthtml-ast-compare](https://github.com/codsen/posthtml-ast-compare). The difference between the two is the following.

`posthtml-ast-compare` will check: is something a _subset_ or exactly equal of something. If **subset** query item has empty array or an array with empty string with it, it will search for exactly the same on the **superset** query item. Unlike in [_.isMatch](https://www.npmjs.com/package/lodash.ismatch), empty array will not be reported as equal to non-empty array.

`ast-loose-compare` will act the same as `posthtml-ast-compare` except

In Lodash [_.isMatch](https://www.npmjs.com/package/lodash.ismatch), an empty array will be equal to anything that has only empty space (on other objects/arrays containing only empty space). Here, `ast-loose-compare` will report that empty array is not equal to non-empty array (or anything containing non just an empty space).

**[⬆ &nbsp;back to top](#)**

## Differences from _.isMatch

> "Partial comparisons will match empty array and empty object source values against any array or object value, respectively." — [Lodash documentation](https://lodash.com/docs/4.16.4#isMatch)

[_.isMatch](https://www.npmjs.com/package/lodash.ismatch) positively matches empty arrays to everything. This is bad when you are comparing parsed HTML/CSS trees. This library doesn't do this. In this library, empty array will not be reported as equal to non-empty array, although if both arguments contain something which is _empty space_, they will be considered equal.

If you want an AST comparison library with a stricter ways towards the _empty space equation_, check [posthtml-ast-compare](https://github.com/codsen/posthtml-ast-compare).

**[⬆ &nbsp;back to top](#)**

## Competition

I want to check, does a deeply-nested array of objects/strings/arrays (for example, [PostHTML-parsed](https://github.com/posthtml/posthtml-parser) AST output) is equal or is a subset of something. Normally `_.isMatch` would do the deed but it positively matches empty arays against any arrays. Hence this library. Plus, this library will accept and adapt to any sources — combinations of arrays, objects and strings. That's necessary to support any parsed AST trees - HTML or CSS or whatever.

**[⬆ &nbsp;back to top](#)**

## API

```js
looseCompare (
  bigObj,   // something (Object|Array|String|nested mix)
  smallObj  // something (Object|Array|String|nested mix). Maybe it's a subset or equal to bigObj.
);
// => Boolean|undefined
```

* If everything from `smallObj` matches everything within `bigObj`, this library returns `true`.
* Otherwise, if there's a mismatch, returns `false`.
* For all other cases where inputs are missing/`undefined`, returns `undefined`.
* If both `smallObj` and `bigObj` contain the same key and their values contain only empty space (differing or not), they will be considered equal.

**[⬆ &nbsp;back to top](#)**

## More examples

```js
compare(
  {a: '1', b: '2', c: '3'}, {a: '1', b: '2'}
)
// => true, because second (smallObj) is subset of (or equal) first (bigObj).
```

```js
compare(
  {a: '1', b: '2'}, {a: '1', b: '2', c: '3'}
)
// => false, because second (smallObj) is not a subset (or equal) to first (bigObj).
```

```js
compare(
  ['a', 'b', 'c'], ['a', 'b']
)
// => true, because second is a subset of first
```

```js
compare(
  ['a', 'b'], ['a', 'b', 'c']
)
// => false, because second is not a subset of first
```

```js
compare(
  'aaaaa\nbbbbb', 'aaaaa\nbbbbb'
)
// => true, because strings are equal
```

```js
compare({a: 'a'})
// => undefined, because second input value is missing
```

**[⬆ &nbsp;back to top](#)**

## Contributing

* If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/ast-loose-compare/issues).

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/ast-loose-compare/issues).

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. Code style is `airbnb-base`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt


[node-img]: https://img.shields.io/node/v/ast-loose-compare.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ast-loose-compare

[npm-img]: https://img.shields.io/npm/v/ast-loose-compare.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/ast-loose-compare

[travis-img]: https://img.shields.io/travis/codsen/ast-loose-compare.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/ast-loose-compare

[cov-img]: https://coveralls.io/repos/github/codsen/ast-loose-compare/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/ast-loose-compare?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/ast-loose-compare.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/ast-loose-compare

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/ast-loose-compare.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/ast-loose-compare/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ast-loose-compare

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/ast-loose-compare.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/ast-loose-compare/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/ast-loose-compare/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/ast-loose-compare

[downloads-img]: https://img.shields.io/npm/dm/ast-loose-compare.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ast-loose-compare

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ast-loose-compare

[license-img]: https://img.shields.io/npm/l/ast-loose-compare.svg?style=flat-square
[license-url]: https://github.com/codsen/ast-loose-compare/blob/master/license.md
