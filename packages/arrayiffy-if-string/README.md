# arrayiffy-if-string

> Put non-empty strings into arrays, turn empty-ones into empty arrays. Bypass everything else.

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
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i arrayiffy-if-string
```

```js
// consume as CommonJS require:
const arrayiffy = require("require arrayiffy-if-string");
// or as an ES module:
import arrayiffy from "arrayiffy-if-string";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                              | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | --------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/arrayiffy-if-string.cjs.js` | 518 B |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/arrayiffy-if-string.esm.js` | 501 B |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/arrayiffy-if-string.umd.js` | 553 B |

**[⬆ back to top](#)**

## Idea

- If it's a non-empty string, put it into an array and return it.
- If it's empty string, return an empty array.
- If it's anything else, just return it.

```js
const arrayiffy = require("arrayiffy-if-string");
var res = arrayiffy("aaa");
console.log("res = " + JSON.stringify(res, null, 4));
// => ['aaa']
```

```js
const arrayiffy = require("arrayiffy-if-string");
var res = arrayiffy("");
console.log("res = " + JSON.stringify(res, null, 4));
// => []
```

```js
const arrayiffy = require("arrayiffy-if-string");
var res = arrayiffy(true);
console.log("res = " + JSON.stringify(res, null, 4));
// => true
```

It's main purpose is to prepare the input argument options' objects. Check out `check-types-mini` on [npm](https://www.npmjs.com/package/check-types-mini), or on [GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/check-types-mini).

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](https://gitlab.com/codsen/codsen/issues/new?issue[title]=arrayiffy-if-string%20package%20-%20put%20title%20here&issue[description]=%23%23%20arrayiffy-if-string%0A%0Aput%20description%20here).
- If you want a new feature but can't code it up yourself, also [raise an issue](https://gitlab.com/codsen/codsen/issues/new?issue[title]=arrayiffy-if-string%20package%20-%20put%20title%20here&issue[description]=%23%23%20arrayiffy-if-string%0A%0Aput%20description%20here). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](https://gitlab.com/codsen/codsen/issues/new?issue[title]=arrayiffy-if-string%20package%20-%20put%20title%20here&issue[description]=%23%23%20arrayiffy-if-string%0A%0Aput%20description%20here). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/arrayiffy-if-string.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/arrayiffy-if-string
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/arrayiffy-if-string
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/arrayiffy-if-string
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/arrayiffy-if-string
[downloads-img]: https://img.shields.io/npm/dm/arrayiffy-if-string.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/arrayiffy-if-string
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/arrayiffy-if-string
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
