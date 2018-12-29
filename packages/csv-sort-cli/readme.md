# csv-sort-cli

> Command line app to sort double-entry CSVs coming from internet banking statements

[![Repository is on BitBucket][bitbucket-img]][bitbucket-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

Other siblings of this package:

- API for it: [csv-sort](https://bitbucket.org/codsen/csv-sort)

## Table of Contents

- [Install globally, call `csvsort` on a file](#markdown-header-install-globally-call-csvsort-on-a-file)
- [or, omit the file's name, it will let you pick a CSV:](#markdown-header-or-omit-the-files-name-it-will-let-you-pick-a-csv)
- [What it does exactly](#markdown-header-what-it-does-exactly)
- [Updating it](#markdown-header-updating-it)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Install globally, call `csvsort` on a file

```bash
$ npm i -g csv-sort-cli
```

- then, either call `csvsort` (or `sortcsv`) appending your file name (with or without `-o`/`--overwrite` flag):

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

![calling directly on a file](https://bitbucket.org/codsen/codsen/raw/e99ef54c0bac616e3b12cc4133aafb617f3fc053/packages/csv-sort-cli/media/example1.gif)

**[⬆ back to top](#markdown-header-csv-sort-cli)**

## or, omit the file's name, it will let you pick a CSV:

```bash
$ csvsort # omit the file's name, but you can include -o/--overwrite flag
```

omit the file name and `csv-sort-cli` will offer a list of CSV files in the current folder to choose from:

![calling without specifying a file name](https://bitbucket.org/codsen/codsen/raw/e99ef54c0bac616e3b12cc4133aafb617f3fc053/packages/csv-sort-cli/media/example2.gif)

You can even try it without installing — use `npx`:

```bash
$ npx csv-sort-cli YOURFILE.csv
```

**[⬆ back to top](#markdown-header-csv-sort-cli)**

## What it does exactly

1.  It **sorts CSV file rows** to correspond to the [double-entry bookkeeping](https://en.wikipedia.org/wiki/Double-entry_bookkeeping_system) principles:

![double bookkeeping example](https://bitbucket.org/codsen/codsen/raw/e99ef54c0bac616e3b12cc4133aafb617f3fc053/packages/csv-sort/media/img1.png)

Sometimes internet banking CSV's have rows in a wrong order, especially when entries are on the _same date_. This library helps to sort the rows in correct order.

2.  As a bonus, it will **trim** the empty columns/rows:

![2D trim of a CSV contents](https://bitbucket.org/codsen/codsen/raw/e99ef54c0bac616e3b12cc4133aafb617f3fc053/packages/csv-sort/media/img2.png)

3.  Not to mention, the [our custom CSV parse](https://bitbucket.org/codsen/csv-split-easy) used here will ensure that all CSV cell _contents_ are trimmed, and there are no empty rows between the content rows. It also accepts any commas as content if the cell is wrapped with a double quotes. Read more in [its repo's readme](https://bitbucket.org/codsen/csv-split-easy).

**[⬆ back to top](#markdown-header-csv-sort-cli)**

## Updating it

When you install it globally, it will check occasionally, are there newer versions available, and if so, will show a message nagging you to update. It's the [same tool](https://www.npmjs.com/package/update-notifier) that AVA and [npm](https://www.npmjs.com/package/npm) themselves use!

**[⬆ back to top](#markdown-header-csv-sort-cli)**

## Contributing

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/csv-sort-cli/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/csv-sort-cli/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ back to top](#markdown-header-csv-sort-cli)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/csv-sort-cli.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/csv-sort-cli
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/csv-sort-cli
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/csv-sort-cli
[downloads-img]: https://img.shields.io/npm/dm/csv-sort-cli.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/csv-sort-cli
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/csv-sort-cli
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/csv-sort-cli
