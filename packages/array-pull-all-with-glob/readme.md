# array-pull-all-with-glob

> pullAllWithGlob - like \_.pullAll but pulling stronger, with globs

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
npm i array-pull-all-with-glob
```

```js
// consume as CommonJS require():
const pullAllWithGlob = require("array-pull-all-with-glob");
// or as ES Module:
import pullAllWithGlob from "array-pull-all-with-glob";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                                   | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/array-pull-all-with-glob.cjs.js` | 4 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/array-pull-all-with-glob.esm.js` | 3 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/array-pull-all-with-glob.umd.js` | 28 KB |

**[⬆ back to top](#)**

## Table of Contents

- [Install](#install)
- [Pulling](#pulling)
- [API](#api)
- [Test](#test)
- [Contributing](#contributing)
- [Licence](#licence)

## Pulling

Let's say you have an array of strings and another array of strings to remove from the aforementioned array. That's easy to achieve with Lodash's [\_.pullAll](https://lodash.com/docs/#pullAll). However, what if you are not sure what _to-be-removed_ strings exactly look like and know only how their names _begin_, or there are too many of them to type manually, yet all begin with the same letters? What if you need to remove 99 elements: `module-1`, `module-2`, ... `module-99` from an array?

You need be able to put a _glob_ in a search query, that is, a _string pattern_ (`*`), which means _any character from here on_.

Check it out how easy it is to achieve that using this library:

```js
var pullAllWithGlob = require("array-pull-all-with-glob");
sourceArray = ["keep_me", "name-1", "name-2", "name-jhkgdhgkhdfghdkghfdk"];
removeThese = ["name-*"];
console.dir(pullAllWithGlob(sourceArray, removeThese));
// => ['keep_me']
```

Personally, I needed this library for another library, [email-comb](https://gitlab.com/codsen/codsen/tree/master/packages/email-comb), where I had to _whitelist_ certain CSS classes (array of strings), removing them from another array.

**[⬆ back to top](#)**

## API

```js
pullAllWithGlob(
  sourceArray, // input array of strings
  removeThese // array of strings to pull
);
```

### API - Input

| Input argument | Type                                      | Obligatory? | Description                                                                          |
| -------------- | ----------------------------------------- | ----------- | ------------------------------------------------------------------------------------ |
| `sourceArray`  | Array                                     | yes         | Source array of strings                                                              |
| `removeThese`  | Array of zero or more strings or a string | yes         | Array of zero or more strings or a single string to be removed from the source array |
| `otps`         | Plain object                              | no          | An Optional Options Object. See its API below.                                       |

By the way, none of the input arguments are mutated. That's checked by unit tests from group 4.x

**[⬆ back to top](#)**

### An Optional Options Object

Type: `object` - an Optional Options Object.

| `options` object's key | Type    | Default | Description                                                                                          |
| ---------------------- | ------- | ------- | ---------------------------------------------------------------------------------------------------- |
| {                      |         |         |
| `caseSensitive`        | Boolean | `true`  | Are comparisons case-sensitive? Default answer is `yes`, but you can override it to `no` using this. |
| }                      |         |         |

**Here are all defaults in one place for copying**:

```js
{
  caseSensitive: true,
}
```

When unused, Optional Options Object can be also passed as a `null` or `undefined` value.

**[⬆ back to top](#)**

### API - Output

| Type  | Description                            |
| ----- | -------------------------------------- |
| Array | Array of strings with elements removed |

## Test

```bash
$ npm test
```

For unit tests we use [AVA](https://github.com/avajs/ava), [Istanbul CLI](https://github.com/istanbuljs/nyc) and [JS Standard](https://standardjs.com) notation.

## Contributing

- If you see an error, [raise an issue](https://gitlab.com/codsen/codsen/issues/new?issue[title]=array-pull-all-with-glob%20package%20-%20put%20title%20here&issue[description]=%23%23%20array-pull-all-with-glob%0A%0Aput%20description%20here).
- If you want a new feature but can't code it up yourself, also [raise an issue](https://gitlab.com/codsen/codsen/issues/new?issue[title]=array-pull-all-with-glob%20package%20-%20put%20title%20here&issue[description]=%23%23%20array-pull-all-with-glob%0A%0Aput%20description%20here). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](https://gitlab.com/codsen/codsen/issues/new?issue[title]=array-pull-all-with-glob%20package%20-%20put%20title%20here&issue[description]=%23%23%20array-pull-all-with-glob%0A%0Aput%20description%20here). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/array-pull-all-with-glob.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/array-pull-all-with-glob
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/array-pull-all-with-glob
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/array-pull-all-with-glob
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/array-pull-all-with-glob
[downloads-img]: https://img.shields.io/npm/dm/array-pull-all-with-glob.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/array-pull-all-with-glob
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/array-pull-all-with-glob
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
