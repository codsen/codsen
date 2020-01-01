# string-collapse-leading-whitespace

> Collapse the leading and trailing whitespace of a string

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
- [Idea](#idea)
- [API - Input](#api-input)
- [API - Output](#api-output)
- [TLDR](#tldr)
- [Purpose](#purpose)
- [The logic explained in examples](#the-logic-explained-in-examples)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i string-collapse-leading-whitespace
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`collapseLeadingWhitespace`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const collapseLeadingWhitespace = require("string-collapse-leading-whitespace");
```

or as an ES Module:

```js
import collapseLeadingWhitespace from "string-collapse-leading-whitespace";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/string-collapse-leading-whitespace/dist/string-collapse-leading-whitespace.umd.js"></script>
```

```js
// in which case you get a global variable "stringCollapseLeadingWhitespace" which you consume like this:
const collapseLeadingWhitespace = stringCollapseLeadingWhitespace;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                                             | Size |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------------------ | ---- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-collapse-leading-whitespace.cjs.js` | 3 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-collapse-leading-whitespace.esm.js` | 3 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-collapse-leading-whitespace.umd.js` | 2 KB |

**[⬆ back to top](#)**

## Idea

```js
// does nothing to trimmed strings:
'aaa' => 'aaa'
// if leading or trailing whitespace doesn't contain \n, collapse to a single space
'  aaa   ' => ' aaa '
// otherwise, collapse to a single \n
'     \n\n   aaa  \n\n\n    ' => '\naaa\n'
```

**[⬆ back to top](#)**

## API - Input

| Input argument                 | Type                        | Obligatory? | Default   | Description                                                                            |
| ------------------------------ | --------------------------- | ----------- | --------- | -------------------------------------------------------------------------------------- |
| `str`                          | String                      | yes         | undefined | Source string to work on                                                               |
| `originalLimitLinebreaksCount` | Natural number (excl. zero) | no          | `1`       | Maximum line breaks that will be put when leading or trailing whitespace contains any. |

If first input argument is not a string, it will be just returned back, untouched.
If second input argument is zero or falsey or not a number, it will be set to `1` and application will continue as normal.

**[⬆ back to top](#)**

## API - Output

String of zero or more characters. If input was not a string, same thing will be returned back, without an error.

## TLDR

It's like custom trim - whitespace in the beginning and in the ending of a string is collapsed with an algorithm, aimed to retain only one space out of each spaces/tabs chunk; or all encountered line breaks; or all encountered non-breaking spaces.

**[⬆ back to top](#)**

## Purpose

When we process strings, sometimes we take notes of what needs to be deleted/added and in the end, process the string in one go. That's opposed to mutating string over and over, where first step's output is second step's input.

Now, we call those "notes" _ranges_ and use familiar format - array and string indexes.

For example, sentence "delete character from string index 1 to index 4" is range `[1, 4]`.

To mark something as to be added, we use third element in array: `[1, 4, "replace with this instead"]`.

Now, when we process these ranges, "to add" values sometimes clash.

This program does the processing of those merged "to add" values, specifically, whitespace control - collapsing or trimming any deemed-to-be-excessive whitespace characters.

I'm going to use it in [ranges-push](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-push).

**[⬆ back to top](#)**

## The logic explained in examples

Sequence of more than one space gets replaced with single space:

```js
const coll = require("string-collapse-leading-whitespace");
const res1 = coll("zzz  ");
console.log(res1);
// Those two trailing spaces got trimmed to one space
// => "zzz "
```

Tabs and other whitespace characters which are not non-breaking spaces or new lines (LF) are replaced with spaces. There can't be more than one space at any outcome.

```js
const coll = require("string-collapse-leading-whitespace");
const res2 = coll("\t\t\t\t\t     zzz zzz\t      \t\t\t\t");
console.log(res2);
// Those two trailing spaces got trimmed to one space
// => " zzz zzz "
```

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-collapse-leading-whitespace%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-collapse-leading-whitespace%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-collapse-leading-whitespace%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-collapse-leading-whitespace%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-collapse-leading-whitespace%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-collapse-leading-whitespace%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/string-collapse-leading-whitespace.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-collapse-leading-whitespace
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-collapse-leading-whitespace
[cov-img]: https://img.shields.io/badge/coverage-94.64%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-collapse-leading-whitespace
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-collapse-leading-whitespace
[downloads-img]: https://img.shields.io/npm/dm/string-collapse-leading-whitespace.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-collapse-leading-whitespace
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-collapse-leading-whitespace
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
