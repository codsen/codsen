# string-range-expander

> Expands string index ranges within whitespace boundaries until letters are met

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
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i string-range-expander
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`expander`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const expander = require("string-range-expander");
```

or as an ES Module:

```js
import expander from "string-range-expander";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/string-range-expander/dist/string-range-expander.umd.js"></script>
```

```js
// in which case you get a global variable "stringRangeExpander" which you consume like this:
const expander = stringRangeExpander;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                                | Size |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ----------------------------------- | ---- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-range-expander.cjs.js` | 8 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-range-expander.esm.js` | 8 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-range-expander.umd.js` | 6 KB |

**[⬆ back to top](#)**

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
  ifRightSideIncludesThisThenCropTightly: "<",
});
console.log("res = " + JSON.stringify(res1, null, 4));
// => [10, 21]
```

This library is used to manage the whitespace in the string index selections. The "from" and "to" indexes correspond the `String.slice()` "beginIndex" and "endIndex" API as described in [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice).

**[⬆ back to top](#)**

## API

**expand(opts)**

The function is exported as _default_, you can name it any way you like when you `import`/`require`.

### API - Function's Input

| Input argument | Key value's type | Obligatory? | Description                               |
| -------------- | ---------------- | ----------- | ----------------------------------------- |
| `opts`         | Plain object     | yes         | An Options Object. See below for its API. |

If input arguments are supplied have any other types, an error will be `throw`n.

**[⬆ back to top](#)**

### Optional Options Object

| Options Object's key                             | Type of its value                            | Obligatory? | Default      | Description                                                                                                       |
| ------------------------------------------------ | -------------------------------------------- | ----------- | ------------ | ----------------------------------------------------------------------------------------------------------------- |
| {                                                |                                              |             |              |
| `str`                                            | string                                       | yes         | `""` (empty) | String to reference                                                                                               |
| `from`                                           | number (natural number)                      | yes         | `0`          | Index from which we should expand backwards                                                                       |
| `to`                                             | number (natural number)                      | yes         | `0`          | Index from which we should expand backwards                                                                       |
| `ifLeftSideIncludesThisThenCropTightly`          | string                                       | no          | `""` (empty) | All characters to the left side of given range you want to tigger a tight crop. All concatenated into one chunk.  |
| `ifLeftSideIncludesThisCropItToo`                | string                                       | no          | `""` (empty) | All characters to the left side of given range you want to skip as if they were whitespace                        |
| `ifRightSideIncludesThisThenCropTightly`         | string                                       | no          | `""` (empty) | All characters to the right side of given range you want to tigger a tight crop. All concatenated into one chunk. |
| `ifRightSideIncludesThisCropItToo`               | string                                       | no          | `""` (empty) | All characters to the right side of given range you want to skip as if they were whitespace                       |
| `extendToOneSide`                                | Boolean `false` or strings "left" or "right" | no          | `false`      | You can expand the range only to one side if you want using this.                                                 |
| `wipeAllWhitespaceOnLeft`                        | Boolean                                      | no          | `false`      | If on, range will be extended to the left until it reaches the first non-whitespace character (or EOL)            |
| `wipeAllWhitespaceOnRight`                       | Boolean                                      | no          | `false`      | If on, range will be extended to the right until it reaches the first non-whitespace character (or EOL)           |
| `addSingleSpaceToPreventAccidentalConcatenation` | Boolean                                      | no          | `false`      | If on, it will prevent accidental concatenation of strings by inserting a single space in tight crop situations   |
| }                                                |                                              |             |              |

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
  extendToOneSide: false,
  wipeAllWhitespaceOnLeft: false,
  wipeAllWhitespaceOnRight: false,
  addSingleSpaceToPreventAccidentalConcatenation: false
}
```

**[⬆ back to top](#)**

### API - Function's Output

The output is an array of two indexes, the new "from" and new "to". For example, `[12, 14]`.

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-range-expander%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-range-expander%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-range-expander%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-range-expander%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-range-expander%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-range-expander%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-range-expander
[cov-img]: https://img.shields.io/badge/coverage-80%25-yellow.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-range-expander
[no-deps-img]: https://img.shields.io/badge/-no%20dependencies-brightgreen?style=flat-square
[no-deps-url]: https://www.npmjs.com/package/string-range-expander?activeTab=dependencies
[downloads-img]: https://img.shields.io/npm/dm/string-range-expander.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-range-expander
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-range-expander
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
