# regex-empty-conditional-comments

> Regular expression for matching HTML empty conditional comments

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
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
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/regex-empty-conditional-comments.cjs.js` | 406 B |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/regex-empty-conditional-comments.esm.js` | 367 B |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/regex-empty-conditional-comments.umd.js` | 566 B |

**[⬆ back to top](#)**

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

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](https:/gitlab.com/codsen/codsen/issues/new?title=regex-empty-conditional-comments%20package%20-%20put%20title%20here).
- If you want a new feature but can't code it up yourself, also [raise an issue](https:/gitlab.com/codsen/codsen/issues/new?title=regex-empty-conditional-comments%20package%20-%20put%20title%20here). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](https:/gitlab.com/codsen/codsen/issues/new?title=regex-empty-conditional-comments%20package%20-%20put%20title%20here). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/regex-empty-conditional-comments.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/regex-empty-conditional-comments
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/regex-empty-conditional-comments
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/regex-empty-conditional-comments
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/regex-empty-conditional-comments
[downloads-img]: https://img.shields.io/npm/dm/regex-empty-conditional-comments.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/regex-empty-conditional-comments
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/regex-empty-conditional-comments
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
