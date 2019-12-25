# ast-contains-only-empty-space

> Returns Boolean depending if passed AST contain only empty space

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
- [Use](#use)
- [Rationale](#rationale)
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i ast-contains-only-empty-space
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`containsOnlyEmptySpace`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const containsOnlyEmptySpace = require("ast-contains-only-empty-space");
```

or as an ES Module:

```js
import containsOnlyEmptySpace from "ast-contains-only-empty-space";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/ast-contains-only-empty-space/dist/ast-contains-only-empty-space.umd.js"></script>
```

```js
// in which case you get a global variable "astContainsOnlyEmptySpace" which you consume like this:
const containsOnlyEmptySpace = astContainsOnlyEmptySpace;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                                        | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/ast-contains-only-empty-space.cjs.js` | 1 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/ast-contains-only-empty-space.esm.js` | 962 B |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/ast-contains-only-empty-space.umd.js` | 12 KB |

**[⬆ back to top](#)**

## Use

```js
const empty = require('ast-contains-only-empty-space')
...
// All values are empty, this means this object contains only empty space.
// Notice it's nested in an array, it does not matter.
console.log(empty([{ 'content': {} }]))
// => true

console.log(empty([{ 'tag': 'style' }]))
// => false

// Works on simple arrays as well:
console.log(empty(['   ', ' ']))
// => true

// Works on strings as well:
console.log(empty('   '))
// => true

// Object keys that have values as null are considered empty:
console.log(empty({a: null}))
// => true

// Works no matter how deeply nested input is:
console.log(empty(
  {
    a: [{
      x: {
        y: [
          {
            z: [
              '\n'
            ]
          }
        ]
      }
    }],
    b: ['\t\t\t  '],
    c: ['\n \n\n'],
    d: ['\t   ']
  }
))
// => true
```

**[⬆ back to top](#)**

## Rationale

Working with parsed HTML is always a battle against the white space. Often you need to know, does certain AST piece (object/array/whatever) contain anything real, or just an empty space. That's what this library is for.

In real life, parsed HTML trees will have many levels of nested arrays, objects and strings. While it's easy to check does a plain object contain only empty space (`'\n'`, `' '`, `'\t'`, line break or a mix of thereof), it's not so easy when your object has arrays of empty objects. I want a solid, tested library which can identify emptiness (or lack of) in anything, nested or not nested.

By the way, weird things (like functions, which don't belong to parsed HTML structures) will yield a result `false`.

**[⬆ back to top](#)**

## API

Input - anything. Output - Boolean.

```js
empty(input); // array, object or string — normally AST (which is array of nested objects/strings/arrays)
// => true/false
```

This library does not mutate the input arguments.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ast-contains-only-empty-space%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aast-contains-only-empty-space%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ast-contains-only-empty-space%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aast-contains-only-empty-space%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ast-contains-only-empty-space%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aast-contains-only-empty-space%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/ast-contains-only-empty-space.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ast-contains-only-empty-space
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ast-contains-only-empty-space
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ast-contains-only-empty-space
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ast-contains-only-empty-space
[downloads-img]: https://img.shields.io/npm/dm/ast-contains-only-empty-space.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ast-contains-only-empty-space
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ast-contains-only-empty-space
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
