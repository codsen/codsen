# is-char-suitable-for-html-attr-name

> Is given character suitable to be in an HTML attribute's name?

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
- [API - Input](#api-input)
- [API - Output](#api-output)
- [Bigger picture](#bigger-picture)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i is-char-suitable-for-html-attr-name
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`isAttrNameChar`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const isAttrNameChar = require("is-char-suitable-for-html-attr-name");
```

or as an ES Module:

```js
import isAttrNameChar from "is-char-suitable-for-html-attr-name";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/is-char-suitable-for-html-attr-name/dist/is-char-suitable-for-html-attr-name.umd.js"></script>
```

```js
// in which case you get a global variable "isCharSuitableForHtmlAttrName" which you consume like this:
const isAttrNameChar = isCharSuitableForHtmlAttrName;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                                              | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/is-char-suitable-for-html-attr-name.cjs.js` | 643 B |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/is-char-suitable-for-html-attr-name.esm.js` | 653 B |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/is-char-suitable-for-html-attr-name.umd.js` | 687 B |

**[⬆ back to top](#)**

## Idea

Detect, is a given character suitable for an HTML attribute's name:

```js
const isAttrNameChar = require("is-char-suitable-for-html-attr-name");
console.log(isAttrNameChar("a"));
// => true

console.log(isAttrNameChar("$"));
// => false
```

**[⬆ back to top](#)**

## API - Input

**isAttrNameChar(str)** — in other words, function which takes one string argument:

| Input argument     | Key value's type       | Obligatory? | Description                                             |
| ------------------ | ---------------------- | ----------- | ------------------------------------------------------- |
| `str`              | String                 | yes         | The character to evaluate. |

This program does not throw. It just returns `false`.

If the input string is longer than `1`, its first character is used.

Zero-length string yields `false`, same like non-string type values.

**[⬆ back to top](#)**

## API - Output

Boolean, `true` or `false`. Erroneous input arguments will yield `false` as well.

**[⬆ back to top](#)**

## PS.

If you need a comprehensive list of all possible HTML attribute names, check out `html-all-known-attributes` ([npm](https://www.npmjs.com/package/html-all-known-attributes)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/html-all-known-attributes/)).

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=is-char-suitable-for-html-attr-name%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ais-char-suitable-for-html-attr-name%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=is-char-suitable-for-html-attr-name%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ais-char-suitable-for-html-attr-name%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=is-char-suitable-for-html-attr-name%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ais-char-suitable-for-html-attr-name%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/is-char-suitable-for-html-attr-name
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/is-char-suitable-for-html-attr-name
[no-deps-img]: https://img.shields.io/badge/-no%20dependencies-brightgreen?style=flat-square
[no-deps-url]: https://www.npmjs.com/package/is-char-suitable-for-html-attr-name?activeTab=dependencies
[downloads-img]: https://img.shields.io/npm/dm/is-char-suitable-for-html-attr-name.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/is-char-suitable-for-html-attr-name
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/is-char-suitable-for-html-attr-name
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
