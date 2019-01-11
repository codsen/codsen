# object-boolean-combinations

> Generate an array full of object copies, each containing a unique Boolean value combination. Includes overrides.

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
- [What it does](#markdown-header-what-it-does)
- [API](#markdown-header-api)
- [Overriding](#markdown-header-overriding)
- [Overriding the combinations — in practice](#markdown-header-overriding-the-combinations-in-practice)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Install

```sh
npm i object-boolean-combinations
```

```js
// consume as a CommonJS require:
const objectBooleanCombinations = require("object-boolean-combinations");
// or as an ES Module:
import objectBooleanCombinations from "object-boolean-combinations";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                                      | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ----------------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/object-boolean-combinations.cjs.js` | 3 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/object-boolean-combinations.esm.js` | 2 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/object-boolean-combinations.umd.js` | 16 KB |

**[⬆ back to top](#markdown-header-object-boolean-combinations)**

## What it does

It consumes a plain object, takes its keys (values don't matter) and produces an array with every possible combination of each key's Boolean^ value. If you have _n_ keys, you'll get `2^n` objects in the resulting array.

```js
const objectBooleanCombinations = require("object-boolean-combinations");
const test = objectBooleanCombinations({ a: "whatever" });
console.log(`test = ${JSON.stringify(test, null, 4)}`);
// => [
//      {a: 0},
//      {a: 1}
//    ]
```

^ We could generate `true`/`false` values, but for efficiency, we're generating `0`/`1` instead. Works the same in Boolean logic, but takes up less space.

PS. Observe how input values don't matter, we had: `{ a: 'whatever' }`.

Sometimes, you don't want all the combinations, you might want to "pin" certain values to be constant across all combinations. In those cases, use [overrides](#overriding), see below.

**[⬆ back to top](#markdown-header-object-boolean-combinations)**

## API

```javascript
objectBooleanCombinations(inputObject, [overrideObject]);
```

### API - Input

| Input argument   | Type         | Obligatory? | Description                                                                                                                           |
| ---------------- | ------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `inputObject`    | Plain object | yes         | Plain object from which we should reference the keys.                                                                                 |
| `overrideObject` | Plain object | no          | Keys in this object will be used as-is and will not be used for generating combinations. See [overriding](#overriding) section below. |

**[⬆ back to top](#markdown-header-object-boolean-combinations)**

## Overriding

Sometimes you want to override the object keys, for example, in the a settings object, I want to override all `a` and `b` keys to be only `true` (`1`). This reduces the object combinations from `2^3 = 8` to: `2^(3-2) = 2^1 = 2`:

```js
const objectBooleanCombinations = require("object-boolean-combinations");
const test = objectBooleanCombinations(
  { a: 0, b: 0, c: 0 },
  { a: 1, b: 1 } // <----- Override. These values will be on all combinations.
);
console.log(`test = ${JSON.stringify(test, null, 4)}`);
// => [
//      {a: 1, b: 1, c: 0},
//      {a: 1, b: 1, c: 1}
//    ]
```

In example above, `a` and `b` are "pinned" to `1`, thus reducing the amount of combinations by power of two, essentially halving resulting objects count twice. Notice how only `c` is having variations.

**[⬆ back to top](#markdown-header-object-boolean-combinations)**

## Overriding the combinations — in practice

In practice, I use this overriding to perform the specific tests on [Detergent.js](https://bitbucket.org/codsen/codsen/src/master/packages/detergent). For example, let's say, I am testing: does Detergent encode entities correctly. In that case I need two arrays filled with objects:

- first array — `encodeEntities = true` and all possible combinations of the other 9 settings (2^(10-1)=512 objects in array)
- second array — `encodeEntities = false` and all possible combinations of the rest — again 512 objects in array.

Here's an AVA test, which uses `objectBooleanCombinations()` to create a combinations array of settings objects, then uses `forEach()` to iterate through them all, testing each:

```js
test("encode entities - pound sign", t => {
  objectBooleanCombinations(sampleObj, {
    convertEntities: true
  }).forEach(function(elem) {
    t.is(
      detergent("\u00A3", elem),
      "&pound;",
      "pound char converted into entity"
    );
  });
});
```

**[⬆ back to top](#markdown-header-object-boolean-combinations)**

## Contributing

- If you see an error, [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=object-boolean-combinations%20package%20-%20put%20title%20here).
- If you want a new feature but can't code it up yourself, also [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=object-boolean-combinations%20package%20-%20put%20title%20here). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=object-boolean-combinations%20package%20-%20put%20title%20here). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://bitbucket.org/codsen/codsen/src/) via BitBucket, then write code, then file a pull request via BitBucket. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#markdown-header-object-boolean-combinations)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/object-boolean-combinations.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/object-boolean-combinations
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/codsen/src/master/packages/object-boolean-combinations
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://bitbucket.org/codsen/codsen/src/master/packages/object-boolean-combinations
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/object-boolean-combinations
[downloads-img]: https://img.shields.io/npm/dm/object-boolean-combinations.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/object-boolean-combinations
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/object-boolean-combinations
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/codsen/src/master/LICENSE
