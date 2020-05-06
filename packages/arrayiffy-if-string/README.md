# arrayiffy-if-string

> Put non-empty strings into arrays, turn empty-ones into empty arrays. Bypass everything else.

[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![no dependencies][no-deps-img]][no-deps-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#install)
- [Idea](#idea)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i arrayiffy-if-string
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`arrayiffy`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const arrayiffy = require("arrayiffy-if-string");
```

or as an ES Module:

```js
import arrayiffy from "arrayiffy-if-string";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/arrayiffy-if-string/dist/arrayiffy-if-string.umd.js"></script>
```

```js
// in which case you get a global variable "arrayiffyIfString" which you consume like this:
const arrayiffy = arrayiffyIfString;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                              | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | --------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/arrayiffy-if-string.cjs.js` | 518 B |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/arrayiffy-if-string.esm.js` | 501 B |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/arrayiffy-if-string.umd.js` | 555 B |

**[⬆ back to top](#)**

## Idea

- If it's a non-empty string, put it into an array and return it.
- If it's empty string, return an empty array.
- If it's anything else, just return it.

```js
const arrayiffy = require("arrayiffy-if-string");
var res = arrayiffy("aaa");
console.log("res = " + JSON.stringify(res, null, 4));
// => ['aaa']
```

```js
const arrayiffy = require("arrayiffy-if-string");
var res = arrayiffy("");
console.log("res = " + JSON.stringify(res, null, 4));
// => []
```

```js
const arrayiffy = require("arrayiffy-if-string");
var res = arrayiffy(true);
console.log("res = " + JSON.stringify(res, null, 4));
// => true
```

It's main purpose is to prepare the input argument options' objects. Check out `check-types-mini` on [npm](https://www.npmjs.com/package/check-types-mini), or on [GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/check-types-mini).

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=arrayiffy-if-string%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aarrayiffy-if-string%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=arrayiffy-if-string%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aarrayiffy-if-string%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=arrayiffy-if-string%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aarrayiffy-if-string%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/arrayiffy-if-string
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/arrayiffy-if-string
[no-deps-img]: https://img.shields.io/badge/-no%20dependencies-brightgreen?style=flat-square
[no-deps-url]: https://www.npmjs.com/package/arrayiffy-if-string?activeTab=dependencies
[downloads-img]: https://img.shields.io/npm/dm/arrayiffy-if-string.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/arrayiffy-if-string
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/arrayiffy-if-string
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
