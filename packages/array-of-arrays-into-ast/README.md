# array-of-arrays-into-ast

> turns an array of arrays of data into a nested tree of plain objects

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

## Install

```bash
npm i array-of-arrays-into-ast
```

```js
// consume as CommonJS require():
const generateAst = require("array-of-arrays-into-ast");
// or as ES Module:
import generateAst from "array-of-arrays-into-ast";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                                   | Size       |
| ------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------------------- | ---------- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/array-of-arrays-into-ast.cjs.js` | 2&nbsp;KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/array-of-arrays-into-ast.esm.js` | 1&nbsp;KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/array-of-arrays-into-ast.umd.js` | 36&nbsp;KB |

**[⬆ &nbsp;back to top](#)**

## Table of Contents

<!-- prettier-ignore-start -->

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [What it does](#what-it-does)
- [API](#api)
- [`opts.dedupe`](#optsdedupe)
- [Principles](#principles)
- [Compared vs. `datastructures-js`](#compared-vs-datastructures-js)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<!-- prettier-ignore-end -->

## What it does

It consumes array of arrays and produces a [trie](https://en.wikipedia.org/wiki/Trie)-like AST from them:

Input:

```js
[[1, 2, 3], [1, 2], [5]];
```

Output:

```js
{
  1: [
    {
      2: [
        {
          3: [null]
        },
        null
      ]
    }
  ],
  5: [null]
}
```

This library is a piece of a breakthrough code generator I'm producing.

**[⬆ &nbsp;back to top](#)**

## API

**generateAst (input, [opts])**

### API - Input

| Input argument | Type                         | Obligatory? | Description                                    |
| -------------- | ---------------------------- | ----------- | ---------------------------------------------- |
| `input`        | Array of zero or more arrays | yes         | Source of data to put into an AST              |
| `otps`         | Plain object                 | no          | An Optional Options Object. See its API below. |

**[⬆ &nbsp;back to top](#)**

### An Optional Options Object

Type: `object` - an Optional Options Object.

| `options` object's key | Type    | Default | Description     |
| ---------------------- | ------- | ------- | --------------- |
| {                      |         |         |
| `dedupe`               | Boolean | `true`  | Skip duplicates |
| }                      |         |         |

**Here are all defaults in one place for copying**:

```js
{
  dedupe: true,
}
```

When unused, Optional Options Object can also be passed as a `null` or `undefined` value.

**[⬆ &nbsp;back to top](#)**

### API - Output

| Type         | Description      |
| ------------ | ---------------- |
| Plain object | AST of the input |

## `opts.dedupe`

If you generate the AST with default settings, `dedupe` setting will be active and duplicate paths won't be created:

```js
import generateAst from "array-of-arrays-into-ast";
const res = generateAst([[1], [1], [1]]);
console.log(
  `${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(res, null, 4)}`
);
// res = {
//   1: [null]
// }
```

Now, see what happens when you turn off `opts.dedupe`:

```js
import generateAst from "array-of-arrays-into-ast";
const res = generateAst([[1], [1], [1]], { dedupe: false });
console.log(
  `${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(res, null, 4)}`
);
// res = {
//   1: [null, null, null]
// }
}
```

Notice how entries for each branch were created.

Generally, I don't see the reason why you'd want duplicates, but the setting is there if you ever need it. 👍🏻

**[⬆ &nbsp;back to top](#)**

## Principles

Every object's key will have a value of `array`.

* `null` inside that array means it's the tip of the branch.

* An object inside that array means the branch continues.

Simples.

## Compared vs. `datastructures-js`

There are libraries that produce and manage _trie_ data structures, for example, [datastructures-js](https://www.npmjs.com/package/datastructures-js#trie). In particular case, the problem is, the data structure is abstracted behind the `let trie = ds.trie();` and you can't access it directly, traversing the nested tree of arrays and objects.

[datastructures-js](https://www.npmjs.com/package/datastructures-js#trie) _trie_ would limit to `search()`, `traverse()` and `count()` methods. However, we need to recursively traverse every node and look up and down, what's around it.

Here's where this library comes in. It doesn't abstract the data it's producing - you get a nested plain object which you can traverse and further process any way you like, using a vast ocean of `object-` processing libraries.

**[⬆ &nbsp;back to top](#)**

## Contributing

* If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/array-of-arrays-into-ast/issues).

* If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/array-of-arrays-into-ast/issues).

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/array-of-arrays-into-ast.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/array-of-arrays-into-ast
[travis-img]: https://img.shields.io/travis/codsen/array-of-arrays-into-ast.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/array-of-arrays-into-ast
[cov-img]: https://coveralls.io/repos/github/codsen/array-of-arrays-into-ast/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/array-of-arrays-into-ast?branch=master
[overall-img]: https://img.shields.io/bithound/code/github/codsen/array-of-arrays-into-ast.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/array-of-arrays-into-ast
[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/array-of-arrays-into-ast.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/array-of-arrays-into-ast/master/dependencies/npm
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/array-of-arrays-into-ast
[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/array-of-arrays-into-ast.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/array-of-arrays-into-ast/master/dependencies/npm
[vulnerabilities-img]: https://snyk.io/test/github/codsen/array-of-arrays-into-ast/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/array-of-arrays-into-ast
[downloads-img]: https://img.shields.io/npm/dm/array-of-arrays-into-ast.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/array-of-arrays-into-ast
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/array-of-arrays-into-ast
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://github.com/prettier/prettier
[license-img]: https://img.shields.io/npm/l/array-of-arrays-into-ast.svg?style=flat-square
[license-url]: https://github.com/codsen/array-of-arrays-into-ast/blob/master/license.md
