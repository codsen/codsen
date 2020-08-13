# ranges-regex

> Perform a regex search on string and get a ranges array of findings (or null)

[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Install

```bash
npm i ranges-regex
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`raReg`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const raReg = require("ranges-regex");
```

or as an ES Module:

```js
import raReg from "ranges-regex";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/ranges-regex/dist/ranges-regex.umd.js"></script>
```

```js
// in which case you get a global variable "rangesRegex" which you consume like this:
const raReg = rangesRegex;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                       | Size |
| ------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------- | ---- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/ranges-regex.cjs.js` | 3 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/ranges-regex.esm.js` | 2 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/ranges-regex.umd.js` | 7 KB |

**[⬆ back to top](#)**

## Table of Contents

- [Install](#install)
- [Purpose](#purpose)
- [API](#api)
- [Examples](#examples)
- [Contributing](#contributing)
- [Licence](#licence)

## Purpose

It takes a string, matches the given regex on it and returns an array of ranges (or null).

This is handy when using _range_-class libraries, for both deletion and/or insertion of character ranges [later](https://www.npmjs.com/package/ranges-apply), down the line.

Similarly to `String.prototype.match()`, a no results case will yield `null`.

**[⬆ back to top](#)**

## API

**raReg(regexp, str, \[replacement])**

| Input argument | Type               | Obligatory? | Description                                                                                       |
| -------------- | ------------------ | ----------- | ------------------------------------------------------------------------------------------------- |
| `regexp`       | Regular expression | yes         | Provide the regexp to apply onto a string                                                         |
| `str`          | String             | yes         | Provide a string upon which to match the regex                                                    |
| `replacement`  | String or `null`   | no          | If you want to add a third argument on every of the finding's third argument values, put it here. |

**Output**: array of zero or more arrays (so-called _ranges_) where each consists of two or more natural number (or zero) indexes OR `null`.

This package does not mutate its inputs.

If the input arguments' types are incorrect or absent, library will `throw` an error.

**[⬆ back to top](#)**

## Examples

Nothing to find:

```js
// nothing to find:
console.log(raReg(/yyy/g, "zzzzzzzz"));
// => null

// stick `null` to add onto every of the findings:
const res = raReg(/def/g, "abcdefghij_abcdefghij", null);
console.log(JSON.stringify(res, null, 4));
// => [[3, 6, null], [14, 17, null]]
```

Notice, you can use all the features of regexes: global, case insensitive flags and so on.

PS. Be careful not to signify the intention to omit the third argument by setting it to `null`. The `null` is a valid value in _ranges_ [ecosystem](https://gitlab.com/codsen/codsen#-11-range-libraries) and it is used in ranges to "kill off" any present insertion values. For example, you merge two ranges and one says "add this" (in a form of third argument) and second says, disregard all that content to add, here's `null` to defuse them for good.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ranges-regex%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aranges-regex%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ranges-regex%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aranges-regex%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ranges-regex%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aranges-regex%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-regex
[cov-img]: https://img.shields.io/badge/coverage-94.74%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-regex
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ranges-regex
[downloads-img]: https://img.shields.io/npm/dm/ranges-regex.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ranges-regex
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ranges-regex
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
