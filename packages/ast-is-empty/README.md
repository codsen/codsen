# ast-is-empty

> Find out, is nested array/object/string/AST tree is empty

[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![no dependencies][no-deps-img]][no-deps-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#install)
- [Rationale](#rationale)
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i ast-is-empty
```
The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`isEmpty`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const isEmpty = require("ast-is-empty");
```

or as an ES Module:

```js
import isEmpty from "ast-is-empty";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/ast-is-empty/dist/ast-is-empty.umd.js"></script>
```

```js
// in which case you get a global variable "astIsEmpty" which you consume like this:
const isEmpty = astIsEmpty;
```

This package has three builds in `dist/` folder:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/ast-is-empty.cjs.js` | 2 KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/ast-is-empty.esm.js` | 1 KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/ast-is-empty.umd.js` | 1 KB

**[⬆ back to top](#)**

## Rationale

Imagine, that you have a nested array which contains plain objects, arrays and strings. Huge tree. This library can tell if it consists of only empty things, by which I mean:

- Arrays or objects with no keys, or
- Arrays or objects that have all keys equal to zero-length strings
- Arrays or objects that have all keys equal to strings that `.trim()` to zero-length
- Zero-length strings
- Or strings that would `.trim()` to zero-length (this includes tabs, line breaks, spaces or mix thereof)

These are empty things, for example:

```js
{
  a: "";
}
```

or

```js
{
  a: [""];
  b: {
    c: {
      d: "";
    }
  }
}
```

or

```js
[
  {
    a: ['']
    b: {c: {d: ''}}
  },
  '',
  ['', '', '']
]
```

Practically speaking, when you work with AST's, all the mentioned empty things are a noise which probably doesn't need to be processed (or needs to be removed altogether).

Functions are not considered to be empty and this library will return `null` if it encounters one anywhere within the `input`. Same with as `undefined` or `null` inputs — both will yield `null`.

**[⬆ back to top](#)**

## API

Default function is exported.
Its API is "Anything-in, Boolean-out".
Also, when inappropriate things are given that don't belong to AST's, `null`-out.

```js
isEmpty(
  input // AST tree, or object or array or whatever. Can be deeply-nested.
);
// => true||false||null
```

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ast-is-empty%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aast-is-empty%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ast-is-empty%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aast-is-empty%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ast-is-empty%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aast-is-empty%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ast-is-empty
[cov-img]: https://img.shields.io/badge/coverage-93.94%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ast-is-empty
[no-deps-img]: https://img.shields.io/badge/-no%20dependencies-brightgreen?style=flat-square
[no-deps-url]: https://www.npmjs.com/package/ast-is-empty?activeTab=dependencies
[downloads-img]: https://img.shields.io/npm/dm/ast-is-empty.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ast-is-empty
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ast-is-empty
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
