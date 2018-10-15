# string-trim-spaces-only

> Like String.trim() but trims only spaces

[![Minimum Node version required][node-img]][node-url]
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
- [API](#markdown-header-api)
- [`opts.classicTrim`](#markdown-header-optsclassictrim)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Install

```bash
npm i string-trim-spaces-only
```

```js
// consume via a CommonJS require:
const trimSpaces = require("string-trim-spaces-only");
// or as an ES Module:
import trimSpaces from "string-trim-spaces-only";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                                  | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-trim-spaces-only.cjs.js` | 2 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-trim-spaces-only.esm.js` | 2 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-trim-spaces-only.umd.js` | 27 KB |

**[⬆ back to top](#markdown-header-string-trim-spaces-only)**

## Usage

```js
const trimSpaces = require("string-trim-spaces-only");
const res = trimSpaces("  aaa   ");
console.log("res = " + JSON.stringify(res1, null, 4));
// => {
//     res: "aaa",
//     ranges: [[0, 2], [5, 8]]
// }

// trimming stops at first non-space:
const res2 = trimSpaces("   \t  zz   \n    ");
console.log("res2 = " + JSON.stringify(res2, null, 4));
// => {
//     res: "\t  zz   \n",
//     ranges: [[0, 3], [12, 16]]
// }
```

We also tested it with emoji, it copes fine. Mind you, the indexes are based on native JS String indexes, that is, if emoji `.length` is `2` then such emoji will increase all subsequent character indexes by `2`.

**[⬆ back to top](#markdown-header-string-trim-spaces-only)**

## API

**trimSpaces(str, [opts])**

### API - Function's Input

| Input argument | Key value's type | Obligatory? | Description                                        |
| -------------- | ---------------- | ----------- | -------------------------------------------------- |
| `input`        | String           | yes         | Input string you want to trim some way             |
| `opts`         | Plain object     | no          | An Optional Options Object. See below for its API. |

If input arguments are supplied have any other types, an error will be `throw`n.

**[⬆ back to top](#markdown-header-string-trim-spaces-only)**

### Optional Options Object

| An Optional Options Object's key | Type of its value | Default | Description                                                                                       |
| -------------------------------- | ----------------- | ------- | ------------------------------------------------------------------------------------------------- |
| {                                |                   |         |
| `classicTrim`                    | Boolean           | `false` | If it's set to `true`, trimming becomes the same as `String.trim()`. Use it when you need ranges. |
| }                                |                   |         |

**[⬆ back to top](#markdown-header-string-trim-spaces-only)**

### API - Function's Output

Since `v.2`, the output is a plain object:

| Key name | Key value's type                  | Description                                                             |
| -------- | --------------------------------- | ----------------------------------------------------------------------- |
| {        |                                   |                                                                         |
| `res`    | String or zero or more characters | Resulting string, what was left after trimming spaces from the input.   |
| `ranges` | Array of zero or more arrays      | If we trimmed anything, each slice range will be added into this array. |
| }        |                                   |                                                                         |

**[⬆ back to top](#markdown-header-string-trim-spaces-only)**

## `opts.classicTrim`

`String.trim()` returns string but sometimes you need just ranges of what would be trimmed, to merge them into compiled ranges array and to process later, along everything else. In those cases, use `opts.classicTrim`. If you need just _string_ value, it's not worth to use this function as a substitute for `String.trim()` for performance reasons.

**[⬆ back to top](#markdown-header-string-trim-spaces-only)**

## Contributing

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/string-trim-spaces-only/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/string-trim-spaces-only/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ back to top](#markdown-header-string-trim-spaces-only)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/string-trim-spaces-only.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-trim-spaces-only
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/string-trim-spaces-only
[cov-img]: https://coveralls.io/repos/bitbucket/codsen/string-trim-spaces-only/badge.svg?style=flat-square&branch=master
[cov-url]: https://coveralls.io/bitbucket/codsen/string-trim-spaces-only?branch=master
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-trim-spaces-only
[downloads-img]: https://img.shields.io/npm/dm/string-trim-spaces-only.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-trim-spaces-only
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-trim-spaces-only
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/string-trim-spaces-only
