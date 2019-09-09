# string-left-right

> Look what's to the left or the right of a given index within a string

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
- [Usage](#usage)
- [API - left() and right()](#api---left-and-right)
- [API - chompLeft() and chompRight()](#api---chompleft-and-chompright)
- [API - chompLeft() and chompRight() modes](#api---chompleft-and-chompright-modes)
- [API - leftStopAtNewLines() and rightStopAtNewLines()](#api---leftstopatnewlines-and-rightstopatnewlines)
- [More complex lookups](#more-complex-lookups)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i string-left-right
```

Consume via a `require()`:

```js
const {
  left,
  right,
  leftSeq,
  rightSeq,
  chompLeft,
  chompRight,
  leftStopAtNewLines,
  rightStopAtNewLines
} = require("string-left-right");
```

or as an ES Module:

```js
import {
  left,
  right,
  leftSeq,
  rightSeq,
  chompLeft,
  chompRight,
  leftStopAtNewLines,
  rightStopAtNewLines
} from "string-left-right";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/string-left-right/dist/string-left-right.umd.js"></script>
```

```js
// in which case you get a global variable "stringLeftRight" which you consume like this:
const {
  left,
  right,
  leftSeq,
  rightSeq,
  chompLeft,
  chompRight,
  leftStopAtNewLines,
  rightStopAtNewLines
} = stringLeftRight;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                            | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-left-right.cjs.js` | 12 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-left-right.esm.js` | 11 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-left-right.umd.js` | 15 KB |

**[⬆ back to top](#)**

## Usage

```js
const { left, right } = require("string-left-right");
// let's get the closest non-whitespace letter to the left of "d"
const str = "abc   def";
const res = left(str, 6); // 6th index marks letter "d"
console.log(
  `next non-whitespace character to the left of ${str[6]} (index 6) is ${
    str[left(str, 6)]
  } (index ${left(str, 6)})`
);
// => next non-whitespace character to the left of d (index 6) is c (index 2)
```

**[⬆ back to top](#)**

## API - left() and right()

Both exported functions have the same API:

**left(str, \[, idx])**

**right(str, \[, idx])**

On both, the first input argument is a string, the optional second (marked by brackets above) is a starting index. We "look" to the left or to the right of that index, then report a first non-whitespace character's index on that side. In absence, we return `null`.

The determinator for whitespace is truthy `string.trim().length` - the trimmed string must have length; otherwise, it's a whitespace.

These functions allow you to locate the first non-whitespace character on left or right.

For example,

```js
const { left } = require("string-left-right");
// we start at index 2, which is character "b".
const res = left("a b", 2);
// the first non-whitespace character to the left of "b" is "a", at index 0:
console.log(res);
// => 0
```

The output is either **natural number index**, pointing to the nearest non-whitespace character on either side or `null` (if the string ends further, for example).

**[⬆ back to top](#)**

## API - chompLeft() and chompRight()

These two allow you to "chomp" multiple instances of a set of characters, possibly spaced out with whitespace.

For example, imagine you have this string:

```
text x  y xyyyyxxxx       x x x x x yyyy y y y .
```

Imagine, you are "located" at the index of ".", `47`. In this case, `chompLeft()` lets you "jump" over x's and y's and locate the index of a second "t" in "text", `3`.

Both exported functions have the same API:

**chompLeft(str, idx, \[opts], char1, char2, char3...)**

**chompRight(str, idx, \[opts], char1, char2, char3...)**

You can pass a plain object - options - as the third argument, or you can omit it.

For example:

```js
const { chompLeft } = require("string-left-right");
const res1 = chompLeft("a  b c b c  x y", 12, "b", "c");
console.log(`res1`);
// => 2

// the default mode is 0 and it's omitted, so above example is the same as:
const res2 = chompLeft("a  b c b c  x y", 12, { mode: 0 }, "b", "c");
console.log(`res2`);
// => 2
```

**[⬆ back to top](#)**

## API - chompLeft() and chompRight() modes

You can pass an options object as a third argument before characters to match.

Modes:

- `0` - leave single space if possible
- `1` - stop at first space, leave whitespace alone
- `2` - aggressively chomp all whitespace except newlines ([CR](https://en.wikipedia.org/wiki/Carriage_return), [LF](https://en.wikipedia.org/wiki/Newline))
- `3` - aggressively chomp all whitespace including newlines ([CR](https://en.wikipedia.org/wiki/Carriage_return), [LF](https://en.wikipedia.org/wiki/Newline))

For example:

```js
const { chompLeft } = require("string-left-right");
const res1 = chompLeft("a\n  b c b c  x y", 13, "b", "c");
console.log(res1);
// => 2
// the default chomp stopped when it reached line break character. It didn't leave a space because it's not a non-whitespace character. If it were not a line break but a letter, it would have stopped one space short of it.

// passing default { mode: 0 } is the same result:
const res2 = chompLeft("a\n  b c b c  x y", { mode: 0 }, 13, "b", "c");
console.log(res2);
// => 2

// mode 1 - stops at first space met, in this case at first "b"
const res3 = chompLeft("a\n  b c b c  x y", 12, { mode: "1" }, "b", "c");
console.log(res3);
// => 4
// PS. "\n" counts as length of one

// mode 2 - chomps all whitespace except newlines
// in this case it stops to the right of \n, index 2:
const res4 = chompLeft("a\n  b c b c  x y", 12, { mode: "2" }, "b", "c");
// => 2

// mode 3 - hungriest of all whitespace chomps - chomps until it meets
// edge of a string or non-whitespace character (one which String.trim()'s
// to non-zero length character):
const res5 = chompLeft("a\n  b c b c  x y", 12, { mode: "3" }, "b", "c");
// => 1
```

The `chompRight()` works the same way, just towards the right side of a given index.

**[⬆ back to top](#)**

## API - leftStopAtNewLines() and rightStopAtNewLines()

Both exported functions have the same API.

**leftStopAtNewLines(str, \[, idx])**

**rightStopAtNewLines(str, \[, idx])**

On both, the first input argument is a string, the optional second (marked by brackets above) is a starting index.

Both functions are the same as `left()`/`right()`, except that besides non-whitespace characters, they also stop at CR and LF, line break characters.

For example,

```js
const { right, rightStopAtNewLines } = require("string-left-right");
const str = "a \n\n\nb";
// right() does not stop at whitespace characters and linebreaks are
// whitespace characters:
const res1 = right(str, 0);
// rightStopAtNewLines() will also stop at line break characters:
const res2 = rightStopAtNewLines(str, 0);
console.log(`res1 = ${res1}; res2 = ${res2}`);
// res1 = 5; res2 = 2
```

PS. While you type Mac line ending LF as two characters, backwards slash and "n" - `\n` - it counts as one character.

**[⬆ back to top](#)**

## More complex lookups

If you need more complex string lookups, check out `string-match-left-right` on [GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/string-match-left-right/)/[npm](https://www.npmjs.com/package/string-match-left-right). It can trim whitespace or certain characters before matching.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-left-right%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-left-right%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-left-right%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-left-right%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-left-right%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-left-right%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/string-left-right.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-left-right
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-left-right
[cov-img]: https://img.shields.io/badge/coverage-96.88%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-left-right
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-left-right
[downloads-img]: https://img.shields.io/npm/dm/string-left-right.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-left-right
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-left-right
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
