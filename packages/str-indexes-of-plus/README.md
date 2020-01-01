# str-indexes-of-plus

> Search for a string in another string. Get array of indexes. Full Unicode support.

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#install)
- [Idea](#idea)
- [Usage](#usage)
- [API](#api)
- [The algorithm](#the-algorithm)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i str-indexes-of-plus
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`indx`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const indx = require("str-indexes-of-plus");
```

or as an ES Module:

```js
import indx from "str-indexes-of-plus";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/str-indexes-of-plus/dist/str-indexes-of-plus.umd.js"></script>
```

```js
// in which case you get a global variable "strIndexesOfPlus" which you consume like this:
const indx = strIndexesOfPlus;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                              | Size |
| ------------------------------------------------------------------------------------------------------- | --------------------- | --------------------------------- | ---- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/str-indexes-of-plus.cjs.js` | 3 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/str-indexes-of-plus.esm.js` | 2 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/str-indexes-of-plus.umd.js` | 2 KB |

**[⬆ back to top](#)**

## Idea

Search for a string in another string. Return the array of indexes of any findings. Astral character-friendly. Allows to optionally offset the starting point of the search (3rd argument).

## Usage

```js
const indx = require("str-indexes-of-plus");
var res1 = indx("abczabc", "abc");
console.log("res1 = " + JSON.stringify(res1, null, 4));
// => [0, 4]

// works with strings containing emoji too:
var res2 = indx("ab🦄", "🦄");
console.log("res2 = " + JSON.stringify(res2, null, 4));
// => [2]

// you can offset the starting point, from which the checking commences.
// observe the third input argument:
var res3 = indx("abczabc", "abc", 3);
console.log("res3 = " + JSON.stringify(res3, null, 4));
// => [4]
```

**[⬆ back to top](#)**

## API

**indx(str, searchValue\[, fromIndex])**

Returns an array of zero or more numbers, each indicating the index of each finding's first character. Unicode astral characters are counted correctly, as one character-long.

**[⬆ back to top](#)**

#### str

Type: `string`

First input argument — the string in which you want to perform a search.

#### searchValue

Type: `string`

Second input argument — the string you're looking for.

#### fromIndex

Type: A natural number or zero. `number` or `string`.

An optional third argument - offset index from which to start searching.

## The algorithm

I came up with my own algorithm. It follows the way how I would search for strings myself: iterate through the given string, looking for the first letter. If found, check does second letter match second finding's letter. If it matches, continue matching each consecutive letter. In anything mismatches, start from new, continuing to iterate along the input string.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=str-indexes-of-plus%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astr-indexes-of-plus%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=str-indexes-of-plus%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astr-indexes-of-plus%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=str-indexes-of-plus%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astr-indexes-of-plus%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/str-indexes-of-plus.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/str-indexes-of-plus
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/str-indexes-of-plus
[cov-img]: https://img.shields.io/badge/coverage-95.35%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/str-indexes-of-plus
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/str-indexes-of-plus
[downloads-img]: https://img.shields.io/npm/dm/str-indexes-of-plus.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/str-indexes-of-plus
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/str-indexes-of-plus
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
