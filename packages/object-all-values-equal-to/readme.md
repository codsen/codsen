# object-all-values-equal-to

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> Does the AST/nested-plain-object/array/whatever contain only one kind of value?

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
  - [`opts.arraysMustNotContainPlaceholders`](#optsarraysmustnotcontainplaceholders)
- [API](#api)
  - [API - Input](#api---input)
  - [Optional Options Object](#optional-options-object)
  - [API - Output](#api---output)
- [Why we need this](#why-we-need-this)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```sh
$ npm i object-all-values-equal-to
```

```js
// consume as a CommonJS require:
const allValuesEqualTo = require('object-all-values-equal-to')
// or as an ES Module:
import allValuesEqualTo from 'object-all-values-equal-to'
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled, contains `require` and `module.exports` | `main`                | `dist/object-all-values-equal-to.cjs.js` | 3&nbsp;KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/object-all-values-equal-to.esm.js` | 3&nbsp;KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/object-all-values-equal-to.umd.js` | 27&nbsp;KB

**[⬆ &nbsp;back to top](#)**

## Purpose

It answers the question: does the given AST/nested-plain-object/array/whatever contain only one kind of value?

The equality is not explicit, that is, we're just checking, that all values are **not unequal** to the given-one.

For example:

```js
const allValuesEqualTo = require('object-all-values-equal-to')

// are all values equal to "false":
console.log(allValuesEqualTo({a: false, c: false}, false))
// => true

// are all values equal to "false":
console.log(allValuesEqualTo({a: false, c: 'zzz'}, false))
// => false, because of `zzz`

// are all values equal to "false":
console.log(allValuesEqualTo({
  a: {
    b: false,
    c: [
      {
        d: false,
        e: false,
      },
      {
        g: false,
      }
    ]
  },
  c: false
}, false))
// => true
```

**[⬆ &nbsp;back to top](#)**

### `opts.arraysMustNotContainPlaceholders`

When working with data structures, this library would be used to check, is the certain piece of JSON data (some key's value, a nested object) is all blank, that is, contains only placeholders everywhere.

Now, with regards to arrays, default arrays should not contain placeholders directly. For example key `b` is customised, it's not a placeholder:

```json
{
  "a": false,
  "b": [false]
}
```

It should be instead:

```json
{
  "a": false,
  "b": []
}
```

When checking against second argument `false`, this library will yield `false` for former and `true` for latter.

Now, this is relevant only when working with data structures. When dealing with all other kinds of nested objects and arrays, placeholders within arrays count as placeholders and should yield `true`.

For that, turn off the `opts.arraysMustNotContainPlaceholders`, set it to `false`.

Observe:

```js
let res1 = allValuesEqualTo([null], null)
console.log(res1)
// => false

let res2 = allValuesEqualTo([null], null, { arraysMustNotContainPlaceholders: false })
console.log(res2)
// => true
```

**[⬆ &nbsp;back to top](#)**

## API

```js
allValuesEqualTo(input, value)
```

### API - Input

Input argument           | Type           | Obligatory? | Default     | Description
-------------------------|----------------|-------------|-------------|-------------
`input`                  | Whatever       | yes         | `undefined` | AST tree, or object or array or whatever. Can be deeply-nested. Hopefully contains some nested plain objects. We love nested plain objects.
`value`                  | Whatever       | no          | `false`     | We will check, does `input` contain only `value` on every key. Please don't set it to `undefined`.

**[⬆ &nbsp;back to top](#)**

### Optional Options Object

options object's key               | Type of its value  | Default  | Description
-----------------------------------|--------------------|----------|----------------------
{                                  |                    |          |
`arraysMustNotContainPlaceholders` | Boolean            | `true`   | When set to `true`, `value` within array should not be present and will yield `false` result. Set this to `false` to allow one or more `value`'s within arrays in the `input`.
}                                  |                    |          |

The Optional Options Object is validated by [check-types-mini](https://github.com/codsen/check-types-mini), so please behave: the settings' values have to match the API and settings object should not have any extra keys, not defined in the API. Naughtiness will cause error `throw`s. I know, it's strict, but it prevents any API misconfigurations and helps to identify some errors early-on.

Here are the Optional Options Object's defaults in one place (in case you ever want to copy and tweak it):

```js
{
  arraysMustNotContainPlaceholders: true,
}
```

**[⬆ &nbsp;back to top](#)**

### API - Output

Boolean: `true` or `false`.

## Why we need this

For example, I was working on [object-fill-missing-keys](https://github.com/codsen/object-fill-missing-keys). The library takes an object, a reference object, and fills in missing keys according to the reference. I was implementing a feature, a options switch, which let to skip filling for chosen keys if they currently contain only placeholders.

You'll need this library when you want to check, does the AST contain only certain value throughout the whole tree. Also, it can be a simple object, in which case, we'd be checking, are all values of all keys equal to something.

**[⬆ &nbsp;back to top](#)**

## Contributing

Hi! 99% of people in the society are passive - consumers. They wait for others to take action, they prefer to blend in. The remaining 1% are proactive citizens who will _do_ something rather than _wait_. If you are one of that 1%, you're in luck because I am the same and _together_ we can make something happen.

* If you **want a new feature** in this package or you would like to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/object-all-values-equal-to/issues). Also, you can [email me](mailto:roy@codsen.com). Just let it out.

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/object-all-values-equal-to/issues). Alternatively, you can [email me](mailto:roy@codsen.com).

* If you don't like the code in here and would like to **give an advice** about how something could be done better, please do. Same drill - [GitHub issues](https://github.com/codsen/object-all-values-equal-to/issues) or [email](mailto:roy@codsen.com), your choice.

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. I'll do my best to merge it quickly. Code style is `airbnb`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2017 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/object-all-values-equal-to.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/object-all-values-equal-to

[npm-img]: https://img.shields.io/npm/v/object-all-values-equal-to.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/object-all-values-equal-to

[travis-img]: https://img.shields.io/travis/codsen/object-all-values-equal-to.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/object-all-values-equal-to

[cov-img]: https://coveralls.io/repos/github/codsen/object-all-values-equal-to/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/object-all-values-equal-to?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/object-all-values-equal-to.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/object-all-values-equal-to

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/object-all-values-equal-to.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/object-all-values-equal-to/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/object-all-values-equal-to

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/object-all-values-equal-to.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/object-all-values-equal-to/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/object-all-values-equal-to/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/object-all-values-equal-to

[downloads-img]: https://img.shields.io/npm/dm/object-all-values-equal-to.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/object-all-values-equal-to

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/object-all-values-equal-to

[license-img]: https://img.shields.io/npm/l/object-all-values-equal-to.svg?style=flat-square
[license-url]: https://github.com/codsen/object-all-values-equal-to/blob/master/license.md
