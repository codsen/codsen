# email-all-chars-within-ascii

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> Scans all characters within a string and checks are they within ASCII range

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

Other siblings of this package:
* CLI, command-line version: [email-all-chars-within-ascii-cli](https://github.com/codsen/email-all-chars-within-ascii-cli)

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
npm i email-all-chars-within-ascii
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled, contains `require` and `module.exports` | `main`                | `dist/email-all-chars-within-ascii.cjs.js` | 3&nbsp;KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/email-all-chars-within-ascii.esm.js` | 3&nbsp;KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/email-all-chars-within-ascii.umd.js` | 17&nbsp;KB

**[⬆ &nbsp;back to top](#)**

## Idea

Traverse the string and check if all characters are suitable for 7bit encoding, in other words, are within the basic ASCII range, first 126 characters, and does not include any invisible control characters.

We don't want any invisible control characters (anything below decimal point 32), EXCEPT:

* HT, horizontal tab, decimal number 9
* LF, new line, decimal number 10
* CR, carriage return, decimal number 13

Often decimal point 127, DEL, is overlooked, yet it is not right in your templates, especially email.

In that sense, [non-ascii regex](https://github.com/sindresorhus/non-ascii/) and the likes are dangerous to validate your email template code because they are too lax.

Also, we want an error `throw`n if any lines exceed the permitted length, 1000 characters. Our algorithm will `throw` earlier, at more than `997` consecutive non-CR/non-LR characters because line lengths count `CRLR` in the end (which is two extra characters, and we don't want to reach 1000).

**[⬆ &nbsp;back to top](#)**

## The API

**within(str\[, opts])**

Input:
- the first argument - string only or will `throw`.
- the second argument - optional options object. Anything else than `undefined`, `null` or a plain object will `throw`.

Input string will be traversed, and if/when the first unacceptable character is encountered, an error will be thrown.

Options object is sanitised by [check-types-mini](https://github.com/codsen/check-types-mini) which will `throw` if you set options' keys to wrong types or add unrecognised keys. You'll thank me later.

**Defaults**:

```js
    {
      messageOnly: false
      checkLineLength: true
    }
```

**[⬆ &nbsp;back to top](#)**

### Optional Options Object's API:

`options` object's key         | Type     | Obligatory? | Default     | Description
-------------------------------|----------|-------------|-------------|----------------------
{                              |          |             |             |
`messageOnly`                  | Boolean  | no          | `false`     | Should we not append `email-all-chars-within-ascii: ` in front of each error message? Set to `true` to turn it off, like in [CLI app](https://github.com/codsen/email-all-chars-within-ascii-cli/).
`checkLineLength`              | Boolean  | no          | `true`      | Throws if line length between any `CR` or `LR` characters is more than `997`. It's because [spec](https://tools.ietf.org/html/rfc821) says "The maximum total length of a text line including `<CRLF>` is 1000 characters".
}                              |          |             |             |

**[⬆ &nbsp;back to top](#)**

## Usage

```js
const within = require('email-all-chars-within-ascii')
let res1 = within('<html><head>zzzz</head><body>blablabla</body></html>')
// => does not throw, that's good.

let res2 = within('Ą')
// => throws an error because "Ą" is not within allowed ASCII range.
```

**[⬆ &nbsp;back to top](#)**

## Practical use

I'm going to use this library to validate my email templates, as a part of final QA. In theory, all email templates should be [HTML encoded](https://github.com/codsen/detergent) and have no characters outside the basic ASCII range (or invisible control characters like ETX). In practice, all depends on the server, what encoding it is using to deploy emails: 7bit, 8bit, quoted-printable or base64, also, does the back-end validate and encode the unacceptable characters for you. However, I'm going to prepare for the worst and deliver all my templates ready for ANY encoding, conforming to 7bit spec: no characters beyond first 126 decimal point.

PS. I'm saying 126, not 127 because 127 is "invisible" DEL character which is not acceptable in templates.

Check out [CLI](https://github.com/codsen/email-all-chars-within-ascii-cli/) version which you can install globally and use in your terminal.

**[⬆ &nbsp;back to top](#)**

## Contributing

Hi! 99% of people in the society are passive - consumers. They wait for others to take action, they prefer to blend in. The remaining 1% are proactive citizens who will _do_ something rather than _wait_. If you are one of that 1%, you're in luck because I am the same and _together_ we can make something happen.

* If you **want a new feature** in this package or you would like to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/email-all-chars-within-ascii/issues). Also, you can [email me](mailto:roy@codsen.com). Just let it out.

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/email-all-chars-within-ascii/issues). Alternatively, you can [email me](mailto:roy@codsen.com).

* If you don't like the code in here and would like to **give an advice** about how something could be done better, please do. Same drill - [GitHub issues](https://github.com/codsen/email-all-chars-within-ascii/issues) or [email](mailto:roy@codsen.com), your choice.

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. I'll do my best to merge it quickly. Code style is `airbnb`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2017 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/email-all-chars-within-ascii.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/email-all-chars-within-ascii

[npm-img]: https://img.shields.io/npm/v/email-all-chars-within-ascii.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/email-all-chars-within-ascii

[travis-img]: https://img.shields.io/travis/codsen/email-all-chars-within-ascii.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/email-all-chars-within-ascii

[cov-img]: https://coveralls.io/repos/github/codsen/email-all-chars-within-ascii/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/email-all-chars-within-ascii?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/email-all-chars-within-ascii.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/email-all-chars-within-ascii

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/email-all-chars-within-ascii.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/email-all-chars-within-ascii/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/email-all-chars-within-ascii

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/email-all-chars-within-ascii.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/email-all-chars-within-ascii/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/email-all-chars-within-ascii/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/email-all-chars-within-ascii

[downloads-img]: https://img.shields.io/npm/dm/email-all-chars-within-ascii.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/email-all-chars-within-ascii

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/email-all-chars-within-ascii

[license-img]: https://img.shields.io/npm/l/email-all-chars-within-ascii.svg?style=flat-square
[license-url]: https://github.com/codsen/email-all-chars-within-ascii/blob/master/license.md
