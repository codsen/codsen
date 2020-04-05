# ranges-iterate

> Iterate a string and any changes within already existing ranges

[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![no dependencies][no-deps-img]][no-deps-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Install

```bash
npm i ranges-iterate
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`iterate`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const iterate = require("ranges-iterate");
```

or as an ES Module:

```js
import iterate from "ranges-iterate";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/ranges-iterate/dist/ranges-iterate.umd.js"></script>
```

```js
// in which case you get a global variable "rangesIterate" which you consume like this:
const iterate = rangesIterate;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                         | Size |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------- | ---- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/ranges-iterate.cjs.js` | 3 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/ranges-iterate.esm.js` | 3 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/ranges-iterate.umd.js` | 2 KB |

**[⬆ back to top](#)**

## Table of Contents

- [Install](#install)
- [What it does](#what-it-does)
- [API](#api)
- [For example](#for-example)
- [Contributing](#contributing)
- [Licence](#licence)

## What it does

Background: strings in JavaScript consist of characters. For example, `abc` is a string. Each character has an index number and the numbering starts from zero. For example, in "abc", "a" has index `0`, "b" has index `1` and so on.

We use arrays to **mark what to delete** from a string, from example, deletion from index `0` to index `5` would be `[0, 5]`. If we added a third element, that would mean we want to **insert it**, replacing the given index range. For example, if a string is `abc` and we want to delete "b", that would be range `[1, 2]`. If we wanted to replace "b" with "x", that would be range `[1, 2, "x"]`.

Now, imagine, you have a string and some ranges marking what needs to be inserted/deleted. You want to add more tasks, to loop through the string again, but considering all these amendments. This library lets you iterate through the string considering the ranges gathered so far, as it those ranges were already applied.

Practically, this means, you can stack the ranges and still avoid mutating input string.

**[⬆ back to top](#)**

## API

**rangesIterate(str, ranges, cb\[, offset])** — in other words, this library gives you a synchronous _function_ (exported as a default) and you must feed three obligatory arguments and fourth, optional (marked with square brackets).

| Input argument | Type                                              | Obligatory? | Description                                                              |
| -------------- | ------------------------------------------------- | ----------- | ------------------------------------------------------------------------ |
| `str`          | `string`                                          | yes         | The input string we are operating on                                     |
| `ranges`       | `null` or `array` of zero or more arrays (ranges) | yes         | The ranges gathered so far                                               |
| `cb`           | Something falsey or a `function`                  | yes         | Callback function to be able to consume the indexes and character values |
| `offset`       | String index, a natural number                    | no          | You can cut corners and start operations later in the string             |

**[⬆ back to top](#)**

## For example

```js
iterate("abcdefghij", [[0, 7, "xyz"]], ({ i, val }) => {
  // console.log(
  //   `84t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
  // );
  pinged += val;
  t.equal(i, index);
  index++;
});
```

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ranges-iterate%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aranges-iterate%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ranges-iterate%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aranges-iterate%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ranges-iterate%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aranges-iterate%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-iterate
[cov-img]: https://img.shields.io/badge/coverage-93.18%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-iterate
[no-deps-img]: https://img.shields.io/badge/-no%20dependencies-brightgreen?style=flat-square
[no-deps-url]: https://www.npmjs.com/package/ranges-iterate?activeTab=dependencies
[downloads-img]: https://img.shields.io/npm/dm/ranges-iterate.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ranges-iterate
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ranges-iterate
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
