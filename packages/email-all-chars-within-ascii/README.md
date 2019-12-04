# email-all-chars-within-ascii

> Scans all characters within a string and checks are they within ASCII range

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

Other siblings of this package:

- CLI for it: `email-all-chars-within-ascii-cli` [on npm](https://www.npmjs.com/package/email-all-chars-within-ascii-cli), [on GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/email-all-chars-within-ascii-cli)

## Table of Contents

- [Install](#install)
- [Idea](#idea)
- [The API](#the-api)
- [Usage](#usage)
- [Practical use](#practical-use)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i email-all-chars-within-ascii
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`within`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const within = require("email-all-chars-within-ascii");
```

or as an ES Module:

```js
import within from "email-all-chars-within-ascii";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/email-all-chars-within-ascii/dist/email-all-chars-within-ascii.umd.js"></script>
```

```js
// in which case you get a global variable "emailAllCharsWithinAscii" which you consume like this:
const within = emailAllCharsWithinAscii;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                                       | Size |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------------ | ---- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/email-all-chars-within-ascii.cjs.js` | 2 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/email-all-chars-within-ascii.esm.js` | 2 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/email-all-chars-within-ascii.umd.js` | 2 KB |

**[⬆ back to top](#)**

## Idea

Traverse the string and check if all characters are suitable for 7bit encoding, in other words, are within the basic ASCII range, first 126 characters, and does not include any invisible control characters.

We don't want any invisible control characters (anything below decimal point 32), EXCEPT:

- HT, horizontal tab, decimal number 9
- LF, new line, decimal number 10
- CR, carriage return, decimal number 13

Often decimal point 127, DEL, is overlooked, yet it is not right in your templates, especially email.

In that sense, [non-ascii regex](https://github.com/sindresorhus/non-ascii/) and the likes are dangerous to validate your email template code because they are too lax.

Also, we want an error `throw`n if any lines exceed the permitted length, 1000 characters. Our algorithm will `throw` earlier, at more than `997` consecutive non-CR/non-LR characters because line lengths count `CRLR` in the end (which is two extra characters, and we don't want to reach 1000).

**[⬆ back to top](#)**

## The API

**within(str\[, opts])**

Input:

- the first argument - string only or will `throw`.
- the second argument - optional options object. Anything else than `undefined`, `null` or a plain object will `throw`.

Input string will be traversed, and if/when the first unacceptable character is encountered, an error will be thrown.

Options object is sanitised by check-types-mini ([npm](https://www.npmjs.com/package/check-types-mini), [GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/check-types-mini)) which will `throw` if you set options' keys to wrong types or add unrecognised keys. You'll thank me later.

**Defaults**:

```js
{
  messageOnly: false;
  checkLineLength: true;
}
```

**[⬆ back to top](#)**

### Optional Options Object's API:

| `options` object's key | Type    | Obligatory? | Default | Description                                                                                                                                                                                                                    |
| ---------------------- | ------- | ----------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| {                      |         |             |         |
| `messageOnly`          | Boolean | no          | `false` | Should we not append `email-all-chars-within-ascii:` in front of each error message? Set to `true` to turn it off, like in [CLI app](https://gitlab.com/codsen/codsen/tree/master/packages/email-all-chars-within-ascii-cli/). |
| `checkLineLength`      | Boolean | no          | `true`  | Throws if line length between any `CR` or `LR` characters is more than `997`. It's because [spec](https://tools.ietf.org/html/rfc821) says "The maximum total length of a text line including `<CRLF>` is 1000 characters".    |
| }                      |         |             |         |

**[⬆ back to top](#)**

## Usage

```js
const within = require("email-all-chars-within-ascii");
let res1 = within("<html><head>zzzz</head><body>blablabla</body></html>");
// => does not throw, that's good.

let res2 = within("Ą");
// => throws an error because "Ą" is not within allowed ASCII range.
```

**[⬆ back to top](#)**

## Practical use

I'm going to use this library to validate my email templates, as a part of final QA. In theory, all email templates should be [HTML encoded](https://www.npmjs.com/package/detergent) and have no characters outside the basic ASCII range (or invisible control characters like ETX). In practice, all depends on the server, what encoding it is using to deploy emails: 7bit, 8bit, quoted-printable or base64, also, does the back-end validate and encode the unacceptable characters for you. However, I'm going to prepare for the worst and deliver all my templates ready for ANY encoding, conforming to 7bit spec: no characters beyond first 126 decimal point.

PS. I'm saying 126, not 127 because 127 is "invisible" DEL character which is not acceptable in templates.

Check out [CLI](https://gitlab.com/codsen/codsen/tree/master/packages/email-all-chars-within-ascii-cli/) version which you can install globally and use in your terminal.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=email-all-chars-within-ascii%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aemail-all-chars-within-ascii%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=email-all-chars-within-ascii%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aemail-all-chars-within-ascii%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=email-all-chars-within-ascii%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aemail-all-chars-within-ascii%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/email-all-chars-within-ascii.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/email-all-chars-within-ascii
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/email-all-chars-within-ascii
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/email-all-chars-within-ascii
[downloads-img]: https://img.shields.io/npm/dm/email-all-chars-within-ascii.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/email-all-chars-within-ascii
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/email-all-chars-within-ascii
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
