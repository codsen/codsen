<div align="center">
  <img alt="HTML Crush" src="https://glcdn.githack.com/codsen/codsen/raw/master/packages/html-crush/media/repo_logo.png" width="480" align="center">
</div>

<div align="center"><p>Minifies HTML/CSS: valid or broken, pure or mixed with other languages</p></div>

[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

<div align="center"><p>Online web app: <a href="https://htmlcrush.com">htmlcrush.com</a></p></div>

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [TLDR;](#tldr)
- [Features](#features)
- [API - Input](#api-input)
- [API - Output](#api-output)
- [Non-deterministic unit tests](#non-deterministic-unit-tests)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i html-crush
```

Consume via a `require()`:

```js
const { crush, defaults, version } = require("html-crush");
```

or as an ES Module:

```js
import { crush, defaults, version } from "html-crush";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/html-crush/dist/html-crush.umd.js"></script>
```

```js
// in which case you get a global variable "htmlCrush" which you consume like this:
const { crush, defaults, version } = htmlCrush;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                     | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------ | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/html-crush.cjs.js` | 29 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/html-crush.esm.js` | 29 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/html-crush.umd.js` | 42 KB |

**[⬆ back to top](#)**

## Usage

```js
const { crush } = require("html-crush");
const res = crush(
  `  <a>
     <b>
   c </b>
   </a>
     <a>
     <b>
   c </b>
   </a>
     <a>
     <b>
   c </b>
   </a>`,
  { removeLineBreaks: true, lineLengthLimit: 8 }
).result;
console.log("res:\n" + JSON.stringify(res, null, 4));
// => "res:
// <a><b> c
// </b></a>
// <a><b> c
// </b></a>
// <a><b> c
// </b></a>
// "
```

**[⬆ back to top](#)**

## TLDR;

Let's minify any input (preferably but not necessarily HTML) without parsing, and do it according to how HTML interprets the whitespace.

We built this minifier so that we were able to minify email templates containing Nunjucks template literals, for example, `{% if order.price < 50 %}` (notice the bracket). Other tools on the market will fail upon first encounter of non-HTML code.

**[⬆ back to top](#)**

## Features

This program:

- Does not parse the input — input can be (X)HTML or whatever or mixed with whatever
- Equally, the input can be with HTML errors, broken HTML, incomplete HTML or not-quite-HTML or whatever
- Mailchimp, Responsys, Exact Target, Campaign Monitor tags in your HTML - all fine

As a side priority, this application also takes into consideration **human-friendliness**:

1. Its API (this npm library) reports progress and its GUI front-end https://htmlcrush.com utilises it to allow a responsive UI
2. We deliberately keep options count under [7](https://en.wikipedia.org/wiki/The_Magical_Number_Seven,_Plus_or_Minus_Two)
3. GUI also considers white and dark interfaces, use of modern toggle switches, CSS hovers to react to any interaction
4. API (this library) considers giving all possible JavaScript use choices: CommonJS transpiled to ES5, modern untranspiled ES Modules code in ES6, and UMD transpiled to ES5 with all dependencies baked-in, all published to npm and accessible via [unpkg](https://unpkg.com/html-crush) CDN
5. Developer friendliness - source is fully set up with `console.log`s which report the line numbers and all actions as they happen. Production builds (`dist/`) strip all logging, of course. This means it's easy to come back later or the first time and debug the code

**[⬆ back to top](#)**

## API - Input

This library exports a plain object where main function is under a key "crush". That's why you consume it like this:

```js
import { crush, defaults, version } from "html-crush";
```

Once you get the function, `crush`, it's API is the following:

**crush(str, \[opts])** — in other words, two arguments:

1. first argument — string,
2. optional (marked with square brackets above) second argument — options — a plain object

| Input argument | Key value's type | Obligatory? | Description                                        |
| -------------- | ---------------- | ----------- | -------------------------------------------------- |
| `str`          | String           | yes         | The input string of zero or more characters        |
| `opts`         | Plain object     | no          | An Optional Options Object. See below for its API. |

If supplied input arguments are of any other types, an error will be thrown.

**[⬆ back to top](#)**

## API - Output

The function exported under key `crush` will return **a plain object** where you'll find log data, result string and corresponding string ranges of all actions performed:

| Key's name | Key value's type                          | Description                                                                                                                       |
| ---------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `log`      | Plain object                              | For example, `{ timeTakenInMilliseconds: 6, originalLength: 0, cleanedLength: 0, bytesSaved: 0, percentageReducedOfOriginal: 0 }` |
| `ranges`   | Array of zero or more string range arrays | For example, if characters from index `0` to `5` and `30` to `35` were deleted, that would be `[[0, 5], [30, 35]]`                |
| `result`   | String                                    | The string version where all ranges were applied to it.                                                                           |

**[⬆ back to top](#)**

### Optional Options Object

| Options Object's key     | The type of its value                   | Default     | Description                                                                                                                                                                                                                                                                          |
| ------------------------ | --------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| {                        |                                         |             |
| `lineLengthLimit`        | number                                  | `500`       | When removing line breaks, what is the maximum line length to keep. Relevant only when `opts.removeLineBreaks` is on                                                                                                                                                                 |
| `removeIndentations`     | Boolean                                 | `true`      | Should we remove indentations? The default is, yes.                                                                                                                                                                                                                                  |
| `removeLineBreaks`       | Boolean                                 | `false`     | Should we remove the line breaks? The default answer is, no. Enabling it automatically enables `opts.removeIndentations`.                                                                                                                                                            |
| `reportProgressFunc`     | `null` or Boolean `false` or `function` | `null`      | If you supply a function here, it will be called, and an argument will be given to it, a natural number, which means percentage complete at that moment. Values will range from `1` to `99`, and finally, the main function will return the result's plain object.                   |
| `reportProgressFuncFrom` | Natural number                          | `0`         | Default is zero percent but you can squeeze reporting percentages to start from a different number                                                                                                                                                                                   |
| `reportProgressFuncTo`   | Natural number                          | `100`       | Default is 100 percent but you can squeeze reporting percentages to go up to a different number                                                                                                                                                                                      |
| `breakToTheLeftOf`       | `array` of zero or more strings         | `see below` | When any of given strings are encountered AND `removeLineBreaks` option is on, current line will be terminated. This setting is not active if `removeLineBreaks` is turned off. If you want to disable a default set, either set this key to `false` or `null` or to an empty array. |
| }                        |                                         |             |

Here it is, in one place, in case you want to copy-paste it somewhere:

```js
{
  lineLengthLimit: 500,
  removeIndentations: true,
  removeLineBreaks: false,
  reportProgressFunc: null,
  breakToTheLeftOf: [
    "</td",
    "<html",
    "<head",
    "<meta",
    "<table",
    "<script",
    "</script",
    "<!DOCTYPE",
    "<style",
    "</style",
    "<title",
    "<body",
    "@media",
    "</html",
    "</body",
    "<!--[if",
    "<!--<![endif"
  ]
}
```

**[⬆ back to top](#)**

# `opts.reportProgressFunc`

This feature is used in [a web worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) setup. Basically, you pass the web worker the input (source, options) and it passes you one or more messages back. That can be one message, final result, but it can equally be many messages, for example, a sequence of natural numbers, each meaning progress percentage done so far, AND THEN, finally, full result.

This latter case is exactly what is happening on our front-end GUI, https://emailcrush.com

If you set the optional options object's key's `reportProgressFunc` value to anything else than a function, an error will be thrown.
If you set it to a function, that function will be fed a natural number string, meaning percentage done so far, from `1` to `100`.

Now, it's up to you how to distinguish "in progress" results and the final result. I use a random string, which is unlikely to happen in the input and I append that secret random string in front of the percentage being passed. Then, front-end checks did result that came through have a secret random string in front or not. If so, it's progress. If not, it's a final result.

## Non-deterministic unit tests

This library has usual unit tests written for `ava`, with coverage tracked by `nyc`.

Yawn.

We also have **non-deterministic** unit tests, where the input is random.

The idea is, even if we generate the random input and apply random settings, the result with all whitespace characters wiped should be equal to the original untouched random input with all whitespace characters wiped. In other words, we ensure that no non-whitespace characters were affected by this application. Which is true! This application, at least so far, is not meant to delete any non-whitespace characters and under no settings combination.

Personally, I think this is cool, and I haven't seen it anywhere else.

Here's how to fire it up:

```bash
ava test_alt/nondeterministic.js -- --time=3s
```

Call the file `nondeterministic.js` located in folder `test_alt` in `ava`, pass the duration in seconds you want to generate and run tests. More time, more random tests. Just number, for example `-- --time=3` means `3 milliseconds`. "s" appended means seconds, for example, `-- --time=3s`. Three minutes would be `-- --time=3m`.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=html-crush%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ahtml-crush%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=html-crush%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ahtml-crush%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=html-crush%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ahtml-crush%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/html-crush
[cov-img]: https://img.shields.io/badge/coverage-91.8%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/html-crush
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/html-crush
[downloads-img]: https://img.shields.io/npm/dm/html-crush.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/html-crush
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/html-crush
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
