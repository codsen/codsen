# string-collapse-white-space

<a href="https://standardjs.com" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Efficient collapsing of white space within strings with optional trimming

[![Link to npm page][npm-img]][npm-url]
[![Build Status][travis-img]][travis-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Coverage Status][cov-img]][cov-url]
[![Known Vulnerabilities][vulnerabilities-img]][vulnerabilities-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Test in browser][runkit-img]][runkit-url]


## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Idea](#idea)
- [The API](#the-api)
  - [Optional Options Object's API:](#optional-options-objects-api)
- [Usage](#usage)
- [Practical use](#practical-use)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
$ npm i string-collapse-white-space
```

Transpiled ES5 code (`es5/index.js`) is served. Source (`./index.js`) is in ES6.

**[⬆ &nbsp;back to top](#)**

## Idea

Traverse the string once, gather a list of ranges indicating white space indexes, calculate the result once and return it.

**[⬆ &nbsp;back to top](#)**

## The API

**collapse (string\[, opts])**

Input:
- the first argument - string only or will `throw`.
- the second argument - optional options object. Anything else than `undefined`, `null` or a plain object will `throw`.

Options object is sanitized by [check-types-mini](https://github.com/codsen/check-types-mini) which will `throw` if you set options' keys to wrong types or add unrecognized keys. You'll thank me later.

**Defaults**:

```js
{
  trimStart: true,
  trimEnd: true,
  dontTouchLeadingWhiteSpace: false,
  dontTouchTrailingWhiteSpace: false
}
```

### Optional Options Object's API:

`options` object's key         | Type     | Obligatory? | Default     | Description
-------------------------------|----------|-------------|-------------|----------------------
{                              |          |             |             |
`trimStart`                    | Boolean  | no          | `true`      | if `false`, leading whitespace will be collapsed to a single space
`trimEnd`                      | Boolean  | no          | `true`      | if `false`, trailing whitespace will be collapsed to a single space
`dontTouchLeadingWhiteSpace`   | Boolean  | no          | `false`     | if `true`, leading whitespace won't be touched. Overrides trimStart.
`dontTouchTrailingWhiteSpace`  | Boolean  | no          | `false`     | if `true`, trailing whitespace won't be touched. Overrides trimEnd.
}                              |          |             |             |

**[⬆ &nbsp;back to top](#)**

## Usage

```js
const collapse = require('string-collapse-white-space')
let res1 = collapse('  aaa     bbb    ccc   dddd  ')
console.log('res1 = ' + JSON.stringify(res1, null, 4))
// => "aaa bbb ccc dddd"

let res2 = collapse('\n \ta b\t \n', {dontTouchLeadingWhiteSpace: true})
console.log('res2 = ' + JSON.stringify(res2, null, 4))
// => "\n \ta b"
```

**[⬆ &nbsp;back to top](#)**

## Practical use

I want a reliable string white space collapsing library which would traverse the input ONLY ONCE and gather result IN ONE GO, before returning it. This is not regex approach where we mutate the string when trimming, then mutate again when collapsing... No. It's a proper traversal within a backward FOR loop (backward instead of forwards is for better speed), where we only gather the intel while traversing.

I'm going to use it first in [Detergent](https://github.com/codsen/detergent), but you never know, it might prove handy in email template building in general.

**[⬆ &nbsp;back to top](#)**

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://standardjs.com) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/codsen/string-collapse-white-space/issues). If you file a pull request, I'll do my best to help you to get it merged as soon as possible. If you have any comments on the code, including ideas how to improve something, don't hesitate to contact me by email.

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

[npm-img]: https://img.shields.io/npm/v/string-collapse-white-space.svg
[npm-url]: https://www.npmjs.com/package/string-collapse-white-space

[travis-img]: https://travis-ci.org/codsen/string-collapse-white-space.svg?branch=master
[travis-url]: https://travis-ci.org/codsen/string-collapse-white-space

[cov-img]: https://coveralls.io/repos/github/codsen/string-collapse-white-space/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/codsen/string-collapse-white-space?branch=master

[overall-img]: https://www.bithound.io/github/codsen/string-collapse-white-space/badges/score.svg
[overall-url]: https://www.bithound.io/github/codsen/string-collapse-white-space

[deps-img]: https://www.bithound.io/github/codsen/string-collapse-white-space/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/codsen/string-collapse-white-space/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/codsen/string-collapse-white-space/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/codsen/string-collapse-white-space/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/string-collapse-white-space.svg
[downloads-url]: https://www.npmjs.com/package/string-collapse-white-space

[vulnerabilities-img]: https://snyk.io/test/github/codsen/string-collapse-white-space/badge.svg
[vulnerabilities-url]: https://snyk.io/test/github/codsen/string-collapse-white-space

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-collapse-white-space

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-ff9900.svg
[runkit-url]: https://npm.runkit.com/string-collapse-white-space
