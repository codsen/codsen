# ast-compare

> Compare anything: AST, objects, arrays, strings and nested thereof

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
- [Examples](#markdown-header-examples)
- [opts.verboseWhenMismatches](#markdown-header-optsverbosewhenmismatches)
- [Rationale](#markdown-header-rationale)
- [Differences from \_.isMatch](#markdown-header-differences-from-_ismatch)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Install

```bash
npm i ast-compare
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                      | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/ast-compare.cjs.js` | 9 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/ast-compare.esm.js` | 9 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/ast-compare.umd.js` | 31 KB |

**[⬆ back to top](#markdown-header-ast-compare)**

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

The main purpose is to compare two parsed HTML/CSS trees or their branches, but you can compare anything, it will recursively traverse arrays too. This lib is dependency for [ast-delete-object](https://bitbucket.org/codsen/ast-delete-object) — library which can delete elements from [parsed](https://github.com/posthtml/posthtml-parser) HTML/CSS objects.

**[⬆ back to top](#markdown-header-ast-compare)**

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

**[⬆ back to top](#markdown-header-ast-compare)**

### Options object

| `options` object's key  | Type    | Obligatory? | Default | Description                                                                                                                                                                     |
| ----------------------- | ------- | ----------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| {                       |         |             |         |
| `hungryForWhitespace`   | Boolean | no          | `false` | The any whitespace (tabs, spaces, line breaks and so on) will match any other white space.                                                                                      |
| `matchStrictly`         | Boolean | no          | `false` | When you want to match like `===`.                                                                                                                                              |
| `verboseWhenMismatches` | Boolean | no          | `false` | When set to `true`, instead of `false` the output will be a string with a message explaining what didn't match. It's for cases when it's important to report what didn't match. |
| }                       |         |             |         |

**[⬆ back to top](#markdown-header-ast-compare)**

### Output

If `smallObj` **is** equal or a superset of `bigObj`, the returned value is always Boolean `true`.

If it's **not** a superset or equal, the value depends on `opts.verboseWhenMismatches`:

- Default, `opts.verboseWhenMismatches===false` will yield `false`
- Default, `opts.verboseWhenMismatches===true` will yield `string`, explaining what didn't match.

**[⬆ back to top](#markdown-header-ast-compare)**

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

**[⬆ back to top](#markdown-header-ast-compare)**

## opts.verboseWhenMismatches

Sometimes you just want a yes/no answer is something a subset or equal to something. But sometimes, the whole point of comparison is to inform the user _exactly what_ is mismatching. In the latter cases, set `opts.verboseWhenMismatches` to `true`. When there is no match, instead of Boolean `false` the main function will return **a string** with an explanatory message.

If you use this setting, you have to anticipate Boolean `true` OR something else (Boolean `false` or string) coming out from this library.

**[⬆ back to top](#markdown-header-ast-compare)**

## Rationale

I want to check, does a deeply-nested array of objects/strings/arrays (for example, [PostHTML-parsed](https://github.com/posthtml/posthtml-parser) AST output) is equal or is a subset of some other AST. Normally `_.isMatch` would do the deed but it positively matches **empty arrays against any arrays** what is terrible. Hence this library. Plus, this library will accept and adapt to any sources — combinations of arrays, objects and strings. That's necessary to support any parsed AST trees - HTML or CSS or whatever.

**[⬆ back to top](#markdown-header-ast-compare)**

## Differences from \_.isMatch

> "Partial comparisons will match empty array and empty object source values against any array or object value, respectively." — [Lodash documentation](https://lodash.com/docs/4.16.4#isMatch)

[\_.isMatch](https://www.npmjs.com/package/lodash.ismatch) positively matches empty arrays to everything. This is bad when you are comparing parsed HTML/CSS trees. This library doesn't do this. An empty array will not be reported as equal to a non-empty array.

```js
// in this library:
var res = compare(["a", "b", "c"], []);
// now, res === false
```

**[⬆ back to top](#markdown-header-ast-compare)**

## Contributing

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/ast-compare/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/ast-compare/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ back to top](#markdown-header-ast-compare)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/ast-compare.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ast-compare
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/ast-compare
[cov-img]: https://coveralls.io/repos/bitbucket/codsen/ast-compare/badge.svg?style=flat-square&branch=master
[cov-url]: https://coveralls.io/bitbucket/codsen/ast-compare?branch=master
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ast-compare
[downloads-img]: https://img.shields.io/npm/dm/ast-compare.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ast-compare
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ast-compare
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/ast-compare
