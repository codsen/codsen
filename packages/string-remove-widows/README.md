# string-remove-widows

> Helps to prevent widow words in text

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
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
- [`opts.language`](#optslanguage)
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

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/string-remove-widows.cjs.js` | 19 KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/string-remove-widows.esm.js` | 18 KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/string-remove-widows.umd.js` | 50 KB

**[⬆ back to top](#)**

## Idea

This library takes a string and removes [widow words](https://en.wikipedia.org/wiki/Widows_and_orphans), by replacing last space in the paragraph with [non-breaking space](http://www.fileformat.info/info/unicode/char/00a0/index.htm):

```html
Some text with many words on one&nbsp;line.
```

**This program's aim: **

to be the most comprehensive widow word removal program that humanity has ever conceived.

**[⬆ back to top](#)**

## Features

- Not just adds but if want, **removes** widow word prevention measures
- Recognises existing measures and if found, skips operation (on that paragraph)
- Option to encode non-breaking space in various ways (character-encode for HTML, CSS or JS strings)
- Tackles both paragraphs and single lines
- Does not mangle the [line endings](https://stackoverflow.com/a/1552775/3943954) (Mac `LF`, Old style `CR` or Windows style `CR LF`)
- Customiseable minimum amount of words per line/paragraph to trigger widow word removal
- Can be used in different stages of the workflow: before HTML/CSS/JS-encoding or after
- Optionally replaces spaces with non-breaking spaces in front of all kinds of **dashes**
- Optionally replaces spaces with non-breaking spaces within **UK postcodes**

**[⬆ back to top](#)**

## API features

- This program is a "string-in — string-out" function — decoupled from DOM, web pages or UI or CLI or terminal or file system
- This program delivers 3 builds: _UMD_ (for websites), _CommonJS_ (for Node applications) and _ES Modules_ (for modern Node applications and evergreen browsers too)

This program is used by [detergent.js](https://www.npmjs.com/package/detergent).

**[⬆ back to top](#)**

## Usage

```js
const { removeWidows } = require("string-remove-widows");
```

## API

When you `require`/`import`, you get two things:

```js
const { removeWidows, version } = require("string-remove-widows");
```

### API - `removeWidows()` Input

`removeWidows` is a function, its API is the following:

| Input argument | Key value's type | Obligatory? | Description                  |
| -------------- | ---------------- | ----------- | ---------------------------- |
| `str`          | String           | yes         | String which we will process |
| `opts`         | Plain object     | no          | Put options here             |

**[⬆ back to top](#)**

### Optional Options Object

convertEntities
hyphens
language

| Options Object's key | The type of its value | Default | Description                                                                                                   |
| -------------------- | --------------------- | ------- | ------------------------------------------------------------------------------------------------------------- |
| {                    |                       |         |                                                                                                               |
| `convertEntities`    | boolean               | `true`  | If it's `false`, raw non-breaking space is inserted. If `true`, encoded in particular language (default HTML) |
| }                    |                       |         |                                                                                                               |

Here it is, in one place, in case you want to copy-paste it somewhere:

```js
{
  convertEntities: true;
}
```

**[⬆ back to top](#)**

### API - `removeWidows()` Output

## `opts.language`

Not all text ends up in HTML. As you know, you can inject the content via CSS pseudo attributes and also text might end up in JavaScript code.

This program allows you customise the target encoding for chosen language: `html`, `css` or `js`

Here's HTML with HTML-encoded non-breaking space:

```html
Some raw text in a very long&nbsp;line.
```

Here's CSS with CSS-encoded non-breaking space:

```css
span:before {
  content: "\00A0";
}
```

Here's JavaScript with JS-encoded non-breaking space:

```js
alert("The hex \u00A0 renders as HTML entity &#160;");
```

Here's how to set it:

```js
const { removeWidows } = require("string-remove-widows");
// second input argument is a plain object, the Optional Options Object:
const result = removeWidows("Here is a very long line of text", {
  language: "css"
});
// now the widow words will be prevented considering that content will go to CSS content:
console.log(result);
// => "Here is a very long line of\00A0text"
```

**[⬆ back to top](#)**

## Compared to competition on npm

In life, anything professional (as opposed to amateur) means _an excess_. Professional weightlifting — excessive weights by "normal peoples" standards. Professional cooking — making 50 dinners in one go — mildly speaking, excessive by "normal peoples" kitchen standards and so on.

In this program, we aim at professional use — all the features you might ever need, API decoupled from DOM operations (or whatever), distributions for all platforms (UMD script for web page, CommonJS and ESModules for modern builds with treeshaking etc). Here's how it compares to alternatives from npm:

|                                                              | [`string-remove-widows`](https://www.npmjs.com/package/string-remove-widows)                                                               | [`widow-js`](https://www.npmjs.com/package/widow-js)                                                               | [`@simmo/widower`](https://www.npmjs.com/package/@simmo/widower)                                                               |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| npm link                                                     | [![npm link](https://img.shields.io/npm/v/string-remove-widows.svg?style=flat-square)](https://www.npmjs.com/package/string-remove-widows) | [![npm link](https://img.shields.io/npm/v/widow-js.svg?style=flat-square)](https://www.npmjs.com/package/widow-js) | [![npm link](https://img.shields.io/npm/v/@simmo/widower.svg?style=flat-square)](https://www.npmjs.com/package/@simmo/widower) |
| Can both add and remove `nbsp`s                              | ✅                                                                                                                                         | ❌                                                                                                                 | ❌                                                                                                                             |
| Option to choose between raw, HTML, CSS or JS-encoded `nbsp` | ✅                                                                                                                                         | ❌                                                                                                                 | ❌                                                                                                                             |
| Can replace spaces in front of hyphens, n- and m-dashes      | ✅                                                                                                                                         | ❌                                                                                                                 | ❌                                                                                                                             |
| Does not mangle different types of line endings (`LF`, `CRLF`, `CR`) | ✅                                                                                                                                         | ✅                                                                                                                 | ❌                                                                                                                             |
| Customiseable minimal word count threshold                   | ✅                                                                                                                                         | ✅                                                                                                                 | ❌                                                                                                                             |
| Customiseable minimal character count threshold              | ✅                                                                                                                                         | ❌                                                                                                                 | ❌                                                                                                                             |
| Progress reporting function for web worker webapps           | ✅                                                                                                                                         | ❌                                                                                                                 | ❌                                                                                                                             |
| Reports string index ranges of what was done | ✅                                                                                                                                         | ❌                                                                                                                 | ❌                                                                                                                             |
| Replaces two spaces or a tab | ✅                                                                                                                                         | ❌                                                                                                                 | ❌                                                                                                                             |
| Decoupled API^                                               | ✅                                                                                                                                         | ❌                                                                                                                 | ✅                                                                                                                             |
| CommonJS build                                               | ✅                                                                                                                                         | ❌                                                                                                                 | ✅                                                                                                                             |
| ES Modules build                                             | ✅                                                                                                                                         | ❌                                                                                                                 | ❌                                                                                                                             |
| UMD build for browser                                        | ✅                                                                                                                                         | ✅                                                                                                                 | ❌                                                                                                                             |
| Licence                                                      | MIT                                                                                                                                        | ISC                                                                                                                | MIT                                                                                                                            |

^ A _decoupled_ API means that at its core, program is a function "_string-in, string-out_" and is not coupled with DOM, file I/O, network or other unrelated operations. This makes it easier to test and create many other applications **on top** of a decoupled API.

One "_string-in, string-out_" library might power a CLI application, an Express REST endpoint on a server, an Electron desktop program and of course, DOM-manipulation library with IIFE's for the dynamic front-end web page manipulation.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-remove-widows%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-remove-widows%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-remove-widows%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-remove-widows%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-remove-widows%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-remove-widows%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/string-remove-widows.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-remove-widows
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-remove-widows
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
