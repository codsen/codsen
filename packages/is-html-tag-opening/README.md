# is-html-tag-opening

> Is given opening bracket a beginning of a tag?

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
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
- [For example,](#for-example)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i is-html-tag-opening
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`isOpening`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const isOpening = require("is-html-tag-opening");
```

or as an ES Module:

```js
import isOpening from "is-html-tag-opening";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/is-html-tag-opening/dist/is-html-tag-opening.umd.js"></script>
```

```js
// in which case you get a global variable "isHtmlTagOpening" which you consume like this:
const isOpening = isHtmlTagOpening;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                              | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | --------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/is-html-tag-opening.cjs.js` | 3 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/is-html-tag-opening.esm.js` | 3 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/is-html-tag-opening.umd.js` | 20 KB |

**[⬆ back to top](#)**

## Idea

Detect, is an opening bracket (`<`) a tag opening? Alternative being, it might be un-encoded text.

## API - Input

**isOpening(str, idx)** — in other words, function which takes two arguments:

| Input argument | Key value's type       | Obligatory? | Description                                 |
| -------------- | ---------------------- | ----------- | ------------------------------------------- |
| `str`          | String                 | yes         | The input string of zero or more characters |
| `idx`          | Natural number or zero | yes         | Index of an opening bracket (`<`)           |

If supplied input arguments are of any other types, an error will be thrown.

**[⬆ back to top](#)**

## API - Output

Boolean, `true` or `false`.

## For example,

```js
const isOpening = require("is-html-tag-opening");
const text = `<span>a < b<span>`;
console.log(is(text, 0));
// => true
console.log(is(text, 8));
// => false
console.log(is(text, 11));
// => true
```

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=is-html-tag-opening%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ais-html-tag-opening%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=is-html-tag-opening%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ais-html-tag-opening%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=is-html-tag-opening%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ais-html-tag-opening%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/is-html-tag-opening.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/is-html-tag-opening
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/is-html-tag-opening
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/is-html-tag-opening
[downloads-img]: https://img.shields.io/npm/dm/is-html-tag-opening.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/is-html-tag-opening
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/is-html-tag-opening
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
