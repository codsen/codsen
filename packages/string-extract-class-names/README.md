# string-extract-class-names

<a href="https://standardjs.com" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Extract all class and id names from a string and return them in an array

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

## Install

```sh
$ npm install --save string-extract-class-names
```

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Purpose](#purpose)
- [Examples](#examples)
- [API](#api)
- [Testing](#testing)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Purpose

This library extracts the class and id names from the string and returns them all put into an array.

I use `string-extract-class-names` to identify all the CSS class names from the parsed HTML/CSS in the library [email-remove-unused-css](https://github.com/codsen/email-remove-unused-css) which detects and deletes the unused CSS styles.

Since deleting of people's code is a risky task, a huge responsibility falls onto parts which identify _what should be deleted_, and more importantly, parts which identify _class names and id's_. That's why I extracted the `string-extract-class-names` from the `email-remove-unused-css` and set up a proper test suite.

Currently there 196 checks in `test.js` running on [AVA](https://github.com/avajs/ava). I'm checking all the possible (and impossible) strings in and around the class and id names to be 100% sure **only** correct class and id names are put into the results array and nothing else.

## Examples

```js
var extract = require('string-extract-class-names')

// two classes and one id extracted:
extract('div.first.second#third a[target=_blank]')
// => ['.first', '.second', '#third']

// six id's extracted (works even despite the nonsensical question mark characters):
extract('?#id1#id2? #id3#id4> p > #id5#id6')
// => ['#id1', '#id2', '#id3', '#id4', '#id5', '#id6']
```

## API

```js
extract(
  string               // String. Input.
)
// => Extracted classes/id's in an array
```

## Testing

```bash
$ npm test
```

Unit tests use [AVA](https://github.com/avajs/ava) and [JS Standard](https://standardjs.com) notation.

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://standardjs.com) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/codsen/string-extract-class-names/issues). If you file a pull request, I'll do my best to review it promptly. If you have any comments on the code, including ideas how to improve things, don't hesitate to contact me by email.

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

[npm-img]: https://img.shields.io/npm/v/string-extract-class-names.svg
[npm-url]: https://www.npmjs.com/package/string-extract-class-names

[travis-img]: https://travis-ci.org/codsen/string-extract-class-names.svg?branch=master
[travis-url]: https://travis-ci.org/codsen/string-extract-class-names

[cov-img]: https://coveralls.io/repos/github/codsen/string-extract-class-names/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/codsen/string-extract-class-names?branch=master

[overall-img]: https://www.bithound.io/github/codsen/string-extract-class-names/badges/score.svg
[overall-url]: https://www.bithound.io/github/codsen/string-extract-class-names

[deps-img]: https://www.bithound.io/github/codsen/string-extract-class-names/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/codsen/string-extract-class-names/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/codsen/string-extract-class-names/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/codsen/string-extract-class-names/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/string-extract-class-names.svg
[downloads-url]: https://www.npmjs.com/package/string-extract-class-names

[vulnerabilities-img]: https://snyk.io/test/github/codsen/string-extract-class-names/badge.svg
[vulnerabilities-url]: https://snyk.io/test/github/codsen/string-extract-class-names

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-extract-class-names

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-ff9900.svg
[runkit-url]: https://npm.runkit.com/string-extract-class-names
