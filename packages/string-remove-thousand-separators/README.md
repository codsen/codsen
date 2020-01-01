# string-remove-thousand-separators

> Detects and removes thousand separators (dot/comma/quote/space) from string-type digits

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Install

```bash
npm i string-remove-thousand-separators
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`remSep`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const remSep = require("string-remove-thousand-separators");
```

or as an ES Module:

```js
import remSep from "string-remove-thousand-separators";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/string-remove-thousand-separators/dist/string-remove-thousand-separators.umd.js"></script>
```

```js
// in which case you get a global variable "stringRemoveThousandSeparators" which you consume like this:
const remSep = stringRemoveThousandSeparators;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                                            | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ----------------------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-remove-thousand-separators.cjs.js` | 4 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-remove-thousand-separators.esm.js` | 4 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-remove-thousand-separators.umd.js` | 24 KB |

**[⬆ back to top](#)**

## Use it

```js
const remSep = require("string-remove-thousand-separators");
let res = remSep("100,000.01");
console.log(res);
// => 100000.01
```

## Table of Contents

- [Install](#install)
- [Use it](#use-it)
- [Purpose](#purpose)
- [Examples](#examples)
- [API](#api)
- [Algorithm](#algorithm)
- [Contributing](#contributing)
- [Licence](#licence)

## Purpose

This library detects and removes a thousand separators from numeric strings.

The main consumer will be `csv-split-easy` ([npm](https://www.npmjs.com/package/csv-split-easy), [GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/csv-split-easy)) which deals with exported Internet Banking CSV files in a double-entry accounting format.

The numeric string must be NUMERIC, that is, not contain any letters or other unrelated characters. It can contain empty space though, which will be automatically trimmed.

**[⬆ back to top](#)**

## Examples

```js
var remSep = require("string-remove-thousand-separators");

// 🇬🇧 🇺🇸 thousand separators:
console.log(remSep("1,000,000.00"));
// => "1000000.00"

// 🇷🇺  thousand separators:
console.log(remSep("1 000 000,00"));
// => "1000000,00"
// (if you want it converted to Western notation with dot,
// set opts.forceUKStyle = true, see below)

// 🇨🇭 thousand separators:
console.log(remSep("1'000'000.00"));
// => "1000000.00"

// IT'S SMART TOO:

// will not delete if the thousand separators are mixed:
console.log(remSep("100,000,000.000")); // => does nothing

// but will remove empty space, even if there is no decimal separator:
// (that's to cope with Russian notation integers that use thousand separators)
console.log(remSep("100 000 000 000")); // => 100000000000

// while removing thousand separators, it will also pad the digits to two decimal places
// (optional, on by default, to turn it off set opts.padSingleDecimalPlaceNumbers to `false`):
console.log(remSep("100,000.2"));
// => "100000.20" (Western notation)

console.log(remSep("100 000,2"));
// => "100000,20" (Russian notation)

console.log(remSep("100'000.2"));
// => "100000.20" (Swiss notation)
```

**[⬆ back to top](#)**

## API

**remSep('str'[, opts])**

If first argument (input) is not `string`, it will `throw` and error.
Second input argument, `opts`, is optional. However, if _it is_ present and is not `null`, not `undefined` and not a plain object, it will `throw` and error.

**[⬆ back to top](#)**

### options

**Defaults**:

```js
    {
      removeThousandSeparatorsFromNumbers: true,
      padSingleDecimalPlaceNumbers: true,
      forceUKStyle: false
    }
```

| `options` object's key                | Type    | Obligatory? | Default | Description                                                                                                                                     |
| ------------------------------------- | ------- | ----------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| {                                     |         |             |         |
| `removeThousandSeparatorsFromNumbers` | Boolean | no          | `true`  | Should remove thousand separators? `1,000,000` → `1000000`? Or Swiss-style, `1'000'000` → `1000000`? Or Russian-style, `1 000 000` → `1000000`? |
| `padSingleDecimalPlaceNumbers`        | Boolean | no          | `true`  | Should we pad one decimal place numbers with zero? `100.2` → `100.20`?                                                                          |
| `forceUKStyle`                        | Boolean | no          | `false` | Should we convert the decimal separator commas into dots? `1,5` → `1.5`?                                                                        |
| }                                     |         |             |         |

**[⬆ back to top](#)**

## Algorithm

This library uses my new favourite, string trickle-class ("strickle-class") algorithm. The string is looped (we aim once, but it depends on the complexity of the task) and the characters trickle one-by-one through our "traps" where we flip boolean flags and count stuff accordingly to what's passing by.

That's a different approach from using regexes. Regexes are an easy solution when it is possible to achieve it using them. However, most of the cases, limits of regexes dictate the limits of the algorithms, and as a result, we sometimes see crippled web apps that are not smart and not really universal. For example, when we banked with Metro Bank back in 2015, they used to export CSV's with some numbers having a thousand separators and some not having them. Also, separately from that, some numbers were wrapped with double quotes, and some were not. That drew my accounting software crazy, and we had to manually edit the CSV's each time. Funnily, a combination of this library and `csv-split-easy` ([npm](https://www.npmjs.com/package/csv-split-easy), [GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/csv-split-easy)) would solve such issues. The question is, how come corporate software can't do things that open source can? Is it corporate ceilings of all kinds or is it the power of JavaScript?

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-remove-thousand-separators%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-remove-thousand-separators%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-remove-thousand-separators%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-remove-thousand-separators%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-remove-thousand-separators%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-remove-thousand-separators%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/string-remove-thousand-separators.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-remove-thousand-separators
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-remove-thousand-separators
[cov-img]: https://img.shields.io/badge/coverage-97.06%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-remove-thousand-separators
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-remove-thousand-separators
[downloads-img]: https://img.shields.io/npm/dm/string-remove-thousand-separators.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-remove-thousand-separators
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-remove-thousand-separators
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
