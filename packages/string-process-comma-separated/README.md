# string-process-comma-separated

> Extracts chunks from possibly comma or whatever-separated string

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#install)
- [Purpose](#purpose)
- [Usage](#usage)
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i string-process-comma-separated
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`processCommaSeparated`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const processCommaSeparated = require("string-process-comma-separated");
```

or as an ES Module:

```js
import processCommaSeparated from "string-process-comma-separated";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/string-process-comma-separated/dist/string-process-comma-separated.umd.js"></script>
```

```js
// in which case you get a global variable "stringProcessCommaSeparated" which you consume like this:
const processCommaSeparated = stringProcessCommaSeparated;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                                         | Size |
| ------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------------------------- | ---- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-process-comma-separated.cjs.js` | 6 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-process-comma-separated.esm.js` | 6 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-process-comma-separated.umd.js` | 3 KB |

**[⬆ back to top](#)**

## Purpose

Imagine, you need to extract and validate `50%` and `50%` of HTML attribute values: `<FRAMESET rows="50%, 50%">`.

The first algorithm idea seems simple:

```js
str
  .split(",")
  .forEach(oneOfValues => {
    ...
  })
```

But in real life, the proper extraction is quite complex and you need to cover all error cases:

- There might be surrounding whitespace `<FRAMESET rows=" 50%, 50% ">`
- There might be spaces after the comma - it might be OK or not - `<FRAMESET rows=" 50%, 50% ">`
- Plain errors like leading comma - `<FRAMESET rows=" ,, 50%, 50% ">`
- There might be non-space characters that look like space like [NBSP](http://www.fileformat.info/info/unicode/char/00a0/index.htm)

This program helps to extract chunks of strings from potentially comma-separated list of string (it might be a single value, without commas).

Separator is configurable via `opts.separator`, so it might be not comma if you wish.

Errors are pinged to a separate callback function.

**[⬆ back to top](#)**

## Usage

Same thing like in `Array.forEach`, we use callbacks, which allows you to tailor what happens with the values that the program gives you.

Here is quite a contrived example, too crazy to be real, but it shows the capabilities of the algorithm:

Instead of expected,

```html
`<frameset rows="50%,50%">`</frameset>
```

we have:

```html
`<frameset rows=" ,,\t50% ,${rawnbsp} 50% ,\t\t,">`</frameset>
```

The program above extracts both values `50%` (string index ranges are fed to the callback, [20, 23] and [27, 30]) and reports all rogue spaces, tabs, non-breaking space and commas.

```js
const processCommaSeparated = require("string-process-comma-separated");
const gatheredChunks = [];
const gatheredErrors = [];
const rawnbsp = "\u00a0";
processCommaSeparated(`<FRAMESET rows=" ,,\t50% ,${rawnbsp} 50% ,\t\t,">`, {
  from: 16, // <- beginning of the attribute's value
  to: 35, // <- ending of the attribute's value
  separator: ",",
  cb: (idxFrom, idxTo) => {
    gatheredChunks.push([idxFrom, idxTo]);
  },
  errCb: (ranges, message) => {
    gatheredErrors.push({ ranges, message });
  }
});

console.log(JSON.stringify(gatheredChunks, null, 4));
// => [
//      [20, 23],
//      [27, 30]
//    ]

console.log(JSON.stringify(gatheredErrors, null, 4));
// => [
//      { ranges: [[16, 17]], message: "Remove the whitespace." },
//      { ranges: [[17, 18]], message: "Remove the separator." },
//      { ranges: [[18, 19]], message: "Remove the separator." },
//      { ranges: [[19, 20]], message: "Remove the whitespace." },
//      { ranges: [[23, 24]], message: "Remove the whitespace." },
//      { ranges: [[25, 27]], message: "Remove the whitespace." },
//      { ranges: [[30, 31]], message: "Remove the whitespace." },
//      { ranges: [[32, 34]], message: "Remove the whitespace." },
//      { ranges: [[31, 32]], message: "Remove the separator." },
//      { ranges: [[34, 35]], message: "Remove the separator." }
//    ]
```

This program saves you time from having to tackle all those possible error cases: rogue separators, consecutive separators and spaces.

**[⬆ back to top](#)**

## API

**processCommaSeparated(str, [opts])**

### API - Function's Input

| Input argument | Key value's type | Obligatory? | Description                            |
| -------------- | ---------------- | ----------- | -------------------------------------- |
| `input`        | String           | yes         | Input string                           |
| `opts`         | Plain object     | yes         | Options Object. See below for its API. |

If input arguments are supplied have any other types, an error will be `throw`n. Empty string or no options object (thus no callbacks) is fine, program will exit early.

**[⬆ back to top](#)**

### Options Object

Main thing, you must pass the callbacks in the options object, `cb` and `errCb`:

| An Options Object's key | Type of its value      | Default      | Description                                                                                                                  |
| ----------------------- | ---------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| {                       |                        |              |
| `from`                  | Integer or falsey      | `0`          | Where in the string does the comma-separated chunk start                                                                     |
| `to`                    | Integer or falsey      | `str.length` | Where in the string does the comma-separated chunk end                                                                       |
| `offset`                | Integer or falsey      | `0`          | Handy when you've been given cropped string and want to report real indexes. Offset adds that number to each reported index. |
| `leadingWhitespaceOK`   | Boolean                | `false`      | Is whitespace at the beginning of the range OK?                                                                              |
| `trailingWhitespaceOK`  | Boolean                | `false`      | Is whitespace at the end of the range OK?                                                                                    |
| `oneSpaceAfterCommaOK`  | Boolean                | `false`      | Can values have space after comma?                                                                                           |
| `separator`             | String, non-whitespace | `,`          | What is the separator character?                                                                                             |
| `cb`                    | Function               | `null`       | Function to ping the extracted value ranges to                                                                               |
| `errCb`                 | Function               | `null`       | Function to ping the errors to                                                                                               |
| }                       |                        |              |

Here is the default options object in one place:

```js
{
  from: 0,
  to: str.length,
  offset: 0,
  leadingWhitespaceOK: false,
  trailingWhitespaceOK: false,
  oneSpaceAfterCommaOK: false,
  separator: ",",
  cb: null,
  errCb: null
}
```

**[⬆ back to top](#)**

### API - Function's Output

The function does not return anything (it returns `undefined` to be precise) — you extract the values via callbacks.

### API - opts.cb - INPUT

`opts` is a plain object. Its key's `cb` value must be a function.

Like in the example above — processCommaSeparated is a function, the second argument is the options object. Below, we set an arrow function to be `cb` value (you could pass a "normal", declared function as well).

```js
const gatheredChunks = [];
...
processCommaSeparated(
  `<FRAMESET...`,
  {
    ...
    cb: (idxFrom, idxTo) => {
      gatheredChunks.push([idxFrom, idxTo]);
    },
    ...
  }
);
```

The program will pass two arguments to the callback function you pass:

| Passed argument at position | We call it | Type    | Description                          |
| --------------------------- | ---------- | ------- | ------------------------------------ |
| 1                           | `idxFrom`  | Integer | Where does the extracted value start |
| 2                           | `idxTo`    | Integer | Where does the extracted value end   |

For example, if you passed the whole string `abc,def` (we assume it's whole HTML attribute's value, already extracted) and didn't give `opts.from` and `opts.to` and thus, program traversed the whole string, it would ping your callback function with two ranges: `[0, 3]` and `[4, 7]`. Full code:

```js
const processCommaSeparated = require("string-process-comma-separated");
const gatheredChunks = [];
processCommaSeparated("abc,def", {
  cb: (idxFrom, idxTo) => {
    gatheredChunks.push([idxFrom, idxTo]);
  }
});
console.log(JSON.stringify(gatheredChunks, null, 4));
// => [
//      [0, 3],
//      [4, 7]
//    ],
```

We omitted the error callback for brevity (`opts.errCb`, see its API below), here would be no errors anyway.

**[⬆ back to top](#)**

### API - opts.cb - OUTPUT

Strictly speaking, function you pass as `opts.cb` value does not return anything, it's like `Array.forEach(key => {})` — you don't expect that arrow function to return something, as in:

```js
["abc", "def"].forEach(key => {
  return "whatever"; // <-- that returned value will be lost
});
```

Above, `return` does not matter; you grab `key` value and do things with it instead.

Same way with our program's callbacks.

**[⬆ back to top](#)**

### API - opts.errCb - INPUT

Similar to `opts.cb`, here two arguments are passed into the callback function, only this time first one is ranges, second-one is message string.

```js
const processCommaSeparated = require("string-process-comma-separated");
const gatheredChunks = [];
const gatheredErrors = [];
processCommaSeparated(`<FRAMESET rows="50%, 50%">`, {
  from: 16,
  to: 24,
  cb: (idxFrom, idxTo) => {
    gatheredChunks.push([idxFrom, idxTo]);
  },
  errCb: (ranges, message) => {
    gatheredErrors.push({ ranges, message });
  }
});
console.log(JSON.stringify(gatheredChunks, null, 4));
// => [
//      [16, 19],
//      [21, 24]
//    ]
console.log(JSON.stringify(gatheredErrors, null, 4));
// => [
//      {
//        ranges: [[20, 21]],
//        message: "Remove the whitespace."
//      }
//    ]
```

| Passed argument at position | We call it | Type                         | Description                             |
| --------------------------- | ---------- | ---------------------------- | --------------------------------------- |
| 1                           | `ranges`   | Array of zero or more arrays | Ranges which indicate the "fix" recipe. |
| 2                           | `message`  | String                       | Message about the error.                |

A quick primer on `ranges` — each range is an array of two or three elements. First two match `String.slice` indexes. If an optional third is present, it means what to add instead. Two element range array — only deletion. Three element range array — replacement.

We have made more _range_ processing libraries see https://gitlab.com/codsen/codsen#-range-libraries

**[⬆ back to top](#)**

### API - opts.errCb - OUTPUT

Same thing like in `opts.cb` — whatever your callback function returns does not matter. You take the values that are passed into function's arguments and do things with them. You don't return anything from the callback function.

```js
["abc", "def"].forEach(key => {
  return "whatever"; // <-- that returned value will be lost
});
```

This returned string `"whatever"` will be discarded. It's not `Array.map`. Same with this program.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-process-comma-separated%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-process-comma-separated%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-process-comma-separated%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-process-comma-separated%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-process-comma-separated%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-process-comma-separated%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/string-process-comma-separated.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-process-comma-separated
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-process-comma-separated
[cov-img]: https://img.shields.io/badge/coverage-92.31%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-process-comma-separated
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-process-comma-separated
[downloads-img]: https://img.shields.io/npm/dm/string-process-comma-separated.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-process-comma-separated
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-process-comma-separated
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
