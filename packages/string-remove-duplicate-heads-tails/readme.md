# string-remove-duplicate-heads-tails

> Detect and (recursively) remove head and tail wrappings around the input string

[![Minimum Node version required][node-img]][node-url]
[![Build Status][travis-img]][travis-url]
[![Coverage][cov-img]][cov-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Known Vulnerabilities][vulnerabilities-img]][vulnerabilities-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

<!-- prettier-ignore-start -->

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Idea](#idea)
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<!-- prettier-ignore-end -->

## Install

```bash
npm i string-remove-duplicate-heads-tails
```

```js
// consume via a CommonJS require:
const removeDuplicateHeadsTails = require("string-remove-duplicate-heads-tails");
// or as an ES Module:
import removeDuplicateHeadsTails from "string-remove-duplicate-heads-tails";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                                              | Size       |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------------------- | ---------- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-remove-duplicate-heads-tails.cjs.js` | 13&nbsp;KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-remove-duplicate-heads-tails.esm.js` | 13&nbsp;KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-remove-duplicate-heads-tails.umd.js` | 34&nbsp;KB |

**[⬆ &nbsp;back to top](#)**

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

**[⬆ &nbsp;back to top](#)**

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

**[⬆ &nbsp;back to top](#)**

### An Optional Options Object

| Optional Options Object's key | Type of its value                                                  | Default  | Description                                                             |
| ----------------------------- | ------------------------------------------------------------------ | -------- | ----------------------------------------------------------------------- |
| {                             |                                                                    |          |
| `heads`                       | Non-empty **string** or **array** of one or more non-empty strings | `['{{']` | Put here the way you mark the beginnings of your variables in a string. |
| `tails`                       | Non-empty **string** or **array** of one or more non-empty strings | `['}}']` | Put here the way you mark the endings of your variables in a string.    |
| }                             |                                                                    |          |

These double curlies are default for [Nunjucks](https://mozilla.github.io/nunjucks/)/Jinja and many other templating languages. Nunjucks is my favourite.

**[⬆ &nbsp;back to top](#)**

### API - Output

Returns a string

## Contributing

* If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/string-remove-duplicate-heads-tails/issues).

* If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/string-remove-duplicate-heads-tails/issues).

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/string-remove-duplicate-heads-tails.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-remove-duplicate-heads-tails
[travis-img]: https://img.shields.io/travis/codsen/string-remove-duplicate-heads-tails.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/string-remove-duplicate-heads-tails
[cov-img]: https://coveralls.io/repos/github/codsen/string-remove-duplicate-heads-tails/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/string-remove-duplicate-heads-tails?branch=master
[overall-img]: https://img.shields.io/bithound/code/github/codsen/string-remove-duplicate-heads-tails.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/string-remove-duplicate-heads-tails
[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/string-remove-duplicate-heads-tails.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/string-remove-duplicate-heads-tails/master/dependencies/npm
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-remove-duplicate-heads-tails
[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/string-remove-duplicate-heads-tails.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/string-remove-duplicate-heads-tails/master/dependencies/npm
[vulnerabilities-img]: https://snyk.io/test/github/codsen/string-remove-duplicate-heads-tails/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/string-remove-duplicate-heads-tails
[downloads-img]: https://img.shields.io/npm/dm/string-remove-duplicate-heads-tails.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-remove-duplicate-heads-tails
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-remove-duplicate-heads-tails
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://github.com/prettier/prettier
[license-img]: https://img.shields.io/npm/l/string-remove-duplicate-heads-tails.svg?style=flat-square
[license-url]: https://github.com/codsen/string-remove-duplicate-heads-tails/blob/master/license.md
