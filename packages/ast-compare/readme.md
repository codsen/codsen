# ast-compare

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> Compare anything: AST, objects, arrays, strings and nested thereof

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
- [Use](#use)
- [API](#api)
  - [Input](#input)
  - [Options object](#options-object)
  - [Output](#output)
- [Examples](#examples)
- [opts.verboseWhenMismatches](#optsverbosewhenmismatches)
- [Rationale](#rationale)
- [Differences from _.isMatch](#differences-from-_ismatch)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
$ npm i ast-compare
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled, contains `require` and `module.exports` | `main`                | `dist/ast-compare.cjs.js` | 10&nbsp;KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/ast-compare.esm.js` | 9&nbsp;KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/ast-compare.umd.js` | 50&nbsp;KB

## Purpose

Find out, does an object/array/string/nested-mix is a subset or equal to another input:

```js
var compare = require('ast-compare')
var result = compare(
  { // <- does this nested plain object...
    a: {
      b: 'd',
      c: [],
      e: 'f',
      g: 'h'
    }
  },
  { // <- ...contain this nested plain object?
    a: {
      b: 'd',
      c: []
    }
  }
)
console.log(result)
// => true
```

Main purpose is to compare two parsed HTML/CSS trees or their branches but you can compare anything, it will recursively traverse arrays too. This lib is dependency for [posthtml-ast-delete-object](https://github.com/codsen/posthtml-ast-delete-object) — library which can delete elements from [parsed](https://github.com/posthtml/posthtml-parser) HTML/CSS objects.

## Use

```js
var compare = require('ast-compare')
```

## API

The output of this library is binary and boolean: `true` or `false`.
This library will not mutate the input arguments.

### Input

**Input**

Input argument   | Type                            | Obligatory? | Description
-----------------|---------------------------------|-------------|--------------
`bigObj`         | Array or Plain object or String | yes         | Super set, larger thing.
`smallObj`       | Array or Plain object or String | yes         | A set of the above, smaller thing.
`opts`           | Plain object                    | no          | A plain object containing settings.

* If everything from `smallObj` matches everything within `bigObj`, this library returns `true`.
* Otherwise, if there's a mismatch or something wrong with input args, returns `false`.

### Options object

`options` object's key  | Type    | Obligatory? | Default | Description
------------------------|---------|-------------|---------|----------------------
{                       |         |             |         |
`hungryForWhitespace`   | Boolean | no          | `false` | The any whitespace (tabs, spaces, line breaks and so on) will match any other white space.
`matchStrictly`         | Boolean | no          | `false` | When you want to match like `===`.
`verboseWhenMismatches` | Boolean | no          | `false` | When set to `true`, instead of `false` the output will be string with a message explaining what didn't match. It's for cases when it's important to report what didn't match.
}                       |         |             |         |

### Output

If `smallObj` **is** equal or a superset of `bigObj`, the returned value is always Boolean `true`.

If it's **not** a superset or equal, the value depends on `opts.verboseWhenMismatches`:

 - Default, `opts.verboseWhenMismatches===false` will yield `false`
 - Default, `opts.verboseWhenMismatches===true` will yield `string`, explaining what didn't match.

## Examples

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
  ['a', 'b', 'c'], ['b', 'a']
)
// => false, because order is wrong
```

```js
compare(
  ['a', 'b'], ['a', 'b', 'c']
)
// => false, because second is not a subset of first
```

```js
compare(
  'a\nb', 'a\nb'
)
// => true, because strings are equal
```

```js
compare({a: 'a'})
// => false. Second input value is missing which means it's a nonsense, thus, false
```

```js
compare(null)
// => false.
```

## opts.verboseWhenMismatches

Sometimes you just want a yes/no answer is something a subset or equal to something. But sometimes, the whole point of comparison is to inform the user _exactly what_ is mismatching. In the latter cases, set `opts.verboseWhenMismatches` to `true`. When there is no match, instead of Boolean `false` the main function will return **a string** with an explanatory message.

If you use this setting, you have to anticipate Boolean `true` OR something else (Boolean `false` or string) coming out from this library.

## Rationale

I want to check, does a deeply-nested array of objects/strings/arrays (for example, [PostHTML-parsed](https://github.com/posthtml/posthtml-parser) AST output) is equal or is a subset of some other AST. Normally `_.isMatch` would do the deed but it positively matches **empty arays against any arrays** what is terrible. Hence this library. Plus, this library will accept and adapt to any sources — combinations of arrays, objects and strings. That's necessary to support any parsed AST trees - HTML or CSS or whatever.

## Differences from _.isMatch

> "Partial comparisons will match empty array and empty object source values against any array or object value, respectively." — [Lodash documentation](https://lodash.com/docs/4.16.4#isMatch)

[_.isMatch](https://www.npmjs.com/package/lodash.ismatch) positively matches empty arrays to everything. This is bad when you are comparing parsed HTML/CSS trees. This library doesn't do this. Empty array will not be reported as equal to non-empty array.

```js
// in this library:
var res = compare(
  ['a', 'b', 'c'],
  []
)
// now, res === false
```

## Contributing

Hi! 99% of people in the society are passive - consumers. They wait for others to take action, they prefer to blend in. The remaining 1% are proactive citizens who will _do_ something rather than _wait_. If you are one of that 1%, you're in luck because I am the same and _together_ we can make something happen.

* If you **want a new feature** in this package or you would like to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/ast-compare/issues). Also, you can [email me](mailto:roy@codsen.com). Just let it out.

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/ast-compare/issues). Alternatively, you can [email me](mailto:roy@codsen.com).

* If you don't like the code in here and would like to **give an advice** about how something could be done better, please do. Same drill - [GitHub issues](https://github.com/codsen/ast-compare/issues) or [email](mailto:roy@codsen.com), your choice.

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. I'll do my best to merge it quickly. Code style is `airbnb`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

## Licence

MIT License (MIT)

Copyright © 2017 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/ast-compare.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ast-compare

[npm-img]: https://img.shields.io/npm/v/ast-compare.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/ast-compare

[travis-img]: https://img.shields.io/travis/codsen/ast-compare.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/ast-compare

[cov-img]: https://coveralls.io/repos/github/codsen/ast-compare/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/ast-compare?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/ast-compare.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/ast-compare

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/ast-compare.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/ast-compare/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ast-compare

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/ast-compare.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/ast-compare/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/ast-compare/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/ast-compare

[downloads-img]: https://img.shields.io/npm/dm/ast-compare.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ast-compare

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ast-compare

[license-img]: https://img.shields.io/npm/l/ast-compare.svg?style=flat-square
[license-url]: https://github.com/codsen/ast-compare/blob/master/license.md
