# email-all-chars-within-ascii-cli

> Command line app to scan email templates, are all their characters within ASCII range

[![Minimum Node version required][node-img]][node-url]
[![Repository is on BitBucket][bitbucket-img]][bitbucket-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

Other siblings of this package:

- API for it: [email-all-chars-within-ascii](https://gitlab.com/codsen/codsen/tree/master/packages/email-all-chars-within-ascii)

## TLDR; Usage

Call on one file:

![ran on one file](https://bitbucket.org/codsen/codsen/raw/e99ef54c0bac616e3b12cc4133aafb617f3fc053/packages/email-all-chars-within-ascii-cli/media/mov1.gif)

Call just the application and it will let you choose a file from that folder:

![ran without any arguments](https://bitbucket.org/codsen/codsen/raw/e99ef54c0bac616e3b12cc4133aafb617f3fc053/packages/email-all-chars-within-ascii-cli/media/mov2.gif)

Call on multiple files all at once:

![ran on multiple files all at once](https://bitbucket.org/codsen/codsen/raw/e99ef54c0bac616e3b12cc4133aafb617f3fc053/packages/email-all-chars-within-ascii-cli/media/mov3.gif)

**[⬆ back to top](#markdown-header-email-all-chars-within-ascii-cli)**

## Table of Contents

- [TLDR; Usage](#markdown-header-tldr-usage)
- [Install](#markdown-header-install)
- [Idea](#markdown-header-idea)
- [Practical use](#markdown-header-practical-use)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Install

```bash
npm i -g email-all-chars-within-ascii-cli
```

Then, call it by a name:

`withinascii YOURFILE.html` or

`tinaturner YOURFILE.html`

Whichever is easier for you to remember.

## Idea

This CLI app will check, does your HTML file (or some other extension) contains non-ASCII characters.

Specifically, it will check, are your file contents suitable for 7bit encoding, in other words, are all characters within the [basic ASCII range](http://www.fileformat.info/info/unicode/block/basic_latin/list.htm), the first 126^ characters. However, **only** this check would be short-sighted, as invisible control characters (anything below decimal point 32) fall within ASCII range but are bad.

We don't want any invisible control characters (anything below decimal point 32), EXCEPT:

- [HT](http://www.fileformat.info/info/unicode/char/0009/index.htm), horizontal tab, decimal number 9
- [LF](http://www.fileformat.info/info/unicode/char/000a/index.htm), new line, decimal number 10
- [CR](http://www.fileformat.info/info/unicode/char/000d/index.htm), carriage return, decimal number 13

^ Also, we don't want character at a decimal point 127, [DEL](http://www.fileformat.info/info/unicode/char/007f/index.htm), which technically falls within basic ASCII range but might appear broken in email-consumption software.

**[⬆ back to top](#markdown-header-email-all-chars-within-ascii-cli)**

## Practical use

I'm going to use this library to validate my email templates, as a part of final QA. In theory, all email templates should be [HTML encoded](https://www.npmjs.com/package/detergent) and have no characters outside the basic ASCII range (or invisible control characters like ETX). In practice, all depends on the server, because your ESP back-end _might_ encode the rogue characters for you. But it might not, and you'd be in trouble.

I'm going to prepare for the worst and deliver all my templates ready for ANY encoding, conforming to 7bit spec: no characters beyond first 126 decimal point.

PS. I'm saying 126, not 127 because 127 is "invisible" [DEL](http://www.fileformat.info/info/unicode/char/007f/index.htm) character which is not acceptable in templates.

Check out [the API](https://gitlab.com/codsen/codsen/tree/master/packages/email-all-chars-within-ascii) version which works well in Gulp environment.

**[⬆ back to top](#markdown-header-email-all-chars-within-ascii-cli)**

## Contributing

- If you see an error, [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=email-all-chars-within-ascii-cli%20package%20-%20put%20title%20here).
- If you want a new feature but can't code it up yourself, also [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=email-all-chars-within-ascii-cli%20package%20-%20put%20title%20here). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=email-all-chars-within-ascii-cli%20package%20-%20put%20title%20here). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://bitbucket.org/codsen/codsen/src/) via BitBucket, then write code, then file a pull request via BitBucket. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#markdown-header-email-all-chars-within-ascii-cli)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/email-all-chars-within-ascii-cli.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/email-all-chars-within-ascii-cli
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://gitlab.com/codsen/codsen/tree/master/packages/email-all-chars-within-ascii-cli
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/email-all-chars-within-ascii-cli
[downloads-img]: https://img.shields.io/npm/dm/email-all-chars-within-ascii-cli.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/email-all-chars-within-ascii-cli
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/codsen/src/master/LICENSE
