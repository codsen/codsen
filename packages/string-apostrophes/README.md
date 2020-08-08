# string-apostrophes

> Comprehensive, HTML-entities-aware tool to typographically-correct the apostrophes and single/double quotes

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
- [Compared to competitors on npm](#compared-to-competitors-on-npm)
- [Usage](#usage)
- [API](#api)
- [API - `convertAll()` input](#api-convertall-input)
- [API - `convertAll()` output](#api-convertall-output)
- [API - `convertOne()` input](#api-convertone-input)
- [API - `convertOne()` output](#api-convertone-output)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i string-apostrophes
```

Consume via a `require()`:

```js
const { convertOne, convertAll } = require("string-apostrophes");
```

or as an ES Module:

```js
import { convertOne, convertAll } from "string-apostrophes";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/string-apostrophes/dist/string-apostrophes.umd.js"></script>
```

```js
// in which case you get a global variable "stringApostrophes" which you consume like this:
const { convertOne, convertAll } = stringApostrophes;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                             | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-apostrophes.cjs.js` | 16 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-apostrophes.esm.js` | 18 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-apostrophes.umd.js` | 13 KB |

**[⬆ back to top](#)**

## Idea

As you know, straight apostrophes are not typographically-correct: `test's` should be `test’s`, with [right single quote](https://www.fileformat.info/info/unicode/char/2019/index.htm) instead of [apostrophe](https://www.fileformat.info/info/unicode/char/27/index.htm).

This program converts all cases of single and double apostrophes, plus [primes](<https://en.wikipedia.org/wiki/Prime_(symbol)>).

Sources used in rules logic and unit tests:

- Oxford A-Z of Grammar and Punctuation 2nd Ed., 2009, [ISBN 978-0199564675](https://www.google.com/search?q=isbn+978-0199564675)
- Butterick's Practical Typography 2nd Ed., "Apostrophes" [chapter](https://practicaltypography.com/apostrophes.html)

Plus, this program passes the curly quotes test suite of [straight-to-curly-quotes.json](https://github.com/kemitchell/straight-to-curly-quotes.json)

**[⬆ back to top](#)**

## Compared to competitors on npm

|                                                                           | This program, <br> [`string-apostrophes`](https://www.npmjs.com/package/string-apostrophes)                                              | [`straight-to-curly-quotes`](https://www.npmjs.com/package/straight-to-curly-quotes)                                                               | [`smartquotes`](https://www.npmjs.com/package/smartquotes)                                                               | [`typographic-quotes`](https://www.npmjs.com/package/typographic-quotes)                                                               |
| ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
|                                                                           | [![npm link](https://img.shields.io/npm/v/string-apostrophes.svg?style=flat-square)](https://www.npmjs.com/package/string-remove-widows) | [![npm link](https://img.shields.io/npm/v/straight-to-curly-quotes.svg?style=flat-square)](https://www.npmjs.com/package/straight-to-curly-quotes) | [![npm link](https://img.shields.io/npm/v/smartquotes.svg?style=flat-square)](https://www.npmjs.com/package/smartquotes) | [![npm link](https://img.shields.io/npm/v/typographic-quotes.svg?style=flat-square)](https://www.npmjs.com/package/typographic-quotes) |
| Returns processed string                                                  | ✅                                                                                                                                       | ✅                                                                                                                                                 | ✅                                                                                                                       | ✅                                                                                                                                     |
| Returns index ranges                                                      | ✅                                                                                                                                       | ❌                                                                                                                                                 | ❌                                                                                                                       | ❌                                                                                                                                     |
| Replaces quotes in DOM, on a web page, where you put a script in          | ❌                                                                                                                                       | ❌                                                                                                                                                 | ✅                                                                                                                       | ❌                                                                                                                                     |
| Not regex-based                                                           | ✅                                                                                                                                       | ❌                                                                                                                                                 | ❌                                                                                                                       | ❌                                                                                                                                     |
| Can output HTML-encoded content upon request                              | ✅                                                                                                                                       | ❌                                                                                                                                                 | ❌                                                                                                                       | ❌                                                                                                                                     |
| Killswitch to bypass processing                                           | ✅                                                                                                                                       | ❌                                                                                                                                                 | ❌                                                                                                                       | ❌                                                                                                                                     |
| Allows to process any part of string as if it were single or double quote | ✅                                                                                                                                       | ❌                                                                                                                                                 | ❌                                                                                                                       | ❌                                                                                                                                     |
| CommonJS (`require()`) and ES Modules (in ES6+, `import`) builds          | ✅                                                                                                                                       | ❌                                                                                                                                                 | ❌                                                                                                                       | ❌                                                                                                                                     |
| UMD builds published to npm and available from unpkg or jsdelivr          | ✅                                                                                                                                       | ❌                                                                                                                                                 | ❌                                                                                                                       | ❌                                                                                                                                     |
| Serves other languages besides English                                    | ❌                                                                                                                                       | ❌                                                                                                                                                 | ❌                                                                                                                       | ✅                                                                                                                                     |

This program has string-in, string-out type API; the DOM changes capabilities are not bundled because _browser_ is only one of many possible targets of an npm program. Other consuming programs might not even have DOM or consumers might be Electron or whatever. It's best to write other, standalone apps which use API-like core function and work from original (string-in string-out), "API" package.

**[⬆ back to top](#)**

## Usage

```js
const { convertOne, convertAll } = require("string-apostrophes");
const res = convertAll(`In the '60s, rock 'n' roll`, {
  convertApostrophes: 1,
  convertEntities: 0,
});
console.log(JSON.stringify(res, null, 4));
// =>
// {
//   "result": "In the ’60s, rock ’n ’ roll",
//   "ranges": [
//     [7, 8, "’"],
//     [18, 19, "’"],
//     [20, 21, "’"]
//   ]
// }
```

**[⬆ back to top](#)**

## API

When you consume this package,

```js
// Common JS:
const { convertOne, convertAll } = require("string-apostrophes");
// ES Modules:
import { convertOne, convertAll } from "string-apostrophes";
```

two functions are exported: `convertOne` and `convertAll`.

**[⬆ back to top](#)**

## API - `convertAll()` input

`convertAll` is a function; its API is the following:

| Input argument | Key value's type | Obligatory? | Description                  |
| -------------- | ---------------- | ----------- | ---------------------------- |
| `str`          | String           | yes         | String which we will process |
| `opts`         | Plain object     | no          | Put options here             |

For example,

```js
console.log(convertAll(`test's`, {
  convertApostrophes: true,
  convertEntities: true
})).result,
// => "test&rsquo;s"
```

**[⬆ back to top](#)**

### Options Object, `opts`

| Options Object's key | The type of its value | Default | Obligatory? | Description                                            |
| -------------------- | --------------------- | ------- | ----------- | ------------------------------------------------------ |
| `convertEntities`    | Boolean               | `false` | no          | Should we HTML-encode the characters?                  |
| `convertApostrophes` | Boolean               | `true`  | no          | Killswitch. If it's `false`, the program does nothing. |

**[⬆ back to top](#)**

## API - `convertAll()` output

A plain object is returned:

| Returned object's key | The type of its value        | Description                                               |
| --------------------- | ---------------------------- | --------------------------------------------------------- |
| `result`              | String                       | Processed string, with all ranges applied                 |
| `ranges`              | Array of zero or more arrays | Ranges that were gathered and applied to produce `result` |

For example, if you gave string `In the '60s, rock 'n' roll` with apostrophes, the result on default settings would be:

```js
{
  result: `In the ’60s, rock ’n’ roll`,
  ranges: [
    [7, 8, `’`],
    [18, 19, `’`],
    [20, 21, `’`]
  ]
}
```

**[⬆ back to top](#)**

## API - `convertOne()` input

`convertOne` is a function; its API is the following:

| Input argument | Key value's type | Obligatory? | Description                  |
| -------------- | ---------------- | ----------- | ---------------------------- |
| `str`          | String           | yes         | String which we will process |
| `opts`         | Plain object     | yes         | Put options here             |

`opts.from` is obligatory — that's how you tell the program which characters to process.

For example:

```js
console.log(convertOne(`test's`, {
  from: 4,
  to: 5,
  convertApostrophes: true,
  convertEntities: false
})),
// => [[4, 5, "&rsquo;"]]
```

**[⬆ back to top](#)**

### Options Object, `opts`

| Options Object's key | The type of its value        | Default     | Obligatory? | Description                                                                                                                  |
| -------------------- | ---------------------------- | ----------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `from`               | Natural number, string index | `undefined` | yes         | Where does the character we need to process start in a given index?                                                          |
| `to`                 | Natural number, string index | `from + 1`  | no          | Where does the character we need to process end in a given index?                                                            |
| `value`              | String                       | `undefined` | no          | Override the value of a string value, present at `str.slice(from, to)`                                                       |
| `convertEntities`    | Boolean                      | `false`     | no          | Should we HTML-encode the characters?                                                                                        |
| `convertApostrophes` | Boolean                      | `true`      | no          | Killswitch. If it's `false`, the program does nothing.                                                                       |
| `offsetBy`           | Function                     | `undefined` | no          | If you provide a function, it will be called with a natural number input argument, meaning how much characters to skip next. |

**[⬆ back to top](#)**

### opts.offsetBy

Offset is needed to bypass characters we already fixed — it happens for example, with nested quotes - we'd fix many in one go, and we need to skip the further processing; otherwise, those characters would get processed multiple times.

For example, here's how the `convertAll()` index is bumped using `offsetBy`, in a callback-fashion:

```js
function convertAll(str, opts) {
  let ranges = [];
  const preppedOpts = Object.assign({}, opts);
  // loop through the given string
  for (let i = 0, len = str.length; i < len; i++) {
    // define starting index:
    preppedOpts.from = i;
    // offset function:
    preppedOpts.offsetBy = (idx) => {
      i = i + idx;
    };
    // calculate the result:
    const res = convertOne(str, preppedOpts);
    if (Array.isArray(res) && res.length) {
      ranges = ranges.concat(res);
    }
  }
  return {
    result: rangesApply(str, ranges),
    ranges,
  };
}
```

The inner function `convertOne()` bumps outer's `convertAll()` index.

**[⬆ back to top](#)**

### opts.value

Consider string `Your's` with HTML-escaped apostrophe:

```HTML
Your&apos;s
```

There are various other cases of apostrophes and quotes where we have a sentence, and all apostrophes/quotes are there, and we know where just different character(s) represent them. Values are not `'` and `"`.

We are not going to code up all those cases!

Instead, use `convertOne()`, process each "symbol" one-by-one and instruct the program from where (`from`) to where (`to`) is a particular character (`value`).

For example,

```js
const { convertOne, convertAll } = require("string-apostrophes");
const res = convertOne(`test&apos;s`, {
  from: 4,
  to: 10,
  value: "'", // <-------- we insist to program that it's an apostrophe between indexes 4 and 10
  convertEntities: 0,
});
console.log(JSON.stringify(res, null, 0));
// => [[4, 10, "’"]]
```

In the example above, the program evaluates surroundings of `&apos;` as if it was a "normal" apostrophe and suggests a replacement.

In practice, that's how _Detergent.js_ ([npm](https://www.npmjs.com/package/detergent), [gitlab](https://gitlab.com/codsen/codsen/tree/master/packages/detergent/)) uses this package.

**[⬆ back to top](#)**

## API - `convertOne()` output

It returns **an array** of zero or more arrays ("ranges"), each representing what needs to be done.

For example, result `[[2, 3, "&lsquo;"], [5, 6, "&rsquo;"]]` means "replace string chunk from index `2` to `3` with `&lsquo;`" and from index `5` to `6` with `&rsquo;`. You can use `ranges-apply` ([npm](https://www.npmjs.com/package/ranges-apply), [gitlab](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-apply/)) to process a string using those ranges (in other words, "to apply those ranges").

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-apostrophes%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-apostrophes%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-apostrophes%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-apostrophes%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-apostrophes%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-apostrophes%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-apostrophes
[cov-img]: https://img.shields.io/badge/coverage-81.02%25-yellow.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-apostrophes
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-apostrophes
[downloads-img]: https://img.shields.io/npm/dm/string-apostrophes.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-apostrophes
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-apostrophes
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
