# string-strip-html

> Strips HTML tags from strings. Detects legit unencoded brackets.

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Install

```bash
npm i string-strip-html
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`stripHtml`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const stripHtml = require("string-strip-html");
```

or as an ES Module:

```js
import stripHtml from "string-strip-html";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/string-strip-html/dist/string-strip-html.umd.js"></script>
```

```js
// in which case you get a global variable "stringStripHtml" which you consume like this:
const stripHtml = stringStripHtml;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                            | Size   |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------- | ------ |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-strip-html.cjs.js` | 31 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-strip-html.esm.js` | 33 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-strip-html.umd.js` | 103 KB |

**[⬆ back to top](#)**

## Use it

```js
const stripHtml = require("string-strip-html");
// it does not assume the output must be always HTML and detects legit brackets:
console.log(stripHtml("a < b and c > d")); // => 'a < b and c > d'
// leaves content between tags:
console.log(stripHtml("Some text <b>and</b> text.")); // => 'Some text and text.'
// adds spaces to prevent accidental string concatenation
console.log(stripHtml("aaa<div>bbb</div>ccc")); // => 'aaa bbb ccc'
```

**[⬆ back to top](#)**

## Table of Contents

- [Install](#install)
- [Use it](#use-it)
- [Purpose](#purpose)
- [Features](#features)
- [API](#api)
- [Options](#options)
- [Not assuming anything](#not-assuming-anything)
- [A bigger picture](#a-bigger-picture)
- [Contributing](#contributing)
- [Licence](#licence)

## Purpose

This library only detects and removes HTML tags from strings (text, in other words). Not more, not less. If something is deemed to be not a tag, it will not be removed. The bar is set higher than browsers - we aim to tackle as much broken code as possible so that later everything will work on browsers. This library is a development tool.

**[⬆ back to top](#)**

## Features

- Can be used to generate Email Text versions. Any URL links can be extracted and put after a previously linked element.
- Works when opening or closing tag bracket is missing on some tags.
- It can detect and skip false positives, for example, `a < b and c > d`.
- Works on dirty code - duplicate brackets, whitespace after opening bracket, messed up closing slashes — you name it, we will aim to tackle them.
- Adds spaces or line breaks to prevent concatenation. Except where punctuation characters follow.
- Can remove tags with all the content between opening and closing tag, for example `<style>...</style>` or `<script>...</script>`
- Uses recursive HTML decoding, so there's no way to cheat this library by using any kind of HTML encoding (unless you turn the decoding off via `opts.skipHtmlDecoding`)
- It doesn't assume anything about the input source or purpose of the output string

**[⬆ back to top](#)**

## API

String-in string-out, with optional second input argument - an Optional Options Object.

### API - Input

| Input argument | Type         | Obligatory? | Description                                        |
| -------------- | ------------ | ----------- | -------------------------------------------------- |
| `input`        | String       | yes         | Text you want to strip HTML tags from              |
| `opts`         | Plain object | no          | The Optional Options Object, see below for its API |

If input arguments are supplied have any other types, an error will be `throw`n.

**[⬆ back to top](#)**

### Optional Options Object

| An Optional Options Object's key | Type of its value                                    | Default                      | Description                                                                                                                                                            |
| -------------------------------- | ---------------------------------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| {                                |                                                      |                              |
| `ignoreTags`                     | Array of zero or more strings                        | `[]`                         | These tags will not be removed                                                                                                                                         |
| `onlyStripTags`                  | Array of zero or more strings                        | `[]`                         | If one or more tag names are given here, only these tags will be stripped, nothing else                                                                                |
| `stripTogetherWithTheirContents` | Array of zero or more strings, or _something falsey_ | `['script', 'style', 'xml']` | These tags will be removed from the opening tag up to closing tag, including content in-between opening and closing tags. Set it to something _falsey_ to turn it off. |
| `skipHtmlDecoding`               | Boolean                                              | `false`                      | By default, all escaped HTML entities for example `&pound;` input will be recursively decoded before HTML-stripping. You can turn it off here if you don't need it.    |
| `returnRangesOnly`               | Boolean                                              | `false`                      | When set to `true`, only ranges will be returned. You can use them later in other [_range_- class libraries](https://gitlab.com/codsen/codsen#-range-libraries)        |
| `trimOnlySpaces`                 | Boolean                                              | `false`                      | Used mainly in automated setups. It ensures non-spaces are not trimmed from the outer edges of a string.                                                               |
| `dumpLinkHrefsNearby`            | Plain object or something _falsey_                   | `false`                      | Used to customise the output of link URL's: to enable the feature, also customise the URL location and wrapping.                                                       |
| }                                |                                                      |                              |

**[⬆ back to top](#)**

### opts.dumpLinkHrefsNearby - plain object

| opts.dumpLinkHrefsNearby key | default value | purpose                                                                                                                                                                                                    |
| ---------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enabled                      | `false`       | by default, this function is disabled - URL's are not inserted nearby. Set it to Boolean `true` to enable it.                                                                                              |
| putOnNewLine                 | `false`       | By default, URL is inserted after any whatever was left after stripping the particular linked piece of code. If you want, you can force all inserted URL's to be on a new line, separated by a blank line. |
| wrapHeads                    | `""`          | This string (default is an empty string) will be inserted in front of every URL. Set it to any string you want, for example `[`.                                                                           |
| wrapTails                    | `""`          | This string (default is an empty string) will be inserted straight after every URL. Set it to any string you want, for example `]`.                                                                        |

**[⬆ back to top](#)**

### Opts Validation

The Optional Options Object is not validated; please take care of what values and of what type you pass.

Here is the Optional Options Object in one place (in case you ever want to copy it whole):

```js
{
  ignoreTags: [],
  onlyStripTags: [],
  stripTogetherWithTheirContents: ["script", "style", "xml"],
  skipHtmlDecoding: false,
  returnRangesOnly: false,
  trimOnlySpaces: false,
  dumpLinkHrefsNearby: {
    enabled: false,
    putOnNewLine: false,
    wrapHeads: "",
    wrapTails: ""
  }
}
```

**[⬆ back to top](#)**

### API - Output

A string of zero or more characters, with all HTML entities (both _named_, like `&nbsp;` and _numeric_, like `&#x20;`) recursively decoded. _Recursive decoding_ means that twice-encoded `&amp;nbsp;` would still get decoded. There's no way the tags can get past with the help of encoding.

**[⬆ back to top](#)**

## Options

### `opts.returnRangesOnly`

If you construct development tools, different libraries perform separate steps, and it's inefficient to transform the input string during each step. It's better to keep a _note_ what needs to be done, supplementing or editing notes along the pipeline. Finally, when the end is reached, _notes_ are used to process the result string.

Notes can be stored as _ranges_ - it's a fancy name for arrays of three arguments: `beginIndex`, `endIndex` and `whatToInsert`. First two correspond to [String.prototype.slice()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice) first two arguments. The third argument signifies what will be put in place of this string slice: if it's `undefined` (missing argument) or empty string — that slice will be deleted. If it's a string, its value will be placed instead of a deleted slice.

All our [_range_- class libraries](https://gitlab.com/codsen/codsen#-range-libraries) adhere to this spec.

Now, `string-strip-html` can also return ranges instead of a final string.

**PS.** If you wonder how [Unicode problem](https://mathiasbynens.be/notes/javascript-unicode) affects _ranges_ concept — the answer is — they are not related. As long as you use JavaScript, all strings will use native JS string index system, the same which ranges use. Now it's your challenge to put _correct_ ranges that mean intended string pieces.

**[⬆ back to top](#)**

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

**[⬆ back to top](#)**

### `opts.dumpLinkHrefsNearby`

This feature is aimed at producing Text versions for promotional or transactional email campaigns.

If input string is has a linked text, URL will be put after it:

```html
I watch both <a href="https://www.rt.com" target="_blank">RT</a> and
<a href="https://www.bbc.co.uk" target="_blank">BBC</a>.
```

it's turned into:

```html
I watch both RT https://www.rt.com and BBC https://www.bbc.co.uk.
```

But equally, any link on any tag, even one without text, will be retained:

```html
Codsen
<div>
  <a href="https://codsen.com" target="_blank"
    ><img
      src="logo.png"
      width="100"
      height="100"
      border="0"
      style="display:block;"
      alt="Codsen logo"
  /></a>
</div>
```

it's turned into:

```
Codsen https://codsen.com
```

This feature is off by default; you need to turn it on, passing options object with a key `opts.dumpLinkHrefsNearby` set to `true`.

**[⬆ back to top](#)**

### `opts.onlyStripTags`

Sometimes you want to strip only certain HTML tag or tags. It would be impractical to ignore all other known HTML tags and leave those you want. Option `opts.onlyStripTags` allows inverting the setting: whatever tags you list will be the only tags removed.

`opts.onlyStripTags` is an array. When a program starts, it will filter out any empty strings and strings that can be `String.trim()`'ed to zero-length string. It's necessary because a presence on just one string in `opts.onlyStripTags` will switch this application to `delete-only-these` mode and it would be bad if empty, falsey or whitespace string value would accidentally cause it.

This option can work in combination with `opts.ignoreTags`. Any tags listed in `opts.ignoreTags` will be removed from the tags, listed in `opts.onlyStripTags`. If there was one or more tag listed in `opts.onlyStripTags`, the `delete-only-these` mode will be on and will be respected, even if there will be no tags to remove because all were excluded in `opts.onlyStripTags`.

**[⬆ back to top](#)**

### `opts.cb`

Sometimes you want more control over the program: maybe you want to strip only certain tags and write your own custom conditions, maybe you want to do something extra on tags which are being ignored, for example, fix whitespace within them?

You can get this level of control using `opts.cb`. In options object, under key's `cb` value, put a function. Whenever this program wants to do something, it will call your function, `Array.forEach(key => {})`-style. Instead of `key` you get a plain object with the following keys:

```js
const cb = ({
  tag,
  deleteFrom,
  deleteTo,
  insert,
  rangesArr,
  proposedReturn
}) => {
  // default action which does nothing different from normal, non-callback operation
  rangesArr.push(deleteFrom, deleteTo, insert);
  // you might want to do something different, depending on "tag" contents.
};
const result = stripHtml("abc<hr>def", { cb });
```

The `tag` key contains all the internal data for the particular tag which is being removed. Feel free to `console.log(JSON.stringify(tag, null, 4))` it and tap its contents.

**[⬆ back to top](#)**

### cb() example one

The point of this callback interface is to pass the action of pushing of ranges to a user, as opposed to a program. The program will suggest you what it would push to final ranges array, but it's up to you to perform the pushing.

Below, the program "does nothing", that is, you push what it proposes, "proposedReturn" array:

```js
const cb = ({
  tag,
  deleteFrom,
  deleteTo,
  insert,
  rangesArr,
  proposedReturn
}) => {
  rangesArr.push(deleteFrom, deleteTo, insert);
};
const res1 = stripHtml("abc<hr>def", { cb });
console.log(res1);
// => "abc def"

// you can request ranges instead:
const res2 = stripHtml("abc<hr>def", { returnRangesOnly: true, cb });
console.log(res2);
// => [[3, 7, " "]]
```

**[⬆ back to top](#)**

### cb() example two

In the example below, we are going to use one of the keys of the `tag`, the `tag.slashPresent` which tells is there a closing slash on this tag or not.

For example, considering input with some rogue whitspace, `<div >abc</ div>`, replace all `div` with `tralala`, minding the closing slash:

```js
const stripHtml = require("string-strip-html");
// define a callback as a separate variable if you are going to use it multiple times:
const cb = ({
  tag,
  deleteFrom,
  deleteTo,
  // insert,
  rangesArr
  // proposedReturn
}) => {
  rangesArr.push(
    deleteFrom,
    deleteTo,
    `<${tag.slashPresent ? "/" : ""}tralala>`
  );
};
const res1 = stripHtml("<div >abc</ div>", { cb });
console.log(`res1 = "${res1}"`);
// res1 = "<tralala>abc</tralala>"

const res2 = stripHtml("<div >abc</ div>", {
  returnRangesOnly: true,
  cb
});
console.log(`res2 = ${JSON.stringify(res2, null, 4)}`);
// res2 = [
//   [0, 6, "<tralala>"],
//   [9, 16, "</tralala>"]
// ]
```

**[⬆ back to top](#)**

## Not assuming anything

Some HTML tag stripping libraries _assume_ that the input is always valid HTML and that intention of their libraries is sanitation of some mystical rogue visitor's input string. Hence, libraries just rip the brackets out and call it a day.

But those libraries assume too much - what if neither input nor output is not an HTML? What if HTML tag stripping library is used in a universal tool which accepts all kinds of text **and strips only and strictly only recognised HTML tags**? Like [Detergent](https://gitlab.com/codsen/codsen/tree/master/packages/detergent) for example?

For the record, somebody might input `a < b and c > d` (clearly, not HTML) into Detergent with intention clean invisible characters before **pasting the result into Photoshop**. A user just wants to get rid of any invisible characters. There's not even a smell of HTML here. There's no rogue XSS injection or cross-site scripting. Notice there are even spaces around brackets! Even Chrome will interpret `a < b and c > d` as text. I believe we should not delete `a < b and c > d` from a text when stripping the HTML. However, [other](https://www.npmjs.com/package/striptags) [HTML](https://www.npmjs.com/package/strip-html-tags) [stripping](https://www.npmjs.com/package/htmlstrip-native) libraries find excuses to think differently.

This library does not assume anything, and its detection will interpret `a < b and c > d` as **not HTML**. Our competition, on the other hand, will strip `a < b and c > d` into `a d`.

But, if you think, a child can code up bracket-to-bracket removal library in 5 minutes. There's more to HTML stripping than just bracket-to-bracket.

Choose your HTML stripping tool wisely.

**[⬆ back to top](#)**

## A bigger picture

I scratched my itch, producing [Detergent](https://gitlab.com/codsen/codsen/tree/master/packages/detergent) — I needed a tool to clean the text before pasting into HTML because clients would supply briefing documents in all possible forms and shapes and often text would contain invisible Unicode characters. I've been given: Excel files, PSD's, Illustrator files, PDF's and of course, good old "nothing" where I had to reference existing code.

Detergent would remove the excessive whitespace, invisible characters and improve the text's English style. Detergent would also take HTML as input — stripping the tags, cleaning the text and giving back ready-to-paste sentences. But most of the cases, Detergent's input is just a text. And not always it ends up in HTML.

In September 2017, [string.js](https://www.npmjs.com/package/string) which originally performed the HTML-stripping was discovered as having [vulnerabilities](https://snyk.io/vuln/npm:string).

I was able to quickly replace all functions that Detergent was consuming from `string.js` except **HTML-stripping**.

This library is the last missing piece of a puzzle to get rid of `string.js`.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-strip-html%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-strip-html%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-strip-html%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-strip-html%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-strip-html%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-strip-html%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/string-strip-html.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-strip-html
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-strip-html
[cov-img]: https://img.shields.io/badge/coverage-91.69%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-strip-html
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-strip-html
[downloads-img]: https://img.shields.io/npm/dm/string-strip-html.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-strip-html
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-strip-html
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
