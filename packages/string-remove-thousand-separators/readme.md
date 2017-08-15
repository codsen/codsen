# string-remove-thousand-separators

<a href="https://standardjs.com" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Detects and removes thousand separators (dot/comma/quote/space) from string-type digits

[![Build Status][travis-img]][travis-url]
[![Coverage Status][cov-img]][cov-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Known Vulnerabilities][vulnerabilities-img]][vulnerabilities-url]
[![Downloads/Month][downloads-img]][downloads-url]

## Install

```sh
$ npm i string-remove-thousand-separators
```

```js
const remSep = require('string-remove-thousand-separators')
let res = remSep('100,000.01') // => 100000.01
```

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

## Examples

```js
var remSep = require('string-remove-thousand-separators')

// 🇬🇧 🇺🇸 thousand separators:
console.log(remSep('1,000,000.00'))
// => "1000000.00"

// 🇷🇺  thousand separators:
console.log(remSep('1 000 000,00'))
// => "1000000.00"

// 🇨🇭 thousand separators:
console.log(remSep("1'000'000.00"))
// => "1000000.00"

// IT'S SMART TOO:

// will not delete if the thousand separators are mixed:
console.log(remSep('100,000,000.000')) // => same, does nothing

// but will remove empty space, even if there is no decimal separator:
// (that's to cope with Russian notation integers that use thousand separators)
console.log(remSep('100 000 000 000')) // => 100000000000

// while removing thousand separators, it will also pad the digits to two decimal places
// (optional, on by default, to turn it off set opts.padSingleDecimalPlaceNumbers to `false`):
console.log(remSep('100,000.2'))
// => "100000.20" (western notation)

console.log(remSep('100 000,2'))
// => "100000,20" (Russian notation)

console.log(remSep('100\'000.2'))
// => "100000,20" (Swiss notation)
```

## API

**remSep('str'[, opts])**

If first argument (input) is not `string`, it will `throw` and error.
If second argument (opts) is not `null` and is not `undefined` and is not a plain object, it will `throw` and error.

### options

**Defaults**:

```js
    {
      padSingleDecimalPlaceNumbers: true,
      forceUKStyle: false
    }
```

`options` object's key         | Type     | Obligatory? | Default     | Description
-------------------------------|----------|-------------|-------------|----------------------
{                              |          |             |             |
`padSingleDecimalPlaceNumbers` | Boolean  | no          | `true`      | Should we pad one decimal place numbers with zero? `100.2` → `100.20`?
`forceUKStyle`                 | Boolean  | no          | `false`     | Should we convert the decimal separator commas into dots? `1,5` → `1.5`?
}                              |          |             |             |

## Algorithm

This library uses my new favourite, string trickle-class ("strickle-class") algorithm. The string is looped (we aim once, but it depends on the complexity of the task) and the characters trickle one-by-one through our "traps" where we flip boolean flags and count stuff accordingly to what's passing by.

That's a different approach from using regexes. Regexes are an easy solution when it is possible to achieve it using them. However, most of the cases, limits of regexes dictate the limits of the algorithms, and as a result, we sometimes see crippled web apps that are not smart and not really universal. For example, when I banked with Metro Bank back in 2015, they used to export CSV's with some numbers having a thousand separators and some not having them. Also, separately from that, some numbers were wrapped with double quotes, and some were not. That drew my accounting software crazy, and I had to manually edit the CSV's each time. Funnily, a combination of this library and [csv-split-easy](https://github.com/codsen/csv-split-easy) would solve such issues. The question is, how come corporate software can't do things that open source can? Is it corporate ceilings of all kinds or is it the power of JavaScript?

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://standardjs.com) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/codsen/string-remove-thousand-separators/issues). If you file a pull request, I'll do my best to review it promptly. If you have any comments on the code, including ideas how to improve things, don't hesitate to contact me by email.

## Licence

> MIT License (MIT)

> Copyright (c) 2017 Codsen Ltd, Roy Revelt

> Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

> The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[travis-img]: https://travis-ci.org/codsen/string-remove-thousand-separators.svg?branch=master
[travis-url]: https://travis-ci.org/codsen/string-remove-thousand-separators

[cov-img]: https://coveralls.io/repos/github/codsen/string-remove-thousand-separators/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/codsen/string-remove-thousand-separators?branch=master

[overall-img]: https://www.bithound.io/github/codsen/string-remove-thousand-separators/badges/score.svg
[overall-url]: https://www.bithound.io/github/codsen/string-remove-thousand-separators

[deps-img]: https://www.bithound.io/github/codsen/string-remove-thousand-separators/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/codsen/string-remove-thousand-separators/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/codsen/string-remove-thousand-separators/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/codsen/string-remove-thousand-separators/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/string-remove-thousand-separators.svg
[downloads-url]: https://www.npmjs.com/package/string-remove-thousand-separators

[vulnerabilities-img]: https://snyk.io/test/github/codsen/string-remove-thousand-separators/badge.svg
[vulnerabilities-url]: https://snyk.io/test/github/codsen/string-remove-thousand-separators
