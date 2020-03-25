# string-remove-duplicate-heads-tails

> Detect and (recursively) remove head and tail wrappings around the input string

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
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i string-remove-duplicate-heads-tails
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`removeDuplicateHeadsTails`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const removeDuplicateHeadsTails = require("string-remove-duplicate-heads-tails");
```

or as an ES Module:

```js
import removeDuplicateHeadsTails from "string-remove-duplicate-heads-tails";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/string-remove-duplicate-heads-tails/dist/string-remove-duplicate-heads-tails.umd.js"></script>
```

```js
// in which case you get a global variable "stringRemoveDuplicateHeadsTails" which you consume like this:
const removeDuplicateHeadsTails = stringRemoveDuplicateHeadsTails;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                                              | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-remove-duplicate-heads-tails.cjs.js` | 9 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-remove-duplicate-heads-tails.esm.js` | 8 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-remove-duplicate-heads-tails.umd.js` | 20 KB |

**[⬆ back to top](#)**

## Idea

Let's say, you know that variables are wrapped with _heads_, for example, `{{` and _tails_, `}}`.

For example:

```js
"Hi {{ first_name }}!";
```

This library detects and deletes redundant heads and tails wrapped around the **whole** input string:

```js
'{{ Hi {{ first_name }}! }}' => 'Hi {{ first_name }}!'
```

But it's also smart and detects **legit** heads and tails at the edges of string:

:exclamation: `{{ first_name }} {{ last_name }}` is not turned into `first_name }} {{ last_name`.

That's what this library is mainly about — being able to detect, are outer heads and tails currently wrapping **a single chunk** of text, or are those heads and tails from **separate chunks**.

Also, this lib removes the leading/trailing empty clumps of empty heads/tails, with or without empty space:

```js
// without whitespace:
`{{}}{{}} {{}}{{}} {{}}{{}} a {{}}{{}}` => `a`
// with whitespace:
`{{   \n   }}   \t   a   \n\n {{ \n\n \n\n   }}   \t\t` => `a`
```

Obviously, you can configure `heads` and `tails` to be whatever you like, single string or array of them. Also, the length of the different heads in your given set can be different.

**[⬆ back to top](#)**

## API

```js
removeDuplicateHeadsTails(str, [opts]);
```

### API - Input

| Input argument | Type         | Obligatory? | Description                                       |
| -------------- | ------------ | ----------- | ------------------------------------------------- |
| `str`          | String       | yes         | Source string upon which to perform the operation |
| `opts`         | Plain object | no          | Optional Options Object, see below for its API    |

If input string is not given, it will `throw`.

**[⬆ back to top](#)**

### An Optional Options Object

| Optional Options Object's key | Type of its value                                                  | Default  | Description                                                             |
| ----------------------------- | ------------------------------------------------------------------ | -------- | ----------------------------------------------------------------------- |
| {                             |                                                                    |          |
| `heads`                       | Non-empty **string** or **array** of one or more non-empty strings | `['{{']` | Put here the way you mark the beginnings of your variables in a string. |
| `tails`                       | Non-empty **string** or **array** of one or more non-empty strings | `['}}']` | Put here the way you mark the endings of your variables in a string.    |
| }                             |                                                                    |          |

These double curlies are default for [Nunjucks](https://mozilla.github.io/nunjucks/)/Jinja and many other templating languages. Nunjucks is my favourite.

**[⬆ back to top](#)**

### API - Output

Returns a string

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-remove-duplicate-heads-tails%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-remove-duplicate-heads-tails%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-remove-duplicate-heads-tails%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-remove-duplicate-heads-tails%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-remove-duplicate-heads-tails%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-remove-duplicate-heads-tails%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-remove-duplicate-heads-tails
[cov-img]: https://img.shields.io/badge/coverage-98.56%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-remove-duplicate-heads-tails
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-remove-duplicate-heads-tails
[downloads-img]: https://img.shields.io/npm/dm/string-remove-duplicate-heads-tails.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-remove-duplicate-heads-tails
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-remove-duplicate-heads-tails
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
