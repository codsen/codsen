# ast-compare

> Compare anything: AST, objects, arrays, strings and nested thereof

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
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
- [Examples](#examples)
- [opts.verboseWhenMismatches](#optsverbosewhenmismatches)
- [Rationale](#rationale)
- [Differences from \_.isMatch](#differences-from-_ismatch)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i ast-compare
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`compare`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const compare = require("ast-compare");
```

or as an ES Module:

```js
import compare from "ast-compare";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/ast-compare/dist/ast-compare.umd.js"></script>
```

```js
// in which case you get a global variable "astCompare" which you consume like this:
const compare = astCompare;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                      | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/ast-compare.cjs.js` | 9 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/ast-compare.esm.js` | 9 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/ast-compare.umd.js` | 21 KB |

**[⬆ back to top](#)**

## Purpose

Find out, does an object/array/string/nested-mix is a subset or equal to another input:

```js
var compare = require("ast-compare");
var result = compare(
  {
    // <- does this nested plain object...
    a: {
      b: "d",
      c: [],
      e: "f",
      g: "h"
    }
  },
  {
    // <- ...contain this nested plain object?
    a: {
      b: "d",
      c: []
    }
  }
);
console.log(result);
// => true
```

The main purpose is to compare two parsed HTML/CSS trees or their branches, but you can compare anything, it will recursively traverse arrays too. This lib is dependency for [ast-delete-object](https://gitlab.com/codsen/codsen/tree/master/packages/ast-delete-object) — library which can delete elements from [parsed](https://github.com/posthtml/posthtml-parser) HTML/CSS objects.

**[⬆ back to top](#)**

## Use

```js
var compare = require("ast-compare");
```

## API

The output of this library is binary and boolean: `true` or `false`.
This library will not mutate the input arguments.

### Input

**Input**

| Input argument | Type                            | Obligatory? | Description                         |
| -------------- | ------------------------------- | ----------- | ----------------------------------- |
| `bigObj`       | Array or Plain object or String | yes         | Super set, larger thing.            |
| `smallObj`     | Array or Plain object or String | yes         | A set of the above, smaller thing.  |
| `opts`         | Plain object                    | no          | A plain object containing settings. |

- If everything from `smallObj` matches everything within `bigObj`, this library returns `true`.
- Otherwise, if there's a mismatch or something wrong with input args, it returns `false`.

**[⬆ back to top](#)**

### Options object

| `options` object's key  | Type    | Obligatory? | Default | Description                                                                                                                                                                     |
| ----------------------- | ------- | ----------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| {                       |         |             |         |
| `hungryForWhitespace`   | Boolean | no          | `false` | The any whitespace (tabs, spaces, line breaks and so on) will match any other white space.                                                                                      |
| `matchStrictly`         | Boolean | no          | `false` | When you want to match like `===`.                                                                                                                                              |
| `verboseWhenMismatches` | Boolean | no          | `false` | When set to `true`, instead of `false` the output will be a string with a message explaining what didn't match. It's for cases when it's important to report what didn't match. |
| }                       |         |             |         |

**[⬆ back to top](#)**

### Output

If `smallObj` **is** equal or a superset of `bigObj`, the returned value is always Boolean `true`.

If it's **not** a superset or equal, the value depends on `opts.verboseWhenMismatches`:

- Default, `opts.verboseWhenMismatches===false` will yield `false`
- Default, `opts.verboseWhenMismatches===true` will yield `string`, explaining what didn't match.

**[⬆ back to top](#)**

## Examples

```js
compare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2" });
// => true, because second (smallObj) is subset of (or equal) first (bigObj).
```

```js
compare({ a: "1", b: "2" }, { a: "1", b: "2", c: "3" });
// => false, because second (smallObj) is not a subset (or equal) to first (bigObj).
```

```js
compare(["a", "b", "c"], ["a", "b"]);
// => true, because second is a subset of first
```

```js
compare(["a", "b", "c"], ["b", "a"]);
// => false, because order is wrong
```

```js
compare(["a", "b"], ["a", "b", "c"]);
// => false, because second is not a subset of first
```

```js
compare("a\nb", "a\nb");
// => true, because strings are equal
```

```js
compare({ a: "a" });
// => false. Second input value is missing which means it's a nonsense, thus, false
```

```js
compare(null);
// => false.
```

**[⬆ back to top](#)**

## opts.verboseWhenMismatches

Sometimes you just want a yes/no answer is something a subset or equal to something. But sometimes, the whole point of comparison is to inform the user _exactly what_ is mismatching. In the latter cases, set `opts.verboseWhenMismatches` to `true`. When there is no match, instead of Boolean `false` the main function will return **a string** with an explanatory message.

If you use this setting, you have to anticipate Boolean `true` OR something else (Boolean `false` or string) coming out from this library.

**[⬆ back to top](#)**

## Rationale

I want to check, does a deeply-nested array of objects/strings/arrays (for example, [PostHTML-parsed](https://github.com/posthtml/posthtml-parser) AST output) is equal or is a subset of some other AST. Normally `_.isMatch` would do the deed but it positively matches **empty arrays against any arrays** what is terrible. Hence this library. Plus, this library will accept and adapt to any sources — combinations of arrays, objects and strings. That's necessary to support any parsed AST trees - HTML or CSS or whatever.

**[⬆ back to top](#)**

## Differences from \_.isMatch

> "Partial comparisons will match empty array and empty object source values against any array or object value, respectively." — [Lodash documentation](https://lodash.com/docs/4.16.4#isMatch)

[\_.isMatch](https://www.npmjs.com/package/lodash.ismatch) positively matches empty arrays to everything. This is bad when you are comparing parsed HTML/CSS trees. This library doesn't do this. An empty array will not be reported as equal to a non-empty array.

```js
// in this library:
var res = compare(["a", "b", "c"], []);
// now, res === false
```

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ast-compare%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aast-compare%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ast-compare%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aast-compare%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ast-compare%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aast-compare%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/ast-compare.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ast-compare
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ast-compare
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ast-compare
[downloads-img]: https://img.shields.io/npm/dm/ast-compare.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ast-compare
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ast-compare
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
