# ast-is-empty

> Find out, is nested array/object/string/AST tree is empty

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#markdown-header-install)
- [Rationale](#markdown-header-rationale)
- [API](#markdown-header-api)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Install

```bash
npm i ast-is-empty
```

```js
// consume as CommonJS require:
const isEmpty = require("ast-is-empty");
// or as a ES Module:
import isEmpty from "ast-is-empty";
// then, for example, feed a parsed HTML tree into it:
console.log(isEmpty(htmlAstObj));
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                       | Size |
| ------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------- | ---- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/ast-is-empty.cjs.js` | 1 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/ast-is-empty.esm.js` | 1 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/ast-is-empty.umd.js` | 1 KB |

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

Anything-in, Boolean-out.
Also, when inappropriate things are given that don't belong to AST's, `null`-out.

```js
isEmpty(
  input // AST tree, or object or array or whatever. Can be deeply-nested.
);
// => true||false
```

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](https:/gitlab.com/codsen/codsen/issues/new?title=ast-is-empty%20package%20-%20put%20title%20here).
- If you want a new feature but can't code it up yourself, also [raise an issue](https:/gitlab.com/codsen/codsen/issues/new?title=ast-is-empty%20package%20-%20put%20title%20here). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](https:/gitlab.com/codsen/codsen/issues/new?title=ast-is-empty%20package%20-%20put%20title%20here). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/ast-is-empty.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ast-is-empty
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ast-is-empty
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ast-is-empty
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ast-is-empty
[downloads-img]: https://img.shields.io/npm/dm/ast-is-empty.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ast-is-empty
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ast-is-empty
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
