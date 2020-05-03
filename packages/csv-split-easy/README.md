# csv-split-easy

> Splits the CSV string into array of arrays, each representing a row of columns

[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#install)
- [Idea](#idea)
- [API](#api)
- [The algorithm](#the-algorithm)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i csv-split-easy
```
The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`splitEasy`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const splitEasy = require("csv-split-easy");
```

or as an ES Module:

```js
import splitEasy from "csv-split-easy";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/csv-split-easy/dist/csv-split-easy.umd.js"></script>
```

```js
// in which case you get a global variable "csvSplitEasy" which you consume like this:
const splitEasy = csvSplitEasy;
```

This package has three builds in `dist/` folder:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/csv-split-easy.cjs.js` | 6 KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/csv-split-easy.esm.js` | 5 KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/csv-split-easy.umd.js` | 17 KB

**[⬆ back to top](#)**

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
- Smart detection of the offset columns. See `csv-fix-offset` ([npm](https://www.npmjs.com/package/csv-fix-offset), [GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/csv-fix-offset))
- Sorting rows of double-entry, accounting CSV's. See `csv-sort` ([npm](https://www.npmjs.com/package/csv-sort), [GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/csv-sort))

**[⬆ back to top](#)**

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

**[⬆ back to top](#)**

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

**[⬆ back to top](#)**

## The algorithm

CSV files, especially accounting-ones, are different from just _any_ files. We assume that **we don't want any empty rows** in the parsed arrays. It means, [conventional](https://github.com/sindresorhus/split-lines/) string splitting libraries would be inefficient here because after splitting, we'd have to clean up any empty rows.

The second requirement is that any of the column values in CSV can be wrapped with double quotes. We have to support _mixed_, wrapped and not wrapped-value CSV's because Metro bank used to produce these when I banked with them back in 2015.

The third requirement is that any of the values can be wrapped with double quotes and have commas within as values.

The requirements mentioned above pretty much rule out the conventional regex-based split algorithms. You [can](https://github.com/sindresorhus/split-lines/blob/master/index.js) just split by `/\r?\n/` but later you'll need to clean up possible empty rows. You can't `string.split` each row by comma because that comma might be a value, you need to check for wrapping double quotes first!

So, the best algorithm is a single `for`-loop traversal on the input string, detecting and `array.push`ing the values one by one. It worked very well on [email-comb](https://gitlab.com/codsen/codsen/tree/master/packages/email-comb) where I remove unused CSS from an HTML template within around 2.5 times more characters "travelled" than there are in the file. Traversing as a string also worked well on [html-img-alt](https://gitlab.com/codsen/codsen/tree/master/packages/html-img-alt) which needs only a single traversal through the string to fix all the `img` tag `alt` attributes and clean all the crap in/around them.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=csv-split-easy%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Acsv-split-easy%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=csv-split-easy%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Acsv-split-easy%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=csv-split-easy%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Acsv-split-easy%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/csv-split-easy
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/csv-split-easy
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/csv-split-easy
[downloads-img]: https://img.shields.io/npm/dm/csv-split-easy.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/csv-split-easy
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/csv-split-easy
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
