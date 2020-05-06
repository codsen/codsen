# charcode-is-valid-xml-name-character

> Does a given character belong to XML spec's "Production 4 OR 4a" type (is acceptable for XML element's name)

[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#install)
- [What is does](#what-is-does)
- [In practice](#in-practice)
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i charcode-is-valid-xml-name-character
```

Consume via a `require()`:

```js
const {
  isProduction4,
  isProduction4a,
  validFirstChar,
  validSecondCharOnwards,
} = require("charcode-is-valid-xml-name-character");
```

or as an ES Module:

```js
import {
  isProduction4,
  isProduction4a,
  validFirstChar,
  validSecondCharOnwards,
} from "charcode-is-valid-xml-name-character";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/charcode-is-valid-xml-name-character/dist/charcode-is-valid-xml-name-character.umd.js"></script>
```

```js
// in which case you get a global variable "charcodeIsValidXmlNameCharacter" which you consume like this:
const {
  isProduction4,
  isProduction4a,
  validFirstChar,
  validSecondCharOnwards,
} = charcodeIsValidXmlNameCharacter;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                                               | Size |
| ------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------------------------------- | ---- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/charcode-is-valid-xml-name-character.cjs.js` | 2 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/charcode-is-valid-xml-name-character.esm.js` | 2 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/charcode-is-valid-xml-name-character.umd.js` | 2 KB |

**[⬆ back to top](#)**

## What is does

It returns a Boolean, is the given character the [Production 4a](https://www.w3.org/TR/REC-xml/#NT-NameStartChar) of XML spec, or in human terms, a possible ending character of an XML element.

This library is used to detect where (X)HTML element names end.

This article contains an in-depth explanation of the spec terminology: https://www.xml.com/pub/a/2001/07/25/namingparts.html — it helped me to get up to speed on this subject.

**[⬆ back to top](#)**

## In practice

Let's say you are iterating through string, character-by-character and it contains (X)HTML code source. This library will evaluate any given character and tell, is it a valid character for an element name. You use this library to detect where element names end.

In the most simple scenario:

```
<img class="">
    ^     ^
    1     2
```

Characters `space` (1) and `=` (2) in the example above mark the ending of the element names (`img` and `class`). OK, so we know spaces and equals' are not allowed as element names and therefore mark their ending. Are there more of such characters? Oh yes. Quite a lot according to [spec](https://www.w3.org/TR/REC-xml/#NT-NameChar) what warrants a proper library dedicated only for that purpose.

**[⬆ back to top](#)**

## API

Two functions - one to check requirements for **first character**, another to check requirements for **second character** and onwards. Both functions return a Boolean.

<table>
  <tr>
    <th>Function's name</th>
    <th>Purpose</th>
  </tr>
  <tr>
    <td><code>isProduction4</code></td>
    <td colspan="2">To tell, is this character suitable to be the first character</td>
  </tr>
  <tr>
    <td><code>validFirstChar</code></td>
  </tr>
  <tr>
    <td><code>isProduction4a</code></td>
    <td colspan="2">To tell, is this character suitable to be the second character and onwards</td>
  </tr>
  <tr>
    <td><code>validSecondCharOnwards</code></td>
  </tr>
</table>

**[⬆ back to top](#)**

### `isProduction4()` / `validFirstChar()` - requirements for 1st char

XML spec [production 4](https://www.w3.org/TR/REC-xml/#NT-NameStartChar) - the requirements for the first character of the XML element. It's more strict than requirements for the subsequent characters, see [production 4a]() below.

Pass any character (including astral-one) into function `isProduction4()`, and it will respond with a Boolean, is it acceptable as first XML character (or not).

```js
const {
  isProduction4,
  validFirstChar,
  // isProduction4a,
} = require("charcode-is-valid-xml-name-character");

const res1 = isProduction4("-"); // or use validFirstChar(), the same
console.log("res1 = " + res1);
// => 'res1 = false <---- minus is not allowed for first character

const res2 = isProduction4("z"); // or use validFirstChar(), the same
console.log("res2 = " + res2);
// => 'res2 = true
```

It **consumes** a single character (can be any Unicode character, including astral-one, comprising two surrogates).
**Returns** Boolean - is it acceptable as the first character in XML element's name.

**[⬆ back to top](#)**

### `isProduction4a()` / `validSecondCharOnwards()` - requirements for 2nd char onwards

XML spec [production 4a](https://www.w3.org/TR/REC-xml/#NT-NameChar) - the requirements for the second character onwards in XML element's name.

Pass any character (including astral-one) into function `isProduction4a()`, and it will respond with a Boolean, is it acceptable as second XML character and onwards (or not). Requirements are same as for the first character but a bit more permissive.

```js
const {
  // isProduction4,
  isProduction4a,
} = require("charcode-is-valid-xml-name-character");

const res1 = isProduction4a("-"); // or use validSecondCharOnwards(), the same
console.log("res1 = " + res1);
// => 'res1 = true <---- minus is allowed for second character-onwards

const res2 = isProduction4a("z"); // or use validSecondCharOnwards(), the same
console.log("res2 = " + res2);
// => 'res2 = true
```

It **consumes** a single character (can be any Unicode character, including astral-one, comprising two surrogates).
**Returns** Boolean - is it acceptable as the second or subsequent character in XML element's name.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=charcode-is-valid-xml-name-character%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Acharcode-is-valid-xml-name-character%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=charcode-is-valid-xml-name-character%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Acharcode-is-valid-xml-name-character%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=charcode-is-valid-xml-name-character%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Acharcode-is-valid-xml-name-character%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/charcode-is-valid-xml-name-character
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/charcode-is-valid-xml-name-character
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/charcode-is-valid-xml-name-character
[downloads-img]: https://img.shields.io/npm/dm/charcode-is-valid-xml-name-character.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/charcode-is-valid-xml-name-character
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/charcode-is-valid-xml-name-character
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
