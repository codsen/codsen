# array-group-str-omit-num-char

> Groups array of strings by omitting number characters

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
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

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/array-group-str-omit-num-char.cjs.js` | 4 KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/array-group-str-omit-num-char.esm.js` | 3 KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/array-group-str-omit-num-char.umd.js` | 37 KB

**[⬆  back to top](#markdown-header-array-group-str-omit-num-char)**

## Table of Contents

- [Install](#markdown-header-install)
- [Idea](#markdown-header-idea)
- [API](#markdown-header-api)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Idea

Take an array of strings, group those which differ only by a certain number.

For example, consider this array atomic CSS class names coming from some report (for example, `email-comb` [output](https://www.npmjs.com/package/email-comb#api---output) object's key `deletedFromHead`):

```js
[
  "wbr425-padding-top-1",
  "wbr425-padding-top-2",
  "main-title",
  "wbr425-padding-top-3"
];
```

In real life, you could have for example, `wbr425-padding-top-*` would be shorter and go up to `500` and there were, let's say, 20 other groups like it.

This npm library groups strings, in this case producing:

```json
{
  "wbr425-padding-top-*": 3,
  "main-title": 1
}
```

Notice the "425" in `wbr425` was not replaced with wildcard because it was constant on all strings that were grouped. This feature, retaining constant digits, was the reason why we got into hassle producing this library.

You see, the quickest, alternative (gung-ho) algorithm is to replace all digits with "`*`" and filter the unique values, but "`425`" in `wbr425` would be lost. That's why we need this library.

**[⬆  back to top](#markdown-header-array-group-str-omit-num-char)**

## API

The main function is exported as _default_, so you can name it whatever you want when you `import`/`require`. For example, instead of "group", you could name the main function "`brambles`": `const brambles = require("array-group-str-omit-num-char");`. But let's consider you chose default name, "`group`".

The API of this library is the following:

```js
group(
  sourceArray, // input array of strings
  opts // an optional options array
);
```

In other words, that variable you imported, "`group`" (or "`brambles`" or whatever) is a **function** which consumes two input arguments.

**[⬆  back to top](#markdown-header-array-group-str-omit-num-char)**

### API - Input

| Input argument | Type         | Obligatory? | Description                                    |
| -------------- | ------------ | ----------- | ---------------------------------------------- |
| `sourceArray`  | Array        | yes         | Array of zero or more strings                  |
| `otps`         | Plain object | no          | An Optional Options Object. See its API below. |

By the way, none of the input arguments are mutated.

**[⬆  back to top](#markdown-header-array-group-str-omit-num-char)**

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

**[⬆  back to top](#markdown-header-array-group-str-omit-num-char)**

### API - Output

An empty array input will give output of a empty plain object.
A non-empty array (with at least one string inside) will yield a plain object: strings will be grouped and put as **keys**, they count will be put as integer **values**.

For example:

```js
console.log(group(["a1-1", "a2-2", "b3-3", "c4-4"]));
// {
//   "a*-*": 2,
//   "b3-3": 1,
//   "c4-4": 1
// }
```

**[⬆  back to top](#markdown-header-array-group-str-omit-num-char)**

## Contributing

* If you see an error, [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=array-group-str-omit-num-char%20package%20-%20put%20title%20here).
* If you want a new feature but can't code it up yourself, also [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=array-group-str-omit-num-char%20package%20-%20put%20title%20here). Let's discuss it.
* If you tried to use this package, but something didn't work out, also [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=array-group-str-omit-num-char%20package%20-%20put%20title%20here). We'll try to help.
* If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆  back to top](#markdown-header-array-group-str-omit-num-char)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors



[node-img]: https://img.shields.io/node/v/array-group-str-omit-num-char.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/array-group-str-omit-num-char

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/array-group-str-omit-num-char

[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/array-group-str-omit-num-char

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/array-group-str-omit-num-char

[downloads-img]: https://img.shields.io/npm/dm/array-group-str-omit-num-char.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/array-group-str-omit-num-char

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/array-group-str-omit-num-char

[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io

[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
