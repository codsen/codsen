# string-overlap-one-on-another

> Lay one string on top of another, with an optional offset

[![Repository is on BitBucket][bitbucket-img]][bitbucket-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#markdown-header-install)
- [Idea](#markdown-header-idea)
- [API](#markdown-header-api)
- [Practical use](#markdown-header-practical-use)
- [Edge cases](#markdown-header-edge-cases)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Install

```bash
npm i string-overlap-one-on-another
```

```js
// consume via a require():
const overlap = require("string-overlap-one-on-another");
// or as a ES Module:
import overlap from "string-overlap-one-on-another";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                                        | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-overlap-one-on-another.cjs.js` | 3 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-overlap-one-on-another.esm.js` | 3 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-overlap-one-on-another.umd.js` | 28 KB |

**[⬆ back to top](#markdown-header-string-overlap-one-on-another)**

## Idea

Place one string "on top" of another:

```js
const str1 = "aaa";
const str2 = "bbb";
const result = overlap(str1, str2, { offset: -2 });
console.log(
  `${`\u001b[${33}m${`result`}\u001b[${39}m`} = ${JSON.stringify(
    result,
    null,
    4
  )}`
);
// result = "bbbaa"
```

In essence,

```js
//           aaa
//      +  bbb      (negative offset of 2 means it's pushed to the left by 2 places)
//         -----
//      =  bbbaa
```

**[⬆ back to top](#markdown-header-string-overlap-one-on-another)**

## API

**overlap(str1, str2, [, opts])**

### API - Input

API for both methods is the same:

| Input argument | Type         | Obligatory? | Description                                                         |
| -------------- | ------------ | ----------- | ------------------------------------------------------------------- |
| `str1`         | String       | yes         | The string which will be put "under" `str2`                         |
| `str2`         | String       | yes         | The string which will be put "over" `str1`                          |
| `opts`         | Plain object | no          | An Optional Options Object. See its API below, in a separate table. |

**[⬆ back to top](#markdown-header-string-overlap-one-on-another)**

### Optional Options Object

| Optional Options Object's key | Type of its value                    | Default                                                                                                                                                                                                                                             | Description                                                                                                                                                         |
| ----------------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| {                             |                                      |                                                                                                                                                                                                                                                     |
| `offset`                      | Positive or negative integer or zero | `0`                                                                                                                                                                                                                                                 | It instructs to offset the top string by this many characters to the right (if a positive number) or to the left (if a negative number). The default value is zero. |
| `offsetFillerCharacter`       | String                               | `` (space) | If the offset value (character amount to push left) pushes the `str2` outside the boundaries of `str1` and not even there's no overlap, but there is a gap, this gap is formed out of these characters. The default is a single space. |
| }                             |                                      |                                                                                                                                                                                                                                                     |

Here are all the defaults in one place:

```js
{
  offset: 0, // how many characters str2 is to the right? (negative means it's off to the left)
  offsetFillerCharacter: " " // how many characters str2 is to the right? (negative means it's off to the left)
}
```

**[⬆ back to top](#markdown-header-string-overlap-one-on-another)**

## Practical use

It will be used in [ranges-recursive-resolve](https://www.npmjs.com/package/ranges-recursive-resolve) when calculating the third argument's value ("string to be added") when two or more ranges clash and all have third arguments. _Recursive resolve_ "joins" two ranges applied on the same string, performed over time. One range "changes" the string and then another range changes the previous result further. When multiple ranges insert or replace character range with some string, two such "replacements" are the same as laying one on top of another. Precisely what this library does.

See other range libraries here: https://bitbucket.org/account/user/codsen/projects/RNG

**[⬆ back to top](#markdown-header-string-overlap-one-on-another)**

## Edge cases

The algorithm is the following:

1. If one and only one of two input strings is zero-long, the other string is returned as a result.
2. If both input strings are empty, an empty string is returned.
3. If both input strings are non-empty, the result is second string overlaid on the first, considering the offset.

Practically,

```js
const res = overlap("", "456", { offset: 99, offsetFillerCharacter: "zzzz" });
console.log(`res = ${res}`);
// => res = "456"
```

Consider the sample above - even though offset is long enough to warrant the filler, no characters are added to the `str2`, `456` because the first argument, `str1` is empty.

**[⬆ back to top](#markdown-header-string-overlap-one-on-another)**

## Contributing

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/string-overlap-one-on-another/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/string-overlap-one-on-another/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ back to top](#markdown-header-string-overlap-one-on-another)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/string-overlap-one-on-another.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-overlap-one-on-another
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/string-overlap-one-on-another
[cov-img]: https://coveralls.io/repos/bitbucket/codsen/string-overlap-one-on-another/badge.svg?style=flat-square&branch=master
[cov-url]: https://coveralls.io/bitbucket/codsen/string-overlap-one-on-another?branch=master
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-overlap-one-on-another
[downloads-img]: https://img.shields.io/npm/dm/string-overlap-one-on-another.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-overlap-one-on-another
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-overlap-one-on-another
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/string-overlap-one-on-another
