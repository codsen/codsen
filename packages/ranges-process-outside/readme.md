# ranges-process-outside

> Iterate through string and optionally a given ranges as if they were one

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
npm i ranges-process-outside
```

```js
// consume as CommonJS require:
const rangesProcessOutside = require("ranges-process-outside");
// or as a native ES module:
import rangesProcessOutside from "ranges-process-outside";
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/ranges-process-outside.cjs.js` | 4 KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/ranges-process-outside.esm.js` | 3 KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/ranges-process-outside.umd.js` | 31 KB

**[⬆  back to top](#markdown-header-ranges-process-outside)**

## Table of Contents

- [Install](#markdown-header-install)
- [Purpose](#markdown-header-purpose)
- [API](#markdown-header-api)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Purpose

Imagine you processed the string and made a note (in shape of string range arrays), that for example, you want to delete from index 1 to 2 (to delete second character).

Now, imagine, you want to perform a second operation, and you don't want to iterate over the characters, marked by ranges you already captured. In our example, you want to process only two chunks: [0, 1] (first character), and what's left, what follows second character (third character and onwards).

This library will take a string, ranges array and callback function. It will feed the chunks outside the given ranges into that callback function. Same thing like `Array.forEach(key => {...})` does.

**[⬆  back to top](#markdown-header-ranges-process-outside)**

## API

**processOutside(str, originalRanges, cb, [skipChecks])**

Bracket around 4th input argument above means it's optional.

| Input argument | Type                         | Obligatory? | Description                                                                                                                                                                                                                     |
| -------------- | ---------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `str`  | Array of zero or more arrays | yes         | String you work upon |
| `originalRanges`       | Array of zero or more arrays, OR, `null` (absence of arrays)               | yes         | Ranges you have |
| `cb`         | Function                 | yes          | Callback function |

**Output**: undefined. Only callback is called zero or more times. If/when callback function is called, its first input argument receives the following plain object:

```
{
	from: 0,
	to: 1,
	value: "z"
}
```

For example:

```js
// tap the library:
const rangesProcessOutside = require("ranges-process-outside");
// (name it anyway you want, function was exported as "default")

// define an empty array which we'll soon fill:
const gather = [];

// call the function with aforementioned arguments.
// observe the 
rangesProcessOutside("abcdefghij", [[1, 5]], obj => {
	const value = obj.value; // or shorter, const {value} = obj;
// push this value into our array:
gather.push(value);
});
// after processing, do anything you want with 
console.log('gather = ' + JSON.stringify(gather, null, 0));
// => ["a", "fghij"]
```

**[⬆  back to top](#markdown-header-ranges-process-outside)**

## Contributing

* If you see an error, [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=ranges-process-outside%20package%20-%20put%20title%20here).
* If you want a new feature but can't code it up yourself, also [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=ranges-process-outside%20package%20-%20put%20title%20here). Let's discuss it.
* If you tried to use this package, but something didn't work out, also [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=ranges-process-outside%20package%20-%20put%20title%20here). We'll try to help.
* If you want to contribute some code, fork the [monorepo](https://bitbucket.org/codsen/codsen/src/) via BitBucket, then write code, then file a pull request via BitBucket. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆  back to top](#markdown-header-ranges-process-outside)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors



[node-img]: https://img.shields.io/node/v/ranges-process-outside.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ranges-process-outside

[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/codsen/src/master/packages/ranges-process-outside

[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://bitbucket.org/codsen/codsen/src/master/packages/ranges-process-outside

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ranges-process-outside

[downloads-img]: https://img.shields.io/npm/dm/ranges-process-outside.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ranges-process-outside

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ranges-process-outside

[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io

[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/codsen/src/master/LICENSE
