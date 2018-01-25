# object-fill-missing-keys

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> Add missing keys into plain objects, according to a reference object

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
- [How this works](#how-this-works)
- [Example](#example)
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```sh
npm i object-fill-missing-keys
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
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/object-fill-missing-keys.cjs.js` | 6&nbsp;KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/object-fill-missing-keys.esm.js` | 6&nbsp;KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/object-fill-missing-keys.umd.js` | 49&nbsp;KB

**[⬆ &nbsp;back to top](#)**

## Purpose

This library fills missing keys in a plain object according to a supplied reference object. It is driving the [json-comb-core](https://github.com/codsen/json-comb-core#enforcekeyset) method `enforceKeyset()`.

**[⬆ &nbsp;back to top](#)**

## How this works

This library performs the key creation part in the JSON files' _normalisation_ operation. JSON file normalisation is, basically, making a set of JSON files to have the same key set.

**Here's how it slots in the normalisation process:**

First, you take two or more plain objects, normally originating from JSON files' contents.

Then, you [calculate](https://github.com/codsen/json-comb-core#getkeyset) the _schema reference_ out of them. It's basically a superset object of all possible keys used across the objects (your JSON files).

Finally, you go through your plain objects second time, one-by-one and [fill missing keys](https://github.com/codsen/json-comb-core#enforcekeyset) using **this library**. It takes the plain object and your generated _schema reference_ (and optionally a custom placeholder if you don't like Boolean `false`) and creates missing keys/arrays in that plain object.

---

Alternatively, you can use this library just to add missing keys. Mind you, for performance reasons, schema is expected to have all key _values_ equal to placeholders. This way, when creation happens, it can be merged over and those placeholder values come into right places as placeholders. This means, if you provide a schema with some keys having values as non-placeholder, you'll get those values written onto your objects.

Previously I kept "insurance" function which took a schema reference object and overwrote all its values to the `opts.placeholder`, but then I understood that "normal" reference schemas will always come with right key values anyway and such operation would waste resources.

**[⬆ &nbsp;back to top](#)**

## Example

```js
const fillMissingKeys = require('object-fill-missing-keys')
const result = fillMissingKeys(
  {
    b: 'b' // <---- input plain object that could have come from JSON
  },
  { // <---- schema reference object
    a: false,
    b: false,
    c: false
  }
)
console.log('result = ' + JSON.stringify(result, null, 4))
// result = {
//   a: false,
//   b: 'b',
//   c: false
// }
```

**[⬆ &nbsp;back to top](#)**

## API

```js
fillMissingKeys(incompleteObj, schemaObj, [opts])
```

Input arguments are not mutated, inputs are cloned before being used. That's important.

### API - Input

Input argument           | Type           | Obligatory? | Description
-------------------------|----------------|-------------|-------------
`incompleteObj`          | Plain object   | yes         | Plain object. Can have nested values.
`schemaObj`              | Plain object   | yes         | Schema object which contains a desired set of values. Can be nested or hold arrays of things.
`opts`                   | Plain object   | no          | Optional Options Object, see below for its API

**[⬆ &nbsp;back to top](#)**

### Optional Options Object

options object's key                               | Type of its value             | Default               | Description
---------------------------------------------------|-------------------------------|-----------------------|----------------------
{                                                  |                               |                       |
`doNotFillThesePathsIfTheyContainPlaceholders`     | Array of zero or more strings | `[]`                  | Handy to activate this for ad-hoc keys in data structures to limit the data bloat.
`placeholder`                                      | Anything                      | `false`               | Used only in combination with `doNotFillThesePathsIfTheyContainPlaceholders` as a means to compare do all children keys contain placeholder values. It won't patch up your reference schema objects (for performance reasons). Always make sure your reference schema object has all values [set](https://github.com/codsen/object-set-all-values-to) to be a desired `placeholder` (default placeholder is usually Boolean `false`).
}                                                  |                               |                       |

**[⬆ &nbsp;back to top](#)**

### `opts.doNotFillThesePathsIfTheyContainPlaceholders`

This setting is handy to limit the lengths of your JSON files. Sometimes, you have some ad-hoc keys that are either very large nested trees of values AND/OR they are rarely used. In those cases, you want to manually trigger the normalisation of that key.

It's done this way.

Find out the path of the key you want to limit normalising on. Path notation is following the one used in [object-path](https://www.npmjs.com/package/object-path): if it's object, put the key name, if it's array, put that element's ID. For example: `orders.latest.0.first_name` would be:

```
{
  orders: {
    latest: [ // <---- notice it's a nested array within a plain object
      {
        first_name: "Bob", // <------ this key is `orders.latest.0.first_name`
        last_name: "Smith"
      },
      {
        first_name: "John",
        last_name: "Doe"
      }
    ]
  }
}
```

Put the path you want to skip normalising into `opts.doNotFillThesePathsIfTheyContainPlaceholders` array. For example:

```js
const res = fillMissingKeys(
  { // <---- input
    a: {
      b: false, // <---- we don't want to automatically normalise this key
      x: 'x',
    },
    z: 'z',
  },
  { // <---- reference schema object
    a: {
      b: {
        c: false,
        d: false,
      },
      x: false,
    },
    z: false,
  },
  {
    doNotFillThesePathsIfTheyContainPlaceholders: ['a.b'],
  },
)
console.log(`res = ${JSON.stringify(res, null, 4)}`)
// res = {
//   a: {
//     b: false, // <---------------- observe, the keys were not added because it had a placeholder
//     x: 'x',
//   },
//   z: 'z',
// }
```

In order to trigger normalisation on an ignored path, you have to set the value on that path to be _falsey_, but not placeholder. If you are using default placeholder, `false`, just set the value in the path as `true`. If you're using custom placeholder, different as `false`, set it to `false`. The normalisation will see not a placeholder and will start to comparing/filling in missing branches in your object.

For example, we want to fill the value for `a.b.c`, but we are not sure what's the data structure. We actually want a placeholder to be set during normalisation under path `a.b`. We set `a.b` to `true`:

```js
const res = fillMissingKeys(
  {
    a: {
      b: true, // <-- not placeholder but lower in data hierarchy (boolean)
      x: 'x',
    },
    z: 'z',
  },
  {
    a: {
      b: {
        c: false,
        d: false,
      },
      x: false,
    },
    z: false,
  },
  {
    doNotFillThesePathsIfTheyContainPlaceholders: ['a.b'],
  },
)
console.log(`res = ${JSON.stringify(res, null, 4)}`)
// res = {
//   a: {
//     b: {
//       c: false, // <---- values added!
//       d: false, // <---- values added!
//     },
//     x: 'x',
//   },
//   z: 'z',
// }
```

**[⬆ &nbsp;back to top](#)**

## Contributing

* If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/object-fill-missing-keys/issues).

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/object-fill-missing-keys/issues).

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. Code style is `airbnb-base`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt


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
