# string-strip-html

> Strips HTML tags from strings. Detects legit unencoded brackets.

[![Minimum Node version required][node-img]][node-url]
[![Repository is on BitBucket][bitbucket-img]][bitbucket-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Install

```sh
npm i string-strip-html
```

```js
// consume as a CommonJS require:
const stripHtml = require("string-strip-html");
// or as an ES Module:
import stripHtml from "string-strip-html";

// it does not assume the output must be always HTML and detects legit brackets:
console.log(stripHtml("a < b and c > d")); // => 'a < b and c > d'
// leaves content between tags:
console.log(stripHtml("Some text <b>and</b> text.")); // => 'Some text and text.'
// adds spaces to prevent accidental string concatenation
console.log(stripHtml("aaa<div>bbb</div>ccc")); // => 'aaa bbb ccc'
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                            | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-strip-html.cjs.js` | 38 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-strip-html.esm.js` | 41 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-strip-html.umd.js` | 97 KB |

**[⬆ back to top](#markdown-header-string-strip-html)**

## Table of Contents

- [Install](#markdown-header-install)
- [Purpose](#markdown-header-purpose)
- [Features](#markdown-header-features)
- [API](#markdown-header-api)
- [OPTS](#markdown-header-opts)
- [Not assuming anything](#markdown-header-not-assuming-anything)
- [Bigger picture](#markdown-header-bigger-picture)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Purpose

This library only detects and removes HTML tags from strings (text, in other words). Not more, not less. If something is deemed to be not a tag, it will not be removed. The bar is set higher than browsers - we aim to tackle as much broken code as possible so that later everything will work on browsers. This library is a development tool.

**[⬆ back to top](#markdown-header-string-strip-html)**

## Features

- Can be used to generate Email Text versions. Any URL links can be extracted and put after previously linked element.
- Works when opening or closing tag bracket is missing on some tags.
- It can detect and skip false positives, for example, `a < b and c > d`
- Works on dirty code - duplicate brackets, whitespace after opening bracket, messed up closing slashes — you name it, we will aim to tackle them.
- Adds spaces or line breaks to prevent concatenation. Except where punctuation characters follow.
- Can remove tags with all the content between opening and closing tag, for example `<style>...</style>` or `<script>...</script>`
- Uses recursive HTML decoding, so there's no way to cheat this library by using any kind of HTML encoding (unless you turn decoding off via `opts.skipHtmlDecoding`)
- It doesn't assume anything about the input source or purpose of the output string

**[⬆ back to top](#markdown-header-string-strip-html)**

## API

String-in string-out, with optional second input argument - an Optional Options Object.

### API - Input

| Input argument | Type         | Obligatory? | Description                                        |
| -------------- | ------------ | ----------- | -------------------------------------------------- |
| `input`        | String       | yes         | Text you want to strip HTML tags from              |
| `opts`         | Plain object | no          | The Optional Options Object, see below for its API |

If input arguments are supplied have any other types, an error will be `throw`n.

**[⬆ back to top](#markdown-header-string-strip-html)**

### Optional Options Object

| An Optional Options Object's key | Type of its value                                    | Default                      | Description                                                                                                                                                                             |
| -------------------------------- | ---------------------------------------------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| {                                |                                                      |                              |
| `ignoreTags`                     | Array of zero or more strings                        | `[]`                         | These tags will not be removed                                                                                                                                                          |
| `stripTogetherWithTheirContents` | Array of zero or more strings, or _something falsey_ | `['script', 'style', 'xml']` | These tags will be removed from opening tag up to closing tag, including content in-between opening and closing tags. Set it to something _falsey_ to turn it off.                      |
| `skipHtmlDecoding`               | Boolean                                              | `false`                      | By default, all escaped HTML entities for example `&pound;` input will be recursively decoded before HTML-stripping. You can turn it off here if you don't need it.                     |
| `returnRangesOnly`               | Boolean                                              | `false`                      | When set to `true`, only ranges will be returned. You can use them later in other [_range_- class libraries](https://github.com/search?q=topic%3Aranges+org%3Acodsen&type=Repositories) |
| `trimOnlySpaces`                 | Boolean                                              | `false`                      | Used mainly in automated setups. It ensures non-spaces are not trimmed from the outer edges of a string.                                                                                |
| `dumpLinkHrefsNearby`            | Boolean                                              | `false`                      | Used to retain HREF link URL's - handy when producing email Text versions.                                                                                                              |
| }                                |                                                      |                              |

The Optional Options Object is validated by [check-types-mini](https://bitbucket.org/codsen/check-types-mini), so please behave: the settings' values have to match the API and settings object should not have any extra keys, not defined in the API. Naughtiness will cause error `throw`s. I know, it's strict, but it prevents any API misconfigurations and helps to identify some errors early-on.

Here is the Optional Options Object in one place (in case you ever want to copy it whole):

```js
{
  ignoreTags: [],
  stripTogetherWithTheirContents: ["script", "style", "xml"],
  skipHtmlDecoding: false,
  returnRangesOnly: false,
  trimOnlySpaces: false,
  dumpLinkHrefsNearby: false
}
```

**[⬆ back to top](#markdown-header-string-strip-html)**

### API - Output

A string of zero or more characters.

## OPTS

### `opts.returnRangesOnly`

If you construct development tools, different libraries perform separate steps, and it's inefficient to transform the input string during each step. It's better to keep a _note_ what needs to be done, supplementing or editing notes along the pipeline. Finally, when the end is reached, _notes_ are used to process the result string.

Notes can be stored as _ranges_ - it's a fancy name for arrays of three arguments: `beginIndex`, `endIndex` and `whatToInsert`. First two correspond to [String.prototype.slice()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice) first two arguments. The third argument signifies what will be put in place of this string slice: if it's `undefined` (missing argument) or empty string — that slice will be deleted. If it's a string, its value will be placed instead of deleted slice.

All [_range_- class libraries](https://github.com/search?q=topic%3Aranges+org%3Acodsen&type=Repositories) adhere to this spec.

Now, `string-strip-html` can also return ranges instead of a final string.

**PS.** If you wonder how [Unicode problem](https://mathiasbynens.be/notes/javascript-unicode) affects _ranges_ concept — the answer is — they are not related. As long as you use JavaScript, all strings will use native JS string index system, the same which ranges use. Now it's your challenge is to put _correct_ ranges that mean intended string pieces.

**[⬆ back to top](#markdown-header-string-strip-html)**

### `opts.trimOnlySpaces`

> `Hi&nbsp;` &rarr; `Hi&nbsp;` instead of `Hi&nbsp;` &rarr; `Hi`

When using this tool in an automated fashion, for example, to process JSON, few JSON fields might comprise a single string. Often there are considerations on how that string is assembled. For example, imagine we "stitch" the sentence: `Hi John! Welcome to our club.` out of three pieces: `Hi` + `John` + `! + Welcome to our club.`. In this case, spaces between the chunks would be added by your templating engine. Now, imagine, the text is of a quite large `font-size`, and there's a risk of words wrapping at wrong places. A client asks you to ensure that `Hi` and `John` are **never split between the lines**.

What do you do?

You remove the space between `Hi` and `John` from the template and move it to data-level. You hard-code the non-breaking space after `Hi` — `Hi&nbsp;`.

As you know, this library trims the input before returning it, and recursive HTML decoding is always on. On default settings, this library would remove your non-breaking space from `Hi&nbsp;`. That's where you need to set `opts.trimOnlySpaces` to `true`.

In this particular case, you can either turn off HTML decoding OR, even better, use this `opts.trimOnlySpaces` setting.

In either case, whitespace between the detected tags will still be aggressively trimmed - `text <div>\n \t \r\n <br>\t \t \t</div> here` &rarr; `text here`.

When this setting is on, only spaces will be trimmed from outside; an algorithm will stop at first non-space character, in this case, non-breaking space:

```
"      &nbsp;     Hi! Please <div>shop now</div>!      &nbsp;      "
```

is turned into:

```
"&nbsp;     Hi! Please shop now!      &nbsp;"
```

Notice how space chunks between `nbsp`'s and text are retained when `opts.trimOnlySpaces` is set to `true`. But the default is `false`; this feature is off by default.

**[⬆ back to top](#markdown-header-string-strip-html)**

### `opts.dumpLinkHrefsNearby`

This feature is aimed at producing Text versions for promotional or transactional email campaigns.

If input string is has a linked text, URL will be put after it:

```html
I watch both <a href="https://www.rt.com" target="_blank">RT</a> and <a href="https://www.bbc.co.uk" target="_blank">BBC</a>.
```

it's turned into:

```html
I watch both RT https://www.rt.com and BBC https://www.bbc.co.uk.
```

But equally, any link on any tag, even one without text, will be retained:

```html
Codsen <div><a href="https://codsen.com" target="_blank"><img src="logo.png" width="100" height="100" border="0" style="display:block;" alt="Codsen logo"/></a></div>
```

it's turned into:

```
Codsen https://codsen.com
```

This feature is off by default; you need to turn it on, passing options object with a key `opts.dumpLinkHrefsNearby` set to `true`.

**[⬆ back to top](#markdown-header-string-strip-html)**

## Not assuming anything

Some HTML tag stripping libraries _assume_ that the input is always valid HTML and that intention of their libraries is sanitation of some mystical rogue visitor's input string. Hence, libraries just rip the brackets out and call it a day.

But those libraries assume too much - what if neither input nor output is not an HTML? What if HTML tag stripping library is used in a universal tool which accepts all kinds of text **and strips only and strictly only recognised HTML tags**? Like [Detergent](https://bitbucket.org/codsen/detergent) for example?

For the record, somebody might input `a < b and c > d` (clearly, not HTML) into Detergent with intention clean invisible characters before **to paste the result into Photoshop**. A user just wants to get rid of any invisible characters. There's not even a smell of HTML here. There's no rogue XSS injection and cross-site scripting. Notice there's even spaces around brackets! It's just that the cleaning tool is very _universal_ and just happens _to snuff out and remove HTML_.

This library does not assume anything, and its detection will interpret `a < b and c > d` as **not HTML**. Our competition, on the other hand, will strip `a < b and c > d` into `a d`.

But, if you think, a child can code up bracket-to-bracket removal library in 5 minutes. There's more to HTML stripping than just bracket-to-bracket.

Choose your HTML stripping tool wisely.

**[⬆ back to top](#markdown-header-string-strip-html)**

## Bigger picture

I scratched my itch, producing [Detergent](https://bitbucket.org/codsen/detergent) — I needed a tool to clean the text before pasting into HTML because clients would supply briefing documents in all possible forms and shapes and often text would contain invisible Unicode characters. I've been given: Excel files, PSD's, Illustrator files, PDF's and of course, good old "nothing" where I had to reference existing code.

Detergent would remove the excessive whitespace, invisible characters and improve the text's English style. Detergent would also take HTML as input — stripping the tags, cleaning the text and giving back ready-to-paste sentences. But most of the cases, Detergent's input is just a text. And not always it ends up in HTML.

In September 2017, [string.js](https://www.npmjs.com/package/string) which originally performed the HTML-stripping was discovered as having [vulnerabilities](https://snyk.io/vuln/npm:string).

I was able to quickly replace all functions that Detergent was consuming from `string.js` except **HTML-stripping**.

This library is the last missing piece of a puzzle to get rid of `string.js`.

**[⬆ back to top](#markdown-header-string-strip-html)**

## Contributing

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/string-strip-html/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/string-strip-html/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ back to top](#markdown-header-string-strip-html)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/string-strip-html.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-strip-html
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/string-strip-html
[cov-img]: https://coveralls.io/repos/bitbucket/codsen/string-strip-html/badge.svg?style=flat-square&branch=master
[cov-url]: https://coveralls.io/bitbucket/codsen/string-strip-html?branch=master
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-strip-html
[downloads-img]: https://img.shields.io/npm/dm/string-strip-html.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-strip-html
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-strip-html
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/string-strip-html
