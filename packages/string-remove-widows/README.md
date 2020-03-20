# string-remove-widows

> Helps to prevent widow words in a text

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
- [Features](#features)
- [API features](#api-features)
- [Usage](#usage)
- [API](#api)
- [More about `opts.targetLanguage`](#more-about-optstargetlanguage)
- [More about `opts.ignore`](#more-about-optsignore)
- [opts.tagRanges](#optstagranges)
- [Compared to competition on npm](#compared-to-competition-on-npm)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i string-remove-widows
```

Consume via a `require()`:

```js
const { removeWidows, defaultOpts, version } = require("string-remove-widows");
```

or as an ES Module:

```js
import { removeWidows, defaultOpts, version } from "string-remove-widows";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/string-remove-widows/dist/string-remove-widows.umd.js"></script>
```

```js
// in which case you get a global variable "stringRemoveWidows" which you consume like this:
const { removeWidows, defaultOpts, version } = stringRemoveWidows;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                               | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-remove-widows.cjs.js` | 17 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-remove-widows.esm.js` | 17 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-remove-widows.umd.js` | 33 KB |

**[⬆ back to top](#)**

## Idea

This library takes a string and removes [widow words](https://en.wikipedia.org/wiki/Widows_and_orphans), by replacing last space in the paragraph with [non-breaking space](http://www.fileformat.info/info/unicode/char/00a0/index.htm):

```html
Some text with many words on one&nbsp;line.
```

Also, optionally, it can replace spaces in front of dashes and between two parts of UK postcodes.

**[⬆ back to top](#)**

## Features

- Not just adds but if want, **removes** widow word prevention measures
- Tackles both paragraphs and single lines
- Recognises existing measures and if found, skips operation
- Option to encode for HTML, CSS or JS strings or put a raw non-breaking space
- Does not mangle the [line endings](https://stackoverflow.com/a/1552775/3943954) (Mac `LF`, Old style `CR` or Windows-style `CR LF`)
- A customisable minimum amount of words per line/paragraph to trigger widow word removal
- Can be used in different stages of the workflow: before HTML/CSS/JS-encoding or after
- Optionally replaces spaces with non-breaking spaces in front of all kinds of **dashes**
- Optionally replaces spaces with non-breaking spaces within **UK postcodes**
- Optionally it can skip content between templating tags, for example, Nunjucks `{{` and `}}` — presets are given for Jinja, Nunjucks, Liquid, Hexo and Hugo

**[⬆ back to top](#)**

## API features

- This program is a "string-in — string-out" style function — decoupled from DOM, web pages or UI or CLI or terminal or file system. Build those on top of this program.
- This program delivers three builds: _UMD_ (for websites), _CommonJS_ (for Node applications) and _ES Modules_ (for modern Node applications and evergreen browsers too)

This program is used by [detergent.js](https://www.npmjs.com/package/detergent).

**[⬆ back to top](#)**

## Usage

```js
const { removeWidows } = require("string-remove-widows");
```

## API

When you `require`/`import`, you get three things:

```js
const { removeWidows, defaultOpts, version } = require("string-remove-widows");
```

`removeWidows` is a function which does all the work.

`defaultOpts` is a plain object, all the default options.

`version` is a semver string like `1.0.0` brought straight from `package.json`.

**[⬆ back to top](#)**

### API - `removeWidows()` Input

`removeWidows` is a function; its API is the following:

| Input argument | Key value's type | Obligatory? | Description                  |
| -------------- | ---------------- | ----------- | ---------------------------- |
| `str`          | String           | yes         | String which we will process |
| `opts`         | Plain object     | no          | Put options here             |

**[⬆ back to top](#)**

### Optional Options Object

| Options Object's key            | The type of its value                                                     | Default | Description                                                                                                      |
| ------------------------------- | ------------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------- |
| {                               |                                                                           |         |                                                                                                                  |
| `removeWidowPreventionMeasures` | boolean                                                                   | `false` | If it's `true`, it will replace all widow word nbsp locations, with a single space                               |
| `convertEntities`               | boolean                                                                   | `true`  | If it's `false`, raw non-breaking space is inserted. If `true`, encoded in particular language (default HTML)    |
| `targetLanguage`                | string                                                                    | `html`  | Choose out of `html`, `css` or `js` — non-breaking spaces will be encoded in this language                       |
| `UKPostcodes`                   | boolean                                                                   | `false` | If enabled, every whitespace between two parts of UK postcodes will be replaced with non-breaking space          |
| `hyphens`                       | boolean                                                                   | `true`  | Whitespace in front of dashes (`-`), n-dashes (`–`) or m-dashes (`—`) will be replaced with a non-breaking space |
| `minWordCount`                  | natural number, `0` (disables feature), _falsey_ thing (disables feature) | `4`     | Minimum word count on a paragraph to trigger widow removal                                                       |
| `minCharCount`                  | natural number, `0` (disables feature), _falsey_ thing (disables feature) | `20`    | Minimum non-whitespace character count on a paragraph to trigger widow removal                                   |
| `ignore`                        | array of zero or more strings OR string                                   | `[]`    | List templating languages whose heads/tails will be recognised and skipped                                       |
| `reportProgressFunc`            | function or `null`                                                        | `null`  | If function is given, it will be pinged a natural number, for each percentage-done (in its first input argument) |
| `reportProgressFuncFrom`        | natural number or `0`                                                     | `0`     | Normally `reportProgressFunc()` reports percentages starting from zero, but you can set it to a custom value     |
| `reportProgressFuncTo`          | natural number                                                            | `100`   | Normally `reportProgressFunc()` reports percentages up to `100`, but you can set it to a custom value            |
| `tagRanges`                     | array of zero or more arrays                                              | `[]`    | If you know where the HTML tags are, provide string index ranges here                                            |
| }                               |                                                                           |         |                                                                                                                  |

Here it is, in one place, in case you want to copy-paste it somewhere:

```js
{
  removeWidowPreventionMeasures: false, // if enabled this function overrides everything else
  convertEntities: true, // encode?
  targetLanguage: "html", // encode in what? [html, css, js]
  UKPostcodes: false, // replace space in UK postcodes?
  hyphens: true, // replace space with non-breaking space in front of dash
  minWordCount: 4, // if there are less words than this in chunk, skip
  minCharCount: 20, // if there are less characters than this in chunk, skip
  ignore: [], // list zero or more templating languages: "jinja", "hugo", "hexo", OR "all"
  reportProgressFunc: null, // reporting progress function
  reportProgressFuncFrom: 0, // reporting percentages from this number
  reportProgressFuncTo: 100, // reporting percentages up to this number
  tagRanges: []
}
```

**[⬆ back to top](#)**

### API - `removeWidows()` Output

Function `removeWidows` returns a plain object; you pick the values from it:

| Key in a returned object | Key value's type                      | Description                                       |
| ------------------------ | ------------------------------------- | ------------------------------------------------- |
| `res`                    | String                                | Processed string                                  |
| `ranges`                 | Array of zero or more ranges (arrays) | Calculated ranges used to produce the `res`       |
| `log`                    | Plain object                          | See its format below                              |
| `whatWasDone`            | Plain object                          | Was it widow removal or just decoding performed ? |

for example, here's how the output could look like:

```js
{
  res: "Lorem ipsum dolor sit&nbsp;amet",
  ranges: [
    [21, 27, "&nbsp;"]
  ],
  log: {
    timeTakenInMiliseconds: 42
  },
  whatWasDone: {
    removeWidows: true,
    convertEntities: false
  }
}
```

**[⬆ back to top](#)**

## More about `opts.targetLanguage`

Not all text ends up in HTML. As you know, you can inject the content via CSS pseudo attributes and also text might be prepared to be pasted into JSON.

This program allows you to customise the target encoding for chosen language: `html`, `css` or `js`.

Here's an HTML with HTML-encoded non-breaking space:

```html
Some raw text in a very long&nbsp;line.
```

Here's CSS analogue:

```css
span:before {
  content: "Some raw text in a very long\00A0line.";
}
```

Here's JavaScript analogue:

```js
alert("Some raw text in a very long\u00A0line.");
```

For example, a minimal application would look like this:

```js
const { removeWidows } = require("string-remove-widows");
// second input argument is a plain object, the Optional Options Object:
const result = removeWidows("Some raw text in a very long line.", {
  targetLanguage: "css"
});
// now the widow words will be prevented considering that content will go to CSS content:
console.log(result);
// => "Some raw text in a very long\00A0line."
```

**[⬆ back to top](#)**

## More about `opts.ignore`

Very often text already contains templating language literals.

For example, this Nunjucks snippet:

```nunjucks
Hi{% if data.firstName %} data.firstName{% endif %}!
```

We intend to either say `Hi John!` to customer John or just `Hi!` if we don't know the customer's name.

But if we run widow words removal on this piece of text, **we don't want** `&nbsp;` inserted into the middle of `endif`:

```nunjucks
Hi{% if data.firstName %} data.firstName{% endif&nbsp;%}!
                                                ^^^^^^
```

That's where `opts.ignore` comes in. You can list heads/tails (chunks from which to start ignoring/where to stop) manually:

```js
const { removeWidows } = require("string-remove-widows");
const result = removeWidows("Here is a very long line of text", {
  targetLanguage: "html",
  ignore: [
    {
      heads: "{{",
      tails: "}}"
    },
    {
      heads: ["{% if", "{%- if"],
      tails: ["{% endif", "{%- endif"]
    }
  ]
});
```

or you can just pick a template:

```
all
jinja
nunjucks
liquid
hugo
hexo
```

for example:

```js
const { removeWidows } = require("string-remove-widows");
const result = removeWidows("Here is a very long line of text", {
  targetLanguage: "html",
  ignore: "jinja"
});
```

If you want widest support of literals, all languages at once, put "all".

**[⬆ back to top](#)**

## opts.tagRanges

Sometimes input string can contain HTML tags. We didn't go that far as to code up full HTML tag recognition, more so that such thing would duplicate already existing libraries, namely, `string-strip-html` ([npm](https://www.npmjs.com/package/string-strip-html), [monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/string-strip-html)).

`opts.tagRanges` accepts known HTML tag ranges (or, in fact, any "black spots" to skip):

```js
const strip = require("string-strip-html");
const { removeWidows } = require("string-remove-widows");

const input = `something in front here <a style="display: block;">x</a> <b style="display: block;">y</b>`;
// first, gung-ho approach - no tag locations provided:
const res1 = removeWidows(input).res;
console.log(res1);
// => something in front here <a style="display: block;">x</a> <b style="display:&nbsp;block;">y</b>
//                                                                               ^^^^^^
//                                      notice how non-breaking space is wrongly put inside the tag
//
// but, if you provide the tag ranges, program works correctly:
const tagRanges = stripHtml(input, { returnRangesOnly: true });
console.log(JSON.stringify(knownHTMLTagRanges, null, 4));
// => [[24, 51], [52, 56], [57, 84], [85, 89]]
// now, plug the tag ranges into opts.tagRanges:
const res2 = removeWidows(input, { tagRanges }).res;
console.log(res2);
// => something in front here <a style="display: block;">x</a>&nbsp;<b style="display: block;">y</b>
```

**[⬆ back to top](#)**

## Compared to competition on npm

In life, anything _professional_ (as opposed to _amateur_) means _an excess_.

🏋️ Professional weightlifting — _excessive_ weights by _normal peoples'_ standards.

👨‍🍳 Professional cooking — making 50 three-course dinners _at once_ — mildly speaking, _excessive_ — by "normal peoples" kitchen standards and so on.

📝 Professional preparing of marketing materials — websites and email templates — is also somewhat full of excesses. Millions of emails sent, hundreds of web pages managed, thousands of products listed. The more features your tool has, the more capabilities you have.

For example, you might need to copy some text from _PSD_, clean invisible characters, encode it in CSS, prevent widow words and paste it into pseudo-element in a .SCSS file. That's one click on [Detergent.io](https://detergent.io) and the **widow word prevention part** would be done by this program.

Supporting CSS and JS encoding besides only HTML is one of many features of this program which distinguishes it from the competition:

|                                                                                         | This program, <br> [`string-remove-widows`](https://www.npmjs.com/package/string-remove-widows)                                            | [`widow-js`](https://www.npmjs.com/package/widow-js)                                                               | [`@simmo/widower`](https://www.npmjs.com/package/@simmo/widower)                                                               |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
|                                                                                         | [![npm link](https://img.shields.io/npm/v/string-remove-widows.svg?style=flat-square)](https://www.npmjs.com/package/string-remove-widows) | [![npm link](https://img.shields.io/npm/v/widow-js.svg?style=flat-square)](https://www.npmjs.com/package/widow-js) | [![npm link](https://img.shields.io/npm/v/@simmo/widower.svg?style=flat-square)](https://www.npmjs.com/package/@simmo/widower) |
| Can both add and remove `nbsp`s                                                         | ✅                                                                                                                                         | ❌                                                                                                                 | ❌                                                                                                                             |
| Option to choose between raw, HTML, CSS or JS-encoded `nbsp`s                           | ✅                                                                                                                                         | ❌                                                                                                                 | ❌                                                                                                                             |
| Can replace spaces in front of hyphens, n- and m-dashes                                 | ✅                                                                                                                                         | ❌                                                                                                                 | ❌                                                                                                                             |
| Can prepare UK postcodes                                                                | ✅                                                                                                                                         | ❌                                                                                                                 | ❌                                                                                                                             |
| Does not mangle different types of line endings (`LF`, `CRLF`, `CR`)                    | ✅                                                                                                                                         | ✅                                                                                                                 | ✅                                                                                                                             |
| Customisable minimal word count threshold                                               | ✅                                                                                                                                         | ✅                                                                                                                 | ❌                                                                                                                             |
| Customisable minimal character count threshold                                          | ✅                                                                                                                                         | ❌                                                                                                                 | ❌                                                                                                                             |
| Progress reporting function for web worker web apps                                     | ✅                                                                                                                                         | ❌                                                                                                                 | ❌                                                                                                                             |
| Reports string index ranges of what was done                                            | ✅                                                                                                                                         | ❌                                                                                                                 | ❌                                                                                                                             |
| Non-breaking space location's whitespace does not necessarily have to be a single space | ✅                                                                                                                                         | ❌                                                                                                                 | ❌                                                                                                                             |
| Presets for Jinja, Nunjucks, Liquid, Hugo and Hexo templating languages                 | ✅                                                                                                                                         | ❌                                                                                                                 | ❌                                                                                                                             |
| Decoupled API^                                                                          | ✅                                                                                                                                         | ❌                                                                                                                 | ✅                                                                                                                             |
| CommonJS build                                                                          | ✅                                                                                                                                         | ❌                                                                                                                 | ✅                                                                                                                             |
| ES Modules build                                                                        | ✅                                                                                                                                         | ❌                                                                                                                 | ❌                                                                                                                             |
| UMD build for browser                                                                   | ✅                                                                                                                                         | ✅                                                                                                                 | ❌                                                                                                                             |
| Can process live DOM of a web page                                                      | ❌                                                                                                                                         | ✅                                                                                                                 | ❌                                                                                                                             |
| Licence                                                                                 | MIT                                                                                                                                        | ISC                                                                                                                | MIT                                                                                                                            |

^ A _decoupled_ API means that at its core, the program is a function "_string-in, string-out_" and is not coupled with DOM, file I/O, network or other unrelated operations. Such API makes it easier to test and create many different applications **on top** of a decoupled API.

For example, our competitor [widow.js](https://www.npmjs.com/package/widow-js) has two coupled parts: 1. API which does string-in, string-out, and 2. DOM processing functions. It could have been two npm libraries. In the end, people who don't need DOM operations can't use it.

One decoupled, "_string-in, string-out_" library like `string-remove-widows` might power all these at once:

- Web page DOM-manipulation library
- a CLI application to process files or piped streams
- an Express REST endpoint on a server,
- a serverless lambda on AWS,
- an Electron desktop program

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-remove-widows%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-remove-widows%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-remove-widows%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-remove-widows%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-remove-widows%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-remove-widows%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-remove-widows
[cov-img]: https://img.shields.io/badge/coverage-90.3%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-remove-widows
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-remove-widows
[downloads-img]: https://img.shields.io/npm/dm/string-remove-widows.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-remove-widows
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-remove-widows
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
