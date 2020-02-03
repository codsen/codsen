# codsen-parser

> Parser aiming at broken code, especially HTML & CSS

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
- [Practical side](#practical-side)
- [Versus competition](#versus-competition)
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i codsen-parser
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`cparser`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const cparser = require("codsen-parser");
```

or as an ES Module:

```js
import cparser from "codsen-parser";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/codsen-parser/dist/codsen-parser.umd.js"></script>
```

```js
// in which case you get a global variable "codsenParser" which you consume like this:
const cparser = codsenParser;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                        | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | --------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/codsen-parser.cjs.js` | 3 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/codsen-parser.esm.js` | 3 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/codsen-parser.umd.js` | 43 KB |

**[⬆ back to top](#)**

## Idea

This parser is aimed at processing **broken code**, HTML mixed with other languages.

## Practical side

This program assembles an AST from tokens produced by `codsen-tokenizer` ([npm](https://www.npmjs.com/package/codsen-tokenizer)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/codsen-tokenizer/)).

If it encounters problems, it raises errors in the format used by `emlint` ([npm](https://www.npmjs.com/package/emlint)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/emlint/)).

**[⬆ back to top](#)**

## Versus competition

HTML/CSS parsers on the market are aimed at parsing correct code (even though some may claim they are "cleaners").

For example, [HTML Tidy](http://infohound.net/tidy/) can't detect a missing opening bracket below:

```html
<div> div class="zz"></div></div>
```

Instead, it "cleans" the snippet into the following (doctype and body tags are added too which is another issue):

```html
...
<div>div class="zz"&gt;</div>
...
```

In theory, there should be two kinds of parsers: those that prioritise error-hunting and those that prioritise real-world usage in a browser (HTML standards, efficiency and smaller size).

The ultimate purpose of this program is to power `emlint` ([npm](https://www.npmjs.com/package/emlint)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/emlint/)) — the email template-oriented linter.

Tactically, we will use good old techniques:

- Leaning on imperative programming style to increase code readability
- `console.log`-based debugging which will allow to see the whole picture of what's happening, from the program's start to the end
- JavaScript will make it developer-friendly
- Modern tooling set up right from the beginning — API, decoupled from the UI — only a function is exported, in CJS, ESM and UMD build flavours
- Since UMD build (whole `dist/` of the Rollup) is published to npm, this program (like all others in this monorepo) can be accessed in a browser, as a script

**[⬆ back to top](#)**

## API

It will be published once the API stabilises.

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=codsen-parser%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Acodsen-parser%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=codsen-parser%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Acodsen-parser%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=codsen-parser%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Acodsen-parser%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/codsen-parser.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/codsen-parser
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/codsen-parser
[cov-img]: https://img.shields.io/badge/coverage-92.31%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/codsen-parser
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/codsen-parser
[downloads-img]: https://img.shields.io/npm/dm/codsen-parser.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/codsen-parser
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/codsen-parser
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
