# object-flatten-all-arrays

> Merge and flatten any arrays found in all values within plain objects

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
- [For example](#markdown-header-for-example)
- [API](#markdown-header-api)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Install

```sh
npm i object-flatten-all-arrays
```

```js
// consume as a CommonJS require:
const flattenAllArrays = require("object-flatten-all-arrays");
// or as an ES Module:
import flattenAllArrays from "object-flatten-all-arrays";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                                    | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | --------------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/object-flatten-all-arrays.cjs.js` | 2 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/object-flatten-all-arrays.esm.js` | 2 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/object-flatten-all-arrays.umd.js` | 36 KB |

**[⬆ back to top](#markdown-header-object-flatten-all-arrays)**

## Purpose

Recursively traverse the cloned input and merge all plain objects within each array.

## For example

```js
const flattenAllArrays = require("object-flatten-all-arrays");
const object = {
  a: "a",
  b: "b",
  c: [
    {
      b: "b",
      a: "a"
    },
    {
      d: "d",
      c: "c"
    }
  ]
};
const flattened = flattenAllArrays(object);
console.log("flattened = " + JSON.stringify(flattened, null, 4));
// => {
// a: 'a',
// b: 'b',
// c: [
//   {
//     a: 'a',
//     b: 'b',
//     c: 'c',
//     d: 'd'
//   }
// ]}
```

**[⬆ back to top](#markdown-header-object-flatten-all-arrays)**

## API

```js
flatten(input[, options])
```

Returns the same type thing as given input, only with arrays (recursively) flattened.

### API - Input

None of the input arguments are mutated. Their clones are being used instead.

| Input argument | Type         | Obligatory? | Description                                                                                            |
| -------------- | ------------ | ----------- | ------------------------------------------------------------------------------------------------------ |
| `input`        | Whatever     | yes         | AST tree, or object or array or whatever. Can be deeply-nested. Hopefully contains some plain objects. |
| `options`      | Plain object | no          | Set the options in this object. See below for keys.                                                    |

| `options` object's key                    | Type    | Obligatory? | Default | Description                                                                                                                                     |
| ----------------------------------------- | ------- | ----------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| {                                         |         |             |         |
| `flattenArraysContainingStringsToBeEmpty` | Boolean | no          | `false` | If any arrays contain strings, flatten them to be empty thing. This is turned off by default, but it's what you actually need most of the time. |
| }                                         |         |             |         |

**[⬆ back to top](#markdown-header-object-flatten-all-arrays)**

## Contributing

- If you see an error, [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=object-flatten-all-arrays%20package%20-%20put%20title%20here).
- If you want a new feature but can't code it up yourself, also [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=object-flatten-all-arrays%20package%20-%20put%20title%20here). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=object-flatten-all-arrays%20package%20-%20put%20title%20here). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://bitbucket.org/codsen/codsen/src/) via BitBucket, then write code, then file a pull request via BitBucket. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#markdown-header-object-flatten-all-arrays)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/object-flatten-all-arrays.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/object-flatten-all-arrays
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/codsen/src/master/packages/object-flatten-all-arrays
[cov-img]: https://img.shields.io/badge/coverage-100%-brightgreen.svg?style=flat-square
[cov-url]: https://bitbucket.org/codsen/codsen/src/master/packages/object-flatten-all-arrays
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/object-flatten-all-arrays
[downloads-img]: https://img.shields.io/npm/dm/object-flatten-all-arrays.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/object-flatten-all-arrays
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/object-flatten-all-arrays
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/codsen/src/master/packages/object-flatten-all-arrays
