# object-set-all-values-to

> Recursively walk the input and set all found values in plain objects to something

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#install)
- [Purpose](#purpose)
- [Use](#use)
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i object-set-all-values-to
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`setAllValuesTo`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const setAllValuesTo = require("object-set-all-values-to");
```

or as an ES Module:

```js
import setAllValuesTo from "object-set-all-values-to";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/object-set-all-values-to/dist/object-set-all-values-to.umd.js"></script>
```

```js
// in which case you get a global variable "objectSetAllValuesTo" which you consume like this:
const setAllValuesTo = objectSetAllValuesTo;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                                   | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/object-set-all-values-to.cjs.js` | 1 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/object-set-all-values-to.esm.js` | 1 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/object-set-all-values-to.umd.js` | 10 KB |

**[⬆ back to top](#)**

## Purpose

Take any input: nested array, nested plain object or whatever really, no matter how deeply nested. Walk through it recursively and if you find any plain objects, assign **all their keys** to a given second input's argument OR default, `false`.

It does not mutate the input arguments. Operations are done on a cloned input.

I needed this library to [overwrite](https://gitlab.com/codsen/codsen/tree/master/packages/json-comb-core) all values to be `false` on JSON schema objects, so that later when I copy from key/value pairs from schema, values are equal to `false` and I don't need to prep them further.

This library is well-tested and is being used in commercial projects.

**[⬆ back to top](#)**

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

**[⬆ back to top](#)**

## API

```js
setAllValuesTo(input, value);
```

### API - Input

| Input argument | Type     | Obligatory? | Default     | Description                                                                                            |
| -------------- | -------- | ----------- | ----------- | ------------------------------------------------------------------------------------------------------ |
| `input`        | Whatever | yes         | `undefined` | AST tree, or object or array or whatever. Can be deeply-nested. Hopefully contains some plain objects. |
| `value`        | Whatever | no          | `false`     | Assign all the found plain object values to this                                                       |

**[⬆ back to top](#)**

### API - Output

Same thing that you gave in the first argument, except with values **overwritten** (where applicable).

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=object-set-all-values-to%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aobject-set-all-values-to%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=object-set-all-values-to%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aobject-set-all-values-to%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=object-set-all-values-to%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aobject-set-all-values-to%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/object-set-all-values-to.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/object-set-all-values-to
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/object-set-all-values-to
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/object-set-all-values-to
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/object-set-all-values-to
[downloads-img]: https://img.shields.io/npm/dm/object-set-all-values-to.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/object-set-all-values-to
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/object-set-all-values-to
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
