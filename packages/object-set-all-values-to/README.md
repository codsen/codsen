# object-set-all-values-to

> Recursively walk the input and set all found values in plain objects to something

[![Minimum Node version required][node-img]][node-url]
[![Repository is on BitBucket][bitbucket-img]][bitbucket-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#markdown-header-install)
- [Purpose](#markdown-header-purpose)
- [Use](#markdown-header-use)
- [API](#markdown-header-api)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Install

```sh
npm i object-set-all-values-to
```

```js
// consume as a CommonJS require:
const setAllValuesTo = require("object-set-all-values-to");
// or as an ES Module:
import setAllValuesTo from "object-set-all-values-to";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                                   | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/object-set-all-values-to.cjs.js` | 2 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/object-set-all-values-to.esm.js` | 1 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/object-set-all-values-to.umd.js` | 11 KB |

**[⬆ back to top](#markdown-header-object-set-all-values-to)**

## Purpose

Take any input: nested array, nested plain object or whatever really, no matter how deeply nested. Walk through it recursively and if you find any plain objects, assign **all their keys** to a given second input's argument OR default, `false`.

It does not mutate the input arguments. Operations are done on a cloned input.

I needed this library to [overwrite](https://bitbucket.org/codsen/json-comb-core) all values to be `false` on JSON schema objects, so that later when I copy from key/value pairs from schema, values are equal to `false` and I don't need to prep them further.

This library is well-tested and is being used in commercial projects.

**[⬆ back to top](#markdown-header-object-set-all-values-to)**

## Use

```js
const setAllValuesTo = require("object-set-all-values-to");

console.log(setAllValuesTo({ a: "b", c: "d" }));
// => {a: false, c: false}

console.log(setAllValuesTo({ a: "b", c: "d" }, "x"));
// => {a: 'x', c: 'x'}

console.log(setAllValuesTo({ a: "b", c: "d" }, ["x"]));
// => {a: ['x'], c: ['x']}
```

**[⬆ back to top](#markdown-header-object-set-all-values-to)**

## API

```js
setAllValuesTo(input, value);
```

### API - Input

| Input argument | Type     | Obligatory? | Default     | Description                                                                                            |
| -------------- | -------- | ----------- | ----------- | ------------------------------------------------------------------------------------------------------ |
| `input`        | Whatever | yes         | `undefined` | AST tree, or object or array or whatever. Can be deeply-nested. Hopefully contains some plain objects. |
| `value`        | Whatever | no          | `false`     | Assign all the found plain object values to this                                                       |

**[⬆ back to top](#markdown-header-object-set-all-values-to)**

### API - Output

Same thing that you gave in the first argument, except with values **overwritten** (where applicable).

## Contributing

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/object-set-all-values-to/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/object-set-all-values-to/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ back to top](#markdown-header-object-set-all-values-to)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/object-set-all-values-to.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/object-set-all-values-to
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/object-set-all-values-to
[cov-img]: https://coveralls.io/repos/bitbucket/codsen/object-set-all-values-to/badge.svg?style=flat-square&branch=master
[cov-url]: https://coveralls.io/bitbucket/codsen/object-set-all-values-to?branch=master
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/object-set-all-values-to
[downloads-img]: https://img.shields.io/npm/dm/object-set-all-values-to.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/object-set-all-values-to
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/object-set-all-values-to
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/object-set-all-values-to
