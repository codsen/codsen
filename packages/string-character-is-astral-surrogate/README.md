# string-character-is-astral-surrogate

> Tells, is given character a part of astral character, specifically, a high and low surrogate

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
- [Usage](#usage)
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i string-character-is-astral-surrogate
```

Consume via a `require()`:

```js
const {
  isHighSurrogate,
  isLowSurrogate,
} = require("string-character-is-astral-surrogate");
```

or as an ES Module:

```js
import {
  isHighSurrogate,
  isLowSurrogate,
} from "string-character-is-astral-surrogate";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/string-character-is-astral-surrogate/dist/string-character-is-astral-surrogate.umd.js"></script>
```

```js
// in which case you get a global variable "stringCharacterIsAstralSurrogate" which you consume like this:
const { isHighSurrogate, isLowSurrogate } = stringCharacterIsAstralSurrogate;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                                               | Size |
| ------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------------------------------- | ---- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-character-is-astral-surrogate.cjs.js` | 2 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-character-is-astral-surrogate.esm.js` | 1 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-character-is-astral-surrogate.umd.js` | 1 KB |

**[⬆ back to top](#)**

## Idea

When you traverse a string the most efficient way, index-by-index, using a `for` loop, you might stumble upon an astral character's low and high surrogates. This library helps to identify them.

No other library seems to be able to do that. For example, [astral-regex](https://www.npmjs.com/package/astral-regex) can tell you, does a string contain astral characters or does the given character comprise of two surrogates. But it won't help you identify them _separately_.

I need to be able to identify **surrogates separately** to be able to cover cases such as surrogates without second counterpart.

In itself, this library is very simple, two functions:

**isHighSurrogate (char)**

**isLowSurrogate (char)**

It reads the character at first index (the first Unicode code point) and evaluates its `charcode`. That's it. If there are more characters they are ignored.

In theory, high surrogate goes first, low surrogate goes second [source](https://unicodebook.readthedocs.io/unicode_encodings.html#surrogates).

**[⬆ back to top](#)**

## Usage

```js
const {
  isHighSurrogate,
  isLowSurrogate,
} = require("string-character-is-astral-surrogate");
// 🧢 = \uD83E\uDDE2
console.log(isHighSurrogate("\uD83E"));
// => true
// the first character, high surrogate of the cap is indeed a high surrogate

console.log(isHighSurrogate("\uDDE2"));
// => false
// the second character, low surrogate of the cap is NOT a high surrogate

console.log(isLowSurrogate("\uD83E"));
// => false
// the first character, high surrogate of the cap is NOT a low surrogate
// it's high surrogate

console.log(isLowSurrogate("\uDDE2"));
// => true
// the second character, low surrogate of the cap is indeed a low surrogate

// PS.
// undefined yields false, doesn't throw
console.log(isHighSurrogate(undefined));
// => false

console.log(isLowSurrogate(undefined));
// => false
```

**[⬆ back to top](#)**

## API

Two functions, same API:
**isHighSurrogate(str)**
**isLowSurrogate(str)**

**Input**: zero or more characters, where `charCodeAt(0)` will be evaluated.
**Output**: Boolean

- If input is empty string or undefined, `false` is returned.
- If input is anything other than the string or undefined, type error is thrown.
- If input consists of more characters, everything beyond `.charCodeAt(0)` is ignored.

We return false to make life easier when traversing the string. When you check "next" character, if it doesn't exist, as far as astral-ness is concerned, we're fine, so it yields `false`. Otherwise, you'd have to check the input before feeding into this library and that's is tedious. This is a low-level library and it doesn't have to be picky.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-character-is-astral-surrogate%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-character-is-astral-surrogate%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-character-is-astral-surrogate%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-character-is-astral-surrogate%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-character-is-astral-surrogate%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-character-is-astral-surrogate%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-character-is-astral-surrogate
[cov-img]: https://img.shields.io/badge/coverage-91.3%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-character-is-astral-surrogate
[no-deps-img]: https://img.shields.io/badge/-no%20dependencies-brightgreen?style=flat-square
[no-deps-url]: https://www.npmjs.com/package/string-character-is-astral-surrogate?activeTab=dependencies
[downloads-img]: https://img.shields.io/npm/dm/string-character-is-astral-surrogate.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-character-is-astral-surrogate
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-character-is-astral-surrogate
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
