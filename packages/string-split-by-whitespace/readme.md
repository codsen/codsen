# string-split-by-whitespace

> Split string into array by chunks of whitespace

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
npm i string-split-by-whitespace
```

```js
// consume via a CommonJS require:
const splitByWhitespace = require("string-split-by-whitespace");
// or as an ES Module:
import splitByWhitespace from "string-split-by-whitespace";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                                     | Size       |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------------------- | ---------- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-split-by-whitespace.cjs.js` | 2&nbsp;KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-split-by-whitespace.esm.js` | 2&nbsp;KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-split-by-whitespace.umd.js` | 20&nbsp;KB |

**[⬆ &nbsp;back to top](#)**

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

**[⬆ &nbsp;back to top](#)**

## API

```js
splitByWhitespace(str, [opts]);
```

### API - Input

| Input argument | Type         | Obligatory? | Description                                       |
| -------------- | ------------ | ----------- | ------------------------------------------------- |
| `str`          | String       | yes         | Source string upon which to perform the operation |
| `opts`         | Plain object | no          | Optional Options Object, see below for its API    |

**[⬆ &nbsp;back to top](#)**

### An Optional Options Object

| Optional Options Object's key | Type of its value                  | Default | Description                                                                                                                                                                 |
| ----------------------------- | ---------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| {                             |                                    |         |
| `ignoreRanges`                | Array of zero or more range arrays | `[]`    | Feed zero or more string slice ranges, arrays of two natural number indexes, like `[[1, 5], [6, 10]]`. Algorithm will not include these string index ranges in the results. |
| }                             |                                    |         |

The `opts.ignoreRanges` can be an empty array, but if it contains anything else then arrays inside, error will be thrown.

**[⬆ &nbsp;back to top](#)**

### `opts.ignoreRanges`

It works like cropping the ranges. The characters in those ranges will not be included in the result.

For example, use library [string-find-heads-tails](https://github.com/codsen/string-find-heads-tails) to extract the ranges of variables' _heads_ and _tails_ in a string. Then ignore all variables' _heads_ and _tails_ when splitting:

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

We need to perform the array.reduce to adapt to the [string-find-heads-tails](https://github.com/codsen/string-find-heads-tails) output, which is in format (index numbers are only examples):

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

**[⬆ &nbsp;back to top](#)**

## Contributing

* If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/string-split-by-whitespace/issues).

* If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/string-split-by-whitespace/issues).

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/string-split-by-whitespace.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-split-by-whitespace
[travis-img]: https://img.shields.io/travis/codsen/string-split-by-whitespace.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/string-split-by-whitespace
[cov-img]: https://coveralls.io/repos/github/codsen/string-split-by-whitespace/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/string-split-by-whitespace?branch=master
[overall-img]: https://img.shields.io/bithound/code/github/codsen/string-split-by-whitespace.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/string-split-by-whitespace
[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/string-split-by-whitespace.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/string-split-by-whitespace/master/dependencies/npm
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-split-by-whitespace
[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/string-split-by-whitespace.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/string-split-by-whitespace/master/dependencies/npm
[vulnerabilities-img]: https://snyk.io/test/github/codsen/string-split-by-whitespace/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/string-split-by-whitespace
[downloads-img]: https://img.shields.io/npm/dm/string-split-by-whitespace.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-split-by-whitespace
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-split-by-whitespace
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://github.com/prettier/prettier
[license-img]: https://img.shields.io/npm/l/string-split-by-whitespace.svg?style=flat-square
[license-url]: https://github.com/codsen/string-split-by-whitespace/blob/master/license.md
