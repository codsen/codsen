# object-boolean-combinations

> Generate an array full of object copies, each containing a unique Boolean value combination. Includes overrides.

[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#install)
- [What it does](#what-it-does)
- [API](#api)
- [Overriding](#overriding)
- [Overriding the combinations — in practice](#overriding-the-combinations--in-practice)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i object-boolean-combinations
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`combinations`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const combinations = require("object-boolean-combinations");
```

or as an ES Module:

```js
import combinations from "object-boolean-combinations";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/object-boolean-combinations/dist/object-boolean-combinations.umd.js"></script>
```

```js
// in which case you get a global variable "objectBooleanCombinations" which you consume like this:
const combinations = objectBooleanCombinations;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                                      | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ----------------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/object-boolean-combinations.cjs.js` | 3 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/object-boolean-combinations.esm.js` | 2 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/object-boolean-combinations.umd.js` | 16 KB |

**[⬆ back to top](#)**

## What it does

It consumes a plain object, takes its keys (values don't matter) and produces an array with every possible combination of each key's Boolean^ value. If you have _n_ keys, you'll get `2^n` objects in the resulting array.

```js
const combinations = require("object-boolean-combinations");
const test = combinations({ a: "whatever" });
console.log(`test = ${JSON.stringify(test, null, 4)}`);
// => [
//      {a: 0},
//      {a: 1}
//    ]
```

^ We could generate `true`/`false` values, but for efficiency, we're generating `0`/`1` instead. Works the same in Boolean logic, but takes up less space.

PS. Observe how input values don't matter, we had: `{ a: 'whatever' }`.

Sometimes, you don't want all the combinations, you might want to "pin" certain values to be constant across all combinations. In those cases, use [overrides](#overriding), see below.

**[⬆ back to top](#)**

## API

```javascript
combinations(inputObject, [overrideObject]);
```

### API - Input

| Input argument   | Type         | Obligatory? | Description                                                                                                                           |
| ---------------- | ------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `inputObject`    | Plain object | yes         | Plain object from which we should reference the keys.                                                                                 |
| `overrideObject` | Plain object | no          | Keys in this object will be used as-is and will not be used for generating combinations. See [overriding](#overriding) section below. |

**[⬆ back to top](#)**

## Overriding

Sometimes you want to override the object keys, for example, in the a settings object, I want to override all `a` and `b` keys to be only `true` (`1`). This reduces the object combinations from `2^3 = 8` to: `2^(3-2) = 2^1 = 2`:

```js
const combinations = require("object-boolean-combinations");
const test = combinations(
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

**[⬆ back to top](#)**

## Overriding the combinations — in practice

In practice, I use this overriding to perform the specific tests on [Detergent.js](https://gitlab.com/codsen/codsen/tree/master/packages/detergent). For example, let's say, I am testing: does Detergent encode entities correctly. In that case I need two arrays filled with objects:

- first array — `encodeEntities = true` and all possible combinations of the other 9 settings (2^(10-1)=512 objects in array)
- second array — `encodeEntities = false` and all possible combinations of the rest — again 512 objects in array.

Here's an AVA test, which uses `objectBooleanCombinations()` to create a combinations array of settings objects, then uses `forEach()` to iterate through them all, testing each:

```js
test("encode entities - pound sign", (t) => {
  combinations(sampleObj, {
    convertEntities: true,
  }).forEach(function (elem) {
    t.equal(
      detergent("\u00A3", elem),
      "&pound;",
      "pound char converted into entity"
    );
  });
});
```

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=object-boolean-combinations%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aobject-boolean-combinations%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=object-boolean-combinations%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aobject-boolean-combinations%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=object-boolean-combinations%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aobject-boolean-combinations%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/object-boolean-combinations
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/object-boolean-combinations
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/object-boolean-combinations
[downloads-img]: https://img.shields.io/npm/dm/object-boolean-combinations.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/object-boolean-combinations
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/object-boolean-combinations
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
