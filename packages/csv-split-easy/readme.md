# csv-split-easy

> Splits the CSV string into array of arrays, each representing a row of columns

[![Minimum Node version required][node-img]][node-url]
[![Repository is on BitBucket][bitbucket-img]][bitbucket-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![All Contributors][contributors-img]][contributors-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#markdown-header-install)
- [Idea](#markdown-header-idea)
- [API](#markdown-header-api)
- [The algorithm](#markdown-header-the-algorithm)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Install

```bash
npm i csv-split-easy
```

```js
// consume its main function as a CommonJS require:
const splitEasy = require("csv-split-easy");
// or as a ES module:
import splitEasy from "csv-split-easy";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                         | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/csv-split-easy.cjs.js` | 5 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/csv-split-easy.esm.js` | 5 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/csv-split-easy.umd.js` | 41 KB |

**[⬆ back to top](#markdown-header-csv-split-easy)**

## Idea

Split a string representing a CSV file into an array of arrays, so that we can traverse it later.

Acceptance Criteria:

- It should accept CSV's with or without a header row
- Header row might have different amount of columns than the rest of the rows
- Content (not header) rows might be offset and have different amount of columns from the rest
- There can be various line break types (`\n`, `\r`, `\n\r` or `\n\n\n\n\n\n\r\r\r\r\r\n\n\n\n` or whatever)
- It should ignore any values wrapped with double quotes
- It should interpret commas as part of the value if it is wrapped in double quotes
- It should accept empty fields and output them as empty strings
- It should automatically detect (dot/comma) and remove thousand separators from digit-only cells
- Minimal dependencies and 100% unit test code coverage in all ways: per-branch, per-statement, per-function and per-line.

Outside of the scope:

- Trimming the values of leading and trailing empty space. Just use `String.prototype.trim()`
- Parsing numeric values. Parse them yourself. It's outside of the scope of this lib.
- Smart detection of the offset columns. See [csv-fix-offset](https://bitbucket.org/codsen/csv-fix-offset)
- Sorting rows of double-entry, accounting CSV's. See [csv-sort](https://bitbucket.org/codsen/csv-sort)

**[⬆ back to top](#markdown-header-csv-split-easy)**

## API

**splitEasy(str[, opts])**

String-in, an array of arrays-out.
Empty values, same as numbers too, are set as empty strings.

### Options object

**Defaults**:

```js
    {
      removeThousandSeparatorsFromNumbers: true,
      padSingleDecimalPlaceNumbers: true,
      forceUKStyle: false
    }
```

| `options` object's key                | Type    | Obligatory? | Default | Description                                                                                                                                     |
| ------------------------------------- | ------- | ----------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| {                                     |         |             |         |
| `removeThousandSeparatorsFromNumbers` | Boolean | no          | `true`  | Should remove thousand separators? `1,000,000` → `1000000`? Or Swiss-style, `1'000'000` → `1000000`? Or Russian-style, `1 000 000` → `1000000`? |
| `padSingleDecimalPlaceNumbers`        | Boolean | no          | `true`  | Should we pad one decimal place numbers with zero? `100.2` → `100.20`?                                                                          |
| `forceUKStyle`                        | Boolean | no          | `false` | Should we convert the decimal separator commas into dots? `1,5` → `1.5`?                                                                        |
| }                                     |         |             |         |

**[⬆ back to top](#markdown-header-csv-split-easy)**

### Returns

Returns an array of arrays. When there's nothing given, returns `[['']]`

There's always one array within the main array and there's always something there, at least an empty string.

### For example

```js
const splitEasy = require("csv-split-easy");
const fs = require("fs");
const path = require("path");
// let's say our CSV sits in the root:
// its contents, let's say, are:
// 'Product Name,Main Price,Discounted Price\nTestarossa (Type F110),"100,000","90,000"\nF50,"2,500,000","1,800,000"'
const testCSVFile = fs.readFileSync(
  path.join(__dirname, "./csv_test.csv"),
  "utf8"
);

let source = splitEasy(testCSVFile);
console.log("source = " + JSON.stringify(source, null, 4));
// => [
//        [
//            "Product Name",
//            "Main Price",
//            "Discounted Price"
//        ],
//        [
//            "Testarossa (Type F110)",
//            "100000",
//            "90000"
//        ],
//        [
//            "F50",
//            "2500000",
//            "1800000"
//        ]
//    ]
```

**[⬆ back to top](#markdown-header-csv-split-easy)**

## The algorithm

CSV files, especially accounting-ones, are different from just _any_ files. We assume that **we don't want any empty rows** in the parsed arrays. It means, [conventional](https://github.com/sindresorhus/split-lines/) string splitting libraries would be inefficient here because after splitting, we'd have to clean up any empty rows.

The second requirement is that any of the column values in CSV can be wrapped with double quotes. We have to support _mixed_, wrapped and not wrapped-value CSV's because Metro bank used to produce these when I banked with them back in 2015.

The third requirement is that any of the values can be wrapped with double quotes and have commas within as values.

The requirements mentioned above pretty much rule out the conventional regex-based split algorithms. You [can](https://github.com/sindresorhus/split-lines/blob/master/index.js) just split by `/\r?\n/` but later you'll need to clean up possible empty rows. You can't `string.split` each row by comma because that comma might be a value, you need to check for wrapping double quotes first!

So, the best algorithm is a single `for`-loop traversal on the input string, detecting and `array.push`ing the values one by one. It worked very well on [email-remove-unused-css](https://bitbucket.org/codsen/email-remove-unused-css) where I remove unused CSS from an HTML template within around 2.5 times more characters "travelled" than there are in the file. Traversing as a string also worked well on [html-img-alt](https://bitbucket.org/codsen/html-img-alt) which needs only a single traversal through the string to fix all the `img` tag `alt` attributes and clean all the crap in/around them.

**[⬆ back to top](#markdown-header-csv-split-easy)**

## Contributing

- If you see an error, [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=csv-split-easy%20package%20-%20put%20title%20here).
- If you want a new feature but can't code it up yourself, also [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=csv-split-easy%20package%20-%20put%20title%20here). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=csv-split-easy%20package%20-%20put%20title%20here). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://bitbucket.org/codsen/codsen/src/) via BitBucket, then write code, then file a pull request via BitBucket. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#markdown-header-csv-split-easy)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/csv-split-easy.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/csv-split-easy
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/codsen/src/master/packages/csv-split-easy
[cov-img]: https://img.shields.io/badge/coverage-100%-brightgreen.svg?style=flat-square
[cov-url]: https://bitbucket.org/codsen/codsen/src/master/packages/csv-split-easy
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/csv-split-easy
[downloads-img]: https://img.shields.io/npm/dm/csv-split-easy.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/csv-split-easy
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/csv-split-easy
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[contributors-img]: https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square
[contributors-url]: #contributors
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/codsen/src/master/packages/csv-split-easy
[all-contributors-url]: https://github.com/kentcdodds/all-contributors
