# string-range-expander

> Expands string index ranges within whitespace boundaries until letters are met

[![Minimum Node version required][node-img]][node-url]
[![Repository is on BitBucket][bitbucket-img]][bitbucket-url]
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
npm i string-range-expander
```

```js
// consume via a CommonJS require:
const expand = require("string-range-expander");
// or as an ES Module:
import expand from "string-range-expander";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                                | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ----------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-range-expander.cjs.js` | 2 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-range-expander.esm.js` | 1 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-range-expander.umd.js` | 27 KB |

**[⬆ back to top](#markdown-header-string-range-expander)**

## Usage

```js
const expand = require("string-range-expander");
// let's say we have picked the "zzzz" index range - [16, 20]
// "something>\n\t    zzzz <here"
//                    |   |
//                  from  to
//
// PS. "\n" and "\t" take up a single character's length
//
const res = expand({
  str: "something>\n\t    zzzz <here",
  from: 16,
  to: 20,
  ifRightSideIncludesThisThenCropTightly: "<"
});
console.log("res = " + JSON.stringify(res1, null, 4));
// => [10, 21]
```

This library is used to manage the whitespace in the string index selections. The "from" and "to" indexes correspond the `String.slice()` "beginIndex" and "endIndex" API as described on [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/String/slice.html&platform=javascript&repo=Main&source=developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice).

**[⬆ back to top](#markdown-header-string-range-expander)**

## API

**expand(opts)**

Function is exported as _default_, you can name it any way you like when you `import`/`require`.

### API - Function's Input

| Input argument | Key value's type | Obligatory? | Description                               |
| -------------- | ---------------- | ----------- | ----------------------------------------- |
| `opts`         | Plain object     | yes         | An Options Object. See below for its API. |

If input arguments are supplied have any other types, an error will be `throw`n.

**[⬆ back to top](#markdown-header-string-range-expander)**

### Optional Options Object

| Options Object's key                     | Type of its value                            | Obligatory? | Default      | Description                                                                                                       |
| ---------------------------------------- | -------------------------------------------- | ----------- | ------------ | ----------------------------------------------------------------------------------------------------------------- |
| {                                        |                                              |             |              |
| `str`                                    | string                                       | yes         | `""` (empty) | String to reference                                                                                               |
| `from`                                   | number (natural number)                      | yes         | `0`          | Index from which we should expand backwards                                                                       |
| `to`                                     | number (natural number)                      | yes         | `0`          | Index from which we should expand backwards                                                                       |
| `ifLeftSideIncludesThisThenCropTightly`  | string                                       | no          | `""` (empty) | All characters to the left side of given range you want to tigger a tight crop. All concatenated into one chunk.  |
| `ifLeftSideIncludesThisCropItToo`        | string                                       | no          | `""` (empty) | All characters to the left side of given range you want to skip as if they were whitespace                        |
| `ifRightSideIncludesThisThenCropTightly` | string                                       | no          | `""` (empty) | All characters to the right side of given range you want to tigger a tight crop. All concatenated into one chunk. |
| `ifRightSideIncludesThisCropItToo`       | string                                       | no          | `""` (empty) | All characters to the right side of given range you want to skip as if they were whitespace                       |
| `extendToOneSide`                        | Boolean `false` or strings "left" or "right" | no          | `false`      | You can expand the range only to one side if you want using this.                                                 |
| }                                        |                                              |             |              |

Here it is in one place if you want to copy-paste it somewhere:

```js
{
  str: "",
  from: 0,
  to: 0,
  ifLeftSideIncludesThisThenCropTightly: "",
  ifLeftSideIncludesThisCropItToo: "",
  ifRightSideIncludesThisThenCropTightly: "",
  ifRightSideIncludesThisCropItToo: "",
  extendToOneSide: false
}
```

**[⬆ back to top](#markdown-header-string-range-expander)**

### API - Function's Output

The output is an array of two indexes, the new "from" and new "to".

**[⬆ back to top](#markdown-header-string-range-expander)**

## Contributing

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/string-range-expander/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/string-range-expander/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ back to top](#markdown-header-string-range-expander)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/string-range-expander.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-range-expander
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/string-range-expander
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-range-expander
[downloads-img]: https://img.shields.io/npm/dm/string-range-expander.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-range-expander
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-range-expander
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/string-range-expander
