# ranges-process-outside

> Iterate through string and optionally a given ranges as if they were one

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
npm i ranges-process-outside
```

```js
// consume as CommonJS require:
const rangesProcessOutside = require("ranges-process-outside");
// or as a native ES module:
import rangesProcessOutside from "ranges-process-outside";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                                 | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------ | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/ranges-process-outside.cjs.js` | 4 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/ranges-process-outside.esm.js` | 2 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/ranges-process-outside.umd.js` | 36 KB |

**[⬆ back to top](#)**

## Table of Contents

- [Install](#install)
- [Purpose](#purpose)
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

## Purpose

This program iterates over inverted ranges. First, it inverts given ranges and then, calls the callback function (which you supply) with index of every character in those inverted ranges.

## API

**processOutside(str, originalRanges, cb, [skipChecks])**

Bracket around 4th input argument above means it's optional.

| Input argument   | Type                                                         | Obligatory? | Description                       |
| ---------------- | ------------------------------------------------------------ | ----------- | --------------------------------- |
| `str`            | Array of zero or more arrays                                 | yes         | String you work upon              |
| `originalRanges` | Array of zero or more arrays, OR, `null` (absence of arrays) | yes         | Ranges you have                   |
| `cb`             | Function                                                     | yes         | Callback function                 |
| `skipChecks`     | Boolean                                                      | no          | Should checks be performed or not |

**Output**: undefined. Only callback is called zero or more times. If/when callback function is called, its first input argument receives string index, one or more times.

For example:

```js
// tap the library:
const rangesProcessOutside = require("ranges-process-outside");
// (name it anyway you want, function was exported as "default")

// define an empty array which we'll soon fill:
const gathered = [];

// call our function:
rangesProcessOutside("abcdefghij", [[1, 5]], i => {
  const value = i; // or shorter, const {value} = obj;
  // push this value into our array:
  console.log("received: " + i);
  gathered.push(i);
});
console.log("gathered = " + JSON.stringify(gathered, null, 0));
// => [0, 5, 6, 7, 8, 9]
```

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ranges-process-outside%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aranges-process-outside%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ranges-process-outside%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aranges-process-outside%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ranges-process-outside%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aranges-process-outside%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/ranges-process-outside.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ranges-process-outside
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-process-outside
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-process-outside
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ranges-process-outside
[downloads-img]: https://img.shields.io/npm/dm/ranges-process-outside.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ranges-process-outside
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ranges-process-outside
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
