# csv-sort-cli

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> Command line app to sort double-entry CSVs coming from internet banking statements

[![Minimum Node version required][node-img]][node-url]
[![Link to npm page][npm-img]][npm-url]
[![Build Status][travis-img]][travis-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Known Vulnerabilities][vulnerabilities-img]][vulnerabilities-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![MIT License][license-img]][license-url]

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

alternatively, the call `sortcsv` will work as well.

**[⬆ &nbsp;back to top](#)**

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

Sometimes internet banking CSV's have rows in a wrong order, especially when entries are on the _same date_. This library helps to sort the rows in correct order.

2. As a bonus, it will **trim** the empty columns/rows:

![2D trim of a CSV contents](https://cdn.rawgit.com/codsen/csv-sort/2bdf5256/media/img2.png)

3. Not to mention, the [our custom CSV parse](https://github.com/codsen/csv-split-easy) used here will ensure that all CSV cell _contents_ are trimmed, and there are no empty rows between the content rows. It also accepts any commas as content if the cell is wrapped with a double quotes. Read more in [its repo's readme](https://github.com/codsen/csv-split-easy).

**[⬆ &nbsp;back to top](#)**

## Updating it

When you install it globally, it will check occasionally, are there newer versions available, and if so, will show a message nagging you to update. It's the [same tool](https://www.npmjs.com/package/update-notifier) that AVA and [npm](https://www.npmjs.com/package/npm) themselves use!

**[⬆ &nbsp;back to top](#)**

## Contributing

* If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/csv-sort-cli/issues).

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/csv-sort-cli/issues).

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. Code style is `airbnb-base`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt


[node-img]: https://img.shields.io/node/v/csv-sort-cli.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/csv-sort-cli

[npm-img]: https://img.shields.io/npm/v/csv-sort-cli.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/csv-sort-cli

[travis-img]: https://img.shields.io/travis/codsen/csv-sort-cli.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/csv-sort-cli

[overall-img]: https://img.shields.io/bithound/code/github/codsen/csv-sort-cli.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/csv-sort-cli

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/csv-sort-cli.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/csv-sort-cli/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/csv-sort-cli

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/csv-sort-cli.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/csv-sort-cli/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/csv-sort-cli/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/csv-sort-cli

[downloads-img]: https://img.shields.io/npm/dm/csv-sort-cli.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/csv-sort-cli

[license-img]: https://img.shields.io/npm/l/csv-sort-cli.svg?style=flat-square
[license-url]: https://github.com/codsen/csv-sort-cli/blob/master/license.md
