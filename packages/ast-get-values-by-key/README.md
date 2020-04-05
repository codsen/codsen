# ast-get-values-by-key

> Read or edit parsed HTML (or AST in general)

[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#install)
- [Use](#use)
- [Purpose](#purpose)
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i ast-get-values-by-key
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`getAllValuesByKey`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const getAllValuesByKey = require("ast-get-values-by-key");
```

or as an ES Module:

```js
import getAllValuesByKey from "ast-get-values-by-key";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/ast-get-values-by-key/dist/ast-get-values-by-key.umd.js"></script>
```

```js
// in which case you get a global variable "astGetValuesByKey" which you consume like this:
const getAllValuesByKey = astGetValuesByKey;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                                | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ----------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/ast-get-values-by-key.cjs.js` | 3 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/ast-get-values-by-key.esm.js` | 3 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/ast-get-values-by-key.umd.js` | 12 KB |

**[⬆ back to top](#)**

## Use

Tag getter in parsed HTML:

```js
// get
const get = require("ast-get-values-by-key");
var res = get(
  {
    tag: "html",
  },
  "tag" // < tag to look for
);
console.log("res = " + JSON.stringify(res, null, 4));
// => res = [{val: "html", path: "tag"}]
```

Tag setter in parsed HTML — just pass array of values to write as a third argument:

```js
// set
const get = require("ast-get-values-by-key");
var res = get(
  {
    tag: "html",
  }, // <--- input
  "tag", // <--- key to look for
  ["style"] // <---- list of values to rewrite the values of the above keys if found
);
console.log("res = " + JSON.stringify(res, null, 4));
// res = {
//         tag: "style"
//       }
```

**[⬆ back to top](#)**

## Purpose

When you parse some HTML using [posthtml-parser](https://github.com/posthtml/posthtml-parser), you get an array which contains an AST — a nested [tree](https://github.com/posthtml/posthtml-parser#posthtml-ast-format) of strings, objects and arrays. This library lets you query that tree — you can get an array of all the key values you want. Later, if you amend and feed this query result again into the `getAllValuesByKey` as a third argument, you can overwrite all the values.

Two arguments triggers GET mode; three arguments is SET (or write over) mode.

**[⬆ back to top](#)**

## API

```js
getAllValuesByKey(
  input, // PLAIN OBJECT OR ARRAY. Can be nested.
  whatToFind, // STRING OR ARRAY OF STRINGS. The name of the key to find. We'll put its value into results array. You can use wildcards (uses Matcher.js).
  replacement // (OPTIONAL) ARRAY. The amended output of the previous call to getAllValuesByKey() if you want to write.
);
```

- If two arguments are given, it's **getter**. You'll receive an array of zero or more plain objects with keys: `val` and `path`, where `path` follows [object-path](https://www.npmjs.com/package/object-path) notation.

- If three arguments are given, it's **setter**. You'll receive a copy of original input, changed accordingly.

This library does not mutate any input arguments.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ast-get-values-by-key%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aast-get-values-by-key%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ast-get-values-by-key%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aast-get-values-by-key%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ast-get-values-by-key%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aast-get-values-by-key%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ast-get-values-by-key
[cov-img]: https://img.shields.io/badge/coverage-95.35%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ast-get-values-by-key
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ast-get-values-by-key
[downloads-img]: https://img.shields.io/npm/dm/ast-get-values-by-key.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ast-get-values-by-key
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ast-get-values-by-key
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
