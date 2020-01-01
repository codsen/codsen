# js-row-num

> Update all row numbers in all console.logs in JS code

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

Other siblings of this package:

- CLI for it: `js-row-num-cli` [on npm](https://www.npmjs.com/package/js-row-num-cli), [on GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/js-row-num-cli)

## Table of Contents

- [Install](#install)
- [Idea](#idea)
- [Usage](#usage)
- [API](#api)
- [Rules](#rules)
- [`opts.overrideRowNum`](#optsoverriderownum)
- [`opts.triggerKeywords`](#optstriggerkeywords)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i js-row-num
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`fixRowNums`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const fixRowNums = require("js-row-num");
```

or as an ES Module:

```js
import fixRowNums from "js-row-num";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/js-row-num/dist/js-row-num.umd.js"></script>
```

```js
// in which case you get a global variable "jsRowNum" which you consume like this:
const fixRowNums = jsRowNum;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                     | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------ | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/js-row-num.cjs.js` | 6 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/js-row-num.esm.js` | 7 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/js-row-num.umd.js` | 23 KB |

**[⬆ back to top](#)**

## Idea

When I create libraries, add new features to them and/or look for bugs, I rely on `console.log` statements. On every one of our libraries, there's Rollup plugins set ([rollup-plugin-strip](https://www.npmjs.com/package/rollup-plugin-strip) and [rollup-plugin-cleanup](https://www.npmjs.com/package/rollup-plugin-cleanup)) who remove all comments and `console.log` statements from the built files that later get published (`dist/` folder's contents). This means we can commit our source files (`src/` folder's contents) **with** `console.log` statements.

Now, when troubleshooting code, there are two essential pieces of information: **what** happened and **from where** it happened:

```js
console.log(`056 SET counter = ${counter}`);
//            ^  └-----------------------┘
//          where      what happened
```

_Where_ part is the `console.log` statement's row number I like to add.

Now, we need an automated tool to update row numbers because there will be many `console.log` rows and it's enough to add or remove one line of code, and all numbers below will be offset.

This library updates row numbers in JS file `console.log` statements. It is an API for other tools - it consumes string (hopefully some JS code) and returns a string (hopefully, also, some JS code). Browser plugins, web apps or Node CLI applications can tap this application to do all the updating work.

**[⬆ back to top](#)**

## Usage

Let's say we want to put row numbers in front of each `console.log` statement and automatically update them:

```js
const fixRowNums = require("js-row-num");
const source = `let filler = "z"; // 1st row
filler = "z"; // 2nd row
filler = "z"; // 3rd row
filler = "z"; // 4th row
filler = "z"; // 5th row
console.log(
  \`099 filler = \${filler} // 7th row
\`);
`;
const res = fixRowNums(source);
// =>
// "let filler = "z"; // 1st row
//  filler = "z"; // 2nd row
//  filler = "z"; // 3rd row
//  filler = "z"; // 4th row
//  filler = "z"; // 5th row
//  console.log(
//    \`007 filler = \${filler} // 7th row
//  \`);
// "
```

Notice how the first number within `console.log` got updated from `099` to `007`.

**[⬆ back to top](#)**

## API

API is simple: `string` in, `string` out. No options, everything beyond the 1st argument will be ignored.

### Optional Options Object

| options object's key | Type of its value                       | Default value     | Description                                                                                                                                                                                                                        |
| -------------------- | --------------------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| {                    |                                         |                   |                                                                                                                                                                                                                                    |
| `padStart`           | Zero, natural number or anything falsey | `3`               | Sets how much digits will be padded                                                                                                                                                                                                |
| `triggerKeywords`    | `null` or array of zero or more strings | `["console.log"]` | After this string, first met chunks of numbers will be replaced with padded row number, unless letter is met first                                                                                                                 |
| `overrideRowNum`     | integer or something falsey             | `null`            | If you have console.log contents already extracted and know the row number, you can pass that row number here. Multiple `console.log`s on multiple lineswon't be recognised, we assume you'll process each console.log one by one. |
| `returnRangesOnly`   | boolean                                 | `false`           | When enabled, instead of string, program will return either `null` (no ranges) or an array of one or more range arrays.                                                                                                            |
| }                    |                                         |                   |                                                                                                                                                                                                                                    |

Here it is all in one place:

```js
{
  padStart: 3,
  triggerKeywords: ["console.log"]
}
```

**[⬆ back to top](#)**

## Rules

Only the digits within `console.log` string will be replaced.

If the letter (either case) precedes the number, it will not be replaced. We agree that numbers should be in front of the `console.log` statement:

This row number will be replaced:

```js
console.log("000 This number in front will be replaced");
// ...replaced into:
console.log("001 This number in front will be replaced");
```

But not this (because letters precede `000`):

```js
// will not be replaced:
console.log("This number: 000 will not be replaced because letter precedes it");
```

The type of quotes doesn't matter: single, double or backticks, as long as opening quote matches the closing quote.

All non-letter characters in front of a digit will not be touched.

Only one lump of digits will be replaced. Second lump onwards will not be touched:

```js
console.log("888 999 This number in front will be replaced");
// ...replaced with:
console.log("001 999 This number in front will be replaced"); // it's first line, so "001"
```

EOL type does not matter; we support all three types of EOL's: `\n`, `\r` and `\r\n` (see unit tests under group `05.01`).

If you don't use `console.log`, put your function's name in `opts.triggerKeywords`:

```js
fixRowNums(`a\nb\nc\n log(\`1 something\`)`, { triggerKeywords: ["log"] }),
// => "a\nb\nc\n log(\`004 something\`)"
```

Above, `log()` is used and it's on the fourth row and padding is default (three).

**[⬆ back to top](#)**

## `opts.overrideRowNum`

If you process each `console.log` one by one (like we do in `eslint-plugin-row-num` ([npm](https://www.npmjs.com/package/eslint-plugin-row-num)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/eslint-plugin-row-num/))) and you already know the row number, you can use this program to pad it and perform the replacement.

```js
const fixRowNums = require("js-row-num");
const res = fixRowNums(
  `
console.log('099 something')
`,
  {
    overrideRowNum: 5
  }
);
console.log(res);
// =>
// console.log('005 something')
//
```

Same with ranges requested, via `opts.returnRangesOnly`:

```js
const fixRowNums = require("js-row-num");
const res = fixRowNums(
  `
console.log('099 something')
`,
  {
    overrideRowNum: 5,
    returnRangesOnly: true
  }
);
console.log(res);
// =>
// [
//    [ 15, 18, "005"]
// ]
//
```

**[⬆ back to top](#)**

## `opts.triggerKeywords`

Setting `opts.triggerKeywords` to `null` will disable all keywords, program will do nothing. In all other cases, where `opts.triggerKeywords` is an empty array, `undefined` or boolean `false`, the default, `console.log` will kick in and the input will be processed.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=js-row-num%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ajs-row-num%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=js-row-num%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ajs-row-num%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=js-row-num%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ajs-row-num%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/js-row-num.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/js-row-num
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/js-row-num
[cov-img]: https://img.shields.io/badge/coverage-90.35%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/js-row-num
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/js-row-num
[downloads-img]: https://img.shields.io/npm/dm/js-row-num.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/js-row-num
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/js-row-num
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
