# csv-sort-cli

<a href="https://standardjs.com" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Sorts double-entry CSVs coming from internet banking statements (and accounting, in general)

[![Link to npm page][npm-img]][npm-url]
[![Build Status][travis-img]][travis-url]
[![bitHound Score][bithound-img]][bithound-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Known Vulnerabilities][vulnerabilities-img]][vulnerabilities-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]

Other siblings of this package:
<!-- * Front end: [csvpony.com](https://csvpony.com) -->
* API for it: [csv-sort](https://github.com/codsen/csv-sort)

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install globally, call `csvsort` on a file](#install-globally-call-csvsort-on-a-file)
- [or, omit the file's name, it will let you pick a CSV:](#or-omit-the-files-name-it-will-let-you-pick-a-csv)
- [What it does exactly](#what-it-does-exactly)
- [Updating it](#updating-it)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

**[⬆ &nbsp;back to top](#)**

## Install globally, call `csvsort` on a file

```bash
$ npm i -g csv-sort-cli
```

- then, either call `csvsort` appending your file name (with or without `-o`/`--overwrite` flag):

```bash
$ csvsort YOURFILE.csv

$ csvsort -o YOURFILE.csv
$ csvsort --overwrite YOURFILE.csv
$ csvsort -v
$ csvsort --version
$ csvsort -h
$ csvsort --help
```

**like this:**

![Calling csv-sort-cli directly on a file](https://cdn.rawgit.com/codsen/csv-sort-cli/b2934c92/media/example1.gif)

## or, omit the file's name, it will let you pick a CSV:

```bash
$ csvsort # omit the file's name, but you can include -o/--overwrite flag
```

omit the file name and `csv-sort-cli` will offer a list of CSV files in the current folder to choose from:

![Calling csv-sort-cli without file and picking a CSV](https://cdn.rawgit.com/codsen/csv-sort-cli/b2934c92/media/example2.gif)

You can even try it without installing — use `npx`:

```bash
$ npx csv-sort-cli YOURFILE.csv
```

**[⬆ &nbsp;back to top](#)**

## What it does exactly

1. It **sorts CSV file rows** to correspond to the [double-entry bookkeeping](https://en.wikipedia.org/wiki/Double-entry_bookkeeping_system) principles:

![double bookkeeping example](https://cdn.rawgit.com/codsen/csv-sort/e273cf48/media/img1.png)

Sometimes Internet Banking CSV's have rows in a wrong order, especially when entries are on the _same date_. This library helps to sort the rows in correct order.

2. As a bonus, it will **trim** the empty columns/rows:

![2D trim of a CSV contents](https://cdn.rawgit.com/codsen/csv-sort/2bdf5256/media/img2.png)

3. Not to mention, the [our custom CSV parse](https://github.com/codsen/csv-split-easy) used here will ensure that all CSV cell _contents_ are trimmed, and there are no empty rows between the content rows. It also accepts any commas as content if the cell is wrapped with double quotes. Read more in [its repo's readme](https://github.com/codsen/csv-split-easy).

**[⬆ &nbsp;back to top](#)**

## Updating it

When you install it globally, it will check occasionally, are there newer versions available, and if so, will show a message nagging you to update. It's the [same tool](https://www.npmjs.com/package/update-notifier) that AVA and [npm](https://www.npmjs.com/package/npm) themselves use!

**[⬆ &nbsp;back to top](#)**

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://standardjs.com) notation.

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/codsen/csv-sort-cli/issues). If you have any comments on the code, including ideas how to improve something, don't hesitate to contact me by email, Twitter or raise an issue on a mentioned issue link.

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

[npm-img]: https://img.shields.io/npm/v/csv-sort-cli.svg
[npm-url]: https://www.npmjs.com/package/csv-sort-cli

[travis-img]: https://travis-ci.org/codsen/csv-sort-cli.svg?branch=master
[travis-url]: https://travis-ci.org/codsen/csv-sort-cli

[bithound-img]: https://www.bithound.io/github/codsen/csv-sort-cli/badges/score.svg
[bithound-url]: https://www.bithound.io/github/codsen/csv-sort-cli

[deps-img]: https://www.bithound.io/github/codsen/csv-sort-cli/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/codsen/csv-sort-cli/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/codsen/csv-sort-cli/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/codsen/csv-sort-cli/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/csv-sort-cli.svg
[downloads-url]: https://www.npmjs.com/package/csv-sort-cli

[vulnerabilities-img]: https://snyk.io/test/github/codsen/csv-sort-cli/badge.svg
[vulnerabilities-url]: https://snyk.io/test/github/codsen/csv-sort-cli

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg
[deps2d-url]: http://npm.anvaka.com/#/view/2d/csv-sort-cli
