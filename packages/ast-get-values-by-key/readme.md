# ast-get-values-by-key

> Read or edit parsed HTML (or AST in general)

[![Minimum Node version required][node-img]][node-url]
[![Repository is on BitBucket][bitbucket-img]][bitbucket-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#markdown-header-install)
- [Use](#markdown-header-use)
- [Purpose](#markdown-header-purpose)
- [API](#markdown-header-api)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Install

```sh
npm i ast-get-values-by-key
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                                | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ----------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/ast-get-values-by-key.cjs.js` | 1 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/ast-get-values-by-key.esm.js` | 1 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/ast-get-values-by-key.umd.js` | 11 KB |

**[⬆ back to top](#markdown-header-ast-get-values-by-key)**

## Use

Tag getter in parsed HTML:

```js
// get
const get = require("ast-get-values-by-key");
var res = get(
  {
    tag: "html"
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
    tag: "html"
  }, // <--- input
  "tag", // <--- key to look for
  ["style"] // <---- list of values to rewrite the values of the above keys if found
);
console.log("res = " + JSON.stringify(res, null, 4));
// res = {
//         tag: "style"
//       }
```

**[⬆ back to top](#markdown-header-ast-get-values-by-key)**

## Purpose

When you parse some HTML using [posthtml-parser](https://github.com/posthtml/posthtml-parser), you get an array which contains an AST — a nested [tree](https://github.com/posthtml/posthtml-parser#posthtml-ast-format) of strings, objects and arrays. This library lets you query that tree — you can get an array of all the key values you want. Later, if you amend and feed this query result again into the `getAllValuesByKey` as a third argument, you can overwrite all the values.

Two arguments triggers GET mode; three arguments is SET (or write over) mode.

**[⬆ back to top](#markdown-header-ast-get-values-by-key)**

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

**[⬆ back to top](#markdown-header-ast-get-values-by-key)**

## Contributing

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/ast-get-values-by-key/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/ast-get-values-by-key/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ back to top](#markdown-header-ast-get-values-by-key)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/ast-get-values-by-key.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ast-get-values-by-key
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/ast-get-values-by-key
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ast-get-values-by-key
[downloads-img]: https://img.shields.io/npm/dm/ast-get-values-by-key.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ast-get-values-by-key
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ast-get-values-by-key
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/ast-get-values-by-key
