# csv-split-easy

<a href="https://standardjs.com" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Splits the CSV string into array of arrays, each representing a row or columns

[![Build Status][travis-img]][travis-url]
[![Coverage Status][cov-img]][cov-url]
[![bitHound Score][bithound-img]][bithound-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Known Vulnerabilities][vulnerabilities-img]][vulnerabilities-url]
[![Downloads/Month][downloads-img]][downloads-url]

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Idea](#idea)
- [API](#api)
- [The algorithm](#the-algorithm)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
$ npm i csv-split-easy
```

**[⬆ &nbsp;back to top](#)**

## Idea

Split a string representing a CSV file into an array of arrays, so that we can traverse it later.

Acceptance Criteria:

- It should accept CSV's with or without a header row
- Header row might have different amount of columns than the rest of the rows
- Content (not header) rows might be offset and have different amount of columns from the rest
- There can be various line break types (`\n`, `\r`, `\n\r` or `\n\n\n\n\n\n\r\r\r\r\r\n\n\n\n` or whatever)
- It should ignore any values wrapped with double quotes
- It should interpret commas as part of the value if it is wrapped in double quotes
- If should accept empty fields and output them as empty strings
- No dependencies (not dev-ones) and 100% unit test code coverage in all ways: per-branch, per-statement, per-function and per-line.

Outside of the scope:

- Trimming the values of leading and trailing empty space. Just use `String.prototype.trim()`
- Parsing numeric values. Parse them yourself. It's outside of the scope of this lib.
- Smart detection of the offset columns. See [csv-fix-offset](https://github.com/codsen/csv-fix-offset)
- Sorting rows of double-entry, accounting CSV's. See [csv-sort](https://github.com/codsen/csv-sort)

**[⬆ &nbsp;back to top](#)**

## API

String-in, an array of arrays-out.
Empty values are set as empty strings.
Numbers in CSV, like everything else, are turned into strings.

For example,

```js
const splitEasy = require('csv-split-easy')
const fs = require('fs')
const path = require('path')
// let's say our CSV sits in the root:
// its contents, let's say, are:
// 'row1-value1,row1-value2,row1-value3\n\rrow2-value1,row2-value2,row2-value3'
const testCSVFile = fs.readFileSync(path.join(__dirname, './csv_test.csv'), 'utf8')

let source = splitEasy(testCSVFile)
console.log('source = ' + JSON.stringify(source, null, 4))
// => [
//        [
//            "row1-value1",
//            "row1-value2",
//            "row1-value3",
//        ],
//        [
//            "row2-value1",
//            "row2-value2",
//            "row2-value3",
//        ]
//    ]
```

**[⬆ &nbsp;back to top](#)**

## The algorithm

CSV files, especially accounting-ones, are different from _any_ files. We assume that **we don't want any empty rows** in the parsed arrays. It means, [conventional](https://github.com/sindresorhus/split-lines/) string splitting libraries would be inefficient here because after splitting, we'd have to clean up any empty rows.

The second requirement is that any of the column values in CSV can be wrapped with double quotes. We have to support _mixed_, wrapped and not wrapped-value CSV's because Metro bank used to produce these when I banked with them back in 2015.

The third requirement is that any of the values can be wrapped with double quotes and have commas within as values.

The requirements mentioned above pretty much rule out the conventional regex-based split algorithms. You [can](https://github.com/sindresorhus/split-lines/blob/master/index.js) just split by `/\r?\n/` but later you'll need to clean up possible empty rows. You can't `string.split` each row by colon because that colon might be a value, you need to check for wrapping double quotes first!

So, the best algorithm is a single `for`-loop traversal on the input string, detecting and `array.push`ing the values one by one. It worked very well on [email-remove-unused-css](https://github.com/codsen/email-remove-unused-css) where I remove unused CSS from an HTML template within around 2.5 times more characters "travelled" than there are in the file. Traversing as a string also worked well on [html-img-alt](https://github.com/codsen/html-img-alt) which needs only a single traversal through the string to fix all the `img` tag `alt` attributes and clean all the crap in/around them.

**[⬆ &nbsp;back to top](#)**

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://standardjs.com) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/codsen/csv-split-easy/issues). If you file a pull request, I'll do my best to help you to get it merged as soon as possible. If you have any comments on the code, including ideas how to improve something, don't hesitate to contact me by email.

**[⬆ &nbsp;back to top](#)**

## Licence

> MIT License (MIT)

> Copyright (c) 2017 Codsen Ltd, Roy Revelt

> Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

> The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[travis-img]: https://travis-ci.org/codsen/csv-split-easy.svg?branch=master
[travis-url]: https://travis-ci.org/codsen/csv-split-easy

[cov-img]: https://coveralls.io/repos/github/codsen/csv-split-easy/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/codsen/csv-split-easy?branch=master

[bithound-img]: https://www.bithound.io/github/codsen/csv-split-easy/badges/score.svg
[bithound-url]: https://www.bithound.io/github/codsen/csv-split-easy

[deps-img]: https://www.bithound.io/github/codsen/csv-split-easy/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/codsen/csv-split-easy/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/codsen/csv-split-easy/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/codsen/csv-split-easy/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/csv-split-easy.svg
[downloads-url]: https://www.npmjs.com/package/csv-split-easy

[vulnerabilities-img]: https://snyk.io/test/github/codsen/csv-split-easy/badge.svg
[vulnerabilities-url]: https://snyk.io/test/github/codsen/csv-split-easy
