# util-nonempty

> Is the input (plain object, array, string or whatever) not empty?

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
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i util-nonempty
```
The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`nonEmpty`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const nonEmpty = require("util-nonempty");
```

or as an ES Module:

```js
import nonEmpty from "util-nonempty";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/util-nonempty/dist/util-nonempty.umd.js"></script>
```

```js
// in which case you get a global variable "utilNonempty" which you consume like this:
const nonEmpty = utilNonempty;
```

This package has three builds in `dist/` folder:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/util-nonempty.cjs.js` | 954 B
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/util-nonempty.esm.js` | 803 B
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/util-nonempty.umd.js` | 1 KB

**[⬆ back to top](#)**

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

var f = function () {
  return "z";
};
nonEmpty(f);
// => false (answer is instantly false if input is not array, plain object or string)
```

If you want to check _non-emptiness_ of complex nested trees of objects, arrays and strings (like parsed HTML [AST](https://github.com/posthtml/posthtml-parser)), you need a library which can **recursively traverse that**. There are two options:

- If you want to check for **strict** emptiness, that is `[]` or `{}` is empty, but `{aaa: ' \n\n\n ', ' \t'}` is not, see [ast-is-empty](https://www.npmjs.com/package/ast-is-empty)
- If your "emptiness" definition is "everything that `String.trim()`'s to an empty string'" (this includes tabs, spaces and line breaks for example, but not letters), see [ast-contains-only-empty-space](https://www.npmjs.com/package/ast-contains-only-empty-space).

**[⬆ back to top](#)**

## API

Anything-in, Boolean-out.

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=util-nonempty%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Autil-nonempty%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=util-nonempty%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Autil-nonempty%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=util-nonempty%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Autil-nonempty%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/util-nonempty
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/util-nonempty
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/util-nonempty
[downloads-img]: https://img.shields.io/npm/dm/util-nonempty.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/util-nonempty
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/util-nonempty
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
