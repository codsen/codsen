# object-delete-key

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> Delete keys from all arrays or plain objects, nested within anything, by key or by value or by both, and clean up afterwards

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
- [Deleting](#deleting)
- [API](#api)
  - [API - Input](#api---input)
    - [Accepted `opts.only` values](#accepted-optsonly-values)
  - [API - Output](#api---output)
- [Example](#example)
- [Rationale](#rationale)
- [This library vs. _.omit](#this-library-vs-_omit)
- [Arrays vs Plain objects](#arrays-vs-plain-objects)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

**[⬆ &nbsp;back to top](#)**

## Install

```bash
$ npm i object-delete-key
```

then,

```js
const deleteKey = require('object-delete-key')
// or
import deleteKey from 'object-delete-key'
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled, contains `require` and `module.exports` | `main`                | `dist/object-delete-key.cjs.js` | 2 KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/object-delete-key.esm.js` | 2 KB
**UMD build** for browsers, transpiled, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/object-delete-key.umd.js` | 43 KB

**[⬆ &nbsp;back to top](#)**

## Deleting

Three modes:

* Delete all `key`/`value` pairs found in any nested plain objects where `key` equals `value`.
* Delete all `key`/`value` pairs found in any nested plain objects where `key` is equal to a certain thing. `value` doesn't matter.
* Delete all `key`/`value` pairs found in any nested plain objects where `value` is equal to a certain thing. `key` doesn't matter.

This library accepts anything as input, including [parsed](https://github.com/posthtml/posthtml-parser) HTML, which is _deeply_ nested arrays of plain objects, arrays and strings. You can feed anything as input into this library - if it's traversable, it will be traversed and searched for your `key` and/or `value` in any plain objects.

If you want to delete any nested objects that contain certain `key`/`value` pair(s), check out [posthtml-ast-delete-object](https://github.com/codsen/posthtml-ast-delete-object).

**[⬆ &nbsp;back to top](#)**

## API

```js
var result = deleteKey(input, options)
```

Input arguments are not mutated; this package clones them first before using.

**[⬆ &nbsp;back to top](#)**

### API - Input

Input argument   | Type     | Obligatory? | Description
-----------------|----------|-------------|-----------
`input`          | Whatever | yes         | AST tree, or object or array or whatever. Can be deeply-nested.
`options`        | Object   | yes         | Options object. See its key arrangement below.

`options` object's key | Type     | Obligatory? | Default     | Description
-----------------------|----------|-------------|-------------|----------------------
{                      |          |             |             |
`key`                  | String   | no^         | n/a         | Key to find and delete.
`val`                  | Whatever | no^         | n/a         | Key's value to find and delete. Can be a massively nested AST tree or whatever.
`cleanup`              | Boolean  | no          | true        | Should this package delete any empty carcases of arrays/objects left after deletion?
`only`                 | String   | no          | `any`       | Default setting will delete from both arrays and objects. If you want to delete from plain objects only, set this to one of "object-type" values below. If you want to delete keys from arrays only, set this to one of "array-type" values below. In this case "key" means array element's value and "value" is not meant to be used.
}                      |          |             |             |

^ - at least one, `key` or `val` must be present.

**[⬆ &nbsp;back to top](#)**

#### Accepted `opts.only` values

Interpreted as "array-type" | Interpreted as "object-type" | Interpreted as "any" type
----------------------------|------------------------------|---------------
 `array`                    | `object`                     | `any`
 `arrays`                   | `objects`                    | `all`
 `arr`                      | `obj`                        | `everything`
 `aray`                     | `ob`                         | `both`
 `arr`                      | `o`                          | `either`
 `a`                        |                              | `each`
<br/>                       |                              | `whatever`
<br/>                       |                              | `e`

If `opts.only` is set to any string longer than zero characters and is **not** case-insensitively equal to one of the above, the `ast-monkey` will **throw an error**.

I wanted to relieve users from having to check the documentation for it.

### API - Output

This library returns the `input` with all requested keys/value pairs removed.

## Example

```js
// deleting key 'c', with value 'd'
deleteKey(
  {
    a: 'b',
    c: 'd'
  },
  {
    key: 'c',
    val: 'd'
  }
)
// => {a: 'b'}
```

```js
// deleting key 'b' with value ['c', 'd']
// two occurencies will be deleted, plus empty objects/arrays deleted because 4th input is default, true
deleteKey(
  {
    a: {e: [{b: ['c', 'd']}]},
    b: ['c', 'd']
  },
  {
    key: 'b',
    val: ['c', 'd']
  }
)
// => {}
```

Feed options object's key `cleanup: false` if you **don't want** empty arrays/objects removed:

```js
// deleting key 'b' with value ['c', 'd']
// two occurencies will be deleted, but empty carcasses won't be touched:
deleteKey(
  {
    a: {e: [{b: {c: 'd'}}]},
    b: {c: 'd'}
  },
  {
    key: 'b',
    val: {c: 'd'},
    cleanup: false
  }
)
// => {a: {e: [{}]}}
```

Also, you can delete by **key only**, for example, delete all key/value pairs where the key is equal to `b`:

```js
deleteKey(
  {
    a: 'a',
    b: 'jlfghdjkhkdfhgdf',
    c: [{b: 'weuhreorhelhgljdhflghd'}]
  },
  {
    key: 'b'
  }
)
// => { a: 'a' }
```

You can delete by **value only**, for example, delete all key/value pairs where the value is equal to `whatever`:

```js
deleteKey(
  {
    a: 'a',
    skldjfslfl: 'x',
    c: [{dlfgjdlkjlfgjhfg: 'x'}]
  },
  {
    val: 'x'
  }
)
// => { a: 'a' }
```

The example above didn't specified the `cleanup`, so this package _will_ delete all empty carcases of objects/arrays by default. When `cleanup` is off, the result would be this:

```js
deleteKey(
  {
    a: 'a',
    skldjfslfl: 'x',
    c: [{dlfgjdlkjlfgjhfg: 'x'}]
  },
  {
    val: 'x',
    cleanup: false
  }
)
// => {
//   a: 'a',
//   c: [{}] // <<<< observe this
// }
```

**[⬆ &nbsp;back to top](#)**

## Rationale

Object-key deletion libraries like [node-dropkey](https://github.com/wankdanker/node-dropkey) are naïve, expecting objects to be located in the input according to a certain pattern. For example, `node-dropkey` expects that the input will always be a flat array of plain objects.

But in real life, where we deal with AST _trees_ - nested _spaghetti_ of arrays, plain objects and strings — we can't expect anything. This library accepts _anything_ as an input, and no matter how deeply-nested. Feed it some nested AST's (`input`), then optionally a `key` or optionally a `value` (or both), and you'll get a result with that key/value pair removed from every plain object within the `input`.

I use this library in [email-remove-unused-css](https://github.com/codsen/email-remove-unused-css) to delete empty carcases of style tags without any selectors or empty class attributes in the inline HTML CSS.

**[⬆ &nbsp;back to top](#)**

## This library vs. _.omit

> OK, but if the input _is_ a plain object, you can achieve the same thing using Lodash `_.omit`, right?

Right, but ONLY if you don't care about the cleanup of empty arrays and/or plain objects afterwards.

Lodash will only delete keys that you ask, possibly leaving empty stumps.

This library will inteligently delete everything upstream if they're empty things (although you can turn it off passing `{ cleanup: false }` in `options` object).

Observe how key `b` _makes poof_, even though, technically, it was only a stump, having nothing to do with actual finding (besides being its parent):

```js
deleteKey(
  {
    a: 'a',
    b: {
      c: 'd'
    }
  },
  {
    key: 'c'
  }
)
// =>
// {
//   a: 'a'
// }
```

Lodash won't clean up the stump `b`:

```js
_.omit(
  {
    a: 'a',
    b: {
      c: 'd'
    }
  },
  'c'
)
// =>
// {
//   a: 'a',
//   b: {} <------------------- LOOK!
// }
```

In conclusion, Lodash `_.omit` is different from this library in that:

* `_.omit` will not work on parsed HTML trees, consisting of nested arrays/plain objects
* `_.omit` will not clean up any stumps left after the deletion.

If you want to save time, `object-delete-key` is better than Lodash because former is _specialised tool for dealing with AST's_.

**[⬆ &nbsp;back to top](#)**

## Arrays vs Plain objects

You know, both are the same _type_ in JavaScript, _object_. This library uses [ast-monkey](https://github.com/codsen/ast-monkey) which is quite liberal when it comes to distinguishing the two.

**[⬆ &nbsp;back to top](#)**

## Contributing

Hi! 99% of society are passive people, consumers. They wait for others to take action, they prefer to blend in. Rest 1% are proactive, vocal (usually also opinionated) citizens who will _do_ something rather than _wait_, hoping others will do it eventually. If you are one of that 1 %, you're in luck because I am the same and together we can make something happen.

* If you want a new feature in this package or you would like to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/object-delete-key/issues). Also, you can [email me](mailto:roy@codsen.com).

* If you tried to use this library but it misbehaves, or you need an advice setting it up, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/object-delete-key/issues). Alternatively, you can [email me](mailto:roy@codsen.com).

* If you don't like the code in here and would like to advise how something could be done better, please do. Same drill - [GitHub issues](https://github.com/codsen/object-delete-key/issues) or [email](mailto:roy@codsen.com), your choice.

* If you would like to add or change some features, just fork it, hack away, and file a pull request. I'll do my best to merge it quickly. Code style is `airbnb`, just without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

## Licence

MIT License (MIT)

Copyright © 2017 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/object-delete-key.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/object-delete-key

[npm-img]: https://img.shields.io/npm/v/object-delete-key.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/object-delete-key

[travis-img]: https://img.shields.io/travis/codsen/object-delete-key.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/object-delete-key

[cov-img]: https://coveralls.io/repos/github/codsen/object-delete-key/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/object-delete-key?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/object-delete-key.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/object-delete-key

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/object-delete-key.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/object-delete-key/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/object-delete-key

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/object-delete-key.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/object-delete-key/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/object-delete-key/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/object-delete-key

[downloads-img]: https://img.shields.io/npm/dm/object-delete-key.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/object-delete-key

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/object-delete-key

[license-img]: https://img.shields.io/npm/l/object-delete-key.svg?style=flat-square
[license-url]: https://github.com/codsen/object-delete-key/blob/master/license.md
