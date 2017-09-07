# email-all-chars-within-ascii-cli

<a href="https://standardjs.com" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Scans all characters within a string and checks are they within ASCII range

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

Other siblings of this package:
* API for it: [email-all-chars-within-ascii](https://github.com/codsen/email-all-chars-within-ascii)

## TLDR; Usage

Call on one file:

![ran on one file](https://cdn.rawgit.com/codsen/email-all-chars-within-ascii-cli/044aa28a/media/mov1.gif)

Call just the application and it will let you choose a file from that folder:

![ran without any arguments](https://cdn.rawgit.com/codsen/email-all-chars-within-ascii-cli/044aa28a/media/mov2.gif)

Call on multiple files all at once:

![ran on multiple files all at once](https://cdn.rawgit.com/codsen/email-all-chars-within-ascii-cli/044aa28a/media/mov3.gif)

**[⬆ &nbsp;back to top](#)**

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Idea](#idea)
- [Practical use](#practical-use)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
$ npm i -g email-all-chars-within-ascii-cli
```

Then, call it by a name `withinascii` or `tinaturner`. Whichever easier for you to remember.

**[⬆ &nbsp;back to top](#)**

## Idea

This CLI app will check, does your HTML file (or some other extension) contains non-ASCII characters.

Specifically, it will check, are your file contents suitable for 7bit encoding, in other words, are all characters within the [basic ASCII range](http://www.fileformat.info/info/unicode/block/basic_latin/list.htm), the first 126^ characters. However, **only** this check would be short-sighted, as invisible control characters (anything below decimal point 32) fall within this range.

We don't want any invisible control characters (anything below decimal point 32), EXCEPT:

* [HT](http://www.fileformat.info/info/unicode/char/0009/index.htm), horizontal tab, decimal number 9
* [LF](http://www.fileformat.info/info/unicode/char/000a/index.htm), new line, decimal number 10
* [CR](http://www.fileformat.info/info/unicode/char/000d/index.htm), carriage return, decimal number 13

^ Also, we don't want character at a decimal point 127, [DEL](http://www.fileformat.info/info/unicode/char/007f/index.htm), which technically falls within basic ASCII range but might appear broken in email clients.

**[⬆ &nbsp;back to top](#)**

## Practical use

I'm going to use this library to validate my email templates, as a part of final QA. In theory, all email templates should be [HTML encoded](https://github.com/codsen/detergent) and have no characters outside the basic ASCII range (or invisible control characters like ETX). In practice, all depends on the server, because your ESP back-end _might_ encode the rogue characters for you. But it might not, and you'd be in trouble.

I'm going to prepare for the worst and deliver all my templates ready for ANY encoding, conforming to 7bit spec: no characters beyond first 126 decimal point.

PS. I'm saying 126, not 127 because 127 is "invisible" [DEL](http://www.fileformat.info/info/unicode/char/007f/index.htm) character which is not acceptable in templates.

Check out [the API](https://github.com/codsen/email-all-chars-within-ascii) version which works well in Gulp environment.

**[⬆ &nbsp;back to top](#)**

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://standardjs.com) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/codsen/email-all-chars-within-ascii-cli/issues). If you file a pull request, I'll do my best to help you to get it merged as soon as possible. If you have any comments on the code, including ideas how to improve something, don't hesitate to contact me by email.

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

[npm-img]: https://img.shields.io/npm/v/email-all-chars-within-ascii-cli.svg
[npm-url]: https://www.npmjs.com/package/email-all-chars-within-ascii-cli

[travis-img]: https://travis-ci.org/codsen/email-all-chars-within-ascii-cli.svg?branch=master
[travis-url]: https://travis-ci.org/codsen/email-all-chars-within-ascii-cli

[cov-img]: https://coveralls.io/repos/github/codsen/email-all-chars-within-ascii-cli/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/codsen/email-all-chars-within-ascii-cli?branch=master

[overall-img]: https://www.bithound.io/github/codsen/email-all-chars-within-ascii-cli/badges/score.svg
[overall-url]: https://www.bithound.io/github/codsen/email-all-chars-within-ascii-cli

[deps-img]: https://www.bithound.io/github/codsen/email-all-chars-within-ascii-cli/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/codsen/email-all-chars-within-ascii-cli/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/codsen/email-all-chars-within-ascii-cli/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/codsen/email-all-chars-within-ascii-cli/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/email-all-chars-within-ascii-cli.svg
[downloads-url]: https://www.npmjs.com/package/email-all-chars-within-ascii-cli

[vulnerabilities-img]: https://snyk.io/test/github/codsen/email-all-chars-within-ascii-cli/badge.svg
[vulnerabilities-url]: https://snyk.io/test/github/codsen/email-all-chars-within-ascii-cli

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg
[deps2d-url]: http://npm.anvaka.com/#/view/2d/email-all-chars-within-ascii-cli

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg
[runkit-url]: https://npm.runkit.com/email-all-chars-within-ascii-cli
