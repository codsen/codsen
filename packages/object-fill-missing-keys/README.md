# object-fill-missing-keys

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding-bottom: 30px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="110" align="right"></a>

> Add missing keys into plain objects, according to a provided schema object

[![Minimum Node version required][node-img]][node-url]
[![Link to npm page][npm-img]][npm-url]
[![Build Status][travis-img]][travis-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Known Vulnerabilities][vulnerabilities-img]][vulnerabilities-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![MIT License][license-badge]][license]

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Purpose](#purpose)
- [Use](#use)
- [API](#api)
  - [API - Input](#api---input)
- [Testing](#testing)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```sh
$ npm install --save object-fill-missing-keys
```

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

## Use

```js
var fillMissingKeys = require('object-fill-missing-keys')
var f = fillMissingKeys(
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

This library is meant for innards of other libraries, that's why it's docile, it will not throw if the input types are wrong — it will silently return `undefined`, that's it. Please enforce your input data types on the parent libraries. You know the API.

To repeat, library does not mutate the input arguments.

## Testing

```bash
$ npm test
```

## Contributing

If you want to contribute, don't hesitate. If it's a code contribution, please supplement `test.js` with tests covering your code. This library uses `airbnb-base` rules preset of `eslint` with few exceptions^ and follows the Semver rules.

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/codsen/object-fill-missing-keys/issues). If you file a pull request, I'll do my best to help you to get it merged promptly. If you have any comments on the code, including ideas how to improve things, don't hesitate to contact me by email.

## Licence

MIT License (MIT)

Copyright (c) 2017 Codsen Ltd, Roy Revelt

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

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

[downloads-img]: https://img.shields.io/npm/dm/object-fill-missing-keys.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/object-fill-missing-keys

[vulnerabilities-img]: https://snyk.io/test/github/codsen/object-fill-missing-keys/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/object-fill-missing-keys


[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/object-fill-missing-keys

[license-badge]: https://img.shields.io/npm/l/object-fill-missing-keys.svg?style=flat-square
[license]: https://github.com/codsen/object-fill-missing-keys/blob/master/license.md
