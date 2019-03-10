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

| Type                                                                                                    | Key in `package.json` | Path                            | Size |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------- | ---- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-left-right.cjs.js` | 1 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-left-right.esm.js` | 1 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-left-right.umd.js` | 1 KB |

**[⬆ back to top](#)**

## Usage

```js
const { left, right } = require("string-left-right");
const res = left("abc   def", 6);
console.log("res = " + res);
// => res = 2
```

## API

Both exported functions have the same API

**left(str, \[, idx])**
**right(str, \[, idx])**

The first input argument is a string, the optional second (marked by brackets above) is offset index.

### API - left() or right() functions

| Input argument | Key value's type | Obligatory? | Description                                                                   |
| -------------- | ---------------- | ----------- | ----------------------------------------------------------------------------- |
| `str`          | String           | yes         | String which we will process                                                  |
| `idx`          | (natural) number | no          | Default is zero (beginning of a string), but you can point to any string index |

The API is deliberately very forgiving; it never throws; if the result can't be determined, it returns `null`.

**[⬆ back to top](#)**

### API - Function's Output

The output is either **natural number index**, pointing to the nearest non-whitespace character on either side or `null`.

**[⬆ back to top](#)**

## More complex lookups

If you need more complex string lookups, check out `string-match-left-right` on [GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/string-match-left-right/)/[npm](https://www.npmjs.com/package/string-match-left-right). It can trim whitespace or certain characters before matching.

## Contributing

- If you see an error, [raise an issue](https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-left-right%20package%20-%20put%20title%20here&issue[description]=%23%23%20string-left-right%0A%0Aput%20description%20here).
- If you want a new feature but can't code it up yourself, also [raise an issue](https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-left-right%20package%20-%20put%20title%20here&issue[description]=%23%23%20string-left-right%0A%0Aput%20description%20here). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-left-right%20package%20-%20put%20title%20here&issue[description]=%23%23%20string-left-right%0A%0Aput%20description%20here). We'll try to help.
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
[cov-img]: https://img.shields.io/badge/coverage-28.57%25-red.svg?style=flat-square
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
