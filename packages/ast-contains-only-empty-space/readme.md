# ast-contains-only-empty-space

> Returns Boolean depending if passed AST contain only empty space

[![Repository is on BitBucket][bitbucket-img]][bitbucket-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#markdown-header-install)
- [Use](#markdown-header-use)
- [Rationale](#markdown-header-rationale)
- [API](#markdown-header-api)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Install

```bash
npm i ast-contains-only-empty-space
```

```js
// consume via CommonJS require():
const containsOnlyEmptySpace = require("ast-contains-only-empty-space");
// or as an ES Module:
import containsOnlyEmptySpace from "ast-contains-only-empty-space";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                                        | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/ast-contains-only-empty-space.cjs.js` | 881 B |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/ast-contains-only-empty-space.esm.js` | 686 B |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/ast-contains-only-empty-space.umd.js` | 12 KB |

**[⬆ back to top](#markdown-header-ast-contains-only-empty-space)**

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

**[⬆ back to top](#markdown-header-ast-contains-only-empty-space)**

## Rationale

Working with parsed HTML is always a battle against the white space. Often you need to know, does certain AST piece (object/array/whatever) contain anything real, or just an empty space. That's what this library is for.

In real life, parsed HTML trees will have many levels of nested arrays, objects and strings. While it's easy to check does a plain object contain only empty space (`'\n'`, `' '`, `'\t'`, line break or a mix of thereof), it's not so easy when your object has arrays of empty objects. I want a solid, tested library which can identify emptiness (or lack of) in anything, nested or not nested.

By the way, weird things (like functions, which don't belong to parsed HTML structures) will yield a result `false`.

**[⬆ back to top](#markdown-header-ast-contains-only-empty-space)**

## API

Input - anything. Output - Boolean.

```js
empty(input); // array, object or string — normally AST (which is array of nested objects/strings/arrays)
// => true/false
```

This library does not mutate the input arguments.

**[⬆ back to top](#markdown-header-ast-contains-only-empty-space)**

## Contributing

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/ast-contains-only-empty-space/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/ast-contains-only-empty-space/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ back to top](#markdown-header-ast-contains-only-empty-space)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/ast-contains-only-empty-space.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ast-contains-only-empty-space
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/ast-contains-only-empty-space
[cov-img]: https://coveralls.io/repos/bitbucket/codsen/ast-contains-only-empty-space/badge.svg?style=flat-square&branch=master
[cov-url]: https://coveralls.io/bitbucket/codsen/ast-contains-only-empty-space?branch=master
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ast-contains-only-empty-space
[downloads-img]: https://img.shields.io/npm/dm/ast-contains-only-empty-space.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ast-contains-only-empty-space
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ast-contains-only-empty-space
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/ast-contains-only-empty-space
