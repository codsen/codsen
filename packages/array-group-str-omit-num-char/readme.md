# array-group-str-omit-num-char

> Groups array of strings by omitting number characters

[![Minimum Node version required][node-img]][node-url]
[![Repository is on BitBucket][bitbucket-img]][bitbucket-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Install

```bash
npm i array-group-str-omit-num-char
```

```js
// consume as CommonJS require():
const group = require("array-group-str-omit-num-char");
// or as ES Module:
import group from "array-group-str-omit-num-char";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                                        | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/array-group-str-omit-num-char.cjs.js` | 3 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/array-group-str-omit-num-char.esm.js` | 3 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/array-group-str-omit-num-char.umd.js` | 41 KB |

**[⬆ back to top](#markdown-header-array-group-str-omit-num-char)**

## Table of Contents

- [Install](#markdown-header-install)
- [Idea](#markdown-header-idea)
- [API](#markdown-header-api)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Idea

Take an array of strings and if they differ only in number characters, group them.

For example, consider this input - array of strings:

```js
[
  "aaaaaa9-1"
  "aaaaaa9-2"
  "bbbbbb"
  "aaaaaa9-3"
]
```

Output - plain object:

{
"aaaaaa9-\*": 3
"bbbbbb": 1
}

Notice the `aaa...` were grouped and `9` was not replaced with wildcard because it was constant on all strings. This feature, retaining constant digits, was the reason why we got into hassle producing this library.

Practically, we're going to use it to filter unused class and id names which were removed in [emailcomb.com](https://emailcomb.com). The list can get quite long, 7000 or more unused atomic classes and id's are not uncommon. To make such lists more manageable, this library will be used to group them, to reduce the amount of entries in the list.

**[⬆ back to top](#markdown-header-array-group-str-omit-num-char)**

## API

```js
group(
  sourceArray, // input array of strings
  opts // an optional options array
);
```

### API - Input

| Input argument | Type         | Obligatory? | Description                                    |
| -------------- | ------------ | ----------- | ---------------------------------------------- |
| `sourceArray`  | Array        | yes         | Source array of strings                        |
| `otps`         | Plain object | no          | An Optional Options Object. See its API below. |

By the way, none of the input arguments are mutated.

**[⬆ back to top](#markdown-header-array-group-str-omit-num-char)**

### An Optional Options Object

Type: `object` - an Optional Options Object.

| `options` object's key | Type    | Default | Description                                                                                                                                                     |
| ---------------------- | ------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| {                      |         |         |
| `wildcard`             | String  | `*`     | What to use to mark grouped characters                                                                                                                          |
| `dedupePlease`         | Boolean | `true`  | By default, input array's contents will be deduped. But that's at a cost of performance, so if you're 100% sure your strings will be unique, set it to `false`. |
| }                      |         |         |

**Here are all defaults in one place for copying**:

```js
{
  wildcard: "*",
  dedupePlease: true
}
```

To explicitly mark the refusal to set custom Optional Options, it can be also passed as a `null` or `undefined` value. In that case, defaults will be set.

**[⬆ back to top](#markdown-header-array-group-str-omit-num-char)**

### API - Output

Empty array input will yield empty plain object as result.
Non-empty array (with at least one string inside) will yield a plain object: strings will be grouped and put as **keys**, they count will be put as integer **values**.

For example:

```js
console.log(group(["a1-1", "a2-2", "b3-3", "c4-4"]));
// {
//   "a*-*": 2,
//   "b3-3": 1,
//   "c4-4": 1
// }
```

**[⬆ back to top](#markdown-header-array-group-str-omit-num-char)**

## Contributing

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/array-group-str-omit-num-char/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/array-group-str-omit-num-char/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ back to top](#markdown-header-array-group-str-omit-num-char)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/array-group-str-omit-num-char.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/array-group-str-omit-num-char
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/array-group-str-omit-num-char
[cov-img]: https://coveralls.io/repos/bitbucket/codsen/array-group-str-omit-num-char/badge.svg?style=flat-square&branch=master
[cov-url]: https://coveralls.io/bitbucket/codsen/array-group-str-omit-num-char?branch=master
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/array-group-str-omit-num-char
[downloads-img]: https://img.shields.io/npm/dm/array-group-str-omit-num-char.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/array-group-str-omit-num-char
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/array-group-str-omit-num-char
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/array-group-str-omit-num-char
