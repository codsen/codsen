# is-language-code

> Is given string a language code (as per IANA)

[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![no dependencies][no-deps-img]][no-deps-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#install)
- [Idea](#idea)
- [API - Input](#api-input)
- [API - Output](#api-output)
- [For example,](#for-example)
- [By the way](#by-the-way)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i is-language-code
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`isLangCode`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const isLangCode = require("is-language-code");
```

or as an ES Module:

```js
import isLangCode from "is-language-code";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/is-language-code/dist/is-language-code.umd.js"></script>
```

```js
// in which case you get a global variable "isLanguageCode" which you consume like this:
const isLangCode = isLanguageCode;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                           | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------ | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/is-language-code.cjs.js` | 77 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/is-language-code.esm.js` | 77 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/is-language-code.umd.js` | 56 KB |

**[⬆ back to top](#)**

## Idea

This program tells, is a given string a _valid_ language tag.

It is based on [RFC #5646](https://tools.ietf.org/html/rfc5646) "Tags for Identifying Languages" which was released in 2009 and as of Jan 2020 it is still [current](https://datatracker.ietf.org/doc/rfc5646/).

Language tags are used in many places, for example, in HTML attribute `hreflang`:

```html
<link rel="alternate" href="http://example.com" hreflang="es-es" />
```

It's very hard to properly match the spec using regex only - you can validate that allowed characters are in allowed places but you can't validate the meaning those characters have. The position of subtag and arrangement matters. Also, this program returns explanations _why_ it deemed the input not to be a language tag.

For example, `de-419-DE` is wrong because it contains two region tags, `419` and `DE`:

```js
{
  res: false,
  message: `Two region subtags, "419" and "DE".`
}
```

Existing regex-based solutions like [ietf-language-tag-regex](https://www.npmjs.com/package/ietf-language-tag-regex) don't have much of a logic besides enforcing subtag _order_ and subtag _length_, for example, it reports any string, longer than two characters, as a valid language tag. We, on other hand, validate each value against known IANA-registered names.

**[⬆ back to top](#)**

## API - Input

**isLangCode(str)** — in other words, a function which takes string.

If input is not a string or an empty string, a negative answer will be returned.

## API - Output

Program returns a clone of a plain object:

```js
{
  res: false,
  message: `Unrecognised language subtag, "posix".`
}
```

or

```js
{
  res: true,
  message: null
}
```

Non-string or empty-string inputs always yield `false`, program does not _throw_.

Language tags are not case-sensitive (there exist conventions for the capitalization of some of the subtags but they don't carry meaning). For performance reasons, all references of the input uses lowercase, even if you entered in uppercase. For example, `en-US-POSIX` would get reported as lowercase "posix":

```js
{
  res: false,
  message: `Unrecognised language subtag, "posix".`
}
```

**[⬆ back to top](#)**

## For example,

```js
const isLangCode = require("is-language-code");
console.log(isLangCode("de").res);
// => true because it's a German language code
console.log(isLangCode("fr").res);
// => true because it's a French language code
console.log(isLangCode("ja").res);
// => true because it's a Japanese language code
console.log(isLangCode("zzz").res);
// => false - unrecognised. npm package "ietf-language-tag-regex" would fail this
console.log(isLangCode("1").res);
// => false - not recognised language code
console.log(isLangCode("x-klingon").res);
// => true - private use
console.log(isLangCode("x-whatever").res);
// => true - private use
console.log(isLangCode("zh-Hant").res);
// => true - Chinese written using the Traditional Chinese script
console.log(isLangCode("zh-cmn-Hans-CN").res);
// => true - Chinese, Mandarin, Simplified script, as used in China
console.log(isLangCode("zh-Hans-CN").res);
// => true - Chinese written using the Simplified script as used in mainland China
console.log(isLangCode("sr-Latn-RS").res);
// => true - Serbian written using the Latin script as used in Serbia
console.log(isLangCode("sl-rozaj").res);
// => true - Resian dialect of Slovenian
console.log(isLangCode("sl-nedis").res);
// => true - Nadiza dialect of Slovenian
console.log(isLangCode("de-CH-1901").res);
// => true - German as used in Switzerland using the 1901 variant [orthography]
console.log(isLangCode("sl-IT-nedis").res);
// => true - Slovenian as used in Italy, Nadiza dialect
console.log(isLangCode("hy-Latn-IT-arevela").res);
// => true - Eastern Armenian written in Latin script, as used in Italy
console.log(isLangCode("en-US").res);
// => true - English as used in the United States
console.log(isLangCode("de-CH-x-phonebk").res);
// => true - private use subtag (x-)
console.log(isLangCode("az-Arab-x-AZE-derbend").res);
// => true - private use subtag
console.log(isLangCode("x-whatever").res);
// => true - private use subtag using singleton x-
console.log(isLangCode("qaa-Qaaa-QM-x-southern").res);
// => true
console.log(isLangCode("de-Qaaa").res);
// => true - private use script subtag (Qaaa)
console.log(isLangCode("sr-Latn-QM").res);
// => true - Serbian, Latin script, private region QM
console.log(isLangCode("en-US-u-islamcal").res);
// => true - tag with extension
console.log(isLangCode("zh-CN-a-myext-x-private").res);
// => true - tag with extension
console.log(isLangCode("en-a-myext-b-another").res);
// => true - tag with extension

console.log(isLangCode("de-419-DE").res);
// => false - two region tags
console.log(isLangCode("a-DE").res);
// => false - use of a single-character subtag in primary position
console.log(isLangCode("ar-a-aaa-b-bbb-a-ccc").res);
// => false - two extensions with same single-letter prefix
```

**[⬆ back to top](#)**

## By the way

Back in 1989, code `iw` was replaced with `he` so we won't include `iw`. Similar way, `ji` and `in` are not included.

> The following codes have been added in 1989 (nothing later): ug (Uigur), iu (Inuktitut, also called Eskimo), za (Zhuang), he (Hebrew, replacing iw), yi (Yiddish, replacing ji), and id (Indonesian, replacing in).
> — https://www.ietf.org/rfc/rfc1766.txt

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=is-language-code%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ais-language-code%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=is-language-code%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ais-language-code%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=is-language-code%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ais-language-code%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/is-language-code
[cov-img]: https://img.shields.io/badge/coverage-93.94%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/is-language-code
[no-deps-img]: https://img.shields.io/badge/-no%20dependencies-brightgreen?style=flat-square
[no-deps-url]: https://www.npmjs.com/package/is-language-code?activeTab=dependencies
[downloads-img]: https://img.shields.io/npm/dm/is-language-code.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/is-language-code
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/is-language-code
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
