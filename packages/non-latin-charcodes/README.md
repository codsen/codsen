# non-latin-charcodes

> List of all non-language characters outside Latin ranges

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
- [Idea](#idea)
- [Example](#example)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i non-latin-charcodes
```

A _default_ is exported so name it whatever you want, its value will be an array of arrays:

```js
// consume via a require():
const charCodeList = require("non-latin-charcodes");
// or as a ES Module:
import charCodeList from "non-latin-charcodes";
// use it:
console.log(JSON.stringify(charCodeList, null, 4));
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                                           | Size |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------------------------- | ---- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/non-latin-charcodes.cjs.js` | 8 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/non-latin-charcodes.esm.js` | 8 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/non-latin-charcodes.umd.js` | 5 KB |

**[⬆ back to top](#)**

## Idea

If you want to HTML-encode characters but don't want to encode text from non-Latin languages: Japanese, Chinese, Hebrew and others, you'll need to check each character's `str.charCodeAt(0)`, is it among the list of known non-Latin letters. Well, this is that list.

For example, when this package exports and array:

```
[
  [0, 880],
  [887, 890],
  [894, 900],
  [906, 908],
  ...
  [2142, 2208],
  [2208, 2210],
  [2220, 2276],
  [2302, 2304],
  ...
  [173824, 177972],
  [177972, 177984],
  [177984, 178205],
  [178205, 194560]
]
```

If you check a Japanese character "本", its `.charCodeAt(0)` value is 26412. It is not within any of our ranges (closest being `[19893, 19904]` and `[40869, 40908]`), so it should not be encoded if you don't want to encode letters.

Digits on the edges (for example, 887 and 890 from `[887, 890]`) are not inclusive and can be encoded because they are not characters.

**[⬆ back to top](#)**

## Example

```js
// CASE 1.
const test1 = "本".charCodeAt(0);
if (
  notLanguageCharCodes.some(
    rangesArr => rangesArr[0] < test1 && rangesArr[1] > test1
  )
) {
  console.log(`encode`);
} else {
  // it won't be matched because it's on the edge of [887, 890]
  console.log("don't encode");
}
// => don't encode

// -----------------------------------------------------------------------------

// CASE 2.
const test2 = 888;
if (
  notLanguageCharCodes.some(
    rangesArr => rangesArr[0] < test2 && rangesArr[1] > test2
  )
) {
  // it will be matched because 888 is within one of ranges, [887, 890]
  console.log(`don't encode`);
} else {
  console.log("encode");
}
// => don't encode
```

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=non-latin-charcodes%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Anon-latin-charcodes%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=non-latin-charcodes%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Anon-latin-charcodes%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=non-latin-charcodes%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Anon-latin-charcodes%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/non-latin-charcodes.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/non-latin-charcodes
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/non-latin-charcodes
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/non-latin-charcodes
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/non-latin-charcodes
[downloads-img]: https://img.shields.io/npm/dm/non-latin-charcodes.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/non-latin-charcodes
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/non-latin-charcodes
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
