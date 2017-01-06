# color-shorthand-hex-to-six-digit

<a href="https://github.com/feross/standard" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Convert shorthand hex colour codes into full. #abc => #aabbcc

[![Build Status][travis-img]][travis-url]
[![Coverage Status][cov-img]][cov-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Downloads/Month][downloads-img]][downloads-url]

## Install

```sh
$ npm install --save color-shorthand-hex-to-six-digit
```

## Purpose

Email newsletters use a lot of styling using HTML attributes, for example, `<td bgcolor='#CCCCCC'>`. As you know, there is alternative way to write color codes in HEX — [shorthand](https://en.wikipedia.org/wiki/Web_colors#Shorthand_hexadecimal_form), for example, `<td bgcolor='#CCC'>`.

Certain contemporary email consumption software doesn't accept shorthand hex colour codes, what means you have to ensure all your email templates use **only full-length colour codes**. Some tooling libraries that work with SASS shorten the colour hex codes, and that's a best practice for web development, but not for email. We need a tool/library which could convert any shorthand hex codes from any input (array, plain object or string) into full notation.

`color-shorthand-hex-to-six-digit` is an internal library either to be used in JS applications, or as a core dependency for plugins (Gulp) or CLI JS applications.

This library takes any input: **array** (of strings, plain objects, other arrays or whatever nested), **plain object** (containing anything in values, including nested plain objects, arrays or strings) or **string**, traverses it and converts all found shorthand hex colour codes into full-length.

## Concept

Here's the idea of this library:
* `color-shorthand-hex-to-six-digit` is one-way only: whatever the hex code is accepted, but all and only shorthand is coverted to full-hand.
* `color-shorthand-hex-to-six-digit` doesn't throw errors when it encounters full hex codes (or, for actually, even stupid things in the input — simply returns them back)
* `color-shorthand-hex-to-six-digit` is AST-ready and accept whatever, including nested spaghetti trees, not just strings. You can pass anything: plain objects, arrays or strings — that's fine, shorthand hex'es will be found and converted.
* if you pass something weird as input into `color-shorthand-hex-to-six-digit`, it will not throw, but simply return it back. This is on purpose, to play well inside other libraries.

## Examples

```js
var conv = require('color-shorthand-hex-to-six-digit')

// converts shorthand hex color codes within strings:
conv('aaaa #f0c zzzz\n\t\t\t#fc0')
// => 'aaaa #ff00cc zzzz\n\t\t\t#ffcc00'

// converts shorthand hex colour codes within plain objects:
conv(
  {
    a: '#ffcc00',
    b: '#f0c',
    c: 'text'
  }
)
// => {
//   a: '#ffcc00',
//   b: '#ff00cc',
//   c: 'text'
// }

// converts shorthand hex colour codes within arrays:
conv(
  [
    '#fc0', '#f0c', 'text', ''
  ]
)
// => [
//   '#ffcc00', '#ff00cc', 'text', ''
// ]

// converts shorthand hex colour codes within nested spaghetti's:
conv(
  [
    [[[[[{x: ['#fc0']}]]]]], {z: '#f0c'}, ['text'], {y: ''}
  ]
)
// => [
//   [[[[[{x: ['#ffcc00']}]]]]], {z: '#ff00cc'}, ['text'], {y: ''}
// ]

// in all other cases it silently returns the input:
conv(null)
// => null

```

## API

```js
conv(
  input  // Anything: array, plain object or string or anything else
)
// => Anything, with all shorthand hex occurrences inside of it, converted to full hand.
// if input is of an unrecognised type (array, plain object or string), it will be returned without errors.
```

## Testing, linting and coverage

```bash
$ npm test
```

Unit tests use [AVA](https://github.com/avajs/ava) and [JS Standard](https://github.com/feross/standard) notation. Coverage is measured by [Istanbul CLI](https://www.npmjs.com/package/nyc), which we aim to be 100%.

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://github.com/feross/standard) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/code-and-send/color-shorthand-hex-to-six-digit/issues). If you file a pull request, I'll do my best to review it promptly. If you have any comments on the code, including ideas how to improve things, don't hesitate to contact me by email.

## Licence

> MIT License (MIT)

> Copyright (c) 2017 Code and Send Ltd, Roy Reveltas

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

[travis-img]: https://travis-ci.org/code-and-send/color-shorthand-hex-to-six-digit.svg?branch=master
[travis-url]: https://travis-ci.org/code-and-send/color-shorthand-hex-to-six-digit

[cov-img]: https://coveralls.io/repos/github/code-and-send/color-shorthand-hex-to-six-digit/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/code-and-send/color-shorthand-hex-to-six-digit?branch=master

[overall-img]: https://www.bithound.io/github/code-and-send/color-shorthand-hex-to-six-digit/badges/score.svg
[overall-url]: https://www.bithound.io/github/code-and-send/color-shorthand-hex-to-six-digit

[deps-img]: https://www.bithound.io/github/code-and-send/color-shorthand-hex-to-six-digit/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/code-and-send/color-shorthand-hex-to-six-digit/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/code-and-send/color-shorthand-hex-to-six-digit/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/code-and-send/color-shorthand-hex-to-six-digit/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/color-shorthand-hex-to-six-digit.svg
[downloads-url]: https://www.npmjs.com/package/color-shorthand-hex-to-six-digit
