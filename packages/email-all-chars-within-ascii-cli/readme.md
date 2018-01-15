# email-all-chars-within-ascii-cli

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> Command line app to scans email templates, are all their characters within ASCII range

[![Minimum Node version required][node-img]][node-url]
[![Link to npm page][npm-img]][npm-url]
[![Build Status][travis-img]][travis-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Known Vulnerabilities][vulnerabilities-img]][vulnerabilities-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![MIT License][license-img]][license-url]

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
npm i -g email-all-chars-within-ascii-cli
```

Then, call it by a name `withinascii YOURFILE.html` or `tinaturner YOURFILE.html`. Whichever easier for you to remember. The transpiled version is served, so the source is not in ES6 and you can use it on Node `v.4` and above. It's not necessary to have Node `6.8.0+` installed (which supports ES6).

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

Hi! 99% of people in the society are passive - consumers. They wait for others to take action, they prefer to blend in. The remaining 1% are proactive citizens who will _do_ something rather than _wait_. If you are one of that 1%, you're in luck because I am the same and _together_ we can make something happen.

* If you **want a new feature** in this package or you would like to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/email-all-chars-within-ascii-cli/issues). Also, you can [email me](mailto:roy@codsen.com). Just let it out.

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/email-all-chars-within-ascii-cli/issues). Alternatively, you can [email me](mailto:roy@codsen.com).

* If you don't like the code in here and would like to **give advice** about how something could be done better, please do. Same drill - [GitHub issues](https://github.com/codsen/email-all-chars-within-ascii-cli/issues) or [email](mailto:roy@codsen.com), your choice.

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. I'll do my best to merge it quickly. Code style is `airbnb-base`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/email-all-chars-within-ascii-cli.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/email-all-chars-within-ascii-cli

[npm-img]: https://img.shields.io/npm/v/email-all-chars-within-ascii-cli.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/email-all-chars-within-ascii-cli

[travis-img]: https://img.shields.io/travis/codsen/email-all-chars-within-ascii-cli.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/email-all-chars-within-ascii-cli

[overall-img]: https://img.shields.io/bithound/code/github/codsen/email-all-chars-within-ascii-cli.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/email-all-chars-within-ascii-cli

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/email-all-chars-within-ascii-cli.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/email-all-chars-within-ascii-cli/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/email-all-chars-within-ascii-cli

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/email-all-chars-within-ascii-cli.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/email-all-chars-within-ascii-cli/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/email-all-chars-within-ascii-cli/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/email-all-chars-within-ascii-cli

[downloads-img]: https://img.shields.io/npm/dm/email-all-chars-within-ascii-cli.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/email-all-chars-within-ascii-cli

[license-img]: https://img.shields.io/npm/l/email-all-chars-within-ascii-cli.svg?style=flat-square
[license-url]: https://github.com/codsen/email-all-chars-within-ascii-cli/blob/master/license.md
