# ast-loose-compare

> Compare anything: AST, objects, arrays and strings

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
- [Difference from `ast-compare`](#difference-from-ast-compare)
- [Differences from \_.isMatch](#differences-from-_ismatch)
- [Competition](#competition)
- [API](#api)
- [More examples](#more-examples)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i ast-loose-compare
```
The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`looseCompare`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const looseCompare = require("ast-loose-compare");
```

or as an ES Module:

```js
import looseCompare from "ast-loose-compare";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/ast-loose-compare/dist/ast-loose-compare.umd.js"></script>
```

```js
// in which case you get a global variable "astLooseCompare" which you consume like this:
const looseCompare = astLooseCompare;
```

This package has three builds in `dist/` folder:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/ast-loose-compare.cjs.js` | 3 KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/ast-loose-compare.esm.js` | 3 KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/ast-loose-compare.umd.js` | 11 KB

**[⬆ back to top](#)**

## Purpose

To find out, does an object/array/string/nested-mix is a subset or equal to another input:

```js
compare(
  {
    a: {
      b: "d",
      c: [],
      e: "f",
      g: "h",
    },
  },
  {
    a: {
      b: "d",
      c: [],
    },
  }
);
// => true
```

Any plain object, array or string or nested tree of thereof that contains only space characters, tabs or line breaks is considered as "containing only empty space".

If this library will encounter two things that contain only _empty space_, it will report them as equal.

For example these two are equal:

```js
compare(
  {
    a: "a",
    b: "\n \n\n",
  },
  {
    a: "a",
    b: "\t\t \t",
  }
);
// => true
```

Second input argument can be subset of first-one, notice `b` values are of a different type, yet both contain only _empty space_:

```js
compare(
  {
    a: "a",
    b: [[["\n \n\n"]]],
    c: "c",
  },
  {
    a: "a",
    b: { c: { d: "   \t\t \t" } },
  }
);
// => true
```

Main purpose of this library is to compare parsed HTML/CSS trees when deleting empty [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) branches. This library is a dependency for [ast-delete-object](https://gitlab.com/codsen/codsen/tree/master/packages/ast-delete-object) — library which can delete elements from [parsed](https://github.com/posthtml/posthtml-parser) HTML/CSS objects.

**[⬆ back to top](#)**

## Difference from `ast-compare`

There is another similarly-named library, [ast-compare](https://gitlab.com/codsen/codsen/tree/master/packages/ast-compare). The difference between the two is the following.

`ast-compare` will check: is something a _subset_ or exactly equal of something. If **subset** query item has empty array or an array with empty string with it, it will search for exactly the same on the **superset** query item. Unlike in [\_.isMatch](https://www.npmjs.com/package/lodash.ismatch), empty array will not be reported as equal to non-empty array.

`ast-loose-compare` will act the same as `ast-compare` except

In Lodash [\_.isMatch](https://www.npmjs.com/package/lodash.ismatch), an empty array will be equal to anything that has only empty space (on other objects/arrays containing only empty space). Here, `ast-loose-compare` will report that empty array is not equal to non-empty array (or anything containing non just an empty space).

**[⬆ back to top](#)**

## Differences from \_.isMatch

> "Partial comparisons will match empty array and empty object source values against any array or object value, respectively." — [Lodash documentation](https://lodash.com/docs/4.16.4#isMatch)

[\_.isMatch](https://www.npmjs.com/package/lodash.ismatch) positively matches empty arrays to everything. This is bad when you are comparing parsed HTML/CSS trees. This library doesn't do this. In this library, empty array will not be reported as equal to non-empty array, although if both arguments contain something which is _empty space_, they will be considered equal.

If you want an AST comparison library with a stricter ways towards the _empty space equation_, check [ast-compare](https://gitlab.com/codsen/codsen/tree/master/packages/ast-compare).

**[⬆ back to top](#)**

## Competition

I want to check, does a deeply-nested array of objects/strings/arrays (for example, [PostHTML-parsed](https://github.com/posthtml/posthtml-parser) AST output) is equal or is a subset of something. Normally `_.isMatch` would do the deed but it positively matches empty arays against any arrays. Hence this library. Plus, this library will accept and adapt to any sources — combinations of arrays, objects and strings. That's necessary to support any parsed AST trees - HTML or CSS or whatever.

**[⬆ back to top](#)**

## API

```js
looseCompare(
  bigObj, // something (Object|Array|String|nested mix)
  smallObj // something (Object|Array|String|nested mix). Maybe it's a subset or equal to bigObj.
);
// => Boolean|undefined
```

- If everything from `smallObj` matches everything within `bigObj`, this library returns `true`.
- Otherwise, if there's a mismatch, returns `false`.
- For all other cases where inputs are missing/`undefined`, returns `undefined`.
- If both `smallObj` and `bigObj` contain the same key and their values contain only empty space (differing or not), they will be considered equal.

**[⬆ back to top](#)**

## More examples

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
compare(["a", "b"], ["a", "b", "c"]);
// => false, because second is not a subset of first
```

```js
compare("aaaaa\nbbbbb", "aaaaa\nbbbbb");
// => true, because strings are equal
```

```js
compare({ a: "a" });
// => undefined, because second input value is missing
```

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ast-loose-compare%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aast-loose-compare%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ast-loose-compare%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aast-loose-compare%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ast-loose-compare%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aast-loose-compare%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ast-loose-compare
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ast-loose-compare
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ast-loose-compare
[downloads-img]: https://img.shields.io/npm/dm/ast-loose-compare.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ast-loose-compare
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ast-loose-compare
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
