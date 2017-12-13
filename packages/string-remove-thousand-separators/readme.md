# string-remove-thousand-separators

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> Detects and removes thousand separators (dot/comma/quote/space) from string-type digits

[![Minimum Node version required][node-img]][node-url]
[![Link to npm page][npm-img]][npm-url]
[![Build Status][travis-img]][travis-url]
[![Coverage][cov-img]][cov-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Known Vulnerabilities][vulnerabilities-img]][vulnerabilities-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![MIT License][license-img]][license-url]

## Install

```sh
$ npm i string-remove-thousand-separators
```

```js
// consume as a CommonJS require:
const remSep = require('string-remove-thousand-separators')
// or as an ES Module:
import remSep from 'string-remove-thousand-separators'

// feed a numeric string to it:
let res = remSep('100,000.01') // => 100000.01
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled, contains `require` and `module.exports` | `main`                | `dist/string-remove-thousand-separators.cjs.js` | 6&nbsp;KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/string-remove-thousand-separators.esm.js` | 6&nbsp;KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/string-remove-thousand-separators.umd.js` | 32&nbsp;KB

**[⬆ &nbsp;back to top](#)**

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Purpose](#purpose)
- [Examples](#examples)
- [API](#api)
  - [options](#options)
- [Algorithm](#algorithm)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Purpose

This library detects and removes a thousand separators from numeric strings.

The main consumer will be [csv-split-easy](https://github.com/codsen/csv-split-easy) which deals with exported Internet Banking CSV files in a double-entry accounting format.

The numeric string must be NUMERIC, that is, not contain any letters or other unrelated characters. It can contain empty space though, which will be automatically trimmed.

**[⬆ &nbsp;back to top](#)**

## Examples

```js
var remSep = require('string-remove-thousand-separators')

// 🇬🇧 🇺🇸 thousand separators:
console.log(remSep('1,000,000.00'))
// => "1000000.00"

// 🇷🇺  thousand separators:
console.log(remSep('1 000 000,00'))
// => "1000000,00"
// (if you want it converted to Western notation with dot,
// set opts.forceUKStyle = true, see below)

// 🇨🇭 thousand separators:
console.log(remSep("1'000'000.00"))
// => "1000000.00"

// IT'S SMART TOO:

// will not delete if the thousand separators are mixed:
console.log(remSep('100,000,000.000')) // => does nothing

// but will remove empty space, even if there is no decimal separator:
// (that's to cope with Russian notation integers that use thousand separators)
console.log(remSep('100 000 000 000')) // => 100000000000

// while removing thousand separators, it will also pad the digits to two decimal places
// (optional, on by default, to turn it off set opts.padSingleDecimalPlaceNumbers to `false`):
console.log(remSep('100,000.2'))
// => "100000.20" (Western notation)

console.log(remSep('100 000,2'))
// => "100000,20" (Russian notation)

console.log(remSep('100\'000.2'))
// => "100000.20" (Swiss notation)
```

**[⬆ &nbsp;back to top](#)**

## API

**remSep('str'[, opts])**

If first argument (input) is not `string`, it will `throw` and error.
Second input argument, `opts`, is optional. However, if _it is_ present and is not `null`, not `undefined` and not a plain object, it will `throw` and error.

**[⬆ &nbsp;back to top](#)**

### options

**Defaults**:

```js
    {
      removeThousandSeparatorsFromNumbers: true,
      padSingleDecimalPlaceNumbers: true,
      forceUKStyle: false
    }
```

`options` object's key                | Type     | Obligatory? | Default     | Description
--------------------------------------|----------|-------------|-------------|----------------------
{                                     |          |             |             |
`removeThousandSeparatorsFromNumbers` | Boolean  | no          | `true`      | Should remove thousand separators? `1,000,000` → `1000000`? Or Swiss-style, `1'000'000` → `1000000`? Or Russian-style, `1 000 000` → `1000000`?
`padSingleDecimalPlaceNumbers`        | Boolean  | no          | `true`      | Should we pad one decimal place numbers with zero? `100.2` → `100.20`?
`forceUKStyle`                        | Boolean  | no          | `false`     | Should we convert the decimal separator commas into dots? `1,5` → `1.5`?
}                                     |          |             |             |

**[⬆ &nbsp;back to top](#)**

## Algorithm

This library uses my new favourite, string trickle-class ("strickle-class") algorithm. The string is looped (we aim once, but it depends on the complexity of the task) and the characters trickle one-by-one through our "traps" where we flip boolean flags and count stuff accordingly to what's passing by.

That's a different approach from using regexes. Regexes are an easy solution when it is possible to achieve it using them. However, most of the cases, limits of regexes dictate the limits of the algorithms, and as a result, we sometimes see crippled web apps that are not smart and not really universal. For example, when I banked with Metro Bank back in 2015, they used to export CSV's with some numbers having a thousand separators and some not having them. Also, separately from that, some numbers were wrapped with double quotes, and some were not. That drew my accounting software crazy, and I had to manually edit the CSV's each time. Funnily, a combination of this library and [csv-split-easy](https://github.com/codsen/csv-split-easy) would solve such issues. The question is, how come corporate software can't do things that open source can? Is it corporate ceilings of all kinds or is it the power of JavaScript?

**[⬆ &nbsp;back to top](#)**

## Contributing

Hi! 99% of people in the society are passive - consumers. They wait for others to take action, they prefer to blend in. The remaining 1% are proactive citizens who will _do_ something rather than _wait_. If you are one of that 1%, you're in luck because I am the same and _together_ we can make something happen.

* If you **want a new feature** in this package or you would like to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/string-remove-thousand-separators/issues). Also, you can [email me](mailto:roy@codsen.com). Just let it out.

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/string-remove-thousand-separators/issues). Alternatively, you can [email me](mailto:roy@codsen.com).

* If you don't like the code in here and would like to **give an advice** about how something could be done better, please do. Same drill - [GitHub issues](https://github.com/codsen/string-remove-thousand-separators/issues) or [email](mailto:roy@codsen.com), your choice.

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. I'll do my best to merge it quickly. Code style is `airbnb`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2017 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/string-remove-thousand-separators.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-remove-thousand-separators

[npm-img]: https://img.shields.io/npm/v/string-remove-thousand-separators.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/string-remove-thousand-separators

[travis-img]: https://img.shields.io/travis/codsen/string-remove-thousand-separators.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/string-remove-thousand-separators

[cov-img]: https://coveralls.io/repos/github/codsen/string-remove-thousand-separators/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/string-remove-thousand-separators?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/string-remove-thousand-separators.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/string-remove-thousand-separators

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/string-remove-thousand-separators.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/string-remove-thousand-separators/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-remove-thousand-separators

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/string-remove-thousand-separators.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/string-remove-thousand-separators/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/string-remove-thousand-separators/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/string-remove-thousand-separators

[downloads-img]: https://img.shields.io/npm/dm/string-remove-thousand-separators.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-remove-thousand-separators

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-remove-thousand-separators

[license-img]: https://img.shields.io/npm/l/string-remove-thousand-separators.svg?style=flat-square
[license-url]: https://github.com/codsen/string-remove-thousand-separators/blob/master/license.md
