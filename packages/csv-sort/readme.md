# csv-sort

<a href="https://standardjs.com" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Sorts double-entry CSVs coming from internet banking statements (and accounting, in general)

[![Link to npm page][npm-img]][npm-url]
[![Build Status][travis-img]][travis-url]
[![Coverage Status][cov-img]][cov-url]
[![bitHound Score][bithound-img]][bithound-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Known Vulnerabilities][vulnerabilities-img]][vulnerabilities-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [TLDR;](#tldr)
- [This lib does two twings:](#this-lib-does-two-twings)
- [Usage](#usage)
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
$ npm i -S csv-sort
```

Other siblings of this package:
<!-- * Front end: [csvpony.com](https://csvpony.com) -->
* CLI version: [csv-sort-cli](https://github.com/codsen/csv-sort-cli)

**[⬆ &nbsp;back to top](#)**

## TLDR;

`csv-sort` can correct the order of rows of _any_ accounting CSV files that come in [double entry bookkeeping](https://en.wikipedia.org/wiki/Double-entry_bookkeeping_system) format:

![double bookkeeping example](https://cdn.rawgit.com/codsen/csv-sort/e273cf48/media/img1.png)

Currently (late 2017) Lloyds Bank website exports CSV files with some rows from the same day in a wrong order. This library is my attempt to to fix such CSV's.

**[⬆ &nbsp;back to top](#)**

## This lib does two twings:

* Sorts rows in correct order that follows the double-entry format.
* Trims the empty columns and rows (so-called 2D-Trim^).

![2D trim of a CSV contents](https://cdn.rawgit.com/codsen/csv-sort/2bdf5256/media/img2.png)

In later releases I would like to be able to recognise and fix any offset columns caused by misinterpreted commas as values.

<small>^ 1D-Trim would be trim of a string. 3D-Trim would be some sort of spatial data trim.</small>

**[⬆ &nbsp;back to top](#)**

## Usage

```js
const csvSort = require('csv-sort')
// ...
```

**[⬆ &nbsp;back to top](#)**

## API

* Input - string
* Output - plain object:

output object                  | Type     | Description
-------------------------------|----------|----------------------
{                              |          |
`res`                          | Array    | Array of arrays, each containing a column's value.
`msgContent`                   | String   | This application outputs the messages here.
`msgType`                      | String   | Can be either `alert` or `info`. That's similar to an icon on the hypothetical UI.
}                              |          |

If the input is anything else than a `string`, it will `throw`.
If the input is an empty string, the output object's `res` key will be equal to `[['']]`.

**[⬆ &nbsp;back to top](#)**

## Contributing

I promise to merge pull requests as soon as possible and to be supportive and positive to all collaborators, including JS newbies.

- Now, _you_ have to promise to stick to [Standard JavaScript](https://standardjs.com) and to write unit tests for your features.
- If you are raising an [issue](https://github.com/codsen/csv-sort/issues) regarding a bug, you have to promise to describe it so that I can recreate it.

I also gladly accept feature requests – chuck them in as [issues](https://github.com/codsen/csv-sort/issues).

I also gladly accept all constructive critique regarding the code inefficiencies. This has never happened yet, but I know the time will come one day when somebody will actually take time to analyse my code, look for its deficiencies and let me know about that.

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

[npm-img]: https://img.shields.io/npm/v/csv-sort.svg
[npm-url]: https://www.npmjs.com/package/csv-sort

[travis-img]: https://travis-ci.org/codsen/csv-sort.svg?branch=master
[travis-url]: https://travis-ci.org/codsen/csv-sort

[cov-img]: https://coveralls.io/repos/github/codsen/csv-sort/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/codsen/csv-sort?branch=master

[bithound-img]: https://www.bithound.io/github/codsen/csv-sort/badges/score.svg
[bithound-url]: https://www.bithound.io/github/codsen/csv-sort

[deps-img]: https://www.bithound.io/github/codsen/csv-sort/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/codsen/csv-sort/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/codsen/csv-sort/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/codsen/csv-sort/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/csv-sort.svg
[downloads-url]: https://www.npmjs.com/package/csv-sort

[vulnerabilities-img]: https://snyk.io/test/github/codsen/csv-sort/badge.svg
[vulnerabilities-url]: https://snyk.io/test/github/codsen/csv-sort

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg
[deps2d-url]: http://npm.anvaka.com/#/view/2d/csv-sort
