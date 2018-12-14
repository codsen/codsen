# html-crush

> Minifies HTML, accepts HTML, mixed with other sources

[![Minimum Node version required][node-img]][node-url]
[![Repository is on BitBucket][bitbucket-img]][bitbucket-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

**Online web app:** [htmlcrush.com](https://htmlcrush.com)

## Table of Contents

- [Install](#markdown-header-install)
- [Usage](#markdown-header-usage)
- [TLDR](#markdown-header-tldr)
- [Features](#markdown-header-features)
- [API](#markdown-header-api)
- [Competition](#markdown-header-competition)
- [Non-deterministic unit tests](#markdown-header-non-deterministic-unit-tests)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Install

```bash
npm i "html-crush";
```

then,

```js
// import using CommonJS require():
const { crush, defaults, version } = require("html-crush");

// or import as an ES Module, using "import":
import { crush, defaults, version } from "html-crush";
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/html-crush.cjs.js` | 22 KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/html-crush.esm.js` | 22 KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/html-crush.umd.js` | 71 KB

**[⬆  back to top](#markdown-header-html-crush)**

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

**[⬆  back to top](#markdown-header-html-crush)**

## TLDR;

Let's minify any input (preferably but not necessarily HTML) without parsing, and do it according to how HTML interprets the whitespace.

We built this minifier so that we were able to minify email templates containing Nunjucks template literals, for example, `{% if order.price < 50 %}` (notice the bracket). Other tools on the market will fail upon first encounter of non-HTML code.

**[⬆  back to top](#markdown-header-html-crush)**

## Features

This program:

- Does not parse the input — input can be (X)HTML or whatever or mixed with whatever
- Equally, the input can be with HTML errors, broken HTML, incomplete HTML or not-quite-HTML or whatever
- Mailchimp, Responsys, Exact Target, Campaign Monitor tags in your HTML - all fine - it will minify it

In short, we prioritise the support of broken or mixed-HTML support over both:

1) minification amount (Kangax [html-minifier](https://www.npmjs.com/package/html-minifier) will compress more);
2) speed

The price we pay is, we are not able to detect an invalid HTML/CSS/JS.

As a side priority, this application also takes into consideration **human-friendliness**:

1) Its API (this npm library) reports progress and its GUI front-end https://htmlcrush.com utilises it to allow a responsive UI
2) We deliberately keep options count under [7](https://en.wikipedia.org/wiki/The_Magical_Number_Seven,_Plus_or_Minus_Two)
3) GUI also considers white and dark interfaces, use of modern toggle switches, CSS hovers to react to any interaction
4) API (this library) considers giving all possible JavaScript use choices: CommonJS transpiled to ES5, modern untranspiled ES Modules code in ES6, and UMD transpiled to ES5 with all dependencies baked-in, all published to npm and accessible via [unpkg](https://unpkg.com/html-crush) CDN
5) Developer friendliness - source is fully set up with `console.log`s which report the line numbers and all actions as they happen. Production builds (`dist/`) strip all logging, of course. This means it's easy to come back later or the first time and debug the code

**[⬆  back to top](#markdown-header-html-crush)**

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

**[⬆  back to top](#markdown-header-html-crush)**

## API - Output

The function exported under key `crush` will return **a plain object** where you'll find log data, result string and corresponding string ranges of all actions performed:

| Key's name     | Key value's type                          | Description                                        |
| -------------- | ----------------------------------------- | -------------------------------------------------- |
| `log`          | Plain object                              | For example, `{ timeTakenInMiliseconds: 6, originalLength: 0, cleanedLength: 0, bytesSaved: 0, percentageReducedOfOriginal: 0 }` |
| `ranges`       | Array of zero or more string range arrays | For example, if characters from index `0` to `5` and `30` to `35` were deleted, that would be `[[0, 5], [30, 35]]` |
| `result`       | String                                    | The string version where all ranges were applied to it. |

### Optional Options Object

| Options Object's key | The type of its value                   | Default | Description                                                                                                                                                                                                                                                   |
| -------------------- | --------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| {                    |                                         |         |
| `lineLengthLimit`    | number                                  | `500`   | When removing line breaks, what is the maximum line length to keep. Relevant only when `opts.removeLineBreaks` is on                                                                                                                                           |
| `removeIndentations` | Boolean                                 | `true`  | Should we remove indentations? The default is, yes.                                                                                                                                                                                                               |
| `removeLineBreaks`   | Boolean                                 | `false`  | Should we remove the line breaks? The default is, yes. Enabling it automatically enables `opts.removeIndentations`.                                                                                                     |
| `reportProgressFunc` | `null` or Boolean `false` or `function` | `null`  | If you supply a function here, it will be called, and an argument will be given to it, a natural number, which means percentage complete at that moment. Values will range from `1` to `99`, and finally, the main function will return the result's plain object. |
| `breakToTheLeftOf`   | `array` of zero or more strings | `see below`  | When any of given strings are encountered AND `removeLineBreaks` option is on, current line will be terminated. This setting is not active if `removeLineBreaks` is turned off. If you want to disable a default set, either set this key to `false` or `null` or to an empty array. |
| }                    |                                         |         |

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

**[⬆  back to top](#markdown-header-html-crush)**

# `opts.reportProgressFunc`

This feature is used in [a web worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) setup. Basically, you pass the web worker the input (source, options) and it passes you one or more messages back. That can be one message, final result, but it can equally be many messages, for example, a sequence of natural numbers, each meaning progress percentage done so far, AND THEN, finally, full result.

This latter case is exactly what is happening on our front-end GUI, https://emailcrush.com

If you set the optional options object's key's `reportProgressFunc` value to anything else than a function, an error will be thrown.
If you set it to a function, that function will be fed a natural number string, meaning percentage done so far, from `1` to `100`.

Now, it's up to you how to distinguish "in progress" results and the final result. I use a random string, which is unlikely to happen in the input and I append that secret random string in front of the percentage being passed. Then, front-end checks did result that came through have a secret random string in front or not. If so, it's progress. If not, it's a final result.

## Competition

This library has its strengths and weaknesses.

**STRENGTHS:**

- We accept any source: broken HTML, HTML mixed whatever programming language, no HTML at all, incomplete HTML and so on, because we process it as a string, we don't parse it
- We're faster than parsing libraries because there's a single loop over the input (as string) and the job's done

**WEAKNESSES:**

- More prone to bugs compared to parsing libraries.
- This library is newer, so less battle-tested and less-famous has fewer maintainers.

**IN GENERAL,**

- When **parsing** libraries break, they'll cause errors and won't give you result at all.
- **Non-parsing** libraries will never break and will always give you a result, only in failure cases it will be erroneous.

also,

- With **parsing** libraries, you worry about how to fix the errors in the code to please the parser.
- With **non-parsing** libraries, you worry, is the result not messed up (because the tool won't tell if things went wrong and it's up to you to judge the result).

---

In general, when you want to minify **a mixed source code** like HTML template which contains ESP templating code (or other back-end code), you've pretty much got **no choice**: either this library or nothing. Web development-oriented libraries are all parsing, (like tried to use this library but it misbehaves, or you need a) and they will not tolerate the mixed sources. Or you'll jump over hoops to make them bypass your non-HTML/CSS parts until you aren't able to jump any more. For example, aforementioned `html-minifier` has escape latches for cheeky code in the _tag attributes_ but no matter how much you tweak its settings — it will fail sooner or later. For example, Nunjucks' `IF` statements are impossible to exclude in settings, an error is inevitable.

**[⬆  back to top](#markdown-header-html-crush)**

## Non-deterministic unit tests

This library has usual unit tests written for `ava`, with coverage tracked by `nyc` and reported onto [coveralls.io](https://coveralls.io/bitbucket/codsen/html-crush).

Yawn.

We also have **non-deterministic** unit tests, where the input is random.

The idea is, even if we generate the random input and apply random settings, the result with all whitespace characters wiped should be equal to the original untouched random input with all whitespace characters wiped. In other words, we ensure that no non-whitespace characters were affected by this application. Which is true! This application, at least so far, is not meant to delete any non-whitespace characters and under no settings combination.

Personally, I think this is cool, and I haven't seen it anywhere else.

Here's how to fire it up:

```bash
ava test_alt/nondeterministic.js -- --time=3s
```

Call the file `nondeterministic.js` located in folder `test_alt` in `ava`, pass the duration in seconds you want to generate and run tests. More time, more random tests. Just number, for example `-- --time=3` means `3 milliseconds`. "s" appended means seconds, for example, `-- --time=3s`. Three minutes would be `-- --time=3m`.

**[⬆  back to top](#markdown-header-html-crush)**

## Contributing

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/html-crush/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/html-crush/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆  back to top](#markdown-header-html-crush)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt



[node-img]: https://img.shields.io/node/v/html-crush.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/html-crush

[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/html-crush

[cov-img]: https://coveralls.io/repos/bitbucket/codsen/html-crush/badge.svg?style=flat-square&branch=master
[cov-url]: https://coveralls.io/bitbucket/codsen/html-crush?branch=master

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/html-crush

[downloads-img]: https://img.shields.io/npm/dm/html-crush.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/html-crush

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/html-crush

[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io

[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/html-crush
