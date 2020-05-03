# string-overlap-one-on-another

> Lay one string on top of another, with an optional offset

[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![no dependencies][no-deps-img]][no-deps-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#install)
- [Idea](#idea)
- [API](#api)
- [Edge cases](#edge-cases)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i string-overlap-one-on-another
```
The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`overlap`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const overlap = require("string-overlap-one-on-another");
```

or as an ES Module:

```js
import overlap from "string-overlap-one-on-another";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/string-overlap-one-on-another/dist/string-overlap-one-on-another.umd.js"></script>
```

```js
// in which case you get a global variable "stringOverlapOneOnAnother" which you consume like this:
const overlap = stringOverlapOneOnAnother;
```

This package has three builds in `dist/` folder:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/string-overlap-one-on-another.cjs.js` | 4 KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/string-overlap-one-on-another.esm.js` | 3 KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/string-overlap-one-on-another.umd.js` | 3 KB

**[⬆ back to top](#)**

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

**[⬆ back to top](#)**

## API

**overlap(str1, str2, [, opts])**

### API - Input

API for both methods is the same:

| Input argument | Type         | Obligatory? | Description                                                         |
| -------------- | ------------ | ----------- | ------------------------------------------------------------------- |
| `str1`         | String       | yes         | The string which will be put "under" `str2`                         |
| `str2`         | String       | yes         | The string which will be put "over" `str1`                          |
| `opts`         | Plain object | no          | An Optional Options Object. See its API below, in a separate table. |

**[⬆ back to top](#)**

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

**[⬆ back to top](#)**

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

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-overlap-one-on-another%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-overlap-one-on-another%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-overlap-one-on-another%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-overlap-one-on-another%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-overlap-one-on-another%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-overlap-one-on-another%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-overlap-one-on-another
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-overlap-one-on-another
[no-deps-img]: https://img.shields.io/badge/-no%20dependencies-brightgreen?style=flat-square
[no-deps-url]: https://www.npmjs.com/package/string-overlap-one-on-another?activeTab=dependencies
[downloads-img]: https://img.shields.io/npm/dm/string-overlap-one-on-another.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-overlap-one-on-another
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-overlap-one-on-another
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
