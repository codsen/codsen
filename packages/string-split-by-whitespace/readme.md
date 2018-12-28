# string-split-by-whitespace

> Split string into array by chunks of whitespace

[![Repository is on BitBucket][bitbucket-img]][bitbucket-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Table of Contents](#markdown-header-markdown-header-table-of-contents)
- [Install](#markdown-header-markdown-header-install)
- [Idea](#markdown-header-markdown-header-idea)
- [API](#markdown-header-markdown-header-api)
- [Contributing](#markdown-header-markdown-header-contributing)
- [Licence](#markdown-header-markdown-header-licence)

## Install

```bash
npm i string-split-by-whitespace
```

```js
// consume via a CommonJS require:
const splitByWhitespace = require("string-split-by-whitespace");
// or as an ES Module:
import splitByWhitespace from "string-split-by-whitespace";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                                     | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-split-by-whitespace.cjs.js` | 2 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-split-by-whitespace.esm.js` | 2 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-split-by-whitespace.umd.js` | 20 KB |

**[⬆ back to top](#)**

## Idea

```js
const splitByWhitespace = require("string-split-by-whitespace");

const res1 = splitByWhitespace("aaa bbb");
console.log("res1 = " + JSON.stringify(res1, null, 4));
// => ['aaa', 'bbb']

const res2 = splitByWhitespace("\n\n\n\n  aaa \t\t\t bbb  \n\n\n");
console.log("res2 = " + JSON.stringify(res2, null, 4));
// => ['aaa', 'bbb']
```

**[⬆ back to top](#)**

## API

```js
splitByWhitespace(str, [opts]);
```

### API - Input

| Input argument | Type         | Obligatory? | Description                                       |
| -------------- | ------------ | ----------- | ------------------------------------------------- |
| `str`          | String       | yes         | Source string upon which to perform the operation |
| `opts`         | Plain object | no          | Optional Options Object, see below for its API    |

**[⬆ back to top](#)**

### An Optional Options Object

| Optional Options Object's key | Type of its value                  | Default | Description                                                                                                                                                                 |
| ----------------------------- | ---------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| {                             |                                    |         |
| `ignoreRanges`                | Array of zero or more range arrays | `[]`    | Feed zero or more string slice ranges, arrays of two natural number indexes, like `[[1, 5], [6, 10]]`. Algorithm will not include these string index ranges in the results. |
| }                             |                                    |         |

The `opts.ignoreRanges` can be an empty array, but if it contains anything else then arrays inside, error will be thrown.

**[⬆ back to top](#)**

### `opts.ignoreRanges`

It works like cropping the ranges. The characters in those ranges will not be included in the result.

For example, use library [string-find-heads-tails](https://bitbucket.org/codsen/string-find-heads-tails) to extract the ranges of variables' _heads_ and _tails_ in a string. Then ignore all variables' _heads_ and _tails_ when splitting:

```js
const input = "some interesting {{text}} {% and %} {{ some more }} text.";
const headsAndTails = strFindHeadsTails(
  input,
  ["{{", "{%"],
  ["}}", "%}"]
).reduce((acc, curr) => {
  acc.push([curr.headsStartAt, curr.headsEndAt]);
  acc.push([curr.tailsStartAt, curr.tailsEndAt]);
  return acc;
}, []);
const res1 = split(input, {
  ignoreRanges: headsAndTails
});
console.log(`res1 = ${JSON.stringify(res1, null, 4)}`);
// => ['some', 'interesting', 'text', 'and', 'some', 'more', 'text.']
```

Equally, you can ignore whole variables, from _heads_ to _tails_, including variable's names:

```js
const input = "some interesting {{text}} {% and %} {{ some more }} text.";
const wholeVariables = strFindHeadsTails(
  input,
  ["{{", "{%"],
  ["}}", "%}"]
).reduce((acc, curr) => {
  acc.push([curr.headsStartAt, curr.tailsEndAt]);
  return acc;
}, []);
const res2 = split(input, {
  ignoreRanges: wholeVariables
});
// => ['some', 'interesting', 'text.']
```

We need to perform the array.reduce to adapt to the [string-find-heads-tails](https://bitbucket.org/codsen/string-find-heads-tails) output, which is in format (index numbers are only examples):

```js
[
  {
    headsStartAt: ...,
    headsEndAt: ...,
    tailsStartAt: ...,
    tailsEndAt: ...,
  },
  ...
]
```

and with the help of `array.reduce` we turn it into our format:

(first example with `res1`)

```js
[
  [headsStartAt, headsEndAt],
  [tailsStartAt, tailsEndAt],
  ...
]
```

(second example with `res2`)

```js
[
  [headsStartAt, tailsEndAt],
  ...
]
```

**[⬆ back to top](#)**

## Contributing

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/string-split-by-whitespace/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/string-split-by-whitespace/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/string-split-by-whitespace.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-split-by-whitespace
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/string-split-by-whitespace
[cov-img]: https://coveralls.io/repos/bitbucket/codsen/string-split-by-whitespace/badge.svg?style=flat-square&branch=master
[cov-url]: https://coveralls.io/bitbucket/codsen/string-split-by-whitespace?branch=master
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-split-by-whitespace
[downloads-img]: https://img.shields.io/npm/dm/string-split-by-whitespace.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-split-by-whitespace
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-split-by-whitespace
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/string-split-by-whitespace
