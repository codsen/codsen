# util-nonempty

> Is the input (plain object, array, string or whatever) not empty?

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
- [API](#markdown-header-api)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Install

```bash
npm i util-nonempty
```

```js
// consume as a CommonJS require:
const nonEmpty = require("util-nonempty");
// or as ES module:
import nonEmpty from "util-nonempty";

// then call as a function, pass it anything:
console.log(nonEmpty("a"));
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                        | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | --------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/util-nonempty.cjs.js` | 756 B |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/util-nonempty.esm.js` | 603 B |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/util-nonempty.umd.js` | 929 B |

**[⬆ back to top](#markdown-header-util-nonempty)**

## Purpose

I want a quick utility function, to be able to detect is the input not empty.

```js
nonEmpty("z");
// => true

nonEmpty("");
// => false

nonEmpty(["a"]);
// => true

nonEmpty([123]);
// => true

nonEmpty([[[[[[[[[[[]]]]]]]]]]]);
// => false

nonEmpty({ a: "a" });
// => true

nonEmpty({});
// => false

var f = function() {
  return "z";
};
nonEmpty(f);
// => false (answer is instantly false if input is not array, plain object or string)
```

If you want to check _non-emptiness_ of complex nested trees of objects, arrays and strings (like parsed HTML [AST](https://github.com/posthtml/posthtml-parser)), you need a library which can **recursively traverse that**. There are two options:

- If you want to check for **strict** emptiness, that is `[]` or `{}` is empty, but `{aaa: ' \n\n\n ', ' \t'}` is not, see [ast-is-empty](https://www.npmjs.com/package/ast-is-empty)
- If your "emptiness" definition is "everything that `String.trim()`'s to an empty string'" (this includes tabs, spaces and line breaks for example, but not letters), see [ast-contains-only-empty-space](https://www.npmjs.com/package/ast-contains-only-empty-space).

**[⬆ back to top](#markdown-header-util-nonempty)**

## API

Anything-in, Boolean-out.

## Contributing

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/util-nonempty/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/util-nonempty/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ back to top](#markdown-header-util-nonempty)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/util-nonempty.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/util-nonempty
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/util-nonempty
[cov-img]: https://coveralls.io/repos/bitbucket/codsen/util-nonempty/badge.svg?style=flat-square&branch=master
[cov-url]: https://coveralls.io/bitbucket/codsen/util-nonempty?branch=master
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/util-nonempty
[downloads-img]: https://img.shields.io/npm/dm/util-nonempty.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/util-nonempty
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/util-nonempty
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/util-nonempty
