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
- [API](#api)
- [More complex lookups](#more-complex-lookups)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i string-left-right
```

```js
// consume via a CommonJS require:
const { left, right } = require("string-left-right");
// or as an ES Module:
import { left, right } from "string-left-right";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                            | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-left-right.cjs.js` | 11 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-left-right.esm.js` | 10 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-left-right.umd.js` | 15 KB |

**[⬆ back to top](#)**

## Usage

```js
const { left, right } = require("string-left-right");
// let's get the closest non-whitespace letter to the left of "d"
const str = "abc   def";
const res = left(str, 6); // 6th index marks letter "d"
console.log(`next non-whitespace character to the left of ${str[6]} (index 6) is ${str[left(str, 6)]} (index ${left(str, 6)})`);
// => next non-whitespace character to the left of d (index 6) is c (index 2)
```

## API

Both exported functions have the same API. When you require/import this package, you get a plain object. That object has two methods - in other words, functions, assigned to a keys "left" and "right".

**left(str, \[, idx])**

**right(str, \[, idx])**

On both, the first input argument is a string, the optional second (marked by brackets above) is an offset index.

### API - `left()` and `right()` Input

| Input argument | Key value's type | Obligatory? | Description                                                                    |
| -------------- | ---------------- | ----------- | ------------------------------------------------------------------------------ |
| `str`          | String           | yes         | String which we will process                                                   |
| `idx`          | (natural) number | no          | Default is zero (beginning of a string), but you can point to any string index |

The API is deliberately very forgiving; it never _throws_; if the result can't be determined, it returns `null`.

**[⬆ back to top](#)**

### API - `left()` and `right()` Output

The output is either **natural number index**, pointing to the nearest non-whitespace character on either side or `null`.

## More complex lookups

If you need more complex string lookups, check out `string-match-left-right` on [GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/string-match-left-right/)/[npm](https://www.npmjs.com/package/string-match-left-right). It can trim whitespace or certain characters before matching.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-left-right%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-left-right%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-left-right%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-left-right%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-left-right%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-left-right%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/string-left-right.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-left-right
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-left-right
[cov-img]: https://img.shields.io/badge/coverage-96.81%25-brightgreen.svg?style=flat-square
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
