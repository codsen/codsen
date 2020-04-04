# regex-empty-conditional-comments

> Regular expression for matching HTML empty conditional comments

[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![no dependencies][no-deps-img]][no-deps-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i regex-empty-conditional-comments
```
The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`emptyCondCommentRegex`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const emptyCondCommentRegex = require("regex-empty-conditional-comments");
```

or as an ES Module:

```js
import emptyCondCommentRegex from "regex-empty-conditional-comments";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/regex-empty-conditional-comments/dist/regex-empty-conditional-comments.umd.js"></script>
```

```js
// in which case you get a global variable "regexEmptyConditionalComments" which you consume like this:
const emptyCondCommentRegex = regexEmptyConditionalComments;
```

This package has three builds in `dist/` folder:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/regex-empty-conditional-comments.cjs.js` | 407 B
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/regex-empty-conditional-comments.esm.js` | 368 B
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/regex-empty-conditional-comments.umd.js` | 569 B

**[⬆ back to top](#)**

## Usage

```js
const emptyCondCommentRegex = require("regex-empty-conditional-comments");

// empty comment which was meant to target Outlook-only
emptyCondCommentRegex().t.test(`<!--[if !mso]>
<![endif]-->`);
//=> true

// empty comment which was meant to target non-Outlook-only
emptyCondCommentRegex().t.test(`<!--[if !mso]><!-- -->
<!--<![endif]-->`);
//=> true

emptyCondCommentRegex().t.test(`<!--[if !mso]><!-- -->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<!--<![endif]-->`);
//=> false

emptyCondCommentRegex().t.test(`<!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->`);
//=> false

emptyCondCommentRegex().exec("<html><!--[if !mso]><![endif]--><title>")[0];
//=> '<!--[if !mso]><![endif]-->'

`<html> <!--[if !mso]><![endif]--> <title>text</title> <!--[if gte mso 9]>
<xml>
<![endif]-->`.match(emptyCondCommentRegex());
//=> ['<!--[if !mso]><![endif]-->']
```

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=regex-empty-conditional-comments%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aregex-empty-conditional-comments%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=regex-empty-conditional-comments%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aregex-empty-conditional-comments%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=regex-empty-conditional-comments%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aregex-empty-conditional-comments%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/regex-empty-conditional-comments
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/regex-empty-conditional-comments
[no-deps-img]: https://img.shields.io/badge/-no%20dependencies-brightgreen?style=flat-square
[no-deps-url]: https://www.npmjs.com/package/regex-empty-conditional-comments?activeTab=dependencies
[downloads-img]: https://img.shields.io/npm/dm/regex-empty-conditional-comments.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/regex-empty-conditional-comments
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/regex-empty-conditional-comments
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
