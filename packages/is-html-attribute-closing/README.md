# is-html-attribute-closing

> Is a character on a given index a closing of an HTML attribute?

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
- [API - Input](#api-input)
- [API - Output](#api-output)
- [Bigger picture](#bigger-picture)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i is-html-attribute-closing
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`isAttrClosing`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const isAttrClosing = require("is-html-attribute-closing");
```

or as an ES Module:

```js
import isAttrClosing from "is-html-attribute-closing";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/is-html-attribute-closing/dist/is-html-attribute-closing.umd.js"></script>
```

```js
// in which case you get a global variable "isHtmlAttributeClosing" which you consume like this:
const isAttrClosing = isHtmlAttributeClosing;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                                    | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | --------------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/is-html-attribute-closing.cjs.js` | 13 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/is-html-attribute-closing.esm.js` | 13 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/is-html-attribute-closing.umd.js` | 33 KB |

**[⬆ back to top](#)**

## Idea

Detect, is a character at a given index in a given string being a closing of an attribute?

In happy path scenarios, the closing is closing quote of an attribute:

```js
const isAttrClosing = require("is-html-attribute-closing");
const str = `<a href="zzz" target="_blank" style="color: black;">`;

// <a href="zzz" target="_blank" ...
//                      ^
//                  index 21

// <a href="zzz" target="_blank" ...
//                             ^
//                         index 28

const res = is(
  str, // reference string
  21, // known opening (or in absence of a quote, a start of a value)
  28 // we question, is this a closing on the attribute?
);
console.log(res);
// => true - it is indeed closing of an attribute
```

But this program detects all the crazy cases of realistic and unrealistic HTML attribute endings:

```js
const isAttrClosing = require("is-html-attribute-closing");
const res1 = is(
  `<a href="z' click here</a>`,
  //         ^
  //         |
  //         L________________________
  //                                 |
  8, // known opening               |
  10 // is this an attribute closing at index 10?
);
console.log(res1);
// => true - it is indeed closing of an attribute

const res2 = is(
  `<a b = = = "c" d = = = 'e'>`,
  //            ^
  //            |
  //            L___________________________
  //                                       |
  11, // known opening                     |
  13 // is this an attribute closing at index 13?
);
console.log(res2);
// => true - it is indeed closing of an attribute
```

**[⬆ back to top](#)**

## API - Input

**isOpening(str, idxOfAttrOpening, isThisClosingIdx)** — in other words, function which takes three arguments:

| Input argument     | Key value's type       | Obligatory? | Description                                             |
| ------------------ | ---------------------- | ----------- | ------------------------------------------------------- |
| `str`              | String                 | yes         | The input string of zero or more characters             |
| `idxOfAttrOpening` | Natural number or zero | yes         | Index of an opening quote of an attribute               |
| `isThisClosingIdx` | Natural number         | yes         | Index we ask program to evaluate, is it a closing quote |

This program does not throw. It just returns `false`.

If anything is wrong with the input arguments, the program returns **false**. It never throws. That's because it's to be used inside other programs. Idea is, proper algorithms that will use this program will "care" only about the truthy case: does the given quote pass as a closing-one. Crappy input arguments yields `false`, happy days, consuming algorithms continue whatever dodgy journeys they have been making.

We don't throw errors in this program.

**[⬆ back to top](#)**

## API - Output

Boolean, `true` or `false`. Erroneous input arguments will yield `false` as well.

## Bigger picture

This program will drive `codsen-tokenizer` ([npm](https://www.npmjs.com/package/codsen-tokenizer)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/codsen-tokenizer/)).

There's already a similar program from yours truly, `is-html-tag-opening` ([npm](https://www.npmjs.com/package/is-html-tag-opening)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/is-html-tag-opening/)) which tells, is given opening bracket a start of a tag.

The same situation - program with its unit tests became too big to even be placed in `src/utils/` folder, so we separated it into a standalone package...

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=is-html-attribute-closing%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ais-html-attribute-closing%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=is-html-attribute-closing%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ais-html-attribute-closing%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=is-html-attribute-closing%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ais-html-attribute-closing%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/is-html-attribute-closing
[cov-img]: https://img.shields.io/badge/coverage-94.67%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/is-html-attribute-closing
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/is-html-attribute-closing
[downloads-img]: https://img.shields.io/npm/dm/is-html-attribute-closing.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/is-html-attribute-closing
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/is-html-attribute-closing
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
