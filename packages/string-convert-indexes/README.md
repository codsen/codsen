# string-convert-indexes

> Convert string character indexes from JS native index-based to Unicode character-count-based and backwards.

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
- [Usage](#usage)
- [API](#api)
- [Practical use](#practical-use)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i string-convert-indexes
```

Consume via a `require()`:

```js
const { nativeToUnicode, unicodeToNative } = require("string-convert-indexes");
```

or as an ES Module:

```js
import { nativeToUnicode, unicodeToNative } from "string-convert-indexes";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/string-convert-indexes/dist/string-convert-indexes.umd.js"></script>
```

```js
// in which case you get a global variable "stringConvertIndexes" which you consume like this:
const { nativeToUnicode, unicodeToNative } = stringConvertIndexes;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                                 | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------ | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-convert-indexes.cjs.js` | 7 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-convert-indexes.esm.js` | 5 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-convert-indexes.umd.js` | 36 KB |

**[⬆ back to top](#)**

## Idea

We are talking about indexes, the numbers used in, for example, `String.slice`.

Some libraries use JS native indexing where emoji counts as two characters.
Some libraries use indexing based on character-count where one emoji counts as one character.

This is a converter that converts between the two systems.

Highlights:

- Efficient algorithm - input string is traversed only once.
- No regexes - no potential security issues.
- Input can be a number or a numeric string or it can be **nested tree of them**. This library will convert _any_ natural numbers (set as numbers or strings). For example, `1` is fine, just like `[["1", "5"], ["5", "7"]]`.
- Untranspiled ES Modules build is wired up to `module` key in `package.json` - WebPack and Rollup will recognise and consume it.
- The main export is transpiled to ES5 (wired up to `main` key in `package.json`). You'll have no issues with `create-react-app`.

**[⬆ back to top](#)**

## Usage

```js
const { nativeToUnicode, unicodeToNative } = require("string-convert-indexes");
// or
import { nativeToUnicode, unicodeToNative } from "string-convert-indexes";

// CONVERTING NATIVE JS INDEXES TO UNICODE-CHAR-COUNT-BASED

// convert the index of the character at index zero, to Unicode-character-count-based index:
const res1 = nativeToUnicode("\uD834\uDF06aa", 0);
console.log(`res1 = ${JSON.stringify(res1, null, 4)}`);
// => 0

// at index #1 we have second surrogate of Unicode astral symbol which has index number #0
const res2 = nativeToUnicode("\uD834\uDF06aa", "1");
console.log(`res2 = ${JSON.stringify(res2, null, 4)}`);
// => '0' <--- notice it's retained as string. Same type as input is kept!

// at position index #2 we have first letter a
// its Unicode-based index, character count starting at zero, would be 1:
const res3 = nativeToUnicode("\uD834\uDF06aa", 2);
console.log(`res3 = ${JSON.stringify(res3, null, 4)}`);
// => 1

// at index #1 we have second surrogate of Unicode astral symbol which has index number #0
const res4 = nativeToUnicode("\uD834\uDF06aa", 3);
console.log(`res4 = ${JSON.stringify(res4, null, 4)}`);
// => 0

// convert many indexes at once - any nested data structure is fine:
const res5 = nativeToUnicode("\uD834\uDF06aa", [1, 0, 2, 3]);
console.log(`res5 = ${JSON.stringify(res5, null, 4)}`);
// => [0, 0, 1, 2]

// Also, works with numeric strings, as long as they are natural numbers or zeros.
// Observe how nested array is retained and string values are given back as strings:
const res6 = nativeToUnicode("\uD834\uDF06aa", [1, "0", [[[2]]], 3]);
console.log(`res6 = ${JSON.stringify(res6, null, 4)}`);
// => ['0', 0, [[[1]]], 2]

// CONVERTING UNICODE-CHAR-COUNT-BASED TO NATIVE JS INDEXES

const res7 = unicodeToNative("\uD834\uDF06aa", [0, 1, 2]);
console.log(`res7 = ${JSON.stringify(res7, null, 4)}`);
// => [0, 2, 3]

const res8 = unicodeToNative("\uD834\uDF06aa", [1, 0, 2]);
console.log(`res8 = ${JSON.stringify(res8, null, 4)}`);
// => [2, 0, 3],

const res9 = unicodeToNative("\uD834\uDF06aa", [1, 0, 2, 3]);
// throws an error!
// that's because there's no character (counting Unicode characters) with index 3
// we have only three Unicode characters, so indexes go only up until 2, not reaching 3 we need
```

**[⬆ back to top](#)**

## API

Two methods:

**nativeToUnicode(str, indexes\[, opts])**

Converts JS native indexes to indexes (used in let's say `String.slice()`), based on Unicode character count.

---

**unicodeToNative(str, indexes\[, opts])**

Converts Unicode character count-based indexes to JS native indexes.

**[⬆ back to top](#)**

### API - Input

API for both methods is the same:

| Input argument | Type         | Obligatory? | Description                                                                                                                                                                                     |
| -------------- | ------------ | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `str`          | String       | yes         | The string in which you want to perform a search                                                                                                                                                |
| `indexes`      | Whatever     | yes         | It can be anything: from numbers to nested arrays or arrays of numeric strings. Only natural numbers (incl. zero) in number or string shape will be compiled and replaced with converted value. |
| `opts`         | Plain object | no          | Options object. See its API below in a separate table.                                                                                                                                          |

**[⬆ back to top](#)**

### Optional Options Object

| Optional Options Object's key                          | Type of its value | Default | Description                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------------ | ----------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| {                                                      |                   |         |
| `throwIfAnyOfTheIndexesAreOutsideOfTheReferenceString` | Boolean           | `true`  | If some index is not covered by Unicode character at that index (`unicodeToNative` conversion) or by native JS string index (`nativeToUnicode` conversion), we can't reliably convert that index. We don't know how many astral characters lead to it (or not). If you want to turn off error throwing in such cases and make this package leave those uncovered indexes alone, set it to `false`. |
| }                                                      |                   |         |

Here are all the defaults in one place:

```js
{
  throwIfAnyOfTheIndexesAreOutsideOfTheReferenceString: true,
}
```

**[⬆ back to top](#)**

## Practical use

I have created quite a few string processing libraries, and some are using native JS indexes, while some are using Unicode character count-based indexing. This library will make them all more universal.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-convert-indexes%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-convert-indexes%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-convert-indexes%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-convert-indexes%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-convert-indexes%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-convert-indexes%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-convert-indexes
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-convert-indexes
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-convert-indexes
[downloads-img]: https://img.shields.io/npm/dm/string-convert-indexes.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-convert-indexes
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-convert-indexes
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
