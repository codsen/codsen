# string-remove-thousand-separators

> Detects and removes thousand separators (dot/comma/quote/space) from string-type digits

[![Minimum Node version required][node-img]][node-url]
[![Repository is on BitBucket][bitbucket-img]][bitbucket-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Install

```sh
npm i string-remove-thousand-separators
```

```js
// consume as a CommonJS require:
const remSep = require("string-remove-thousand-separators");
// or as an ES Module:
import remSep from "string-remove-thousand-separators";

// feed a numeric string to it:
let res = remSep("100,000.01"); // => 100000.01
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                                            | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ----------------------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-remove-thousand-separators.cjs.js` | 4 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-remove-thousand-separators.esm.js` | 3 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-remove-thousand-separators.umd.js` | 38 KB |

**[⬆ back to top](#markdown-header-string-remove-thousand-separators)**

## Table of Contents

- [Install](#markdown-header-install)
- [Purpose](#markdown-header-purpose)
- [Examples](#markdown-header-examples)
- [API](#markdown-header-api)
- [Algorithm](#markdown-header-algorithm)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Purpose

This library detects and removes a thousand separators from numeric strings.

The main consumer will be [csv-split-easy](https://bitbucket.org/codsen/csv-split-easy) which deals with exported Internet Banking CSV files in a double-entry accounting format.

The numeric string must be NUMERIC, that is, not contain any letters or other unrelated characters. It can contain empty space though, which will be automatically trimmed.

**[⬆ back to top](#markdown-header-string-remove-thousand-separators)**

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

**[⬆ back to top](#markdown-header-string-remove-thousand-separators)**

## API

**remSep('str'[, opts])**

If first argument (input) is not `string`, it will `throw` and error.
Second input argument, `opts`, is optional. However, if _it is_ present and is not `null`, not `undefined` and not a plain object, it will `throw` and error.

**[⬆ back to top](#markdown-header-string-remove-thousand-separators)**

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

**[⬆ back to top](#markdown-header-string-remove-thousand-separators)**

## Algorithm

This library uses my new favourite, string trickle-class ("strickle-class") algorithm. The string is looped (we aim once, but it depends on the complexity of the task) and the characters trickle one-by-one through our "traps" where we flip boolean flags and count stuff accordingly to what's passing by.

That's a different approach from using regexes. Regexes are an easy solution when it is possible to achieve it using them. However, most of the cases, limits of regexes dictate the limits of the algorithms, and as a result, we sometimes see crippled web apps that are not smart and not really universal. For example, when we banked with Metro Bank back in 2015, they used to export CSV's with some numbers having a thousand separators and some not having them. Also, separately from that, some numbers were wrapped with double quotes, and some were not. That drew my accounting software crazy, and we had to manually edit the CSV's each time. Funnily, a combination of this library and [csv-split-easy](https://bitbucket.org/codsen/csv-split-easy) would solve such issues. The question is, how come corporate software can't do things that open source can? Is it corporate ceilings of all kinds or is it the power of JavaScript?

**[⬆ back to top](#markdown-header-string-remove-thousand-separators)**

## Contributing

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/string-remove-thousand-separators/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/string-remove-thousand-separators/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ back to top](#markdown-header-string-remove-thousand-separators)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/string-remove-thousand-separators.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-remove-thousand-separators
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/string-remove-thousand-separators
[cov-img]: https://coveralls.io/repos/bitbucket/codsen/string-remove-thousand-separators/badge.svg?style=flat-square&branch=master
[cov-url]: https://coveralls.io/bitbucket/codsen/string-remove-thousand-separators?branch=master
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-remove-thousand-separators
[downloads-img]: https://img.shields.io/npm/dm/string-remove-thousand-separators.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-remove-thousand-separators
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-remove-thousand-separators
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/string-remove-thousand-separators
