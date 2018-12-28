# regex-empty-conditional-comments

> Regular expression for matching HTML empty conditional comments

[![Repository is on BitBucket][bitbucket-img]][bitbucket-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#markdown-header-install)
- [Usage](#markdown-header-usage)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Install

```
npm i regex-empty-conditional-comments
```

```js
// consume as a CommonJS require:
const emptyCondCommentRegex = require("regex-empty-conditional-comments");
// or in ES Modules:
import emptyCondCommentRegex from "regex-empty-conditional-comments";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                                           | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/regex-empty-conditional-comments.cjs.js` | 131 B |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/regex-empty-conditional-comments.esm.js` | 87 B  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/regex-empty-conditional-comments.umd.js` | 276 B |

**[⬆ back to top](#markdown-header-regex-empty-conditional-comments)**

## Usage

```js
const emptyCondCommentRegex = require("regex-empty-conditional-comments");

// empty comment which was meant to target Outlook-only
emptyCondCommentRegex().test(`<!--[if !mso]>
<![endif]-->`);
//=> true

// empty comment which was meant to target non-Outlook-only
emptyCondCommentRegex().test(`<!--[if !mso]><!-- -->
<!--<![endif]-->`);
//=> true

emptyCondCommentRegex().test(`<!--[if !mso]><!-- -->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<!--<![endif]-->`);
//=> false

emptyCondCommentRegex().test(`<!--[if gte mso 9]><xml>
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

**[⬆ back to top](#markdown-header-regex-empty-conditional-comments)**

## Contributing

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/regex-empty-conditional-comments/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/regex-empty-conditional-comments/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ back to top](#markdown-header-regex-empty-conditional-comments)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/regex-empty-conditional-comments.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/regex-empty-conditional-comments
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/regex-empty-conditional-comments
[cov-img]: https://coveralls.io/repos/bitbucket/codsen/regex-empty-conditional-comments/badge.svg?style=flat-square&branch=master
[cov-url]: https://coveralls.io/bitbucket/codsen/regex-empty-conditional-comments?branch=master
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/regex-empty-conditional-comments
[downloads-img]: https://img.shields.io/npm/dm/regex-empty-conditional-comments.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/regex-empty-conditional-comments
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/regex-empty-conditional-comments
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/regex-empty-conditional-comments
