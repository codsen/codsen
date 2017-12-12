# object-fill-missing-keys

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> Add missing keys into plain objects, according to a provided schema object

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
  - [API - Input](#api---input)
  - [Optional Options Object](#optional-options-object)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```sh
$ npm i object-fill-missing-keys
```

```js
// consume as a CommonJS require:
const fillMissingKeys = require('object-fill-missing-keys')
// or as an ES Module:
import fillMissingKeys from 'object-fill-missing-keys'
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled, contains `require` and `module.exports` | `main`                | `dist/object-fill-missing-keys.cjs.js` | 4&nbsp;KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/object-fill-missing-keys.esm.js` | 4&nbsp;KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/object-fill-missing-keys.umd.js` | 37&nbsp;KB

**[⬆ &nbsp;back to top](#)**

## Purpose

Imagine you parsed two JSON files and got two objects. Each has few keys that another one doesn't. How do you make so that each has the same set of keys, in alphabetical order? I call that _normalising_. Mind you; each JSON file can be nested spaghetti of plain objects within arrays within plain objects and contain gazillion of string values too. Normalising involves Abstract Syntax Tree (AST) traversal, what requires recursive operations.

This library performs this **normalising part**. Feed an input object and a schema object and it will fill any keys that are in the schema but not in the input.

Now, you may ask, how do you generate a _schema object_?

Flatten and merge all arrays, then set all key values of it to the default value you want schema to bear.

For that you'll need few other libraries:

* [object-flatten-all-arrays](https://github.com/codsen/object-flatten-all-arrays)
* [object-merge-advanced](https://github.com/codsen/object-merge-advanced)
* [object-set-all-values-to](https://github.com/codsen/object-set-all-values-to)

But let's get back to the main subject.

**[⬆ &nbsp;back to top](#)**

## Use

```js
const fillMissingKeys = require('object-fill-missing-keys')
const f = fillMissingKeys(
  {
    b: 'b'
  },
  {
    a: false,
    b: false,
    c: false
  }
)
console.log('f = ' + JSON.stringify(f, null, 4))
// => {
//      a: false,
//      b: 'b',
//      c: false
//    }
```

**[⬆ &nbsp;back to top](#)**

## API

```js
fillMissingKeys(incompleteObj, schemaObj)
```

Input arguments are not mutated, inputs are cloned before being used.

### API - Input

Input argument           | Type           | Obligatory? | Description
-------------------------|----------------|-------------|-------------
`incompleteObj`          | Plain object   | yes         | Plain object. Can have nested values.
`schemaObj`              | Plain object   | yes         | Schema object which contains a desired set of values. Can be nested or hold arrays of things.
`opts`                   | Plain object   | no          | Optional Options Object, see below for its API

### Optional Options Object

options object's key                               | Type of its value             | Default               | Description
---------------------------------------------------|-------------------------------|-----------------------|----------------------
{                                                  |                               |                       |
`placeholder`                                      | Anything                      | `false`               | What should we use to put as a placeholder value when adding a key. Default is Boolean `false`.
`doNotFillTheseKeysIfAllTheirValuesArePlaceholder` | Array of zero or more strings | `[]`                  | Handy to activate this for ad-hoc keys in data structures to limit the data bloat.
}                                                  |                               |                       |

**[⬆ &nbsp;back to top](#)**

## Contributing

Hi! 99% of people in the society are passive - consumers. They wait for others to take action, they prefer to blend in. The remaining 1% are proactive citizens who will _do_ something rather than _wait_. If you are one of that 1%, you're in luck because I am the same and _together_ we can make something happen.

* If you **want a new feature** in this package or you would like to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/object-fill-missing-keys/issues). Also, you can [email me](mailto:roy@codsen.com). Just let it out.

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/object-fill-missing-keys/issues). Alternatively, you can [email me](mailto:roy@codsen.com).

* If you don't like the code in here and would like to **give an advice** about how something could be done better, please do. Same drill - [GitHub issues](https://github.com/codsen/object-fill-missing-keys/issues) or [email](mailto:roy@codsen.com), your choice.

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. I'll do my best to merge it quickly. Code style is `airbnb`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2017 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/object-fill-missing-keys.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/object-fill-missing-keys

[npm-img]: https://img.shields.io/npm/v/object-fill-missing-keys.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/object-fill-missing-keys

[travis-img]: https://img.shields.io/travis/codsen/object-fill-missing-keys.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/object-fill-missing-keys

[cov-img]: https://coveralls.io/repos/github/codsen/object-fill-missing-keys/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/object-fill-missing-keys?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/object-fill-missing-keys.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/object-fill-missing-keys

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/object-fill-missing-keys.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/object-fill-missing-keys/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/object-fill-missing-keys

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/object-fill-missing-keys.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/object-fill-missing-keys/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/object-fill-missing-keys/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/object-fill-missing-keys

[downloads-img]: https://img.shields.io/npm/dm/object-fill-missing-keys.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/object-fill-missing-keys

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/object-fill-missing-keys

[license-img]: https://img.shields.io/npm/l/object-fill-missing-keys.svg?style=flat-square
[license-url]: https://github.com/codsen/object-fill-missing-keys/blob/master/license.md
