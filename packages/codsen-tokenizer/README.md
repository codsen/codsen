# codsen-tokenizer

> Tokenizer for mixed inputs aiming at broken code, especially HTML & CSS

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
- [Highlights](#highlights)
- [Versus competition](#versus-competition)
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i codsen-tokenizer
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`tokenizer`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const tokenizer = require("codsen-tokenizer");
```

or as an ES Module:

```js
import tokenizer from "codsen-tokenizer";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/codsen-tokenizer/dist/codsen-tokenizer.umd.js"></script>
```

```js
// in which case you get a global variable "codsenTokenizer" which you consume like this:
const tokenizer = codsenTokenizer;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                           | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------ | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/codsen-tokenizer.cjs.js` | 23 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/codsen-tokenizer.esm.js` | 24 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/codsen-tokenizer.umd.js` | 43 KB |

**[⬆ back to top](#)**

## Highlights

This tokenizer is aimed at processing **broken code**, HTML mixed with other languages.

- Aimed at broken code — you won't surprise the parser — tokenizer will surprise _you_
- Finds boundaries between mixed code: html, css, esp tags, EOL characters etc
- Heuristical ESP (Email Service Provider) and templating tag recognition, including all major ESP's on the market tested extra

**[⬆ back to top](#)**

## Versus competition

Here are all the common parsers/tokenizers in the market currently:

- Angular
- HTMLParser2
- Hyntax
- Parse5
- PostHTML-parser
- svelte
- vue

Some of them promise to be resilient to code errors but that's only promises. In real life neither one of the above can properly tackle the simplest example:

```
<div> div class="zz"></div></div>
```

Try yourself in https://astexplorer.net/

If human programmer looked at the snippet above, what would they see?

Well, an opening div, a div with missing opening bracket and two closing divs.

That's what this parser will ping to a given callback, four tokens:

```
{
    "type": "html",
    "start": 0,
    "end": 5,
    ...
},
{
    "type": "text",
    "start": 5,
    "end": 21,
    ...
},
{
    "type": "html",
    "start": 21,
    "end": 27,
    ...
},
{
    "type": "html",
    "start": 27,
    "end": 33,
    ...
}
```

The purpose of this tokenizer is to find boundaries between text, html, css and unknown templating language chunks/tokens. It's up to you what you are going to do with that info — `emlint` ([npm](https://www.npmjs.com/package/emlint)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/emlint/)) for example, will use it to flag up code errors.

**[⬆ back to top](#)**

## API

It will be published once the API stabilises.

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=codsen-tokenizer%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Acodsen-tokenizer%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=codsen-tokenizer%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Acodsen-tokenizer%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=codsen-tokenizer%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Acodsen-tokenizer%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/codsen-tokenizer.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/codsen-tokenizer
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/codsen-tokenizer
[cov-img]: https://img.shields.io/badge/coverage-92.84%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/codsen-tokenizer
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/codsen-tokenizer
[downloads-img]: https://img.shields.io/npm/dm/codsen-tokenizer.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/codsen-tokenizer
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/codsen-tokenizer
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
