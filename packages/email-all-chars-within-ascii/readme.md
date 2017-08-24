# email-all-chars-within-ascii

<a href="https://standardjs.com" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Scans all characters within a string and checks are they within ASCII range

[![Link to npm page][npm-img]][npm-url]
[![Build Status][travis-img]][travis-url]
[![bitHound Overall Score][bithound-img]][bithound-url]
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
- [API](#api)
- [Usage](#usage)
- [Practical use](#practical-use)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
$ npm i email-all-chars-within-ascii
```

**[⬆ &nbsp;back to top](#)**

## Idea

Traverse the string and check if all characters are suitable for 7bit encoding, in other words, are within the basic ASCII range, first 126 characters, and does not include any invisible control characters.

We don't want any invisible control characters (anything below decimal point 32), EXCEPT:

* HT, horizontal tab, decimal number 9
* LF, new line, decimal number 10
* CR, carriage return, decimal number 13

Often decimal point 127, DEL, is overlooked, yet it is not good in your templates, especially email.

In that sense, [non-ascii regex](https://github.com/sindresorhus/non-ascii/) and the likes are dangerous to validate your email template code because they are too lax.

**[⬆ &nbsp;back to top](#)**

## API

Input - string only or will `throw`.
Input string will be traversed and if/when the first unacceptable character is encountered, an error will be thrown.

## Usage

```js
const within = require('email-all-chars-within-ascii')
let res = within('<html><head>zzzz</head><body>blablabla</body></html>')
// => does not throw, that's good.

// works with encoded HTML:
var res2 = within('Ą')
// => throws an error because "Ą" is not within allowed ASCII range.
```

**[⬆ &nbsp;back to top](#)**

## Practical use

I'm going to use this library to validate my email templates, as a part of final QA. In theory, all email templates should be [HTML encoded](https://github.com/codsen/detergent) and have no characters outside the basic ASCII range (or invisible control characters like ETX). In practice, all depends on the server, what encoding it is using to deploy emails: 7bit, 8bit, quoted-printable or base64, also, does the back-end validate and encode the unacceptable characters for you. However, I'm going to prepare for the worst and deliver all my templates ready for ANY encoding, conforming to 7bit spec: no characters beyond first 126 decimal point.

PS. I'm saying 126, not 127 because 127 is "invisible" DEL character which is not acceptable in templates.

**[⬆ &nbsp;back to top](#)**

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://standardjs.com) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/codsen/email-all-chars-within-ascii/issues). If you file a pull request, I'll do my best to help you to get it merged as soon as possible. If you have any comments on the code, including ideas how to improve something, don't hesitate to contact me by email.

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

[npm-img]: https://img.shields.io/npm/v/email-all-chars-within-ascii.svg
[npm-url]: https://www.npmjs.com/package/email-all-chars-within-ascii

[travis-img]: https://travis-ci.org/codsen/email-all-chars-within-ascii.svg?branch=master
[travis-url]: https://travis-ci.org/codsen/email-all-chars-within-ascii

[cov-img]: https://coveralls.io/repos/github/codsen/email-all-chars-within-ascii/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/codsen/email-all-chars-within-ascii?branch=master

[bithound-img]: https://www.bithound.io/github/codsen/email-all-chars-within-ascii/badges/score.svg
[bithound-url]: https://www.bithound.io/github/codsen/email-all-chars-within-ascii

[deps-img]: https://www.bithound.io/github/codsen/email-all-chars-within-ascii/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/codsen/email-all-chars-within-ascii/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/codsen/email-all-chars-within-ascii/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/codsen/email-all-chars-within-ascii/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/email-all-chars-within-ascii.svg
[downloads-url]: https://www.npmjs.com/package/email-all-chars-within-ascii

[vulnerabilities-img]: https://snyk.io/test/github/codsen/email-all-chars-within-ascii/badge.svg
[vulnerabilities-url]: https://snyk.io/test/github/codsen/email-all-chars-within-ascii

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg
[deps2d-url]: http://npm.anvaka.com/#/view/2d/email-all-chars-within-ascii

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-ff9900.svg
[runkit-url]: https://npm.runkit.com/email-all-chars-within-ascii
