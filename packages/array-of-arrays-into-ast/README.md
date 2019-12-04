# array-of-arrays-into-ast

> turns an array of arrays of data into a nested tree of plain objects

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Install

```bash
npm i array-of-arrays-into-ast
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`generateAst`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const generateAst = require("array-of-arrays-into-ast");
```

or as an ES Module:

```js
import generateAst from "array-of-arrays-into-ast";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/array-of-arrays-into-ast/dist/array-of-arrays-into-ast.umd.js"></script>
```

```js
// in which case you get a global variable "arrayOfArraysIntoAst" which you consume like this:
const generateAst = arrayOfArraysIntoAst;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                                   | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/array-of-arrays-into-ast.cjs.js` | 2 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/array-of-arrays-into-ast.esm.js` | 1 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/array-of-arrays-into-ast.umd.js` | 41 KB |

**[⬆ back to top](#)**

## Table of Contents

- [Install](#install)
- [What it does](#what-it-does)
- [API](#api)
- [`opts.dedupe`](#optsdedupe)
- [Principles](#principles)
- [Compared vs. `datastructures-js`](#compared-vs-datastructures-js)
- [Contributing](#contributing)
- [Licence](#licence)

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

**[⬆ back to top](#)**

## API

**generateAst (input, [opts])**

### API - Input

| Input argument | Type                         | Obligatory? | Description                                    |
| -------------- | ---------------------------- | ----------- | ---------------------------------------------- |
| `input`        | Array of zero or more arrays | yes         | Source of data to put into an AST              |
| `otps`         | Plain object                 | no          | An Optional Options Object. See its API below. |

**[⬆ back to top](#)**

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

**[⬆ back to top](#)**

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

**[⬆ back to top](#)**

## Principles

Every object's key will have a value of `array`.

- `null` inside that array means it's the tip of the branch.

- An object inside that array means the branch continues.

Simples.

## Compared vs. `datastructures-js`

There are libraries that produce and manage _trie_ data structures, for example, [datastructures-js](https://www.npmjs.com/package/datastructures-js#trie). In particular case, the problem is, the data structure is abstracted behind the `let trie = ds.trie();` and you can't access it directly, traversing the nested tree of arrays and objects.

[datastructures-js](https://www.npmjs.com/package/datastructures-js#trie) _trie_ would limit to `search()`, `traverse()` and `count()` methods. However, we need to recursively traverse every node and look up and down, what's around it.

Here's where this library comes in. It doesn't abstract the data it's producing - you get a nested plain object which you can traverse and further process any way you like, using a vast ocean of `object-` processing libraries.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=array-of-arrays-into-ast%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aarray-of-arrays-into-ast%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=array-of-arrays-into-ast%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aarray-of-arrays-into-ast%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=array-of-arrays-into-ast%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aarray-of-arrays-into-ast%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/array-of-arrays-into-ast.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/array-of-arrays-into-ast
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/array-of-arrays-into-ast
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/array-of-arrays-into-ast
[downloads-img]: https://img.shields.io/npm/dm/array-of-arrays-into-ast.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/array-of-arrays-into-ast
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/array-of-arrays-into-ast
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
