# ranges-merge

> Merge and sort arrays which mean string slice ranges

[![Minimum Node version required][node-img]][node-url]
[![Repository is on BitBucket][bitbucket-img]][bitbucket-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#markdown-header-install)
- [The Idea](#markdown-header-the-idea)
- [API](#markdown-header-api)
- [`progressFn` - the 2nd input argument](#markdown-header-progressfn-the-2nd-input-argument)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Install

```bash
npm i ranges-merge
```

```js
// consume as a CommonJS require:
const mergeRanges = require("ranges-merge");
// or as native ES Module:
import mergeRanges from "ranges-merge";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                       | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/ranges-merge.cjs.js` | 3 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/ranges-merge.esm.js` | 3 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/ranges-merge.umd.js` | 29 KB |

**[⬆ back to top](#markdown-header-ranges-merge)**

## The Idea

If, after sorting, two ranges in the vicinity have the same edge value (like `2` below), merge those ranges:

```js
const rangesMerge = require('ranges-merge')
rangesMerge([
  [1, 2], [2, 3], [9, 10]
])
// => [
//   [1, 3], [9, 10]
// ]
}
```

If ranges overlap, merge them too:

```js
const rangesMerge = require('ranges-merge')
rangesMerge([
  [1, 5], [2, 10]
])
// => [
//   [1, 10]
// ]
}
```

**[⬆ back to top](#markdown-header-ranges-merge)**

## API

**rangesMerge(arrOfRanges\[, progressFn])** — in other words, this library gives you a _function_ and you must feed _an array_ into its first argument and also if you wish, you can feed a second argument, a function (bracket in `[, progressFn]` means "optional").

It returns a new array of zero or more arrays, with ranges merged (where applicable). Original input is not mutated.

| Input argument | Type     | Obligatory? | Description                                                                                                                                           |
| -------------- | -------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `arrOfRanges`  | Array    | yes         | Array of zero or more arrays meaning natural number ranges (2 elements each)                                                                          |
| `progressFn`   | Function | no          | If you provide a function, it will be fed a natural number many times, for each percentage (mostly) of the work done. It's handy in worker scenarios. |

**[⬆ back to top](#markdown-header-ranges-merge)**

## `progressFn` - the 2nd input argument

Consider this example (notice an arrow function in the second input argument):

```js
console.log(
  mergeRanges([[1, 5], [11, 15], [6, 10], [16, 20], [10, 30]], perc => {
    console.log(`done: ${perc}`);
  })
);
//
// done: 0
// done: 1
// done: 2
// done: 3
// done: 4
// done: 4
// done: 5
// done: 21
// done: 40
// done: 60
// done: 79
// done: 99
// [[1, 5], [6, 30]]
```

Imagine, instead of `console.log`, this function could sit in a worker and report its progress, then, finally, ping the last value - result.

Whatever function you give in second argument, it will be called with percentage done so far given as the first argument. Grab that argument and do whatever you want with it in your function.

**[⬆ back to top](#markdown-header-ranges-merge)**

## Contributing

- If you see an error, [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=ranges-merge%20package%20-%20put%20title%20here).
- If you want a new feature but can't code it up yourself, also [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=ranges-merge%20package%20-%20put%20title%20here). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=ranges-merge%20package%20-%20put%20title%20here). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://bitbucket.org/codsen/codsen/src/) via BitBucket, then write code, then file a pull request via BitBucket. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#markdown-header-ranges-merge)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/ranges-merge.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ranges-merge
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/codsen/src/master/packages/ranges-merge
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ranges-merge
[downloads-img]: https://img.shields.io/npm/dm/ranges-merge.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ranges-merge
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ranges-merge
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/codsen/src/master/packages/ranges-merge
