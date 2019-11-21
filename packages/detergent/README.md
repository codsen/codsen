<div align="center">
  <img alt="Detergent" src="https://cdn.statically.io/gl/codsen/codsen/master/packages/detergent/media/detergent_200x200.png" height="200" align="center">
</div>

<div align="center"><p>a tool to prepare text for pasting into HTML</p></div>

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

<div align="center"><p>Online web app: <a href="https://Detergent.io">https://detergent.io</a></p></div>

## Table of Contents

- [Install](#install)
- [Rationale](#rationale)
- [API](#api)
- [`applicableOpts`](#applicableopts)
- [Example](#example)
- [`opts.cb`](#optscb)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i detergent
```

Consume via a `require()`:

```js
const { det, opts, version } = require("detergent");
```

or as an ES Module:

```js
import { det, opts, version } from "detergent";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/detergent/dist/detergent.umd.js"></script>
```

```js
// in which case you get a global variable "detergent" which you consume like this:
const { det, opts, version } = detergent;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                    | Size   |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ----------------------- | ------ |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/detergent.cjs.js` | 48 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/detergent.esm.js` | 53 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/detergent.umd.js` | 393 KB |

**[⬆ back to top](#)**

## Rationale

Detergent is a tool which cleans and prepares text so you can paste it safely into HTML template:

For starters, Detergent will:

- delete invisible Unicode characters
- collapse whitespace chunks longer than one space (considering newlines)
- strip HTML and recursively decode anything HTML-encoded

Then Detergent will optionally:

- encode all non-ASCII characters (for example, `£` into `&pound;`)
- improve English grammar style (for example, convert straight quotes to curly)

Adobe Photoshop and Illustrator both place [ETX](https://en.wikipedia.org/wiki/End-of-Text_character) characters when you insert linebreaks using SHIFT+ENTER to break the line but keep the text within the same paragraph (that's opposed to normal line breaks using ENTER alone which breaks paragraphs). When a text with an ETX character is pasted into HTML template, it is invisible in the code editor but might surface up later as "�" when CMS or ESP or other platform attempts to read the code.

Detergent has optional features to improve the English style:

- [widow word](https://en.wikipedia.org/wiki/Widows_and_orphans) prevention adding `&nbsp;` between last [two words](http://practicaltypography.com/widow-and-orphan-control.html)
- [M-dash and N-dash](http://practicaltypography.com/hyphens-and-dashes.html) recognition and automatic replacement where typographically appropriate
- Adding fancy [apostrophes](http://practicaltypography.com/apostrophes.html) and [curly quotes](http://practicaltypography.com/straight-and-curly-quotes.html)
- Adding missing spaces after full stops, commas and semicolons, except when it's a number.

Extra features are:

- You can skip the HTML encoding of non-Latin language letters. Useful when you are deploying Japanese or Chinese emails because otherwise, _everything_ would be HTML-encoded.
- Detergent is both XHTML and HTML-friendly. You can set which way you want your `<BR>`'s to appear: with a closing slash (XHTML) or without (HTML), so your HTML code should be passing the W3C validator.
- Detergent handles the full range of Unicode code points. In other words, it's emoji-friendly.
- Detergent will use the named HTML entities (for example, `&nbsp;` instead of `&#xA0;`) so you can read and recognise them. Not all named HTML entities work in all email clients, so we did the testing, found out which-ones [don't render correctly](https://gitlab.com/codsen/codsen/tree/master/packages/html-entities-not-email-friendly/) and set those to be _numeric_.

**[⬆ back to top](#)**

## API

The main function is exported in a plain object under key `detergent`, so please import it like that:

```js
const { det } = require("detergent");
// or request everything:
const { det, opts, version } = require("detergent");
// this gives extra plain object `exportedOpts` with default options. Handy when
// developing front-ends that consume the Detergent.
```

`det` is the main function. See its API below.

`opts` is default options' object. You pass it (or its tweaked version) to `det`.

`version` returns same-named package.json key's value - the version of the particular copy of Detergent you've got.

**[⬆ back to top](#)**

### API - `det()` Input

The `det` above is a function. You pass two input arguments to it:

| Input argument | Type   | Obligatory? | Description                                    |
| -------------- | ------ | ----------- | ---------------------------------------------- |
| `input`        | String | yes         | The string you want to clean.                  |
| `options`      | Object | no          | Options object. See its key arrangement below. |

**[⬆ back to top](#)**

### API - `det()` options object

| Options object's key     | Type of its value                | Default                                   | Description                                                                                                                                                                       |
| ------------------------ | -------------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| {                        |                                  |                                           |
| `fixBrokenEntities`      | Boolean                          | True                                      | should we try to fix any broken named HTML entities like `&nsp;` ("b" missing)                                                                                                    |
| `removeWidows`           | Boolean                          | True                                      | replace the last space in paragraph with a non-breaking space                                                                                                                     |
| `convertEntities`        | Boolean                          | True                                      | encode all non-[ASCII](https://en.wikipedia.org/wiki/ASCII) chars                                                                                                                 |
| `convertDashes`          | Boolean                          | True                                      | typographically-correct the n/m-dashes                                                                                                                                            |
| `convertApostrophes`     | Boolean                          | True                                      | typographically-correct the apostrophes                                                                                                                                           |
| `replaceLineBreaks`      | Boolean                          | True                                      | replace all line breaks with `br`'s                                                                                                                                               |
| `removeLineBreaks`       | Boolean                          | False                                     | put everything on one line (removes any line breaks, inserting space where necessary)                                                                                             |
| `useXHTML`               | Boolean                          | True                                      | add closing slashes on `br`'s                                                                                                                                                     |
| `dontEncodeNonLatin`     | Boolean                          | True                                      | skip non-latin character encoding (for example, [CJK](https://en.wikipedia.org/wiki/CJK_characters), Alefbet Ivri or Arabic abjad)                                                |
| `addMissingSpaces`       | Boolean                          | True                                      | adds missing spaces after dots/colons/semicolons, unless it's an URL                                                                                                              |
| `convertDotsToEllipsis`  | Boolean                          | True                                      | convert three dots into `&hellip;` - ellipsis character. When set to `false`, all encoded ellipses will be converted to three dots.                                               |
| `stripHtml`              | Boolean                          | True                                      | by default, all HTML tags are stripped (with exception to `opts.keepBoldEtc` - option to ignore `b`, `strong` and other tags). You can turn off HTML tag removal completely here. |
| `stripHtmlButIgnoreTags` | Array                            | `["b", "strong", "i", "em", "br", "sup"]` | List zero or more strings, each meaning a tag name that should not be stripped. For example, `["a", "sup"]`.                                                                      |
| `stripHtmlAddNewLine`    | Array                            | `["li", "/ul"]`                           | List of zero or more tag names which, if stripped, are replaced with a line break. Closing tags must start with slash.                                                            |
| `cb`                     | something _falsey_ or a function | `null`                                    | Callback function to additionally process characters between tags (like turning letters uppercase)                                                                                |
| }                        |                                  |                                           |

Here it is in one place:

```js
det("text to clean", {
  fixBrokenEntities: true,
  removeWidows: true,
  convertEntities: true,
  convertDashes: true,
  convertApostrophes: true,
  replaceLineBreaks: true,
  removeLineBreaks: false,
  useXHTML: true,
  dontEncodeNonLatin: true,
  addMissingSpaces: true,
  convertDotsToEllipsis: true,
  stripHtml: true,
  stripHtmlButIgnoreTags: ["b", "strong", "i", "em", "br", "sup"],
  stripHtmlAddNewLine: ["li", "/ul"],
  cb: null
});
```

The default set is a wise choice for the most common scenario - preparing text to be pasted into HTML.

You can also set the options to numeric `0` or `1`, that's shorter than Boolean `true` or `false`.

**[⬆ back to top](#)**

### API - `det()` output object

| output object's key | Type of its value | Description                                                                                                                 |
| ------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------- |
| {                   |                   |
| `res`               | String            | The cleaned string                                                                                                          |
| `applicableOpts`    | Plain Object      | Copy of options object without keys that have array values, each set to boolean, is that function applicable to given input |
| }                   |                   |

Function `det` returns a plain object, for example:

```js
{
  res: "abc",
  applicableOpts: {
    fixBrokenEntities: false,
    removeWidows: false,
    convertEntities: false,
    convertDashes: false,
    convertApostrophes: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
    useXHTML: false,
    dontEncodeNonLatin: false,
    addMissingSpaces: false,
    convertDotsToEllipsis: false,
    stripHtml: false
  }
}
```

**[⬆ back to top](#)**

## `applicableOpts`

Next generation web applications are designed to show only the options that are applicable to the given input. This saves user's time and also conserves mental resources — you don't even need to read all the labels of the options if they are not applicable.

Detergent currently has 14 option keys, 12 of them boolean. That's not a lot but if you use the tool every day, every optimisation counts.

I got inspiration for this feature while visiting competitor application https://typograf.github.io — it has 110 checkboxes grouped into 12 groups and options are hidden twice — first sidebar is hidden when you visit the page, second, option groups are collapsed.

Another example of overwhelming options set — Kangax minifier — https://kangax.github.io/html-minifier/ — it's got 26 options with heavy descriptions.

Detergent tackles this problem by changing its algorithm: it processes the given input and then makes a note, is particular option applicable or not, independently, is it enabled or not. Then, if it's enabled, it changes the result value.

For example, detergent's output might look like this — all options not applicable because there's nothing to do on "abc":

```js
{
  res: "abc",
  applicableOpts: {
    fixBrokenEntities: false,
    removeWidows: false,
    convertEntities: false,
    convertDashes: false,
    convertApostrophes: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
    useXHTML: false,
    dontEncodeNonLatin: false,
    addMissingSpaces: false,
    convertDotsToEllipsis: false,
    stripHtml: false
  }
}
```

The options keys which have values of a type _array_ (`stripHtmlButIgnoreTags` and `stripHtmlAddNewLine`) are omitted from `applicableOpts` report.

**[⬆ back to top](#)**

## Example

The simplest possible operation - encoding using default settings:

```js
const { det } = require("detergent");
let { res } = det("clean this text £");
console.log(res);
// > 'clean this text &pound;'
```

Now, using custom settings object with one custom setting `convertEntities` (others are left default):

```js
const { det } = require("detergent");
let { res } = det("clean this text £", {
  convertEntities: 0 // <--- zero is like "false", turns off the feature
});
console.log(res);
// > 'clean this text £'
```

**[⬆ back to top](#)**

## `opts.cb`

One of the unique (and complex) features of this program is HTML tag recognition. We process only the text and don't touch the tags, for example, widow word removal won't add non-breaking spaces within your tags if you choose not to strip the HTML.

`opts.cb` lets you perform additional operations on all the string characters outside any HTML tags. We aim to tap detergent.io uppercase-lowercase functionality here but maybe you'll find additional uses.

Here's an example, where we have widow word removal, HTML tags and additionally, with help of `opts.cb`, turn all the letters uppercase (but not on HTML tags):

```js
```

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=detergent%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Adetergent%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=detergent%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Adetergent%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=detergent%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Adetergent%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

Passes unit tests from https://github.com/kemitchell/straight-to-curly-quotes.json, licenced under CC0-1.0

[node-img]: https://img.shields.io/node/v/detergent.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/detergent
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/detergent
[cov-img]: https://img.shields.io/badge/coverage-90.39%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/detergent
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/detergent
[downloads-img]: https://img.shields.io/npm/dm/detergent.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/detergent
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/detergent
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
